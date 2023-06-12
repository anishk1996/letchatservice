const mongoose = require("mongoose");

const DB = process.env.DATABASE
console.log('Starting DB connection', DB);
mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=> console.log("DataBase Connected")).catch((err)=>{
    console.log('Error in connection online');
    console.log(err);
})