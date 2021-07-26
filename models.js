var mongoose=require("mongoose");

var ebookSchema=mongoose.Schema({
image:{
    type:String,
    required:true
},
type:{
    type:String,
    required:true
},
name:{
    type:String,
    required:true
}
});


module.exports=mongoose.model('Ebook',ebookSchema);