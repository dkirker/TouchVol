function require(key) {
	return IMPORTS.require(key);
};

String.prototype.startsWith = function(str) {
	return (this.indexOf(str) == 0);
};

function getAppId(assistant) {
	var id = assistant.controller.message.applicationID();
	var index = id.indexOf(" ");
	if(index>-1) {
		id = id.substring(0, index);
	}
	return id;
};

function validForPrivate(assistant) {
	var appid = getAppId(assistant);
	return (appid=="" || appid=="com.wordpress.touchcontrol.touchvol");
}
