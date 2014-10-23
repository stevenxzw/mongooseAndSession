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
            gcTime : 1000*60 *15,
            //心跳保持时间
            hbTime : 1000*2,
            //每个会话消息保存长度
            msgMaxLength : 50,

            //保存位置
            saveIndb : false
        },

        //保存会话
        _data : {},
        /** 会话基本操作 ***/


        getReqCookie : function(req){

            var _cookie = {}, cookies =  req.headers.cookie;
            cookies.split(';').forEach(function (c) {
                var pair = c.split('=');
                _cookie[pair[0].trim()] = [pair[1].trim(), {}];
            });
            console.log(_cookie);
        },
        //查找会话
        getSession : function(sid){
            var cookie;
            if(cookie){

            }

        },
        //创建会话
        createSession : function(req){
            var ip = util.getUserIP(req);
            var time = (new Date()).getTime() + '';
            var id = ip+'_'+(new Date().getTime()) + '_' + (Math.round(Math.random() * 1000));
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
        intiSessionHeartbeatProcessor : function(){},
        //推送消息处理器
        pushMessageProcessor : function(id){},

        init : function(){
            //console.log(conn.db);
            //console.log(this);
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