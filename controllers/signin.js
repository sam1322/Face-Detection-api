const handleSignIn = (req,res,db,bcrypt)=>{
    //using sync for now so that the function used are simple to understand
   
    const { email ,password } = req.body ;
  
if(!email||!password)
{
   return  res.status(400).json('Incorrect form submission') ;
}
    db.select('email','hash').from('login')
    .where('email' , '=' , req.body.email )
    .then(data =>{
        console.log(data)
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        console.log(isValid) 
        if(isValid){
          return db.select('*').from('users') 
          .where('email','=',req.body.email) 
            .then(user =>{
                console.log(user) ;
                res.json(user[0]) 
            })
            .catch(err=>res.status(400).json('unable to find user'))
        }
    else{
        res.status(400).json('Wrong credentials')
    }
    })
    .catch(err=>res.status(400).json('Wrong credentials'))


}

module.exports = {
    handleSignIn: handleSignIn  
}