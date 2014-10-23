/**
 * session
 * Created by zhiwen on 14-10-23.
 */

(function(){
    var _debug = global._debug ,
        conn = require('./../common/conn'),
        util = require('./../common/util').util;
    var _data = {};

    exports.sessoin = {
        //基本配置
        config : {
            //回收会话时间
            gcTime : 1000*60 *2,
            //心跳保持时间
            hbTime : 1000*2,

            cookieGc : 1000*60 *5,
            //每个会话消息保存长度
            msgMaxLength : 50,

            cookiename : 'sid',

            //保存位置
            saveIndb : false
        },

        //保存会话
        _data : {},
        /** 会话基本操作 ***/

        //获取请求cookie
        getReqCookie : function(req){

            var _cookie = {}, cookies =  req.headers.cookie;
            if(!cookies) return {};
            cookies.split(';').forEach(function (c) {
                var pair = c.split('=');
                _cookie[pair[0].trim()] = [pair[1].trim(), {}];
            });
            return _cookie;
        },

        hasCookie : function(req){
            var cookie = this.getReqCookie(req), sid;
            if(sid = cookie[this.config.cookiename]){
                return this.getSession(sid);
            }else{
                return false;
            }
        },

        setSession : function(req, res, username){
            var cookie = this.hasCookie(req);
            if(!cookie && username){
                var sid = this.createSession(req);
                cookie = this._data[sid] = this.sessionContent(sid, username);
            }else{
                cookie.gcTime = (+new Date) + this.config.gcTime;
            }
            res.setHeader("Set-Cookie", ['sid='+cookie.sid+ ';expires='+cookie.cookieGc]); //注意：多个cookie需要
        },

        //查找会话
        getSession : function(sid){
            return this._data[sid];
        },
        //创建会话
        createSession : function(req){
            var ip = util.getUserIP(req),
                time = (new Date()).getTime() + '',
                sid = ip+'_'+(new Date().getTime()) + '_' + (Math.round(Math.random() * 1000));
            return sid;
        },

        sessionContent : function(sid, username){

            return {

                gcTime : (+new Date) + this.config.gcTime,

                sid : sid,

                cookieGc : (+new Date) + this.config.cookieGc,

                username : username

            }

        },

        //替换会话
        replaceSession : function(source,target){},
        //销毁会话
        destorySession : function(id){},
        //共享会话
        sharedSession : function(){},

        /** 会话处理器 ***/
        //初始化会话回收处理器
        initSessionGCProcessor : function(){},
        //初始化会话心跳检测处理器
        intiSessionHeartbeatProcessor : function(){
            var that = this;
            setInterval(function(){
                var now = +new Date, j = 0 ;
                for(var k in that._data){
                    var item = that._data[k];
                    if(item.gcTime < now){
                        delete that._data[k];
                    }
                    j++;
                }
                if(j){
                    console.log(now+'---------------:');
                    console.log(that._data);
                }
            }, this.config.hbTime)
        },
        //推送消息处理器
        pushMessageProcessor : function(id){},

        init : function(){
            //console.log(conn.db);
            //console.log(this);
            this.intiSessionHeartbeatProcessor();
        }

        /*
         var session = {
         id:'xx',
         state : 1, //会话状态
         lastTime : new Date(), //最后访问时间
         _attr :{}, //属性
         _msg : [], //保存推送消息
         getAllAttr : function(){ return this._attr; },
         getAttr : function(key){ return this._attr[key]; }, //获取属性
         removeAttr : function(key){ delete this._attr[key]; }, //删除属性
         setAttr : function(key,value){  this._attr[key] = value; return this; }, //设置属性
         write : function(msg){ this._msg.push(msg); },    //输入准备推送的消息
         getAndPushMsg : function(){ var result = this._msg; this._msg = []; return  result; }, //获取并且推送消息
         close : function(){ this.state = 0; }, //关闭会话
         destory : function(){ this.state = -1;}, //销毁会话
         replace : function(session){ this._attr = session.getAllAttr(); }, //替换会话
         refreshLastTime : function(){ this.lastTime = new Date(); }, //刷新最后访问时间
         };

         */
    }

})()