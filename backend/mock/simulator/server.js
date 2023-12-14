const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const bodyParser = require('body-parser');
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)
server.use(bodyParser.json());

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

server.post('/file', (req, res) => {
    if (req.body.java_content === "loop") {
        res.jsonp({"log": "-1\nInfinite loop", "error": null})
    } else if (req.body.java_content === "error") {
        res.jsonp({"error": "Error details"})
    } else if (req.body.java_content === "timeout") {
        setTimeout(() => {
            res.jsonp({message: 'Delayed response after 20 seconds'});
        }, 20000);
    } else {
        res.jsonp({"log": "0 1 2\n3 4 5\n1 successful", "error": null})
    }
})

// Use default router
server.use(router)
server.listen(9999, () => {
    console.log('JSON Server is running')
})