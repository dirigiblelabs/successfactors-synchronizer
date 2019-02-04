var response = require("http/v3/response");
var configurations = require("core/v3/configurations");
var httpClientAsync = require("http/v3/clientAsync");
var clientAsync = httpClientAsync.getInstnace();
var successFactorsClient = require("successfactors-synchronizer/utils/client");
var dao = require("successfactors-synchronizer/dao/WorkScheduleDao");
configurations.set("SUCCESSFACTORS_WORKSCHEDULE", JSON.stringify([]));

//var workSchedules = dao.create({
//	table: "SUCCESSFACTORS_WORKSCHEDULE",
//	properties: [{
//		name: "externalCode",
//		column: "EXTERNALCODE",
//		type: "VARCHAR",
//		id: true
//	}, {
//		name: "modelCategory",
//		column: "MODELCATEGORY",
//		type: "VARCHAR",
//		required: true
//	}, {
//		name: "userId",
//		column: "USERID",
//		type: "VARCHAR",
//		required: false
//   }]
//});
//
////Create CUSTOMERS table
//workSchedules.createTable();

dao.dropTable();
dao.createTable();

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

var workSchedules = JSON.parse(configurations.get("SUCCESSFACTORS_WORKSCHEDULE", "[]"));
for (var i = 0; i < workSchedules.length; i ++) {
	var workSchedule = workSchedules[i];
	dao.create(workSchedule);
}
response.println(JSON.stringify(workSchedules));