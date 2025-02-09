const path = require('path');
const fs = require('fs');

// Vairiable holding the file path
const booksDbPath = path.join(__dirname, 'db', 'books.json');




// Function to get all books from the JSON file and send them as a response to a GET request to '/books'
function getAllBooks(req, res){
    // Read the JSON file and send the data as a response
    fs.readFile(booksDbPath, 'utf-8',  (err, users) =>{
        if(err){
            console.log(err);
            res.writeHead(400);
            res.end('an rror occured');
        };

        res.end(users);
    });
};


// Function to add a new book to the JSON file and send a response to a POST request to '/books'
function addBook(req, res){
    const body = [];

    req.on('data', (chunk)=>{
        body.push(chunk);
    });

    req.on('end', ()=>{
        const parseBody = Buffer.concat(body).toString();
        const newBook = JSON.parse(parseBody);
    

        // Add the new book to the data
        fs.readFile(booksDbPath, 'utf8', (err, data)=>{
            if(err){
                console.log(err);
                res.writeHead(404);
                res.end('an rror occured');
            }

            const oldBooks = JSON.parse(data);

            // Conditional statement to check if the book array is empty or not
            const newId = oldBooks.length > 0 ? oldBooks[oldBooks.length - 1].id + 1 : 1;
            
            // Add the id to the new book
            newBook.id = newId;

            const allBooks = [...oldBooks, newBook]
            
            // Write the updated JSON file with the new book
            fs.writeFile(booksDbPath, JSON.stringify(allBooks), (err)=>{
                if(err){
                    console.log(err);
                    res.writeHead(400);
                    res.end(JSON.stringify({
                        message: `Interal error: could not save new book to database.`
                    }));
                }

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newBook));
            });
        });
    });
        
}

// Function to update an existing book in the JSON file and send a response to a PUT request to '/books'
function updateBook(req,res){
    const body = [];

    req.on('data', (chunk)=>{
        body.push(chunk);
    })

    req.on('end', ()=>{
        const parseBook = Buffer.concat(body).toString()
        const detailsToUpadate = JSON.parse(parseBook)
        const bookId = detailsToUpadate.id

        // Read the JSON file and send the data as a response
        fs.readFile(booksDbPath, 'utf8', (err, books)=>{
            if(err){
                console.log(err);
                res.writeHead(400);
                res.end('An error occured');
            }
            const booksObject = JSON.parse(books);
           
            // Check if the book with the specified id exists in the JSON file
            const bookIndex = booksObject.findIndex(book => book.id === bookId);

            if(bookIndex === -1){
                res.writeHead(404);
                res.end('Book with the specified id not found');
                return;
            }

            // Update the book with the new details
            const updatedBook = {...booksObject[bookIndex], ...detailsToUpadate}
            booksObject[bookIndex] = updatedBook;

            // Write the updated JSON file with the updated book
            fs.writeFile(booksDbPath, JSON.stringify(booksObject), (err)=>{
                if(err){
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: `Internal error: could not save new book to database.`
                    }));
                }
                res.writeHead(200);
                res.end(JSON.stringify({message : 'Update successful.'}));
            });
            
        });
    }); 
}

// Function to delete a book from the JSON file and send a response to a DELETE request to '/books'
function deleteBook(req, res){
    const body = [];

    req.on('data', (chunk)=>{
        body.push(chunk);
    })

    req.on('end', ()=>{
        const parseBook = Buffer.concat(body).toString()
        const idOfBookToDelete = JSON.parse(parseBook)
        const bookId = idOfBookToDelete.id
        console.log(bookId);


        // Read the JSON file and send the data as a response
        fs.readFile(booksDbPath, 'utf8', (err, books)=>{
            if(err){
                console.log(err);
                res.writeHead(400);
                res.end('An error occured');
            }

            const booksObject = JSON.parse(books);

            // Check if the book with the specified id exists in the JSON file
            const bookIndex = booksObject.findIndex(book => book.id === bookId);

            if(bookIndex === -1){
                res.writeHead(404);
                res.end('Book with the specified id not found');
                return;
            };

            // Delete the book from the JSON file
            booksObject.splice(bookIndex, 1);

            // Write the updated JSON file with the deleted book
            fs.writeFile(booksDbPath, JSON.stringify(booksObject), (err)=>{
                if(err){
                    console.log(err);
                    res.writeHead(500);
                    res.end(JSON.stringify({
                        message: `Internal error: could not save new book to database.`
                    }));
                }
                res.writeHead(200);
                res.end(JSON.stringify({message:'Book deleted successfully.'}));
            });

        });
    });
};

// Exporting the functions for use in server.js
module.exports = {getAllBooks, addBook, updateBook, deleteBook};