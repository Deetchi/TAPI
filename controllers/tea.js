const Tea = require('../models/tea');
const multer = require('multer');

//upload Image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadImg = multer({storage: storage}).single('image');

//POST tea
const newTea = (req, res) => {
    //check if tea already exists in db
    Tea.findOne({name:req.body.name},(data)=>{
        console.log(req.file);
        //if tea not in db, add it
        if(data===null){
            const newTea = new Tea({
                name:req.body.name,
                image: req.file.path,
                description: req.body.description,
                keywords: req.body.keywords,
                origin: req.body.origin,
                brew_time: req.body.brew_time,
                temperature: req.body.temperature,
            })

            // save to database
            newTea.save((err, data)=>{
                if(err) return res.json({Error: err});
                return res.json(data);
            })            
        }else{
            return res.json({message:"Tea exists"});
        }
    })    
};

//GET all teas
const getAllTea = (req, res) => {
    Tea.find({}, (err, data)=>{
        if (err){
            return res.json({Error: err});
        }
        return res.json(data);
    })
};

//DELETE teas
const deleteAllTea = (req, res) => {
    Tea.deleteMany({}, err => {
        if(err) {
          return res.json({message: "Complete delete failed"});
        }
        return res.json({message: "Complete delete successful"});
    })
};

//GET 1 tea
const getOneTea = (req, res) => {
    let name = req.params.name;
    Tea.findOne({name:name}, (err, data) => {
    if(err || !data) {
        return res.json({message: "Tea doesn't exist."});
    }
    else return res.json(data);
    });
};

//POST 1 tea comment
const newComment = (req, res) => {
    let name = req.params.name;
    let newComment = req.body.comment;

    const comment = {
        text: newComment,
        date: new Date()
    }
    
    //find the tea object
    Tea.findOne({name:name}, (err, data) => {
        if(err || !data || !newComment) {
            return res.json({message: "Tea doesn't exist."});
        }
        else {
            //add to comments array of the tea object
            data.comments.push(comment);
            
            //save changes to db
            data.save(err => {
                if (err) { 
                return res.json({error:err});
                }
                return res.json(data);
            })  
        } 
    })
};

//DELETE 1 tea
const deleteOneTea = (req, res) => {
    let name = req.params.name;
    Tea.deleteOne({name:name}, (err, data) => {
    if(err || !data) {
        return res.json({message: "Tea doesn't exist."});
    }
    else return res.json({message: "Tea deleted."});
    });
};

//export controller
module.exports = {
    getAllTea,
    uploadImg,
    newTea,
    deleteAllTea,
    getOneTea,
    newComment,
    deleteOneTea
};