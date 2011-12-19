function require(key) {
	return IMPORTS.require(key);
};

String.prototype.startsWith = function(str) {
	return (this.indexOf(str) == 0);
};
