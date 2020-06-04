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

app.get('/' ,(req, res)=>{
    res.json(database.users)
})

app.post('/signin',(req,res)=>{
    //using sync for now so that the function used are simple to understand
    db.select('email','hash').from('login')
    .where('email' , '=' , req.body.email )
    .then(data =>{
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid) 
        if(isValid){
          return db.select('*').from('users') 
          .where('email','=',req.body.email) 
            .then(user =>{
                console.log(user[0]) ;
                res.json(user[0]) 
            })
            .catch(err=>res.status(400).json('unable to find user'))
        }
    else{
        res.status(400).json('Wrong credentials')
    }
    })
    .catch(err=>res.status(400).json('Wrong credentials'))


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