var process = require("bpm/v3/process");
var dao = require("successfactors-synchronizer/data/EntityDao")
var inMemoryEntityDao = require("successfactors-synchronizer/data/InMemoryEntityDao");

function getEntity() {
	var execution = process.getExecutionContext();
	return process.getVariable(execution.getId(), "entity");
}

function getEntityModel() {
	var execution = process.getExecutionContext();
	return JSON.parse(process.getVariable(execution.getId(), "entityModel"));
}

dao.setEntityModel(getEntityModel());

var entities = inMemoryEntityDao.list(getEntity());
for (var i = 0; i < entities.length; i ++) {
	var entity = entities[i];
	if (!dao.contains(entity)) {
		dao.create(entity);
	} else {
		dao.update(entity);
	}
}