var process = require("bpm/v3/process");
var dao = require("successfactors-synchronizer/data/EntityDao")

var daoModelUtils = require("successfactors-synchronizer/utils/entityModel");

var execution = process.getExecutionContext();
var entity = process.getVariable(execution.getId(), "entity");
var entityModel = daoModelUtils.getModel(entity);

dao.setEntityModel(entityModel);
var existsTable = dao.existsTable();

process.setVariable(execution.getId(), "entityModel", JSON.stringify(entityModel));
process.setVariable(execution.getId(), "existsTable", existsTable);