var process = require("bpm/v3/process");
var dao = require("successfactors-synchronizer/data/EntityDao")

var execution = process.getExecutionContext();
var entityModel = JSON.parse(process.getVariable(execution.getId(), "entityModel"));

dao.setEntityModel(entityModel);
dao.createTable();