const express = require('express')
const bodyParser = require('body-parser') ;
const app = express() ;
const bcrypt = require('bcrypt')
const cors = require('cors') 

app.use(cors())
app.use(bodyParser.json()) ;
 
const saltRound = 10 
const database  = {
    users:[
        {
            id : '123',
            name : 'John' ,
            email : 'john@email.com' ,
            password:'cookies',
            entries : 0 ,
            joined : new Date()
        }, 
        {
            id : '124',
            name : 'Sally' ,
            email : 'sally@email.com' ,
            password:'pastry' ,
            entries : 0 ,
            joined : new Date()   
        }
    ], 
    login:[
        {
            id :'987',
            hash :'',
            email : 'john@email.com'
        }
    ]
}

app.get('/' ,(req, res)=>{
    res.json(database.users)
})

app.post('/signin',(req,res)=>{
    // bcrypt.compare("apples","$2b$10$p3erOwvcEBengpkAAS7f9Oet4fZlTY9Mx3eKNSQtZxwKCXsfcuQ2G", function(err, result) {
    //    console.log('first guess ',result ) ;
    // });
    // bcrypt.compare("veggies","$2b$10$p3erOwvcEBengpkAAS7f9Oet4fZlTY9Mx3eKNSQtZxwKCXsfcuQ2G", function(err, result) {
    //     console.log('second guess ',result ) ;
    // });
    
    if(req.body.email === database.users[0].email &&
         req.body.password === database.users[0].password ){
            res.json(database.users[0]);
    }
    else{
        res.status(400).json('error logging in ')
    }
})

app.post('/register',(req,res)=>{
    const { email , name ,password } = req.body ;
    
    // bcrypt.hash(password, saltRound, function(err, hash) {
    //     console.log(hash) ;
    // });
    database.users.push({
        id : '125',
        name :  name ,
        email : email,
        // password :password ,
        entries : 0 ,
        joined : new Date()
    })

    res.json(database.users[database.users.length - 1 ]) ;
})


app.get('/profile/:id',(req,res)=>{
    const {id} = req.params ;
    let found = false ; 
    database.users.forEach(user =>{
        if(user.id ===id){
            found = true ;
            return res.json(user) ;
            
        }
    })
    if(!found)
    {
        res.status(400).json('No such user') ;
    }
}) 

app.put('/image' ,(req ,res) =>{
    const {id} = req.body ;
    let found = false ; 
    database.users.forEach(user =>{
        if(user.id ===id){
            found = true ;
            user.entries++ ;
            return res.json(user.entries) ;
            
        }
    })
    if(!found)
    {
        res.status(400).json('No such user') ;
    }
})




app.listen(3000,()=>{
    console.log('app is running on local host 3000') ;
})

/*
 / --> res = this is working
 /signin -->Post  = successful/fail 
 /register-->Post  = user
 /:profile/:userid --> Get = user 
 /image --> PUT -->user

*/