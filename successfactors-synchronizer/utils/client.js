var base64 = require('utils/v3/base64');
var successFactorsConfig = require('successfactors-auth/utils/config');


exports.getApi = function(entity) {
	return 'https://' + successFactorsConfig.getHost() + '/odata/v2/' + entity;
};

exports.getAuthorizationHeader = function() {
	var basicHeader = successFactorsConfig.getUser() + '@' + successFactorsConfig.getCompany() + ':' + successFactorsConfig.getPassword();
	return {
		'name': 'Authorization',
		'value': 'Basic ' + base64.encode(basicHeader)
	};
};