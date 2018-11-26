const app = require('./app')
const server = require('http').Server(app);
const config = require('./config')

server.listen(config.port, () => {
    console.log(`server is listening on port ${config.port}`)
})