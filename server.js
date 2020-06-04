const express = require('express')
const bodyParser = require('body-parser') ;
const app = express() ;
const bcrypt = require('bcrypt')
const cors = require('cors') 
const knex = require('knex')

app.use(cors())
app.use(bodyParser.json()) ;
 
const saltRounds = 10 

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234',
      database : 'face_detection'
    }
  });


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

    const hash = bcrypt.hashSync(password, saltRounds);

    db.transaction(trx=>{
        trx.insert({
            hash:hash ,
            email :email 
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0] ,
                name:name , 
                joined :new Date()
            })
            .then(user =>{
                res.json(user[0]) ;
            })
        })
        .then(trx.commit)
        .catch(trx.rollback) 
    })
   
    .catch(err=> res.status(400).json('unable to register')) 

})


app.get('/profile/:id',(req,res)=>{
    const {id} = req.params ;

    
    db.select('*').from('users').where({id})
    .then(user=>{
        if(user.length)
            res.json(user[0]) 
        else
        res.status(400).json('No such user') ;
    }) 
    .catch(err => res.status(400).json('error getting user') )
    // if(!found)
    // {
    //     res.status(400).json('No such user') ;
    // }
}) 

app.put('/image' ,(req ,res) =>{
    const {id} = req.body ;

    db('users')
    .where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries) ;
    })
    .catch(err=>res.status(400).json('Unable to get entries'))
    // let found = false ; 
    // database.users.forEach(user =>{
    //     if(user.id ===id){
    //         found = true ;
    //         user.entries++ ;
    //         return res.json(user.entries) ;
            
    //     }
    // })
    // if(!found)
    // {
    //     res.status(400).json('No such user') ;
    // }
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