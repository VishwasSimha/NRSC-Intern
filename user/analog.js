var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/nodeshop',{useNewUrlParser:true});
// CREATE INSTANCE OF THE SCHEMA
var mongoSchema =   mongoose.Schema;
// CREATE SCHEMA
var analog  = {
    "id" : String,
    "key" : Number,
    "sensortype" : String,
    "sensorid" : String,
    "min_sensor_value" : Number,
    "max_sensor_value" : Number,
    "sensitivity" : Number,
    "sensor_value" : Number,
    "datetime" : Date
};
// CREATE MODEL IF NOT EXIST
module.exports = mongoose.model('anaschema',analog);