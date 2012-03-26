enyo.kind({
   name:"Launchme",
   kind:"Component",
	components:[
		{kind: "PalmService", service: "palm://com.wordpress.touchcontrol.touchvol",
			components:[
				{name: "amixerSetVolume",	method: "change"},
				{name: "setlunaVolume", 	method: "lunaSender"},
				{name: "KillLaunchwindow",	method: "KillLaunchwindow"}
		]},
	],
   	
	create: function() {
		this.inherited(arguments);
		this.started = false;
   	},
   
	startup: function() {
		var launcher = this;
		var params = enyo.windowParams;
		launcher.relaunch(params);
	},
	
	relaunch: function(params) {
		var windowlist = enyo.windows.getWindows();
        var checkWindow = enyo.windows.fetchWindow("touchvolDash");
        var launch = localStorage.getItem("touchvol_launcher_option");
		if (params.launchedAtBoot) {
			this.started = true;
	        return;
	    }
		else if (params.dockMode == true && params.windowType == "dockModeWindow") {
			enyo.windows.openWindow("Main/index.html","TouchVol.Exhibition",{},{window:"dockMode"});
			return;
		}
		else if (params.target) {
			enyo.windows.activate("Main/index.html", "TouchVol.Main", params);
			return;
		}
		else if (params.runProfile || (launch === "1" && !checkWindow)) {
			if (!checkWindow && !this.started) {
                enyo.windows.activate("Dash/index.html", "",{});
                enyo.windows.openDashboard("Dash/popup.html", "touchvolDash", {}, {webosDragMode:"manual", clickableWhenLocked:true });
				this.$.KillLaunchwindow.call();
            }
			if (params.runProfile) {
				this.loadProfile(params.runProfile);
	        	enyo.windows.addBannerMessage("Launching Profile: " + params.runProfile, "{}", "");
			}
	        return;
	    }
	    else {
			enyo.windows.activate("Main/index.html", "TouchVol.Main", params);
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
			if (controlName.slice(-3) === " On") {
				if (value === true) {
					var value = "on";
				}
				else {
					var value = "off";
				}
				var controlName = controlName.slice(0,-3);
			}
			else if (key === "Media") {
				//luna slider
				this.$.setlunaVolume.call(
				{
					target: "media/setVolume",
					control: "volume", 
					value: value,
					scenario: "media_headset"
				});
				this.$.setlunaVolume.call(
				{
					target: "media/setVolume",
					control: "volume", 
					value: value,
					scenario: "media_back_speaker"
				});
				continue;
			}
			else if (key === "System") {
				//luna slider
				this.$.setlunaVolume.call(
					{
						target: "system/setVolume",
						control: "volume", 
						value: value,
						scenario: ""
					});
				continue;
			}
			else {
			//amixer sliders
				if (key === "Headphone") {
					var Headphone = controls[key];
					continue;
				}
				else if (key === "Balance") {
					var Balance = controls[key];
					continue;
				}
				if (key === "DAC1_L") {
					var DAC1_L = controls[key];
					continue;
				}
				else if (key === "DAC1_R") {
					var DAC1_R = controls[key];
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
			if (Balance != null) {
				value = Headphone + "," + Balance;
			}
		this.$.amixerSetVolume.call(
		{
			control: controlName, 
			value: value
		});
		}
		if (DAC1_L != null) {
			controlName = "'DAC1'";
			value = DAC1_L;
			if (DAC1_R != null) {
				value = DAC1_L + "," + DAC1_R;
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