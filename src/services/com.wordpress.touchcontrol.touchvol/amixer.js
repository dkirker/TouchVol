function amixerAssistant() {};
amixerAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;
var cmd = "/usr/bin/amixer set \"" + inArgs.control + "\" " + inArgs.value;
if (inArgs.control === "DAC1") {
	cmd = "/usr/bin/amixer set DAC1 1,1; " + cmd;
}
var exec = require("child_process").exec;
exec(cmd, function() { future.result = {"return":"No reason to processs returns for this method, too bad!"};
	});
};

function amixerSaveAssistant() {};
amixerSaveAssistant.prototype.run = function(future) {
this.future = future;
var cmd = "/bin/sh /media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts/store-amixer.sh";
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

function amixerReadAssistant() {};
amixerReadAssistant.prototype.run = function(future) {
this.future = future;

this.command = '/usr/bin/amixer contents | egrep -A 2 -E "\'AIF1DAC1 EQ1 Volume\'|\'AIF1DAC1 EQ2 Volume\'|\'AIF1DAC1 EQ3 Volume\'|\'AIF1DAC1 EQ4 Volume\'|\'AIF1DAC1 EQ5 Volume\'|\'IN1L Volume\'|\'IN2L Volume\'|\'AIF1DAC1 EQ Switch\'|\'AIF1DAC1 3D Stereo Volume\'|\'AIF1DAC1 3D Stereo Switch\'|\'AIF1 Boost Volume\'|\'Headphone Volume\'|\'DAC1 Volume\'"';
consolego(this.command, function(hidden) {
	var txtresult = hidden;
	var results = new Object();
	var regex = /[0-9]+,[0-9]+/;
	var i = 0;
	var index1 = 0;
	var index2 = 0;
	var linetemp;
	var compound;
	var myarray = ["AIF1DAC1_EQ1", "AIF1DAC1_EQ2", "AIF1DAC1_EQ3", "AIF1DAC1_EQ4", "AIF1DAC1_EQ5", "IMic", "EMic", "AIF1DAC1_EQ_On", "AIF1DAC1_3D_Stereo", "AIF1DAC1_3D_Stereo_On"];
	var myarray2 = ["AIF1DAC1 EQ1 Volume", "AIF1DAC1 EQ2 Volume", "AIF1DAC1 EQ3 Volume", "AIF1DAC1 EQ4 Volume", "AIF1DAC1 EQ5 Volume", "IN1L Volume", "IN2L Volume", "AIF1DAC1 EQ Switch", "AIF1DAC1 3D Stereo Volume", "AIF1DAC1 3D Stereo Switch"];
	
	 for (i=0; i< myarray.length; i++) {
        index1 = txtresult.indexOf("name='" + myarray2[i] + "'");
        index2 = txtresult.indexOf(": values=", index1) + 9;
        results[myarray[i]] = txtresult.substring(index2, index2 + 2).trim();
        index1 = 0;
        index2 = 0;
        if (results[myarray[i]] === "on") {
            results[myarray[i]] = true;
        }
        else if (results[myarray[i]] === "of") {
            results[myarray[i]] = false;
        }
    }
    
	index1 = txtresult.indexOf("'AIF1 Boost Volume'");
    index2 = txtresult.indexOf(": values=", index1) + 9;
    results.AIF1_Boost = txtresult.charAt(index2);

    index1 = txtresult.indexOf("'Headphone Volume'");
    index2 = txtresult.indexOf(": values=", index1) + 9;
    linetemp = txtresult.substring(index2, index2 + 5).trim();
	compound = linetemp.match(regex);
	results.Headphone = compound[0].split(",")[0];
	results.Balance = compound[0].split(",")[1];
	
    index1 = txtresult.indexOf("'DAC1 Volume'");
    index2 = txtresult.indexOf(": values=", index1) + 9;
	linetemp = txtresult.substring(index2, index2 + 5).trim();
	compound = linetemp.match(regex);
	results.DAC1_L = compound[0].split(",")[0];
	results.DAC1_R = compound[0].split(",")[1];
    

	this.future.result = results;
	}.bind(this));
};


function lunaSetAssistant() {};
lunaSetAssistant.prototype.run = function(future) {
this.future = future;
var inArgs = this.controller.args;

this.command = "/usr/bin/luna-send -n 1 palm://com.palm.audio/" + inArgs.target + " " + "'{\"scenario\":\"" + inArgs.scenario + "\",\"" + inArgs.control + "\":" + inArgs.value + "}'"; 
lunago(this.command, function(hidden) {
	this.future.result = hidden;
	}.bind(this));
};

function lunaSubscribeAssistant() {};
lunaSubscribeAssistant.prototype.run = function(future, subscription) {
var cmd = "/usr/bin/luna-send";
var args = ['-i', 'palm://com.palm.audio/system/status' ,'{\"subscribe\":true}'];
var spawn = require('child_process').spawn;
var luna = spawn(cmd, args);
future.result = {subPID: luna.pid};
luna.stdout.on('data', function(data) {
	var change = subscription.get();

	// this is for the odd pattern of returning 2 responses when volume reaches min/max
	// for now just accept the first response and throw away the second, until I find a need for it
	var strdata = data.toString();
	var firstresponse = strdata.substr(0,strdata.indexOf("}") + 1);

	change.result = JSON.parse(firstresponse);
});
};

function stopSubscribe() {};
stopSubscribe.prototype.run = function(future) {
var inArgs = this.controller.args;
var appid = this.controller.message.applicationID();
var spawn = require('child_process').spawn;
var cmd = "/bin/kill";
if (appid.substr(0,appid.indexOf(" ")) === "com.wordpress.touchcontrol.touchvol") {
	var die = spawn(cmd, [inArgs.pid]); 	
	future.result = {"return":"No reason to processs returns for this method, too bad!"};

}
else {
	future.result = {"error":"Reserved for internal use"};
};

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
		var jsonresponse = JSON.parse(response.stdout);
		
		if(this.callback) {
			callback(jsonresponse);
		} else if(this.future) {
			this.future.result = jsonresponse;
		}
	});
};






