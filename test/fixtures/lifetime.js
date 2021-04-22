const throng = require('../../lib/throng');

throng({
  count: 3,
  lifetime: 500,
  worker: () => {
    console.log('worker');
    process.exit();
  }
});
