/**
 * Created by zhiwen on 14-3-20.
 * ��¼����
 */
(function(){

    var config = global.config;
    var _util = require('./../common/util').util,
        session = require('./../common/session').sessoin;

    exports.filter = {

        authorize : function(req, res, next) {
            if (!req.session.user_id && req.url.indexOf('admin/login') ==-1) {
                res.redirect('/admin/login');
            } else {
                next();
            }

        },

        templateFilter : function(req, res, next) {
            if (!req.session.user_id && req.url.indexOf('admin/login') ==-1) {
                res.redirect('/admin/login');
            } else {
                next();
            }

        },

        readSession : function(req, res, next) {
            session.getReqCookie(req);
            res.setHeader("Set-Cookie", ["sid="+_util.toCookie(req)+";path=/;domain="+config.domain+";expires="+new Date("2030") ]);

            next();
        }
    }

})()
