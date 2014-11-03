/**
 * Created by steven on 14-11-3.
 */

(function(){

    var cutil = require('./../common/cutil').util;

    exports.Impl = {

        login : function(req, res){
            var user = cutil.getHttpRequestParams(req);
            if(user.username){
                impl.getUserPwd(user.username, function(err, result, row){
                    if(err){
                        res.json(cutil.resultCollection(err,'', result));
                    }else{
                        if(impl.comparePwdMD5(result, user.pwd)){
                            impl.setSessin(req, user);
                            impl.uploadTable('users',{uid:user.username}, {$set:{'lastTime':+new Date,'logTimes':row['logTimes']+1}}, function(err){
                                _debug && console.log('change user login:'+err);
                            });
                            res.json(cutil.resultCollection(err, '', result));
                        }else{
                            res.json(cutil.resultCollection("密码错误",'10001', result));
                        }
                    }
                });
            }
        },

        /*-----------------帐号功能------------------*/

        //密码比较
        comparePwdMD5 : function(dbpwd, pwd){
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            return md5.update(pwd).digest('base64') === dbpwd;
        },

        //取出帐号密码
        getUserPwd : function(uid, fn){
            mongo.read('users', {"uid":uid}, function(err, result){
                if(result.length){
                    fn && fn(err, result[0].pwd, result[0]);
                }else
                    fn && fn("帐号不存在", result);
            })
        },


        //获取帐号权限
        getRole : function(uid, fn){
            mongo.read('users', {"uid":uid}, function(err, result){
                if(result.length){
                    fn && fn(err, result[0].role);
                }else
                    fn && fn("帐号不存在", result);
            })
        },
    }

});
