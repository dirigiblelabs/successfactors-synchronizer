var process = require("bpm/v3/process");
var httpClient = require("http/v3/client");
var httpClientAsync = require("http/v3/clientAsync");
var successFactorsClient = require("successfactors-synchronizer/utils/client");
var inMemoryEntityDao = require("successfactors-synchronizer/data/InMemoryEntityDao");

function getEntity() {
	var execution = process.getExecutionContext();
	return process.getVariable(execution.getId(), "entity");
}

function getApi() {
	return successFactorsClient.getApi(getEntity());
}

function getEntitiesCount() {
	var countResponse = httpClient.get(getApi() + "/$count", {
		headers: [successFactorsClient.getAuthorizationHeader()]
	});
	return parseInt(countResponse.text, 0);
}

function getSelectedProperties() {
	var execution = process.getExecutionContext();
	var entityModel = JSON.parse(process.getVariable(execution.getId(), "entityModel"));
	return entityModel.oDataSelect;
}

var entitiesCount = getEntitiesCount();
var batchSize = 100;
var counter = Math.ceil(entitiesCount / batchSize);

inMemoryEntityDao.clear(getEntity());
var clientAsync = httpClientAsync.getInstnace();

for (var i = 0; i < counter; i ++) {
	clientAsync.getAsync(getApi(), {
		success: function(response, context) {
			var inMemoryEntityDao = require("successfactors-synchronizer/data/InMemoryEntityDao");
			var entities = JSON.parse(response.text).d.results;
			inMemoryEntityDao.add(context.entity, entities);
		}
	}, {
		context: {
			entity: getEntity()
		},
		headers: [successFactorsClient.getAuthorizationHeader()],
		params: [{
			name: "$select",
			value: getSelectedProperties()
		}, {
			name: "$format",
			value: "json"
		}, {
			name: "$skip",
			value: i * batchSize
		}, {
			name: "$top",
			value: batchSize
		}]
	});
}
clientAsync.execute();