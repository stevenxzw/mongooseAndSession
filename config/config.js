/**
 * Created by zhiwen on 14-10-23.
 */

exports.config = {

    ip : '127.0.0.1',

    domain: '*',

    db : 'rms',


    adminOpt : {

        items : [{
            cls :'',
            name : 'Home',
            uri : '/admin'
        },{
            cls :'',
            name : 'User',
            uri : '/admin/users'
        }]
    }

}