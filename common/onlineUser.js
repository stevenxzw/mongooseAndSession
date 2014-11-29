/**
 * Created by steven on 14-11-5.
 * 在线用户列表
 */
(function(){

    var socket ;
    global.io.sockets.on('connection', function (st) {
        socket = st
    });
    var OnlineUser = {

        invalTime : 20000,

        invalTimer  : null,

        users : {},

        getUserKey : function(user){
            return user.uid+'-'+user.rid;
        },

        getUsers : function(){
            return this.users;
        },

        addUser : function(user, fn){
            if(this.isHasUser(user)){
                this.updateUserTime(this.users[this.getUserKey(user)]);
            }else{
                this.updateUserTime(user);
                this.users[this.getUserKey(user)] = user;
                //fn && fn(this.users);
                //console.log('----------------------------');
                this.emitUserChange();
                if(this.invalTimer === null){
                    this.setInterval();
                }
            }
        },

        emitUserChange : function(){
            socket.broadcast.emit('userChange', this.users);
        },

        isHasUser : function(user){
            return this.users[this.getUserKey(user)];
        },

        updateUserTime : function(user){
            return (user.lastTime = this.getDate());
        },

        getDate : function(){
            return +new Date;
        },

        delUser : function(user){

            delete this.users[this.getUserKey(user)];
            if(this.isEmpty()) this.clearInterval();
            console.log('---------delUser');
            this.emitUserChange();
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
            var nowTime = +new Date;
            for(var k in this.users){
                var user = this.users[k];
                if(user.lastTime + this.invalTime < nowTime){//20秒内没有通信息
                    this.delUser(user);
                }
            }

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