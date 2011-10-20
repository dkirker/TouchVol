function amixerAssistant() {};
amixerAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;
var cmd = "/usr/bin/amixer set \"" + inArgs.control + "\" " + inArgs.value;
var exec = require("child_process").exec;
exec(cmd, function() { future.result = {"return":"No reason to processs returns for this method, too bad!"};
	});
};

function amixerSaveAssistant() {};
amixerSaveAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;
var cmd = "/usr/sbin/alsactl -f /media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/amixer-" + inArgs.file + ".state store 0";
var appid = this.controller.message.applicationID();
var exec = require("child_process").exec;
if (appid.substr(0,appid.indexOf(" ")) == "com.wordpress.touchcontrol.touchvol") {
	exec(cmd, function() { future.result = {"return":"No reason to processs returns for this method, too bad!"};
	}); 	
}
else {
	this.future.result = {"error":"Reserved for internal use"};
	};
};

function amixerReadAssistant() {};
amixerReadAssistant.prototype.run = function(future) {
this.future = future;

this.command = "/usr/bin/amixer | egrep -A 6 -E \"(AIF1DAC1 EQ)|(AIF1 Boost)|(AIF1DAC1 3D Stereo)|'Headphone'\"";
amixergo(this.command, function(hidden) {
	var txtresult = hidden;
	results = new Object();

	var index1 = txtresult.indexOf("'AIF1DAC1 EQ'");
	var index2 = txtresult.indexOf("Playback [", index1) + 10;
	var index3 = txtresult.indexOf("]", index2);
	results.AIF1DAC1_EQ_On = false;
	if (txtresult.substring(index2, index3) == "on") { results.AIF1DAC1_EQ_On = true; }
	//console.log("AIF1DAC1 EQ On: " + results.AIF1DAC1_EQ_On);

	index1 = txtresult.indexOf("'AIF1DAC1 EQ1'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_EQ1 = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 EQ1: " + results.AIF1DAC1_EQ1);

	index1 = txtresult.indexOf("'AIF1DAC1 EQ2'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_EQ2 = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 EQ2: " + results.AIF1DAC1_EQ2);

	index1 = txtresult.indexOf("'AIF1DAC1 EQ3'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_EQ3 = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 EQ3: " + results.AIF1DAC1_EQ3);

	index1 = txtresult.indexOf("'AIF1DAC1 EQ4'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_EQ4 = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 EQ4: " + results.AIF1DAC1_EQ4);

	index1 = txtresult.indexOf("'AIF1DAC1 EQ5'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_EQ5 = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 EQ5: " + results.AIF1DAC1_EQ5);

	index1 = txtresult.indexOf("'AIF1 Boost'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1_Boost = txtresult.charAt(index2);
	//console.log("AIF1 Boost: " + results.AIF1_Boost);

	index1 = txtresult.indexOf("'AIF1DAC1 3D Stereo'");
	index2 = txtresult.indexOf("Mono: ", index1) + 6;
	results.AIF1DAC1_3D_Stereo = txtresult.substring(index2, index2 + 2).trim();
	//console.log("AIF1DAC1 3D Stereo: " + results.AIF1DAC1_3D_Stereo);
	index3 = txtresult.indexOf("Playback [", index2) + 10;
	var index4 = txtresult.indexOf("]", index3);
	results.AIF1DAC1_3D_Stereo_On = false;
	if (txtresult.substring(index3, index4) == "on") { results.AIF1DAC1_3D_Stereo_On = true;}
	//console.log("AIF1DAC1 3D Stereo_On: " + results.AIF1DAC1_3D_Stereo_On);

	index1 = txtresult.indexOf("'Headphone'");
	index2 = txtresult.indexOf("Front Left: ", index1) + 12;
	results.Headphone = txtresult.substring(index2, index2 + 2).trim();
	//console.log("HeadphoneL: " + results.Headphone);
	index3 = txtresult.indexOf("Front Right: ", index1) + 13;
	results.Balance = txtresult.substring(index3, index3 + 2).trim();
	//console.log("HeadphoneR: " + results.Balance);
	results.Balance_On = true;
	if (results.Balance == results.Headphone) { results.Balance_On = false; }
	//console.log("Balance On: " + results.Balance_On);

	

	this.future.result = results;
	}.bind(this));
};

function amixergo(command, callback) {
var cmd = new CommandLine(command);
cmd.run(function(response) {
		//console.log("XXXXXXX" + response.stdout + "XXXXXXXXXX")
		//console.log("YYYYYYY" + response.stderr + "YYYYYYYYYY")
		//var jsonresponse = JSON.parse(response.stdout);
		var txtblock = response.stdout;

		if(this.callback) {
			callback(txtblock);
		} else if(this.future) {
			this.future.result = txtblock;
		}
	});
};

function lunaSetAssistant() {};
lunaSetAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;

this.command = "/usr/bin/luna-send -n 1 palm://com.palm.audio/" + inArgs.target + " " + "'{\"" + inArgs.control + "\":" + inArgs.value + "}'"; 
lunago(this.command, function(hidden) {
	this.future.result = hidden;
	}.bind(this));
};

function lunaSubscribeAssistant() {};
lunaSubscribeAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;

	this.command = "/usr/bin/luna-send -i palm://com.palm.audio/media/status '{\"subscribe\":true}'";
lunago(this.command, function(hidden) {
	this.future.result = hidden;
	}.bind(this));
};

function lunaGetAssistant() {};
lunaGetAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;

this.command = "/usr/bin/luna-send -n luna-send -n 1 palm://com.palm.audio/" + inArgs.control + "/getVolume '{}'";

lunago(this.command, function(hidden) {
	this.future.result = hidden;
	}.bind(this));
};


function lunago(command, callback) {
var cmd = new CommandLine(command);
cmd.run(function(response) {
		//console.log("XXXXXXX" + response.stdout + "XXXXXXXXXX")
		//console.log("YYYYYYY" + response.stderr + "YYYYYYYYYY")
		var jsonresponse = JSON.parse(response.stdout);
		
		if(this.callback) {
			callback(jsonresponse);
		} else if(this.future) {
			this.future.result = jsonresponse;
		}
	});
};

