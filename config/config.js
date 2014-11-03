/**
 * Created by zhiwen on 14-10-23.
 */
var _util = require('./../common/util').util;
exports.config = {

    ip : '127.0.0.1',

    domain: '*',

    db : 'rms',


    adminOpt : {

        getItem : function(){
            return _util.deepClone(this.items);
        },

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
    }

}