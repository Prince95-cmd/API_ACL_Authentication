const path = require('path');
const fs = require('fs');

const userDbPath = path.join(__dirname, 'db', 'users.json');
const booksDbPath = path.join(__dirname, 'db', 'books.json');


function getAllUsers(){
    return new Promise((resolve, reject) =>{
        fs.readFile(userDbPath, 'utf-8', (err, users) => {
            if(err){
                reject(err);
            }
            resolve(JSON.parse(users));
        });
    })
}
function authenticateUser(req, res, roles){
    return new Promise((resolve, reject)=>{

        const body = [];
 
        req.on('data', (chunk)=>{
            body.push(chunk);
        })

        req.on('end', async ()=>{
            const parseBody = Buffer.concat(body).toString();

            if(!parseBody){ 
                reject('No usename or password provided');
            }

            const {user: loginDetails, book} = JSON.parse(parseBody);
            const users = await getAllUsers()
            const userFound = users.find((user) => {
               return  user.username === loginDetails.username && user.password === loginDetails.password
            })

            if(!userFound){
                reject('User not found, please sign up')
            }

            if(!roles.includes(userFound.role)){
                reject('You do not have the required role to access the resource')
            }
            
            resolve(book)
            console.log(book)
            console.log({user: loginDetails})
        })
    });
};

module.exports = {
    authenticateUser
}