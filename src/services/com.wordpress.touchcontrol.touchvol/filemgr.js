function listDirsAssistant() {};
listDirsAssistant.prototype.run = function(future) {
var inArgs = this.controller.args;
var inPath = inArgs.path;

future.result = list(inPath, "dir");	
};

function listFilesAssistant() {};
listFilesAssistant.prototype.run = function(future) {
var inArgs = this.controller.args;
var inPath = inArgs.path;
future.result = list(inPath, "file");	

};

function getParentAssistant() {};
getParentAssistant.prototype.run = function(future) {
var inArgs = this.controller.args;
var path = IMPORTS.require('path'); 
var filepath = inArgs.file;

var parent = path.normalize(filepath + "/..");
if (path.existsSync(parent)) {
	future.result = {"parent": parent};
}
else {
	future.result = {"result": false};
}
};

function list(startPath, inFunc) {
var fs = IMPORTS.require("fs");
var path = IMPORTS.require("path");
var i;
var masterList = new Array();
var fileList = [];
var dirList = [];
var result = {"result": false};
var curFile = "";
if (path.existsSync(startPath)) {
    masterList = fs.readdirSync(startPath);
    for (i in masterList.sort()) {
        var item = {};
        curFile = startPath + '/' + masterList[i];
        item.name = masterList[i];
        item.path = curFile;

		if (fs.statSync(curFile).isFile()) {
            fileList.push(item);
        }
        else {
            dirList.push(item);
        }
    }
    
	if (inFunc === "dir") {
		result = {items:dirList};
	}
	else if (inFunc === "file") {
		result = {items:fileList};
	}
}
return (result);
}