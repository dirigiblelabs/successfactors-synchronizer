var process = require("bpm/v3/process");
var configurations = require("core/v3/configurations");
var httpClientAsync = require("http/v3/clientAsync");
var clientAsync = httpClientAsync.getInstnace();
var successFactorsClient = require("successfactors-synchronizer/utils/client");

configurations.set("SUCCESSFACTORS_WORKSCHEDULE", JSON.stringify([]));

var api = successFactorsClient.getApi("WorkSchedule");
for (var i = 0; i < 6; i ++) {
	clientAsync.getAsync(api, {
		success: function(response) {
			var configurations = require("core/v3/configurations");
			var workSchedules = JSON.parse(configurations.get("SUCCESSFACTORS_WORKSCHEDULE", "[]"));
			var entity = JSON.parse(response.text);
			workSchedules = workSchedules.concat(entity.d.results);
			configurations.set("SUCCESSFACTORS_WORKSCHEDULE", JSON.stringify(workSchedules));
		}
	}, {
		headers: [successFactorsClient.getAuthorizationHeader()],
		params: [{
			name: "$select",
			value: "externalCode,modelCategory,userId"
		}, {
			name: "$format",
			value: "json"
		}, {
			name: "$skip",
			value: i * 2
		}, {
			name: "$top",
			value: "2"
		}]
	});
}

clientAsync.execute();

