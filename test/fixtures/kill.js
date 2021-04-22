const throng = require('../../lib/throng');

throng({
  count: 3,
  lifetime: 0,
  grace: 250,
  worker: () => {
    console.log('ah ha ha ha');

    process.on('SIGTERM', function() {
      console.log('stayin alive');
    });
  }
});
