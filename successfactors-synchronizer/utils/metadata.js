var xml = require("utils/v3/xml");
var httpClient = require("http/v3/client");
var successFactorsClient = require("successfactors-synchronizer/utils/client");

exports.getMetadata = function(entity) {
	var api = successFactorsClient.getApi(entity);
	var metadataResponse = httpClient.get(api + "/$metadata", {
		headers: [successFactorsClient.getAuthorizationHeader()]
	});

	var metadata = JSON.parse(xml.toJson(metadataResponse.text));

	return metadata["edmx:Edmx"]
		["edmx:DataServices"]
		["Schema"]
		[1]
		["EntityType"]
		["Property"]
		.map(e => {
			return {
				name: e["-Name"],
				type: e["-Type"],
				nullable: e["-Nullable"],
				required: e["-sap:required"],
				creatable: e["-sap:creatable"],
				updatable: e["-sap:updatable"],
				upsertable: e["-sap:upsertable"],
				visible: e["-sap:visible"],
				sortable: e["-sap:sortable"],
				filterable: e["-sap:filterable"],
				label: e["-sap:label"]
			};
		});
};