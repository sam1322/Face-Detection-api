const Clarifai = require('clarifai')

const app = new  Clarifai.App({
    // apiKey:'24b3781c6755492599230a1e2d0a3125'
    apiKey :'7b84e73d37684b1bbc34c2560d8ce0c0'
    // apiKey:'1d0adac7b6454014a35371852c8c4d4a'
  }) ;
  
const handleApiCall = (req,res) =>{
    console.log("hello Sriram")
  app.models
//   .predict( Clarifai.FACE_DETECT_MODEL, req.body.input)
.predict(
    {
      id: "a403429f2ddf4b49b307e318f00e528b",
      version: "34ce21a40cc24b6b96ffee54aabff139",
    },
    req.body.input
  )
  .then(data =>{
      console.log(data)
      return res.json(data) ;
  })
  .catch(err =>res.status(400).json(`unable to work with Api getting error ${err}`))
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