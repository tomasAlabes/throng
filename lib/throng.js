const cluster = require("cluster");
const os = require("os");

const nCPU = os.cpus().length;
const defaultOpts = {
  master: () => {},
  count: nCPU,
  delay: 0,
  lifetime: Infinity,
  grace: 5000,
  signals: ["SIGTERM", "SIGINT"],
};

module.exports = async function throng(options) {
  const config = Object.assign(defaultOpts, parseOptions(options));
  const worker = config.worker;

  if (typeof worker !== "function") {
    throw new Error(`Start function required, config: ${options}`);
  }

  if (cluster.isWorker) {
    await worker(cluster.worker.id, disconnect);
  } else {
    startMaster(config)
  }
}

async function startMaster (config) {
  const reviveUntil = Date.now() + config.lifetime;
  let running = true;

  listen();
  await config.master();
  fork(config.count, config.delay);

  function listen() {
    cluster.on("exit", revive);
    config.signals.forEach((signal) => process.on(signal, shutdown(signal)));
  }

  function shutdown(signal) {
    return () => {
      running = false;
      setTimeout(() => forceKill(signal), config.grace).unref();

      Object.values(cluster.workers).forEach((w) => {
        w.process.kill(signal);
      });
    };
  }

  function revive() {
    if (!running) return;
    if (Date.now() >= reviveUntil) return;
    cluster.fork();
  }

  function forceKill(signal) {
    Object.values(cluster.workers).forEach((w) => w.kill(signal));
    process.exit();
  }
}

function fork(numForks, delayMs) {
  for (let i = 0; i < numForks; i++) {
    if (delayMs > 0) {
      const delay = i * delayMs;
      setTimeout(() => {
        cluster.fork();
      }, delay);
    } else {
      cluster.fork();
    }
  }
}

// Queue the disconnect for a short time in the future.
// Node has some edge-cases with child processes that this helps with -
// Unlike main processes, child processes do not exit immediately once no async ops are pending.
// However, calling process.exit() exits immediately, even if async I/O (like console.log/stdout/piping to a file) is pending.
// Instead of using process.exit(), you can disconnect the worker, after which it will die just like a normal process.
// In practice, disconnecting directly after I/O can cause EPIPE errors (https://github.com/nodejs/node/issues/29341)
// I dislike adding arbitrary delays to the system, but 50ms here has eliminated flappy test failures.
function disconnect() {
  setTimeout(() => cluster.worker.disconnect(), 50);
}

function parseOptions(options = {}) {
  if (typeof options === "function") {
    return { worker: options };
  }
  return options;
}
