/**
 * Created by zhiwen on 14-10-27.
 */

(function(){

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var PersonSchema = new Schema({
        name:String,   //定义一个属性name，类型为String
        age : Number,
        attr : {}
    });

    PersonSchema.methods.speak = function(){
        console.log(this.name);
    };

    PersonSchema.statics.findByName = function(name,cb){
        this.find({name:new RegExp(name,'i')},cb);
    }


    var BlogSchema = new Schema({
        title:String,
        author:String
    });

    module.exports = {
        person : PersonSchema,

        blog : BlogSchema
    };

})()