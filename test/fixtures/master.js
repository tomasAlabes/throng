const throng = require('../../lib/throng');

throng({
  lifetime: 0,
  count: 2,
  master: () => {
    console.log('master');
  },
  worker: () => {
    console.log('worker');
    process.exit();
  }
});
