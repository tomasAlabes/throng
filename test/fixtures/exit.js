const throng = require('../../lib/throng');

throng({
  count: 3,
  lifetime: 0,
  worker: () => {
    console.log('worker');
    process.exit();
  }
});
