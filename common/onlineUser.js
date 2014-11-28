/**
 * Created by steven on 14-11-5.
 * 在线用户列表
 */
(function(){

    var socket  = global.io.sockets.on('connection', function (st) {
        socket = st
    });
    var OnlineUser = {

        invalTime : 20000,

        invalTimer  : null,

        users : {},

        addUser : function(user, fn){
            if(this.isHasUser(user)){
                this.updateUserTime(user);
            }else{
                this.users[user.id+'-'+user.rid] = this.updateUserTime(user);
                fn && fn('addsuccess');
                socket.broadcast.emit('userChange', this.users);
                if(this.invalTimer === null){
                    this.setInterval();
                }
            }
        },

        isHasUser : function(user){
            return this.users[user.id+'-'+user.rid];
        },

        updateUserTime : function(user){
            return (user.lastTime = this.getDate());
        },

        getDate : function(){
            return +new Date;
        },

        delUser : function(user){
            delete this.users[user.id+'-'+user.rid];
            if(this.isEmpty()) this.clearInterval();
            socket.broadcast.emit('userChange', this.users);
        },

        setInterval : function(){
            var that = this;
            this.clearInterval();
            this.invalTimer = setInterval(function(){
                that.repeatUsers();
            }, this.invalTime);
        },

        clearInterval : function(){
            clearInterval(this.invalTimer);
            this.invalTimer = null;
        },



        repeatUsers : function(){
            var nowTime = +new Date, that = this;
            forEach(this.users, function(i, user){
                if(user.lastTime + this.invalTime < nowTime){//20秒内没有通信息
                    that.delUser(user);
                }
            });
        },

        isEmpty : function(){
            for(var n in this.users){
                return false;
            }
            return true;
        }
    };


    module.exports = OnlineUser;

})()