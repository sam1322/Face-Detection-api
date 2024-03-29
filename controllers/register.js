const handleRegister = (req,res,db,bcrypt,saltRounds)=>{
    const { email , name ,password } = req.body ;
    
    // bcrypt.hash(password, saltRound, function(err, hash) {
    //     console.log(hash) ;
    // });
if(!email||!name||!password)
{
   return  res.status(400).json('Incorrect form submission') ;
}
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

}

module.exports = {
    handleRegister: handleRegister 
}