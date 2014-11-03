/**
 * Created by zhiwen on 14-10-29.
 */
/**
 * 所有Dao的父类
 */

function CommonDao (Model){
    /*if(typeof Model === 'undefined' || Model == null)
     throw new Error('Model can not be null.');
     */
    this.model = Model;
}

/**
 *create
 *主要用于批量添加
 */
CommonDao.prototype.create = function (doc,callback){
    this.model.create(doc, function (error) {
        if(error) return callback(error);

        return callback(null);
    });
};

/**
 * 根据Id获取Model
 */
CommonDao.prototype.getById = function (id, callback) {
    this.model.findOne({_id:id}, function(error, model){
        if(error) return callback(error,null);

        return callback(null,model);
    });
};

/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.countByQuery = function (query, callback) {
    this.model.count(query, function(error, model){
        if(error) return callback(error,null);

        return callback(null,model);
    });
};

/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.getByQuery = function (query,fileds,opt,callback) {
    this.model.find(query, fileds, opt, function(error,model){
        if(error) return callback(error,null);

        return callback(null,model);
    });
};

/**
 * 根据查询条件获取Model
 */
CommonDao.prototype.getByQueryOfPage = function (query,fileds,opt,callback) {

    //.limit(pageSize).skip((page-1)*pageSize)
    this.model.find(query, fileds, opt, function(error,model){
        if(error) return callback(error,null);

        return callback(null,model);
    });
};

/**
 * 获取所有Model
 */
CommonDao.prototype.getAll = function (callback) {
    this.model.find({}, function(error,model){
        if(error) return callback(error,null);

        return callback(null, model);
    });
};
/*
 CommonDao.prototype.getAllModelByOption = function (opt, callback) {
 CommonDao.getModelByQuery({},{},opt, callback);
 };*/

/**
 * 根据查询条件删除
 */
CommonDao.prototype.delete = function (query, callback){
    this.model.remove(query, function(error){
        if(error) return callback(error);

        return callback(null);
    });
};

/*
 * 更新
 */
CommonDao.prototype.update = function( conditions, update ,options, callback) {
    this.model.update(conditions, update, options, function (error) {
        if(error) return callback(error);

        return callback(null);
    });
};

module.exports = CommonDao;

/*
查询总结:
    模糊查询两种方法 :
        var key = req.query.n;
        1:  {'name':{$regex:key}}
        2:  {'name':RegExp(key)}



 */