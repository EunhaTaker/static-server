http = require('http')
render = require('./render')
port = require('./config').port

http.createServer((req, res) => {
    render(req, res)
}).listen(port)