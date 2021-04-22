const throng = require('../../lib/throng');

throng({
  worker: () => {
    console.log('worker');
    process.exit();
  },
  count: 3
});
