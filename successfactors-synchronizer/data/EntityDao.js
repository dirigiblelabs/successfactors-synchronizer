var daoBuilder = require("db/v3/dao");
var sql = require('db/v3/sql');
var query = require('db/v3/query');

var dao = null;
var entityModel = null;

exports.setEntityModel = function(model) {
	entityModel = model;
	dao = daoBuilder.create(model);
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

exports.update = function(entity) {
	var id = this.getId(entity);
	if (id) {
		entity[entityModel.key.name] = id;
		dao.update(entity);
	}
};

exports.delete = function(id) {
	dao.remove(id);
};

exports.count = function() {
	return dao.count();
};

exports.getId = function(entity) {
	var script = sql.getDialect()
		.select(entityModel.key.column)
		.from(entityModel.table)
		.where(entityModel.businessKeys.map(e => e.name.toUpperCase() + " = ?").join("and"))
		.build();

	var parameters = [];
	for (var i = 0; i < entityModel.businessKeys.length; i ++) {
		for (var j in entity) {
			if (entityModel.businessKeys[i].name === j) {
				parameters.push(entity[j]);
			}
		}
	}
	var resultSet = query.execute(script, parameters);
	return resultSet && resultSet.length > 0 ? resultSet[0][entityModel.key.column] : null;
};

exports.contains = function(entity) {
	return this.getId(entity) !== null;
};