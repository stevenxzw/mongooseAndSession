/**
 * Created by steven on 14-11-3.
 */

(function(){

    var _debug = global._debug || false,
        _util = require('./../common/util').util,
        commonDao = require('./../Dao/commonDao'),
        mongoose = require('./../common/mongoose');

    exports.Impl = {

        login : function(req, res){
            var user = _util.getHttpRequestParams(req), that = this;
            if(user.username){
                this.getUserPwd(user.username, function(err, result, row){
                    if(err){
                        res.json(_util.resultCollection(err,'', result));
                    }else{
                        if(that.comparePwdMD5(result, user.pwd)){
                            that.setSessin(req, user);
                            that.uploadTable('users',{uid:user.username}, {$set:{'lastTime':+new Date,'logTimes':row['logTimes']+1}},'', function(err){
                                _debug && console.log('change user login:'+err);
                            });
                            res.json(_util.resultCollection(err, '', result));
                        }else{
                            res.json(_util.resultCollection("密码错误",'10001', result));
                        }
                    }
                });
            }
        },

        uploadTable : function(table, conditions, update ,options, callback) {
            var t = mongoose.getDao(table);
            t.update(conditions, update, options, callback);
        },

        /*-----------------帐号功能------------------*/

        //密码比较
        comparePwdMD5 : function(dbpwd, pwd){
            var crypto = require('crypto');
            var md5 = crypto.createHash('md5');
            return dbpwd === pwd;
            return md5.update(pwd).digest('base64') === dbpwd;
        },

        //取出帐号密码
        getUserPwd : function(uid, fn){
            var users = mongoose.getDao('users');

            users.getByQuery({name:uid}, '','', function(err, result){
                if(result.length){
                    fn && fn(err, result[0].pass, result[0]);
                }else
                    fn && fn("帐号不存在", result);
            });
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

        setSessin : function(req, user){
            req.session.user_id = user.username || user.weiboId || user.qqId;
            req.session.resetSession = +new Date;
        },

        getSession : function(req, key){
            _debug && console.log(req.session.user_id)
            if(req.session.user_id && key) return req.session[key];
            return req.session.user_id || '';
        },

        getCookie : function(__req){
            _debug && console.log(__req.cookies);
            return __req.cookies;
        },

        setCookie : function(__res, cookies, seconds, domain, httpOnly){
            seconds = seconds ? seconds*1000 : 0;
            for(var key in cookies){
                __res.cookie(key, cookies[key], {maxAge:seconds, path:domain || '/', secure:false, httpOnly:httpOnly?httpOnly:false});
            }
        }
    }

})();
