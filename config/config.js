/**
 * Created by zhiwen on 14-10-23.
 */
var _util = require('./../common/util').util;
exports.config = {

    ip : '127.0.0.1',

    domain: '*',

    db : 'rms',

    getItem : function(items){
        return _util.deepClone(items);
    },


    adminOpt : {

        items : [{
            cls :'',
            name : 'Home',
            uri : '/admin'
        },{
            cls :'',
            name : 'User',
            uri : '/admin/users'
        },{
            cls :'',
            name : 'CharRoom',
            uri : '/admin/charRoom'
        }]
    },

    webOpt : {
        items : [{
            cls :'',
            name : 'Home',
            uri : '/'
        },{
            cls :'',
            name : 'Room',
            uri : '/room'
        },{
            cls :'',
            name : 'Option',
            uri : '/option'
        }]

    }

}