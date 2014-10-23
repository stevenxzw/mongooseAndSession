/**
 * Created by zhiwen on 14-3-17.
 * 连接数据库
 */

(function(){
    var _debug = global._debug, localConn = global._local;
    //if(_debug) console.log('========================conn-----------------------');
    var mongoose = require('mongoose');
    if(localConn){
        exports.db = mongoose.connect('mongodb://localhost/rms');
        if(_debug) console.log('本地数据库-------conn------rms');
    }else{
        if(_debug) console.log('外网数据库-------conn------rms');
        exports.db = mongoose.connect('mongodb://admin:123456@ds049898.mongolab.com:49898/rms');
    }
    //mongodb://<dbuser>:<dbpassword>@ds033087.mongolab.com:33087/atong
})();
