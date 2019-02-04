var daoBuilder = require("db/v3/dao");

var dao = null;

exports.setEntityModel = function(entityModel) {
	dao = daoBuilder.create(entityModel);
};

exports.existsTable = function() {
	return dao.existsTable();
};

exports.createTable = function() {
	dao.createTable();
};

exports.dropTable = function() {
	dao.dropTable();
};

exports.list = function(settings) {
	return dao.list(settings);
};

exports.get = function(id) {
	return dao.find(id);
};

exports.create = function(entity) {
	dao.insert(entity);
};

exports.delete = function(id) {
	dao.remove(id);
};

exports.count = function() {
	return dao.count();
};