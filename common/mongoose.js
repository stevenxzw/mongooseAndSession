/**
 * Created by zhiwen on 14-10-27.
 */

(function(){

    var mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        conn = require('./../common/conn'),
        commonDao = require('./../Dao/commonDao'),
    //userSchema
    userSchema = new Schema({
        id : Number,
        name:String,
        pass : String,
        createTime : { type: Date, default: Date.now },
        loginTimes : 0
    }),


    //charRoomSchema
     charRoomSchema = new Schema({
        id : Number,
        name:String,
        createTime : { type: Date, default: Date.now },
         members : String
    }),

    //charSchema
    charSchema = new Schema({
        users:String,
        createTime : { type: Date, default: Date.now },
        content : String,
        charRoom :Number
    });







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
        users : userSchema,

        charRoom : charRoomSchema,

        char : charSchema,


        person : PersonSchema,

        blog : BlogSchema,


        getDao : function(name){
            if(this[name]){
                return new commonDao(conn.db.model(name,this[name]));
            }else return null;
        }
    };

})()