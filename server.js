const {getAllBooks, addBook, updateBook, deleteBook} = require('./services');
const http = require('http');

const {authenticateUser} = require('./authenticate');

const PORT = 5000;
const HOST_NAME = 'localhost';

// Functions for handling requests
async function requestHandler(req, res){
    res.setHeader('Content-Type', 'application/json');

    if(req.url === '/books' && req.method === 'GET'){
        // load and return books
        authenticateUser(req, res, ["admin", "reader"])
        .then(()=>{
            getAllBooks(req, res);
        }).catch((err) => {
            res.statusCode = 401;
            res.end(JSON.stringify({
                error: err
            }))
        })
    }else if(req.url === '/books' && req.method === 'POST'){
        // add a new book
        authenticateUser(req, res, ["admin"])
        .then((book)=>{
            addBook(req, res, book);
        }).catch((err) => {
            res.statusCode = 401;
            res.end(JSON.stringify({
                error: err
            }))
        })
    }else if(req.url === '/books' && req.method === 'PUT'){
        // update an existing book
        updateBook(req, res);
    }else if(req.url === '/books' && req.method === 'DELETE'){
        // delete a book by id 1234567890
        deleteBook(req, res);
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({
            message: 'Method not supported'
        }));
    }
}

// Create and start the server 127.0.0.1:4000
const server = http.createServer(requestHandler);

// Log the server start message 127.0.0.1:4000
server.listen(PORT, HOST_NAME, ()=>{
    console.log(`Server is listening on ${HOST_NAME}:${PORT}`);
});  