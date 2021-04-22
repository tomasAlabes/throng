const throng = require('../../lib/throng')

function worker(id, disconnect) {
    console.log('worker')
    disconnect()
}

throng({ worker, count: 4, lifetime: 0 })
