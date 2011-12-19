enyo.kind({
   name:"Launchme",
   kind:"Component",
	components:[
		{kind: "PalmService", service: "palm://com.wordpress.touchcontrol.touchvol",
			components:[
				{name: "amixerSetVolume",	method: "change"},
				{name: "setlunaVolume", 	method: "lunaSender"},
		]},
	],
   	
	create: function() {
		this.inherited(arguments);
		this.started = false;
   	},
   
	startup: function() {
		var launcher = this;
		//console.log("launch.js - got startup");
		var params = enyo.windowParams;
		//console.log("params test: " + JSON.stringify(params));
		launcher.relaunch(params);
	},
	
	relaunch: function(params) {
		//console.log("launch.js - got relaunch");
		var windowlist = enyo.windows.getWindows();
        //for (i in windowlist) {
			//console.log("window: " + i);
        //}
		var checkWindow = enyo.windows.fetchWindow("touchvolDash");
        //console.log("checkWindow: " + checkWindow);
		if (params.runProfile) {
			 if (!checkWindow && !this.started) {
                //console.log("opening dashboard");
				enyo.windows.activate("Dash/index.html", "",{});
                enyo.windows.openDashboard("Dash/popup.html", "touchvolDash", {}, {});
            }
			//console.log("launch.js - should have processed profile");
			this.loadProfile(params.runProfile);
	        enyo.windows.addBannerMessage("Launching Profile: " + params.runProfile, "{}", "");
	        return;
	    }
	    else if (params.launchedAtBoot) {
			//console.log("launchedAtBoot relaunch returning");
            this.started = true;
	        return;
	    }
	    else {
			enyo.windows.activate("Main/index.html", "TouchVol.Main",{});
			return;
		}
	},
	
	loadProfile: function(inProfile) {
		var storeItem = localStorage.getItem(inProfile);
		var controls = enyo.json.parse(storeItem);
		for (key in controls) {
			var controlName = key.replace(/_/g, " ");
			var value = controls[key];
			//toggles
			if (key.slice(-3) == " On") {
				if (controls[key] == true) {
					var value = "on";
				}
				else {
					var value = "off";
				}
				var controlName = controlName.slice(-3);
				if (controlName == "Balance") { 
					var Balance_On = controls[key];
					continue; }
			}
			else if (key == "Media") {
				//luna slider
				this.$.setlunaVolume.call(
				{
					target: "media/setVolume",
					control: "volume", 
					value: value
				});
				continue;
			}
			else if (key == "System") {
				//luna slider
				this.$.setlunaVolume.call(
					{
						target: "system/setVolume",
						control: "volume", 
						value: value
					});
				continue;
			}
			else {
			//amixer sliders
				if (key == "Headphone") {
					var Headphone = controls[key];
					continue;
				}
				else if (key == "Balance") {
					var Balance = controls[key];
					continue;
				}
				else {
					value = controls[key];
				}
			}
			controlName = "'" + controlName + "'";
			this.$.amixerSetVolume.call(
			{
				control: controlName, 
				value: value
			});
		}		
		if (Headphone != null) {
			controlName = "'Headphone'";
			value = Headphone;
			if (Balance != null && Balance_On == true) {
				value = Headphone + "," + Balance;
			}
		this.$.amixerSetVolume.call(
		{
			control: controlName, 
			value: value
		});
		}
	},
	
	unload:function(){
	}
})