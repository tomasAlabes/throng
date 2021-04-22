const throng = require('../../lib/throng');

throng({
  lifetime: 0,
  worker: () => {
    console.log('worker');
    process.exit();
  }
});
