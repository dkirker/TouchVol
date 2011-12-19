enyo.kind({
	name: "TouchVol.App",
	kind: "VFlexBox", 
	events: { 
        onReqFile: ""
  },
	components: [
		{	kind: "PalmService", service: "palm://com.wordpress.touchcontrol.touchvol",
			components:[
				{name: "amixerSetVolume",	method: "change"},
				{name: "amixerGetVolume",	method: "get", 			onResponse: "processAmixerInfo"},
				{name: "amixerSaveState",   method: "save"},
				{name: "setlunaVolume", 	method: "lunaSender"},
				{name: "getlunaVolume", 	method: "lunaGetter", 	onResponse: "processLunaInfo"},
				{name: "setPulseReset", 	method: "Pulseflip"},
				{name: "reclunaVolume", 	method: "lunaRecieve", 	onResponse: "processLunaInfo"},
				{name: "setlunaPatch", 		method: "lunaPatch"}
		]},
		{kind:"PalmService", service:"palm://com.palm.audio/media/",
		    	components:[{name:"getMediaVolume", method:"status", subscribe:true, onResponse:"processLunaInfo"}]
		},
		{name: "AppManager", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
		{kind: "PalmService", service: "palm://com.palm.applicationManager/", name: "addLaunchPoint", method: "addLaunchPoint", onSuccess: "pointSuccess", onFailure: "pointFail"},
		{kind: "ApplicationEvents", onLoad: "startup", onUnload: "quit", onOpenAppMenu: "openAppMenu", onCloseAppMenu: "closeAppMenu", onWindowRotated: "processWindowRotate"},
		{kind: "AppMenu", automatic: false, onBeforeOpen: "beforeAppMenuOpen", components: [
			{caption: "Luna Patch", components: [
				{caption: "Install Patch", name: "installPatch", onclick: "enablePatch"},
				{caption: "Remove Patch", name: "removePatch", onclick: "disablePatch"}]},
			{caption: "Restart PulseAudio", onclick: "setPulse"},
			{caption: "Reset Profiles", onclick: "resetProfilesStore"},
			{caption: "Choose Profile", components: [
				{kind: "VirtualRepeater", name:"appmenuProfiles", onSetupRow: "getProfileList", components: [
				{kind: "SwipeableItem", layoutKind: "HFlexLayout", tapHighlight:true, name:"appmenuProfilesBox", onConfirm: "deleteProfile", onclick: "processProfile", components: [	
					{name: "appmenuProfileCaption", flex: 1},	
					{name: "appmenuProfileImg", kind: "Image", src:"", height:"24px"}]}
				]}
			]},
			{caption: "Background", components: [
				{caption: "Black", onclick: "setBackground"},
				{caption: "Image", onclick: "setBackground"},
				{caption: "Choose Your Own", onclick: "setBackground"},
				{kind:"HFlexBox", align:"center", components: [
					{kind: "Image", src:"source/images/brightness-less.png"},
					{kind: "Slider", flex:1, name:"Opacity", style:"margin 5px", minimum:0, maximum:10, position:5, onChange: "setBackground"},
					{kind: "Image", src:"source/images/brightness-more.png"},
					]},
				]},
			{caption: "About", onclick: "appAbout"},
			
		]},
		{kind: "Image", name:"Background", src: "", style:"position:absolute;top:0px,left:0px;z-index:-1;opacity:0.5"},
		{kind:enyo.HFlexBox, name:"TopRow", components: [
			
		{kind:enyo.VFlexBox, flex:1, name:"TopLeft", style:"border-right: 1px solid;border-color:#5AA6EC", components: [
				
				{kind: "Toolbar", components: [
					{kind:"Button", caption:"Equalizer controls +", style:"background-color:#2C6399;color:white", name:"EQ_Button", onclick:"showIT"},
					{kind:"ToggleButton", name:"AIF1DAC1_EQ_On", state: true, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
				]},
				{kind: "Control", layoutKind: "VFlexLayout", style:"padding:0px 20px 0px 20px", components: [
					{content: "20hz", className:"vertical"},
					{kind:"Slider", name:"AIF1DAC1_EQ1", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ2", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ3", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ4", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{content: "20Khz", className:"vertical",},
					{kind:"Slider", name:"AIF1DAC1_EQ5", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},		
					{kind: enyo.HFlexBox, components: [	
						{content: "3D Effect", style:"padding: 10px 10px 0px 0px"},
						{kind:"Slider", name:"AIF1DAC1_3D_Stereo", flex:1, minimum:0, maximum: 15, onChange: "setVolumeControl", onChanging:"showValue"},
					]},
					{kind: enyo.HFlexBox, components: [	
					{kind:"ToggleButton", name:"AIF1DAC1_3D_Stereo_On", style:"padding: 0px", state: false, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
				]},
				]},
		]}, /* end Topleft */
		{kind:enyo.VFlexBox, flex:1, name:"TopRight", style:"border-left: 1px solid;border-color:#5AA6EC", components: [
			{name:"paneltest"},	
				{kind: "Toolbar", components: [
					{kind:"Button", caption: "Volume controls +", style:"background-color:#2C6399;color:white", name:"Vol_Button", onclick:"showIT"}
					]},
				{kind: "Control", layoutKind: "VFlexLayout", style:"padding:0px 20px 0px 20px", components: [
				{kind: enyo.HFlexBox, components: [		
					{content: "Headphone", style:"padding: 10px 10px 0px 0px"},
					{content: "L", name:"Bal_L", showing:false, style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"Headphone", flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
				]},	
				{content:"Balance", style:"font-size:10pt;padding-left:15px"},
				{kind: enyo.HFlexBox, components: [		
				{kind:"ToggleButton", style:"margin-right:15px", name:"Balance_On", onChange: "switchVolControl", onLabel:"On", offLabel:"Off" },
				{content: "R", name:"Bal_R", showing:false, style:"padding: 10px 20px 0px 0px"},
				{kind:"Slider", name:"Balance", showing: false, flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
				]},	
				{kind: enyo.HFlexBox, components: [	
					{content: "Media", style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"Media", flex:1, minimum:0, maximum: 100, onChange: "switchLunaVolume", onChanging:"showValue"},
				]},
				{kind: enyo.HFlexBox, components: [	
					{content: "System", style:"padding: 10px 15px 0px 0px"},
					{kind:"Slider", name:"System", flex:1, minimum:0, maximum: 100, onChange: "switchLunaVolume", onChanging:"showValue"},
				]},
				{kind: enyo.HFlexBox, components: [	
					{content: "Boost", style:"padding: 10px 25px 0px 0px"},
					{kind:"Slider", name:"AIF1_Boost", flex:1, minimum:0, maximum: 2, onChange: "setVolumeControl", onChanging:"showValue"}
				]},
				
				]},
		]}	/* end Top Right  */
		]}, /* end Toprow */
		
		{kind: enyo.VFlexBox, flex: 1, name:"Bottom", pack:"end", components:[
			{className: "enyo-divider", style:"margin-bottom:0px"},
				{kind: enyo.HFlexBox, components: [
					{kind: "Toolbar", flex:1, components: [
						{kind: enyo.HFlexBox, style:"width:150px", components:[
							{kind:"RadioToolButtonGroup", name:"Output",  onChange: "setOutputToggle", components:[
								{caption:"Headset", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
								{caption:"Speaker", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
							]},
						]},
						{kind: "Spacer"},
						{kind:"Button", name:"Reset", style:"background-color:red;color:white", pack:"center", caption:"Reset to Default", onclick:"setDefaults"},
						{kind: "Spacer"},
						// this next bit is retarded, there must be someway better to center in a toolbar by default
						{kind: enyo.HFlexBox, style:"width:150px", pack:"end", components: [
						{kind:"Button", caption:"Save to Profile", style:"background-color:#2C6399;color:white", name:"Profile_Button", onclick:"setProfilePopup"},
						]},
					]},
				]},
				
				//coupla debugging areas, <REMINDER> to reset these to showing:false before package
				{name:"curValue", content: "curValue", showing:false},
				{name:"curValue2", content: "curValue2", showing:false},
				{kind: "SpinnerLarge", style:"position:absolute;top:500px;left:45%"},
				{flex: 1, name: "list", kind: "VirtualList", className: "list", onSetupRow: "listSetupRow", components: [
					{name: "cells", kind: "HFlexBox"}
				]},
				{kind: "Selection"},
				
		]},
		//profile popup
		{kind: "ModalDialog", name: "profilePopup", height:"100%", width:"480px", showKeyboardWhenOpening: false, layoutKind: "VFlexLayout",   
			components: [
				{layoutKind: "VFlexLayout", flex: 1, style: "height: 600px", components: [  
				{kind: "Scroller", flex: 1, components: [
				{kind: "HFlexBox", name:"popupTitle", components: [{flex:1},{content: "Pick saved settings & icon"},{flex:1}]},
				{kind: "HFlexBox", name:"selectControlsList", components: [
					{kind: "VFlexBox", style:"padding-right:10px", flex:1, components: [ 
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ_On", checked:true}, {content: "EQ On"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ1", checked:true}, {content: "EQ level 1"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ2", checked:true}, {content: "EQ level 2"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ3", checked:true}, {content: "EQ level 3"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ4", checked:true}, {content: "EQ level 4"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ5", checked:true}, {content: "EQ level 5"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_3D_Stereo_On", checked:true}, {content: "3D On"}]},
						{kind: "HFlexBox", components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_3D_Stereo", checked:true}, {content: "3D level"}]},
						] },
					{kind: "VFlexBox", flex:1, align:"end", components: [ 
						{kind: "HFlexBox", components: [{content: "Headphone/L"}, {kind:"CheckBox", name:"checkbox_Headphone", checked:true, onChange:"checkBlock" }]},
						{kind: "HFlexBox", components: [{content: "/R"}, {kind:"CheckBox", name:"checkbox_Balance", checked:false, onChange:"checkBlock"}]},
						{kind: "HFlexBox", components: [{content: "Balance On"}, {kind:"CheckBox", name:"checkbox_Balance_On", checked:false, onChange:"checkBlock"}]},
						{kind: "HFlexBox", components: [{content: "Media"}, {kind:"CheckBox", name:"checkbox_Media", checked:true}]},
						{kind: "HFlexBox", components: [{content: "System"}, {kind:"CheckBox", name:"checkbox_System", checked:true}]},
						{kind: "HFlexBox", components: [{content: "Boost level"}, {kind:"CheckBox", name:"checkbox_AIF1_Boost", checked:true}]},
						{kind: "Input", spellcheck:false, autocorrect: false, alwaysLooksFocused: true, name:"inputProfileName", hint: "Profile Name"}
						] },
				]},
				{className: "enyo-divider"},
				{kind: "Image", src:"source/images/icon.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/headphones.png", onclick:"setSelectedIcon",style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/icon-green.png", onclick:"setSelectedIcon",style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/headphones-red.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/icon-purple.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/headphones-yellow.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/icon-blue.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/headphones-green.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/icon-flashy.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind: "Image", src:"source/images/headphones-purple.png", onclick:"setSelectedIcon", style: "padding: 2px; height: 40px;"},
				{kind:"Button", caption:"Or browse for Icon", onclick:"setSelectedIcon", style:"background-color:#2C6399;color:white", onclick:"getProfileIcon"},
				{kind:"HFlexBox", pack:"center", components: [{kind: "Image", name:"selectedIcon", src:"", style: "padding: 4px; height: 96px"}]},
				{className: "enyo-divider", style:"margin:0px"},
				{kind: "HFlexBox", pack:"center", components: [{content: "Create Launchpoint? "}, {kind:"CheckBox", name:"create_ProfileLaunchPoint", checked:false}]},
				{className: "enyo-divider", style:"margin:0px"},
				{kind: "HFlexBox", pack:"center", components: [
				{kind: "Button", caption: "Cancel", flex:1, style:"background-color:red;color:white", popupHandler: "Cancel"},
				{kind: "Button", caption: "OK", flex:1, style:"background-color:#2C6399;color:white", onclick: "createProfile"},
				]},
			]}
			]}
			]
		}, 
				
		{kind: "ModalDialog", name: "patchPopup", height:"100px", width:"480px", showKeyboardWhenOpening: false, layoutKind: "VFlexLayout",
		components: [
			{name: "patchPopupTitle"},
			{kind: "HFlexBox", pack:"center", components: [
				{kind: "Button", caption: "Cancel", style:"background-color:red;color:white", popupHandler: "Cancel"},
				{kind: "Button", caption: "OK", style:"background-color:#2C6399;color:white", onclick: "runPatch"},
			]},
		]},
		
	],
	enablePatch: function() {
		if (innerWidth < 500) {
			this.$.patchPopup.openAt({top:0,left:(innerWidth / 2) - 170});
		}
		else {
			this.$.patchPopup.openAtCenter();
		}
		this.$.patchPopupTitle.setContent("Enabling the patch will execute a Luna restart, continue?");
		
	},
	disablePatch: function() {
		if (innerWidth < 500) {
			this.$.patchPopup.openAt({top:0,left:(innerWidth / 2) - 170});
		}
		else {
			this.$.patchPopup.openAtCenter();
		}
		this.$.patchPopupTitle.setContent("Disabling the patch will execute a Luna restart, continue?");
		
	},
	
	runPatch: function() {
		var check;
		this.$.patchPopup.close();
		enyo.scrim.show();
		this.$.spinnerLarge.setShowing(true);
		if (this.$.patchPopupTitle.content.charAt(0) == "E") {
			var patch = "install";
			localStorage.setItem("touchvol_patch_install", 1);
			while (check != 1) {
				check = localStorage.getItem('touchvol_patch_install');		}
			}
		if (this.$.patchPopupTitle.content.charAt(0) == "D") {
			var patch = "remove";
			localStorage.setItem("touchvol_patch_install", 0);
			while (check != 0) {
				check = localStorage.getItem('touchvol_patch_install')		}
			}		
			
		setTimeout(function() {this.$.setlunaPatch.call({ command: patch});}.bind(this), 3000);
	},
			
	createLaunchPoint: function(inName, inFile) {
		//var selected = this.$.launchPointSelector.getValue();
		console.log (inFile);
		this.$.addLaunchPoint.call(
		{
			id: "com.wordpress.touchcontrol.touchvol",
			icon: inFile, 
			title: "TV-Profile - " + inName,
			params: {
				runProfile: inName
			}
		});
		enyo.windows.addBannerMessage("Created: " + inName + " in Favorites", "{}", "");
		//this.$.launchPointPopup.close();
	},
	
		
	getProfileList: function(inSender, inIndex) {
		var profileList = this.profiles;
			if (inIndex * 2 < profileList.length) {
				this.$.appmenuProfileCaption.setContent(profileList[inIndex * 2]);
				this.$.appmenuProfileImg.setSrc(profileList[(inIndex * 2) + 1]);
				return true;
			}
	},
	
	resetProfilesStore: function() {
		localStorage.removeItem("firstRunProfilesStored");
		this.profiles = [];
		this.scanForProfiles();
		this.resizeHandler();
	},
	
	deleteProfile: function(inSender, inIndex) {
		this.profiles.splice(inIndex * 2, 2);
		localStorage.setItem("profiles", this.profiles);
		this.scanForProfiles();
		this.$.appmenuProfiles.render();
		this.$.list.refresh();
	},
	
	createProfile: function(inSender) {
		inName = this.$.inputProfileName.value;
		var inFile = "/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/Main/source/images/icon.png";
		if (this.$.selectedIcon.src) {
			inFile = this.$.selectedIcon.src;
		}
		
		if (inName == "profiles" || inName == "" || inName == "touchvol_patch_install") {
			return false;
		}
		inName = inName.replace(" ","_");
		inName = inName.replace(",","_");
		
		var profile = "{"; 
		for(control in this.$) {
			if (this.$[control].name.slice(0,8) == "checkbox") {
				if (this.$[control].checked == true) {
					var name = control.slice(9);
					if (this.$[name].kind == "Slider") {
						profile += "\"" + name + "\":" + this.$[name].position + ",";
					}
					if (this.$[name].kind == "ToggleButton") {
						profile += "\"" + name + "\":" + this.$[name].state + ",";
					}
					
				}
			}
		}
		profile = profile.slice(0,-1) + "}";
		//sessionStorage.removeItem("profileChecks");
		localStorage.setItem(inName, profile);
		var profileList = [];
		if (this.profiles.length > 1) {
			profileList = this.profiles;
			for (i=0; i<= profileList.length; i +=2) {
				if (profileList[i] == inName) {
					profileList[i+1] = inFile;
					var found = true;
				}
			}
		}
		if (!found) {
			profileList.push (inName);
			profileList.push (inFile);
		}
		localStorage.setItem("profiles", profileList);
		this.scanForProfiles();
		this.resizeHandler();
		if (this.$.create_ProfileLaunchPoint.checked) {
			this.createLaunchPoint(inName,inFile);
		}
		//this.$.appmenuProfiles.render();
		// ok how can I clear that input field between uses?
		//this.$.inputProfileName.$.input.value = null;
		//this.$.inputProfileName.value = null;
		this.$.profilePopup.close();
	},
	
	checkBlock: function(inSender) {
		if (inSender.name == "checkbox_Headphone") {
			if (inSender.checked == false) {
				this.$.checkbox_Balance_On.setChecked(false);
				this.$.checkbox_Balance.setChecked(false);
			}
		}
		if (inSender.name.slice(0,10) == "checkbox_B") {
			if (inSender.checked == true) {
				this.$.checkbox_Headphone.setChecked(true);
				this.$.checkbox_Balance_On.setChecked(true);
				this.$.checkbox_Balance.setChecked(true);
			}
			if (inSender.checked == false) {
				this.$.checkbox_Balance_On.setChecked(false);
				this.$.checkbox_Balance.setChecked(false);
			}
		}
	},
		
	
	processWindowRotate: function(inSender) {
		var position = enyo.getWindowOrientation();
		if (position == "up") {
			this.$.Background.applyStyle("-webkit-transform", null);
		}
		
		if (position == "right") {
			var number = (innerWidth / 2) + "px";
			var value = number + " " + number;
			this.$.curValue.setContent(value);
			this.$.Background.applyStyle("-webkit-transform-origin", value);
			this.$.Background.applyStyle("-webkit-transform", "rotate(90deg)");
		}
		if (position == "left") {
			// matrix rotation appears broken, wont do a scale + rotation correctly kluged to get close
			var number = (innerWidth / 2) + "px";
			var value = number + " " + number;
			this.$.curValue.setContent(value);
			this.$.Background.applyStyle("-webkit-transform-origin", value);
			this.$.Background.applyStyle("-webkit-transform", "rotate(90deg)");
		}
		
		if (position == "down") {
			this.$.Background.applyStyle("-webkit-transform", null);
		}
		
	},
	
	setSelectedIcon: function(inSender) {
		this.$.selectedIcon.setSrc("/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/Main/" + inSender.src);
	},
	
	setProfilePopup: function() {
		if (innerWidth < 500) {
			this.$.profilePopup.openAt({top:0,left:(innerWidth / 2) - 170});
		}
		else {
			this.$.profilePopup.openAtCenter();
		}
	},
	
	setPopupFile: function(inFile) {
		this.setProfilePopup();
		if (inFile) {
		this.$.selectedIcon.setSrc(inFile); }
	},
	
	getProfileIcon: function() { 
		this.doReqFile("profile");
		this.owner.$.primary.selectViewByName("file");	
		return false;
	},
	
	appAbout: function() {
		this.owner.$.primary.selectViewByName("about");
	},
	
	openAppMenu: function() {
		var menu = this.myAppMenu || this.$.appMenu;
		menu.open();
	},
	closeAppMenu: function() {
		var menu = this.myAppMenu || this.$.appMenu;
		menu.close();
	},
	beforeAppMenuOpen: function() {
		this.$.appmenuProfiles.render();
		var storeItem = localStorage.getItem("opacity");
		if (storeItem) {
			this.$.Background.applyStyle("opacity", storeItem / 10);
			this.$.Opacity.setPositionImmediate(storeItem);
		}
		var patch = localStorage.getItem("touchvol_patch_install");
		if (patch == 1) {
			this.$.installPatch.hide();
		}
		else {
			this.$.removePatch.hide();
		}
	},
	
	openPrefMenu: function() {
	},
	
	setBackground: function(inSender, inValue) {
		if(inSender) {
			if (inSender.caption == "Choose Your Own") {
				this.doReqFile("background");
				this.owner.$.primary.selectViewByName("file");
			}
			if (inSender == "file") {
				localStorage.setItem("background", inValue);
			}
			if (inSender.caption == "Black") {
				localStorage.setItem("background", "source/images/black.png");
			}
			if (inSender.caption == "Image") {
				localStorage.setItem("background", "source/images/background.jpg");
			}
			if (inSender.name == "Opacity") {
				localStorage.setItem("opacity", inValue);
			}
		}
			var storeItem = localStorage.getItem("background");
			
			if (storeItem) {
				this.$.Background.setSrc(storeItem);
			}
			storeItem = null;
			storeItem = localStorage.getItem("opacity");
			if (storeItem) {
				this.$.Background.applyStyle("opacity", storeItem / 10);
			}
	},
	
	quit: function () {
	this.$.amixerSaveState.call();
	},
	
	startup: function() {
	
	//Work on this later, 
	//this.$.reclunaVolume.call ({});
	if (innerWidth < 500 || innerHeight < 500) {
			this.$.Reset.hide();
			this.$.list.hide();
			enyo.loadSheet("source/pre3.css");
	}
	// <REMINDER> temp disable, enable before pack
	//enyo.scrim.show();
	//this.$.spinnerLarge.setShowing(true);
	this.$.getlunaVolume.call ({control:"system"});
	// com.palm.audio/media works on subscribe but not set, system not at all...   why?!?
	//this.$.getlunaVolume.call ({control:"media"});
	this.$.amixerGetVolume.call ();
	this.$.getMediaVolume.call ();
	this.setBackground();
	//this.resizeHandler();
	},
	
	setPulse: function() {
		this.$.setPulseReset.call ();
	},
	
	processLunaInfo: function(inSender, inValue) {
		this.$.curValue2.setContent(inSender.name + " - " + 
					   inValue.returnValue + " - " +
					   "Scenario" + " - " +
					   inValue.scenario + " - " +
					   "Volume" + " - " +
					   inValue.volume);  
		if (inValue.returnValue) {
			if (inValue.scenario.substr(0,5) == "media") {	
				if (inValue.volume !== undefined) {
					this.$.Media.setPositionImmediate(inValue.volume); 
					this.$.Media.doChanging(inValue.volume);}
			//	if (inValue.scenario  == "media_back_speaker") {
			//		this.$.Output.setValue(1);
			//		this.$.Output.doChange(1);
			//	}
				if (inValue.scenario  == "media_headset") {
					if (inValue.action == "enabled") {
						this.$.Output.setValue(0);
						this.$.Output.doChange(0); }
					else if (inValue.action == "disabled") {
						this.$.Output.setValue(1);
						this.$.Output.doChange(1); }
					
				}
			}
			else {
				if(inValue.volume != 'undefined') {
					this.$.System.setPositionImmediate(inValue.volume); 
					this.$.System.doChanging(inValue.volume);}
			};
		};	
			
	},
	// <REMINDER> clean up process loop here	
	processAmixerInfo: function(inSender, inValue) {
		this.$.AIF1DAC1_EQ_On.setState(inValue.AIF1DAC1_EQ_On);
        this.$.Balance_On.setState(inValue.Balance_On);
        this.$.AIF1DAC1_3D_Stereo_On.setState(inValue.AIF1DAC1_3D_Stereo_On);
        this.$.Headphone.setPositionImmediate(inValue.Headphone);
        this.$.AIF1DAC1_3D_Stereo.setPositionImmediate(inValue.AIF1DAC1_3D_Stereo);
        this.$.AIF1_Boost.setPositionImmediate(inValue.AIF1_Boost);
		if (inValue.Balance_On == true) {
            this.$.Balance_On.doChange(inValue.Balance_On);	
			this.$.Balance.setPositionImmediate(inValue.Balance);
		};
							
		var control;
		for(var control in this.$) {
			if (control.slice(0,-1) == "AIF1DAC1_EQ") {
				this.$[control].setPositionImmediate(inValue[control]);
			}
						
			if (this.$[control].kind == "Slider") { 
				// color vals on all sliders at reset
				this.$[control].doChanging(this.$[control].position);
			}
		}
		enyo.scrim.hide();
		this.$.spinnerLarge.setShowing(false);
	},
	
	showValue: function(inSender,inValue) {
		var percLoc = enyo.byId(inSender.id + "_button").style.left.slice(0,-1);
		if (inSender.name == "AIF1_Boost") {
			this.$.curValue2.setContent(this);
			if (percLoc == 100) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -160px";
			}
			else if (percLoc == 50) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -80px";
			}
			else {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -40px";
			}
		}
		else {
			if (percLoc  < 21) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -40px";
			}
			else if (percLoc  > 20 && percLoc < 41) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% 0px";
			}
			else if (percLoc  > 40 && percLoc < 61) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -80px";
			}
			else if (percLoc  > 60 && percLoc < 81) {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -120px";
			}
			else {
				enyo.byId(inSender.id + "_button").style.backgroundPosition = "0% -160px";
			}
		};
		this.$.curValue.setContent(inSender.name + " = " + inValue);  
	},

	setOutputToggle: function(inSender, inValue) {
	var value="\"media_headset\"";
	
	if (inValue == 1) {
		value = "\"media_back_speaker\""; 
	}
	this.$.curValue.setContent(inSender.name + " = " + value);	
	this.$.setlunaVolume.call(
	{
		target: "media/setCurrentScenario",
		control: "scenario", 
		value: value
	});
	},
	
	switchLunaVolume: function(inSender, inValue) {
		inSender.doChanging(inValue);
		this.$.curValue.setContent(inSender.name + " = " + inValue);  
		this.$.setlunaVolume.call(
		{
			target: inSender.name.toLowerCase() + "/setVolume",
			control: "volume", 
			value: inValue
		});
	
	},
		
	setDefaults: function() {
		this.$.AIF1DAC1_EQ_On.doChange(false);
		this.$.AIF1DAC1_EQ_On.setState(false);
		this.$.Balance_On.setState(false);
		this.$.Balance_On.doChange(false);
		this.$.AIF1DAC1_3D_Stereo_On.doChange(false);
		this.$.AIF1DAC1_3D_Stereo_On.setState(false);
		this.$.Headphone.setPositionImmediate(45);
		this.$.Headphone.doChange(45);
		this.$.AIF1DAC1_3D_Stereo.setPositionImmediate(0);
		this.$.AIF1DAC1_3D_Stereo.doChange(0);
		this.$.AIF1_Boost.setPositionImmediate(0);
		this.$.AIF1_Boost.doChange(0);
		
		var control;
		for(var control in this.$) {
			if (control.slice(0,-1) == "AIF1DAC1_EQ") {
				this.$[control].doChange(12);
				this.$[control].setPositionImmediate(12);
			}
						
			if (this.$[control].kind == "Slider") { 
				// color vals on all sliders at reset
				this.$[control].doChanging(this.$[control].position);
			}
		}
	},
			
	showIT: function(inSender) {
		if (inSender.name == "EQ_Button") {
			if (this.$.TopRight.getShowing()) {
				this.$.TopRight.applyStyle("display", "none"); 
				this.$.EQ_Button.setCaption("Equalizer controls -");
			}
			else {
				this.$.TopRight.applyStyle("display", "null"); 
				this.$.EQ_Button.setCaption("Equalizer controls +");
				}
			}
		if (inSender.name == "Vol_Button") {
			if (this.$.TopLeft.getShowing()) {
				this.$.TopLeft.applyStyle("display", "none"); 
				this.$.Vol_Button.setCaption("Volume controls -");
				}
			else {
				this.$.TopLeft.applyStyle("display", "null"); 
				this.$.Vol_Button.setCaption("Volume controls +");
				}
		}
	},
	
	switchVolControl: function(inSender, inValue) {
		
		if (inValue == true) {
			this.$.Balance.applyStyle("display", "null");
			this.$.Bal_R.applyStyle("display", "null");
			this.$.Bal_L.applyStyle("display", "null");
			this.$.Balance.setPositionImmediate(this.$.Headphone.position);
			this.$.Balance.doChanging(this.$.Balance.position);
			}
		else {
			this.$.Balance.applyStyle("display", "none");
			this.$.Bal_R.applyStyle("display", "none");
			this.$.Bal_L.applyStyle("display", "none");
			this.$.Headphone.doChange(this.$.Headphone.position);
			}
		},

	setVolumeControl: function(inSender, inValue) {	
		inSender.doChanging(inValue);  //in case of point click on a slider, rerun the icon selector
		var controlName = "'" + inSender.name.replace(/_/g, " ") + "'";
		var value = inValue;
		this.$.curValue.setContent(controlName + " = " + value);					
		if (inSender.name == "Balance" || inSender.name == "Headphone") {
			if (this.$.Balance_On.getState()) {
				controlName = "Headphone";
				var value = this.$.Headphone.position + "," + this.$.Balance.position;
				this.$.curValue.setContent(controlName + " = " + value);
			}
		}	
		
		this.$.amixerSetVolume.call(
		{
			control: controlName, 
			value: value
		});  
	},
	
	setVolToggle: function(inSender, inValue) {
		var controlName = "'" + inSender.name.slice(0,inSender.name.length -3).replace(/_/g, " ") + "'"; 
		var value = "";
			
		if (inValue == true) {
			value = "on";
			}
		else { value = "off" }
			
		this.$.curValue.setContent(controlName + " = " + value);
		this.$.amixerSetVolume.call(
		{
			control: controlName, 
			value: value
		});  
	},
	
	scanForProfiles: function () {
		var profiles = [];
		var storeItem = localStorage.getItem("firstRunProfilesStored");
		
		// <REMINDER> comment this before packing
		//storeItem = null;
		if (!storeItem) {
			localStorage.setItem("profiles", ["Bass", "source/images/icon.png", "Treble", "source/images/headphones-green.png", "Mute", "source/images/headphones.png", "Loud", "source/images/icon-green.png"]);
			var Bass = enyo.json.stringify({
				AIF1DAC1_EQ_On: true,
				AIF1DAC1_EQ1: 18,
				AIF1DAC1_EQ2: 20,
				AIF1DAC1_EQ3: 10,
				AIF1DAC1_EQ4: 12,
				AIF1DAC1_EQ5: 12,
				AIF1DAC1_3D_Stereo_On: false
				});
			var Treble = enyo.json.stringify({
				AIF1DAC1_EQ_On: true,
				AIF1DAC1_EQ1: 10,
				AIF1DAC1_EQ2: 10,
				AIF1DAC1_EQ3: 14,
				AIF1DAC1_EQ4: 16,
				AIF1DAC1_EQ5: 18,
				AIF1DAC1_3D_Stereo_On: false
				});
			var Mute = enyo.json.stringify({
				Media: 0,
				System: 0
				});
			var Loud = enyo.json.stringify({
				Headphone: 50,
				Media: 90,
				System: 90,
				AIF1_Boost: 1
				});
			localStorage.setItem("Bass", Bass);
			localStorage.setItem("Treble", Treble);
			localStorage.setItem("Mute", Mute);
			localStorage.setItem("Loud", Loud);
			storeItem = localStorage.setItem("firstRunProfilesStored",1);
		}
		var storeItem = localStorage.getItem("profiles");
		if (storeItem) {
			this.profiles = storeItem.split(",");
		}
		else {
			this.profiles = "";
		}
		this.count = this.profiles.length / 2;
	},
	
	processProfile: function(inSender, inEvent, idx) {
		if (idx == null) {
			this.closeAppMenu();
			idx = inEvent.rowIndex;
		}
		var storeName = this.profiles[idx * 2];
		var storeItem = localStorage.getItem(storeName);
		
		if (!storeItem) {
			console.log("Someone screwed the pooch.");
		}
		var controls = enyo.json.parse(storeItem);
		for (key in controls) {
			
			if (this.$[key].kind == "Slider") {
				this.$[key].setPositionImmediate(controls[key]);
			}
			if (this.$[key].kind == "ToggleButton") {
				this.$[key].setState(controls[key]);
			}
			this.$[key].doChange(controls[key]);
		}
	},
	
	create: function() {
		this.inherited(arguments);
		this.scanForProfiles();
		
	},
	
	rendered: function() {
		this.inherited(arguments);
		this.buildCells();
	},
	
	resizeHandler: function() {
		this.buildCells();
		this.$.list.refresh();
		this.inherited(arguments);
	},
	
	buildCells: function() {
		if (this.count > 0) {
			var bounds = this.$.list.getBounds();
			this.cellCount = Math.floor(bounds.width / 170);
			this.$.cells.destroyControls();
			this.cells = [];
			for (var i=0; i<this.cellCount; i++) {
				var c = this.$.cells.createComponent({kind: "VFlexBox", width: "170px", align: "center", style: "overflow:hidden;border-style:solid;border-color:red;border-width:0px;padding: 10px 10px 20px 10px", owner: this, idx: i, onclick: "cellClick"});
				c.createComponent({kind: "Image", style: "padding: 4px; height: 96px;"});
				c.createComponent({content: "File: " + i});
				this.cells.push(c);
			}
		}
	},
	
	listSetupRow: function(inSender, inIndex) {
		var idx = inIndex * this.cellCount;
		if (idx >= 0 && idx < this.count) {
			for (var i=0, c; c=this.cells[i]; i++, idx++) {
				if (idx < this.count) {
					var path = this.profiles[(idx * 2) +1]
					c.$.control.content = this.profiles[idx * 2];								
					if (this.$.selection.isSelected(idx)) {
						c.applyStyle("background", "url('source/images/highlight.png') no-repeat center");
						
						//var selected = c;
						//setTimeout(function() {this.timefunc(selected);}.bind(this), 3000);
						clearTimeout(this.t);
						this.t=setTimeout(function() {this.deselectHighlight();}.bind(this), 2000);
						
						
					}
					else {
						c.applyStyle("background", "url('')");
					}
					
				} else {
					path = "";
					c.$.control.content = "";
					bg = null;
					c.applyStyle("background", "url('')");
				}
				c.$.image.setSrc(path);
			}
		return true;	
		}
		
	},
	
	deselectHighlight: function() {
	//	select.applyStyle("background", "url('source/images/highlight.png') no-repeat center");
		this.$.selection.clear()
		this.$.list.refresh();
		},

	cellClick: function(inSender, inEvent, inRowIndex) {
		var idx = inEvent.rowIndex * this.cellCount + inSender.idx;
		this.$.selection.select(idx);
		this.processProfile("cellClick", "filler", idx);
		this.$.list.refresh();
	},
});
