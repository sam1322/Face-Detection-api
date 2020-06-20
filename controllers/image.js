const Clarifai = require('clarifai')

const app = new  Clarifai.App({
    apiKey:'24b3781c6755492599230a1e2d0a3125'
  }) ;
  
const handleApiCall = (req,res) =>{
  app.models
  .predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data =>{
      res.json(data) ;
  })
  .catch(err =>res.status(400).json('unable to work with Api'))
  }

const handleImage = (req,res,db)=>{
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
}

module.exports = {
    handleImage :handleImage,
    handleApiCall:handleApiCall
}