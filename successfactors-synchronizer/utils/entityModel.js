var extensions = require("core/v3/extensions");
var metadataUtils = require("successfactors-synchronizer/utils/metadata");

function getDatabaseType(oDataType) {
	switch (oDataType) {
		case "Edm.String":
			return "VARCHAR";
		case "Edm.Double":
			return "DOUBLE";
		case "Edm.DateTime":
			return "DATETIME";
		case "Edm.Boolean":
			return "BOOLEAN";
		case "Edm.Int32":
			return "INTEGER";
		case "Edm.Int64":
			return "INTEGER";
		case "Edm.Single":
			return "BIT";
		case "Edm.DateTimeOffset":
			return "DATETIMEOFFSET";
		default:
			return "VARCHAR";
	}
}

exports.getModel = function(entity) {
	var model = {
		table: "SUCCESSFACTORS_" + entity.toUpperCase(),
		properties: [{
			name: "id",
			column: "ID",
			type: "INTEGER",
			id: true
		}]
	};
	var metadata = metadataUtils.getMetadata(entity);
	var selectedProperties = this.getSelectedProperties(entity);
	selectedProperties = selectedProperties ? selectedProperties : metadata;

	model.oDataSelect = selectedProperties.map(e => e.name).join(",");

	for (var i = 0; i < selectedProperties.length; i++) {
		for (var j = 0; j < metadata.length; j ++) {
			if (metadata[j].name === selectedProperties[i].name) {
				model.properties.push({
					name: metadata[j].name,
					column: metadata[j].name.toUpperCase(),
					type: getDatabaseType(metadata[j].type),
					required: !Boolean(metadata[j].nullable)
				});
			}
		}
	}
	return model;
};

exports.getSelectedProperties = function(entity) {
	var entityModels = extensions.getExtensions("successfactors-entity-models");
	if (entityModels !== null && entityModels.length > 0) {
		for (var i = 0; i < entityModels.length; i ++) {
			var module = require(entityModels[i]);
			if (module.getEntityName() === entity) {
				return module.getSelectedProperties();
			}
		}
	}
	return null;
};