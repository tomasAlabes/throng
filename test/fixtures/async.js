const throng = require('../../lib/throng')

async function master() {
    await new Promise(r => setTimeout(r, 500))
    console.log('master')
}

async function worker(id, disconnect) {
    console.log('worker')
    disconnect()
}

throng({ master, worker, count: 1, lifetime: 0 })
