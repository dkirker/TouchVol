function patchAssistant() {};
patchAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;
var appid = this.controller.message.applicationID();
this.command = "/bin/sh /media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts/";
if (inArgs.command === "install") {
	this.command = this.command + "inst-lunapatch.sh";
} 
else if (inArgs.command === "remove") {
	this.command = this.command + "rem-lunapatch.sh";
} 
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	consolego(this.command, function(hidden) { 
		this.future.result = hidden; 
		if (this.future.result.substring(0,4) === "Done") {
			this.command = "/usr/bin/pkill LunaSysMgr"
			consolego(this.command, function(whatever) { }.bind(this));
		}
	}.bind(this));
}
else {
	this.future.result = {"error":"Reserved for internal use"};
}
};

function UCMpatchAssistant() {};
UCMpatchAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;
var appid = this.controller.message.applicationID();
var command = "/bin/sh /media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts/"
if (inArgs.command === "headphone") {
	command = command + 'base_ucm.sh "\'Headphone Volume\'"';
} 
else if (inArgs.command === "microphone") {
	command = command + 'base_ucm.sh "\'IN1L Volume\'" "\'IN2L Volume\'"';
} 
else if (inArgs.command === "pre3eq") {
	command = command + 'base_ucm.sh "\'AIF1DAC1 EQ1 Volume\'" "\'AIF1DAC1 EQ2 Volume\'" "\'AIF1DAC1 EQ3 Volume\'" "\'AIF1DAC1 EQ4 Volume\'" "\'AIF1DAC1 EQ5 Volume\'"';
}
else if (inArgs.command === "reset") {
	command = command + "reset_ucm.sh";
}
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	consolego(command, function(hidden) { 
		this.future.result = hidden; 
	}.bind(this));
}
else {
	this.future.result = {"error":"Reserved for internal use"};
}
};

function consolego(command, callback) {
var cmd = new CommandLine(command);
cmd.run(function(response) {
		var txtblock = response.stdout;

		if(this.callback) {
			callback(txtblock);
		} else if(this.future) {
			this.future.result = txtblock;
		}
	});
};

function PulseAssistant() {};
PulseAssistant.prototype.run = function(future) {
this.future = future;
var appid = this.controller.message.applicationID();

if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
var cmd = "/sbin/stop pulseaudio; /sbin/stop audiod; sleep 1; /sbin/start pulseaudio; sleep 2; /sbin/start audiod";
var exec = require("child_process").exec;
exec(cmd, function() { 
	future.result = {"return":"No reason to processs returns for this method, too bad!"};
});
}
else {
this.future.result = {"error":"Reserved for internal use"};
}
};

function saveFileAssistant() {};
saveFileAssistant.prototype.run = function(future) {
var inArgs = this.controller.args;
var fs = IMPORTS.require("fs");
var path = IMPORTS.require('path'); 
var filename = "/media/internal/TouchVol-profile-" + inArgs.filename + ".tvp";
var exists = path.existsSync(filename);
var appid = this.controller.message.applicationID();
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	if (exists) {
		fs.renameSync(filename, filename + ".backup");
	}
	var error = fs.writeFileSync(filename, '{"name":"' + inArgs.filename + '","profile":' + inArgs.profile + "}");
	
	if (!error) {
		//console.log("success");
		future.result = {"result": true};
	}
	else {
		//console.log("fail");
		future.result = {"result": false};
	}
}
else {
this.future.result = {"error":"Reserved for internal use"};
}
};

function readFileAssistant() {};
readFileAssistant.prototype.run = function(future) {
var inArgs = this.controller.args;
var fs = IMPORTS.require("fs");
var path = IMPORTS.require('path'); 
var filename = inArgs.filename;
var appid = this.controller.message.applicationID();
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	var exists = path.existsSync(filename);
	if (exists) {
		var content = fs.readFileSync(filename, 'utf8');
		future.result = JSON.parse(content);
	}
	else {
		future.result = {"result": false};
	}
}
else {
this.future.result = {"error":"Reserved for internal use"};
}
};

function regHandlerAssistant() {};
regHandlerAssistant.prototype.run = function(future) {
this.future = future;
var appid = this.controller.message.applicationID();

if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
var cmd = "/usr/bin/luna-send -n 1 palm://com.palm.applicationManager/removeHandlersForAppId '{\"appId\":\"com.wordpress.touchcontrol.touchvol\"}'; sleep 1; /usr/bin/luna-send -n 1 palm://com.palm.applicationManager/addResourceHandler '{\"appId\":\"com.wordpress.touchcontrol.touchvol\",\"extension\":\"tvp\",\"mimeType\":\"application/touchvol\",\"shouldDownload\":true}'";
var exec = require("child_process").exec;
exec(cmd, function() { 
	future.result = {"return":"No reason to processs returns for this method, too bad!"};
});
}
else {
this.future.result = {"error":"Reserved for internal use"};
}
};

function KillLaunchwindowAssistant() {};
KillLaunchwindowAssistant.prototype.run = function(future) {
this.future = future;
var cmd = "/bin/sh /media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts/kill_launcher.sh";
var appid = this.controller.message.applicationID();
var exec = require("child_process").exec;
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	exec(cmd, function() { future.result = {"return":"No reason to processs returns for this method, too bad!"};
	}); 	
}
else {
	this.future.result = {"error":"Reserved for internal use"};
	};
};