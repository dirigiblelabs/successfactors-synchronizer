var uuid = require('utils/v3/uuid');
var configurations = require("core/v3/configurations");

var CONFIGURATIONS_PREFIX = "SUCCESSFACTORS";

function getKeyPrefix(entityName) {
	return CONFIGURATIONS_PREFIX + "-" + entityName.toUpperCase();
}

function getKey(entityName) {
	return getKeyPrefix(entityName) + "-" + uuid.random();
}

exports.add = function(entityName, entity) {
	var key = getKey(entityName);
	var configuration = getConfiguration(key);
	if (entity instanceof Array) {
		configuration = configuration.concat(entity);
	} else {
		configuration.push(entity);
	}
	setConfiguration(key, configuration);
};
	
exports.list = function(entityName) {
	var entities = [];
	var configurationsKeyPrefix = CONFIGURATIONS_PREFIX + "-" + entityName.toUpperCase();
	var keys = configurations.getKeys();
	for (var i = 0; i < keys.length; i ++) {
		if (keys[i].startsWith(configurationsKeyPrefix)) {
			entities = entities.concat(getConfiguration(keys[i]));
		}
	}
	return entities;
};

exports.clear = function(entityName) {
	var configurationsKeyPrefix = CONFIGURATIONS_PREFIX + "-" + entityName.toUpperCase();
	var keys = configurations.getKeys();
	for (var i = 0; i < keys.length; i ++) {
		if (keys[i].startsWith(configurationsKeyPrefix)) {
			configurations.remove(keys[i]);
		}
	}
};

function getConfiguration(name) {
	var configuration = configurations.get(name, JSON.stringify([]));
	return JSON.parse(configuration);
}

function setConfiguration(name, data) {
	configurations.set(name, JSON.stringify(data));
}