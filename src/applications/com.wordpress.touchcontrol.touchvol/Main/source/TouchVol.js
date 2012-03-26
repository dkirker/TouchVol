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
				{name: "setlunaVolume", 	method: "lunaSender", onResponse: "lunaResultMsg"},
				{name: "getlunaVolume", 	method: "lunaGetter", 	onResponse: "processLunaInfo"},
				{name: "setPulseReset", 	method: "Pulseflip"},
				{name: "reclunaVolume", 	method: "lunaRecieve", subscribe:true, onResponse: "processLunaInfo"},
				{name: "stopSub",			method: "stopSubscribe"},
				{name: "setlunaPatch", 		method: "lunaPatch"},
				{name: "setucmPatch", 		method: "ucmPatch"},
				{name: "saveProfiletoFile",	method: "saveFile", onSuccess: "saveProfileSuccess"},
				{name: "readProfileFile",	method: "readFile", onSuccess: "readProfileSuccess", onFailure: "readProfileFailure"},
				{name: "regFileHandler", 	method: "regHandler"},
		]},
		{kind:"PalmService", service:"palm://com.palm.audio/media/",
		    	components:[{name:"getMediaVolume", method:"status", subscribe:true, onResponse:"processLunaInfo"}]
		},
		{name: "AppManager", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
		{kind: "PalmService", service: "palm://com.palm.applicationManager/", name: "addLaunchPoint", method: "addLaunchPoint", onSuccess: "pointSuccess", onFailure: "pointFail"},
		{kind: "ApplicationEvents", onLoad: "startup", onUnload: "quit", onOpenAppMenu: "openAppMenu", onCloseAppMenu: "closeAppMenu", onWindowRotated: "processWindowRotate",onWindowActivated: "updateAmixer"},
		{kind: "AppMenu", automatic: false, onBeforeOpen: "beforeAppMenuOpen", components: [
			{caption: "Launch Options", components: [
				{caption: "Luna Patch", className:"red-back", name: "installPatch", onclick: "enablePatch"},
				{caption: "Remove Patch", name: "removePatch", onclick: "disablePatch"},
				{caption: "Full Gui on Launch", className:"test2", name: "normalLaunch", onclick:"setLaunchOption"},
				{caption: "Dashboard on Launch", name: "dashLaunch", onclick:"setLaunchOption"}]},
			{caption: "Media Patches", components:[
				{caption: "Headphone", name: "UCMheadphone", className:"red-back", onclick: "ucmChange"},
				{caption: "Microphone", name: "UCMmicrophone", className:"red-back", onclick: "ucmChange"},
				{caption: "Pre3 - EQ", name: "UCMpre3eq", className:"red-back", onclick: "ucmChange"},
				{caption: "Undo Media changes", name: "UCMreset", onclick: "ucmReset", showing:false},
			]},
			{caption: "Restart PulseAudio", onclick: "setPulse"},
			{caption: "Reset Profiles", onclick: "resetProfilesStore"},
			{caption: "Choose Profile", components: [
				{kind: "VirtualRepeater", name:"appmenuProfiles", onSetupRow: "getProfileList", components: [
				{kind: "SwipeableItem", layoutKind: "HFlexLayout", tapHighlight:true, name:"appmenuProfilesBox", onConfirm: "deleteProfile", onmousehold:"launchMinipopup", onclick: "processProfile", components: [	
					{name: "appmenuProfileCaption", flex: 1},	
					{name: "appmenuProfileImg", kind: "Image", src:"", height:"24px"}]}
				]}
			]},
			{caption: "Background", components: [
				{caption: "Black", className:"dark-back", onclick: "setBackground"},
				{caption: "Image", className:"black-dark-back", onclick: "setBackground"},
				{caption: "Choose Your Own", className:"black-darker-back",onclick: "setBackground"},
				{kind:"HFlexBox", className:"black-darkest-back", align:"center", components: [
					{kind: "Image", className:"brightness-label", src:"source/images/brightness-less.png"},
					{kind: "Slider", flex:1, name:"Opacity", style:"margin 5px", minimum:0, maximum:10, position:5, onChange: "setBackground"},
					{kind: "Image", className:"brightness-label", src:"source/images/brightness-more.png"},
					]},
				]},
			{caption: "About", onclick: "appAbout"},
			
		]},
		{kind: "Image", name:"Background", src: "", style:"position:absolute;top:0px,left:0px;z-index:-10;opacity:0.5"},
		{kind:"HFlexBox", name:"TopRow", components: [
		{kind:"VFlexBox", flex:1, name:"EQ_box", style:"overflow:hidden;border-right: 2px solid;border-color:#5AA6EC", components: [
			{kind: "Toolbar", components: [
				{kind:"Button", caption:"Equalizer +", className:"blueButton", name:"EQ_Button", onclick:"showIT"},
				//{kind:"HFlexBox", name:"eq_spacer", className:"eq_spacer pre3-show"},
				{kind:"ToggleButton", name:"AIF1DAC1_EQ_On", state: true, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
			]},
			{kind: "Control", name: "TL_sliderGroup", className:"sliderGroup", layoutKind: "VFlexLayout", components: [
				{content: "20hz", className:"vertical"},
				{kind:"Slider", name:"AIF1DAC1_EQ1", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
				{kind:"Slider", name:"AIF1DAC1_EQ2", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
				{kind:"Slider", name:"AIF1DAC1_EQ3", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
				{kind:"Slider", name:"AIF1DAC1_EQ4", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
				{content: "20Khz", className:"vertical",},
				{kind:"Slider", name:"AIF1DAC1_EQ5", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},		
				{kind: "HFlexBox", components: [	
					{content: "3D Effect", style:"padding: 10px 10px 0px 0px"},
					{kind:"Slider", name:"AIF1DAC1_3D_Stereo", flex:1, minimum:0, maximum: 15, onChange: "setVolumeControl", onChanging:"showValue"},
				]},
				{kind: "HFlexBox", components: [	
					{kind:"ToggleButton", name:"AIF1DAC1_3D_Stereo_On", style:"padding: 0px", state: false, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
				]},
			]},
		]}, /* end EQ_box */
		{kind:"VFlexBox", flex:1, name:"OUTPUT_box", style:"overflow:hidden", components: [
			{kind: "Toolbar", components: [
				{kind:"Image", name:"paneLeft", className:"pre3-header-arrow", onclick:"swapTopRow", src:"source/images/arrow_left.png"},
				//{kind: "Button", caption: "Left", name:"paneLeft", onclick:"swapTopRow"},
				{kind:"Button", caption: "Volume +", className:"blueButton",  name:"OUTPUT_Button", onclick:"showIT"},
				//{kind: "Button", caption: "Right", name:"paneRight", onclick:"swapTopRow", showing:false}
				{kind:"Image", name:"paneRight", className:"pre3-header-arrow", onclick:"swapTopRow", src:"source/images/arrow_right.png", showing:false},
			]},
			{kind: "Control", className:"sliderGroup", layoutKind: "VFlexLayout", defaultKind:"HFlexBox", components: [
				{kind: "Control", className:"test-back2", layoutKind: "VFlexLayout", defaultKind:"HFlexBox", components: [
					{components: [	
						{content: "L", className:"text-padding-small"},
						{kind:"Slider", name:"DAC1_L", flex:1, minimum:0, maximum: 96, onChange: "setVolumeControl", onChanging:"showValue"},
					]},
					{style:"height:1px", components:[
						{kind: "Image", name:"DAC1Link", src:"source/images/locked.png", className:"slider-link", onclick:"changeLink"},
						{content: "Master", flex:1, className:"text-zero-height"},
					]},
					{components: [	
						{content: "R", className:"text-padding-small"},
						{kind:"Slider", name:"DAC1_R",  flex:1, minimum:0, maximum: 96, onChange: "setVolumeControl", onChanging:"showValue"},
					]},
				]},
				{kind: "Control", className:"test-back", layoutKind: "VFlexLayout", defaultKind:"HFlexBox", components: [
					{components: [		
						{content: "L", name:"Bal_L", className:"text-padding-small"},
						{kind:"Slider", name:"Headphone", flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
					]},	
					{style:"height:1px", components:[
						{kind: "Image", name:"HeadphoneLink", src:"source/images/locked.png", className:"slider-link", onclick:"changeLink"},
						{content: "Headphones", flex:1, className:"text-zero-height"},
					]},
					{components: [		
						{content: "R", name:"Bal_R", className:"text-padding-small"},
						{kind:"Slider", name:"Balance",  showing: true, flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
					]},
				]},
				{components: [	
					{content: "Media", className:"text-padding-med"},
					{kind:"Slider", name:"Media", flex:1, minimum:0, maximum: 100, onChange: "switchLunaVolume", onChanging:"showValue"},
				]},
				{components: [	
					{content: "System", className:"text-padding"},
					{kind:"Slider", name:"System", flex:1, minimum:0, maximum: 100, onChange: "switchLunaVolume", onChanging:"showValue"},
				]},
				{components: [	
					{content: "Boost", className:"text-padding-large"},
					{kind:"Slider", name:"AIF1_Boost", flex:1, minimum:0, maximum: 2, onChange: "setVolumeControl", onChanging:"showValue"}
				]},
			]},
		]},	/* end OUTPUT_box  */
		{kind:"VFlexBox", flex:1, name:"INPUT_box", showing:false, style:"overflow:hidden;border-left: 2px solid;border-color:#5AA6EC", components: [
			{kind: "Toolbar", components: [
				{kind:"Button", caption: "Input +", className:"blueButton",  name:"INPUT_Button", onclick:"showIT"}
			]},
			{kind: "Control", className:"sliderGroup", layoutKind: "VFlexLayout", defaultKind:"HFlexBox", components: [
				{components: [	
					{kind:"Slider", name:"IMic", flex:1, minimum:0, maximum: 31, onChange: "setVolumeControl", onChanging:"showValue"}
				]},
				{style:"height:1px", components:[
					{content: "Internal Mic", flex:1, className:"text-zero-height"},
				]},
				{components: [	
					{kind:"Slider", name:"EMic", flex:1, minimum:0, maximum: 31, onChange: "setVolumeControl", onChanging:"showValue"}
				]},
				{style:"height:1px", components:[
					{content: "External Mic", flex:1, className:"text-zero-height"},
				]},
					
			]},
		]},	/* end Input_box  */
		
		]}, /* end Toprow */
		
		{kind: enyo.VFlexBox, flex: 1, name:"Bottom", pack:"end", components:[
			{className: "enyo-divider divider-nomargin"},
				{kind: enyo.HFlexBox, components: [
					{kind: "Toolbar", flex:1, components: [
						{kind: enyo.HFlexBox, style:"width:150px", components:[
							{kind:"RadioToolButtonGroup", name:"Output",  onChange: "setOutputToggle", value:"1", components:[
								{caption:"Headset", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
								{caption:"Speaker", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
							]},
						]},
						{kind: "Spacer"},
						{kind:"Button", name:"Reset", className:"pre3-hide redButton", pack:"center", caption:"Reset to Default", onclick:"setDefaults"},
						{kind: "Spacer"},
						{kind: enyo.HFlexBox, style:"width:150px", pack:"end", components: [
						{kind:"Button", caption:"Save to Profile", className:"blueButton",  name:"Profile_Button", onclick:"setProfilePopup"},
						]},
					]},
				]},
				
				{kind: "SpinnerLarge", style:"position:absolute;top:200px;left:45%", showing:false},
				{flex: 1, name: "list", kind: "VirtualList", className: "pre3-hide", onSetupRow: "listSetupRow", components: [
					{name: "cells", kind: "HFlexBox"}
				]},
				{kind: "Selection"},
				
		]},
		//profile popup
		{kind: "ModalDialog", name: "profilePopup", height:"100%", width:"480px", showKeyboardWhenOpening: false,    
			components: [
				{layoutKind: "VFlexLayout", flex: 1, style: "height: 600px", components: [  
				{kind: "Scroller", flex: 1, components: [
				{kind: "HFlexBox", components: [{flex:1},{name:"popupTitle", content: "Pick saved settings & icon"},{flex:1}]},
				{kind: "HFlexBox", name:"selectControlsList", components: [
					{kind: "VFlexBox", style:"padding-right:10px", flex:1, defaultKind:"HFlexBox", components: [ 
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ_On", checked:true}, {content: "EQ On"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ1", checked:true}, {content: "EQ level 1"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ2", checked:true}, {content: "EQ level 2"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ3", checked:true}, {content: "EQ level 3"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ4", checked:true}, {content: "EQ level 4"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_EQ5", checked:true}, {content: "EQ level 5"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_3D_Stereo_On", checked:true}, {content: "3D On"}]},
						{components: [{kind:"CheckBox", name:"checkbox_AIF1DAC1_3D_Stereo", checked:true}, {content: "3D level"}]},
						] },
					{kind: "VFlexBox", flex:1, align:"end", defaultKind:"HFlexBox", components: [ 
						{components: [{content: "Master/L"}, {kind:"CheckBox", name:"checkbox_DAC1_L"}]},
						{components: [{content: "Master/R"}, {kind:"CheckBox", name:"checkbox_DAC1_R"}]},
						{components: [{content: "Headphone/L"}, {kind:"CheckBox", name:"checkbox_Headphone", checked:true}]},
						{components: [{content: "Headphone/R"}, {kind:"CheckBox", name:"checkbox_Balance", checked:true}]},
						{components: [{content: "Media"}, {kind:"CheckBox", name:"checkbox_Media", checked:true}]},
						{components: [{content: "System"}, {kind:"CheckBox", name:"checkbox_System", checked:true}]},
						{components: [{content: "Boost level"}, {kind:"CheckBox", name:"checkbox_AIF1_Boost", checked:true}]},
						{kind: "Input", spellcheck:false, autocorrect: false, alwaysLooksFocused: true, name:"inputProfileName", hint: "Profile Name"}
						] },
				]},
				{className: "enyo-divider"},
				{kind: "Image", src:"source/images/icon.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/headphones.png", onclick:"setSelectedIcon",className:"icon-spacing"},
				{kind: "Image", src:"source/images/icon-green.png", onclick:"setSelectedIcon",className:"icon-spacing"},
				{kind: "Image", src:"source/images/headphones-red.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/icon-purple.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/headphones-yello.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/icon-blue.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/headphones-green.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/icon-flashy.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind: "Image", src:"source/images/headphones-purpl.png", onclick:"setSelectedIcon", className:"icon-spacing"},
				{kind:"Button", caption:"Or browse for Icon", onclick:"setSelectedIcon", className:"blueButton",  onclick:"getProfileIcon"},
				{kind:"HFlexBox", pack:"center", components: [{kind: "Image", name:"selectedIcon", src:"", style: "padding: 4px; height: 96px"}]},
				{className: "enyo-divider", style:"margin:0px"},
				{kind: "HFlexBox", pack:"center", components: [{content: "Create Launchpoint? "}, {kind:"CheckBox", name:"create_ProfileLaunchPoint"}]},
				{className: "enyo-divider", style:"margin:0px"},
				{kind: "HFlexBox", name:"profilePopupButtons", pack:"center", components: [
				{kind: "Button", caption: "Cancel", flex:1, className:"redButton", popupHandler: "Cancel"},
				{kind: "Button", caption: "OK", flex:1, className:"blueButton",  onclick: "createProfile"},
				{kind: "Button", caption: "Ok", flex:1, className:"blueButton",  onclick: "createProfileFromImport", showing:false},
				]},
			]}
			]}
			]
		}, 
		//patch confirm popup		
		{kind: "ModalDialog", name: "patchPopup", height:"100px", width:"480px", showKeyboardWhenOpening: false, layoutKind: "VFlexLayout",
		components: [
			{name: "patchPopupTitle"},
			{kind: "HFlexBox", pack:"center", components: [
				{kind: "Button", caption: "Cancel", className:"redButton", popupHandler: "Cancel"},
				{kind: "Button", caption: "OK", className:"blueButton",  onclick: "runPatch"},
			]},
		]},
		//virtual list popup
		{kind: "Popup", name: "miniPopup", showKeyboardWhenOpening: false, layoutKind: "VFlexLayout", width:"150px",
		components: [
			{name: "miniPopupTitle"},
				{kind: "Button", caption: "Export to File", style:"background-color:white;color:#2C6399", onclick: "exportProfile"},
				{kind: "Button", caption: "Create launchpoint", className:"blueButton",  onclick: "launchpointFromProfile"}
		]},
		
	],
	
	updateAmixer: function() {
		this.$.amixerGetVolume.call ();
	},

	swapTopRow: function(inSender) {
		if (inSender.name === "paneLeft") {
			this.$.EQ_box.setShowing(false);
			this.$.INPUT_box.setShowing(true);
			this.$.paneLeft.setShowing(false);
			this.$.paneRight.setShowing(true);
		}
		else {
			this.$.EQ_box.setShowing(true);
			this.$.INPUT_box.setShowing(false);
			this.$.paneLeft.setShowing(true);
			this.$.paneRight.setShowing(false);
		}
	},
	
	ucmChange: function(inSender) {
		var ucmName = inSender.name.substring(3);
		var media = localStorage.getItem("touchvol_media_option");
		var mediavars = new Object();
		if (media) {
			var mediavars = enyo.json.parse(media);
		}
		mediavars[ucmName] = 1;
		media = enyo.json.stringify(mediavars);
		localStorage.setItem("touchvol_media_option", media);
			
		this.$.setucmPatch.call({
			command: ucmName
		});
	},
	
	ucmReset: function(inSender) {
		var ucmName = inSender.name.substring(3);
		localStorage.removeItem("touchvol_media_option");
		this.$.UCMreset.hide();
		this.$.UCMheadphone.show();
		this.$.UCMmicrophone.show();
		this.$.UCMpre3eq.show();
		
		this.$.setucmPatch.call({
			command: ucmName
		});
	},
	
	setLaunchOption: function() {
		var launch = localStorage.getItem("touchvol_launcher_option");
			if (launch === "1") {	
				localStorage.setItem("touchvol_launcher_option", 0);
			}
			else {
				localStorage.setItem("touchvol_launcher_option", 1);
			}
	
	},
	
	createProfileFromImport: function() {
		var content = this.$.popupTitle.content;
		var inName = content.substr(content.indexOf("Profile:")+9);
		inName = inName.substr(0,10);
		enyo.windows.addBannerMessage("Imported: " + inName, "{}", "");
		var inFile = "source/images/icon.png";
		var i=0;
		if (this.$.selectedIcon.src) {
			inFile = this.$.selectedIcon.src;
		}
		if (inName === "profiles" || inName === "" || inName === "touchvol_patch_install" || inName === "firstRunProfilesStored" || inName === "regHandlerDone" || inName === "touchvol_launcher_option") {
			return false;
		}
		inName = inName.replace(" ","_");
		inName = inName.replace(",","_");
			
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
			this.createLaunchPoint(inName);
		}
		this.$.profilePopup.close();
	},
	
	saveProfileSuccess: function(inSender, inValue) {
		enyo.windows.addBannerMessage("Exported Profile to /media/internal", "{}", "");
	},
	
	readProfileSuccess: function(inSender, inValue) {
		localStorage.setItem(inValue.name, enyo.json.stringify(inValue.profile));
		if (innerWidth < 500) {
			this.$.profilePopup.openAt({top:0,left:10});
            this.$.profilePopup.applyStyle("width", innerWidth - 20 + "px");
		}
		else {
			this.$.profilePopup.openAtCenter();
		}
		this.$.selectControlsList.applyStyle("display", "none"); 
		this.$.profilePopupButtons.controls[1].applyStyle("display", "none"); 
		this.$.profilePopupButtons.controls[2].applyStyle("display", "null"); 
		this.$.popupTitle.setContent("Importing Profile: " + inValue.name);
		
	},
	readProfileFailure: function() {
		console.log("readprofile fail");
	},
	
	exportProfile: function(inSender, inEvent) {
		var i=0;
		if (inSender.name === "appmenuProfilesBox") {
			var name = this.profiles[inEvent.rowIndex * 2];
		}
		else {
			var name = this.$.miniPopupTitle.content;
		}
		var profile = localStorage.getItem(name);
		this.$.saveProfiletoFile.call( 
		{
			filename: name,
			profile: profile
		});
		this.$.miniPopup.close();
	},
	
	launchMinipopup: function(inSender, inEvent) {
		if (inSender.name === "appmenuProfilesBox") {
			this.$.miniPopup.openAt({top:inEvent.pageY-20,left:inEvent.pageX+25});
			this.$.miniPopupTitle.setContent(this.profiles[inEvent.rowIndex * 2]);
		}
		else {
			if ((innerWidth / 2) < inEvent.pageX) {
				this.$.miniPopup.openAt({top:inEvent.pageY-100,left:inEvent.pageX-275});
			}
			else {
				this.$.miniPopup.openAt({top:inEvent.pageY-100,left:inEvent.pageX-25});
			}
			this.$.miniPopupTitle.setContent(inSender.$.control.content);
		}
	},
	
	launchpointFromProfile: function() {
		this.createLaunchPoint(this.$.miniPopupTitle.content);
		this.$.miniPopup.close();
	},
	
	enablePatch: function() {
		if (innerWidth < 500) {
			this.$.patchPopup.openAt({top:0,left:10});
            this.$.patchPopup.applyStyle("width", innerWidth - 20 + "px");
		}
		else {
			this.$.patchPopup.openAtCenter();
		}
		this.$.patchPopupTitle.setContent("Enabling the patch will execute a Luna restart, continue?");
		
	},
	disablePatch: function() {
		if (innerWidth < 500) {
			this.$.patchPopup.openAt({top:0,left:10});
            this.$.patchPopup.applyStyle("width", innerWidth - 20 + "px");
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
		if (this.$.patchPopupTitle.content.charAt(0) === "E") {
			var patch = "install";
			localStorage.setItem("touchvol_patch_install", 1);
			while (check != 1) {
				check = localStorage.getItem('touchvol_patch_install');		}
			}
		if (this.$.patchPopupTitle.content.charAt(0) === "D") {
			var patch = "remove";
			localStorage.setItem("touchvol_patch_install", 0);
			while (check != 0) {
				check = localStorage.getItem('touchvol_patch_install')		}
			}		
			
		setTimeout(function() {this.$.setlunaPatch.call({ command: patch});}.bind(this), 3000);
	},
			
	createLaunchPoint: function(inName) {
		var i=0;
		for (i=0; i< this.profiles.length; i +=2) {
			if (inName == this.profiles[i]) {
				var inFile = this.profiles[i+1];
			}
		}
			
		
		if (inFile.charAt(0) != "/") {
			inFile = "/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/Main/" + inFile;
		}
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
	},
	
		
	getProfileList: function(inSender, inIndex) {
		var profileList = this.profiles;
			if (inIndex * 2 < profileList.length) {
				this.$.appmenuProfileCaption.setContent(profileList[inIndex * 2]);
				this.$.appmenuProfileImg.setSrc(profileList[(inIndex * 2) + 1]);
				if (inIndex%2 === 0) {
					this.$.appmenuProfilesBox.addClass('black-dark-back'); 
				}
				else {
					this.$.appmenuProfilesBox.addClass('dark-back'); 
				}
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
		//<Reminder to actually delete the localstorage entry - maybe delete launchpoints associated as well
	},
	
	createProfile: function() {
		var inName = this.$.inputProfileName.value;
		inName = inName.substr(0,10);
		var inFile = "source/images/icon.png";
		var i=0;
		if (this.$.selectedIcon.src) {
			inFile = this.$.selectedIcon.src;
		}
		
		if (inName === "profiles" || inName === "" || inName === "touchvol_patch_install" || inName === "firstRunProfilesStored" || inName === "regHandlerDone" || inName === "touchvol_launcher_option") {
			return false;
		}
		inName = inName.replace(" ","_");
		inName = inName.replace(",","_");
		
		var profile = "{"; 
		for(control in this.$) {
			if (this.$[control].name.slice(0,8) === "checkbox") {
				if (this.$[control].checked === true) {
					var name = control.slice(9);
					if (this.$[name].kind === "Slider") {
						profile += "\"" + name + "\":" + this.$[name].position + ",";
					}
					if (this.$[name].kind === "ToggleButton") {
						profile += "\"" + name + "\":" + this.$[name].state + ",";
					}
					
				}
			}
		}
		profile = profile.slice(0,-1) + "}";
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
			this.createLaunchPoint(inName);
		}
		
		// ok how can I clear that input field between uses?
		//this.$.inputProfileName.$.input.value = null;
		//this.$.inputProfileName.value = null;
		this.$.profilePopup.close();
	},
	
	processWindowRotate: function(inSender) {
		var position = enyo.getWindowOrientation();
		if (position === "up") {
			this.$.Background.applyStyle("-webkit-transform", null);
		}
		
		if (position === "right") {
			var number = (innerWidth / 2) + "px";
			var value = number + " " + number;
			this.$.Background.applyStyle("-webkit-transform-origin", value);
			this.$.Background.applyStyle("-webkit-transform", "rotate(90deg)");
		}
		if (position === "left") {
			// matrix rotation appears broken, wont do a scale + rotation correctly kluged to get close
			var number = (innerWidth / 2) + "px";
			var value = number + " " + number;
			this.$.Background.applyStyle("-webkit-transform-origin", value);
			this.$.Background.applyStyle("-webkit-transform", "rotate(90deg)");
		}
		
		if (position === "down") {
			this.$.Background.applyStyle("-webkit-transform", null);
		}
		
	},
	
	importProfile: function(filename) {
		var filestring = filename.substr(filename.indexOf("//")+2);
		console.log("filestring: " + filestring);
		this.$.readProfileFile.call({filename: filestring});
	},
	
	setSelectedIcon: function(inSender) {
		this.$.selectedIcon.setSrc(inSender.src);
	},
	
	setProfilePopup: function() {
		if (innerWidth < 500) {
			this.$.profilePopup.openAt({top:0,left:10});
            this.$.profilePopup.applyStyle("width", innerWidth - 20 + "px");
		}
		else {
			this.$.profilePopup.openAtCenter();
		}
		this.$.selectControlsList.applyStyle("display", "null"); 
		this.$.profilePopupButtons.controls[1].applyStyle("display", "null"); 
		this.$.profilePopupButtons.controls[2].applyStyle("display", "none"); 
		this.$.popupTitle.setContent("Pick saved settings & icon");
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
		if (patch === "1") {
			this.$.installPatch.hide();
		}
		else {
			this.$.removePatch.hide();
		}
		var launch = localStorage.getItem("touchvol_launcher_option");
		if (launch === "1") {
			this.$.dashLaunch.hide();
			this.$.normalLaunch.show();
		}
		else {
			this.$.normalLaunch.hide();
			this.$.dashLaunch.show();
		}
		var media = localStorage.getItem("touchvol_media_option");
		if (media) {
			var mediavars = enyo.json.parse(media);
			if (mediavars.headphone === 1) {
				this.$.UCMheadphone.hide();
				this.$.UCMreset.show();
			}
			if (mediavars.pre3eq === 1) {
				this.$.UCMpre3eq.hide();
				this.$.UCMreset.show();
			}
			if (mediavars.microphone === 1) {
				this.$.UCMmicrophone.hide();
				this.$.UCMreset.show();
			}
		}
	},
	
	setBackground: function(inSender, inValue) {
		if(inSender) {
			if (inSender.caption === "Choose Your Own") {
				this.doReqFile("background");
				this.owner.$.primary.selectViewByName("file");
			}
			if (inSender === "file") {
				localStorage.setItem("background", inValue);
			}
			if (inSender.caption === "Black") {
				localStorage.setItem("background", "source/images/black.png");
			}
			if (inSender.caption === "Image") {
				localStorage.setItem("background", "source/images/background.jpg");
			}
			if (inSender.name === "Opacity") {
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
	var temp = sessionStorage.getItem("subPID");
	this.$.amixerSaveState.call();
	if (temp) {
		this.$.stopSub.call({pid: temp});
	}
	},
	
	startup: function() {
	var reghandled = localStorage.getItem("regHandlerDone");
	if (reghandled === "0" || !reghandled) {
		this.$.regFileHandler.call ();
		localStorage.setItem("regHandlerDone", 1);
	}
	if (innerWidth < 500 || innerHeight < 500) {
		enyo.loadSheet("source/pre3.css");
	}
	// <REMINDER> temp disable, enable before pack
	//enyo.scrim.show();
	//this.$.spinnerLarge.setShowing(true);
	// com.palm.audio/media works on subscribe but not set, system not at all...   why?!?
	// replacement service to subscribe to private version of audio/system through luna-send
	this.$.reclunaVolume.call ();
	this.$.amixerGetVolume.call ();
	this.$.getMediaVolume.call ();
	this.setBackground();
	},
	
	setPulse: function() {
		this.$.setPulseReset.call ();
	},
	
	lunaResultMsg: function(inSender, inValue) {
		if (inValue.errorText === "Could not set current scenario." ) {
			this.$.Output.setValue(1);
			this.$.Output.doChange(1);
		}
	},
				
	processLunaInfo: function(inSender, inValue) {
		var i;
		if (inValue.returnValue) {
			if (inValue.subPID) {
				sessionStorage.setItem("subPID", inValue.subPID);
			}
			else if (inValue.scenario.substr(0,5) === "media") {	
				if (inValue.volume !== undefined) {
					this.$.Media.setPositionImmediate(inValue.volume); 
					this.$.Media.doChanging(inValue.volume);
				}
				if (inValue.scenario  === "media_headset") {
					if (inValue.action === "enabled" || inValue.action === "requested") {
						this.$.Output.setValue(0);
						//this.$.Output.doChange(0); 
					}
					else if (inValue.action === "disabled") {
						this.$.Output.setValue(1);
						//this.$.Output.doChange(1); 
					}
				}
				if (inValue.action) {
					for (i=0; i <inValue.changed.length; i++) {
						if (inValue.changed[i] === "scenario") {
							// changed action, rerun amixer pull to get changed settings from ucm - only tracked element should be headphone volume
							this.$.amixerGetVolume.call ();
						}
					}
				}
			}
			else {
				if(inValue.volume != 'undefined') {
					this.$.System.setPositionImmediate(inValue.volume); 
					this.$.System.doChanging(inValue.volume);}
			};
		};	
			
	},
	
	processAmixerInfo: function(inSender, inValue) {
		if (inValue.Headphone === inValue.Balance) {
			this.$.HeadphoneLink.setSrc("source/images/locked.png");
		}
		else {
			this.$.HeadphoneLink.setSrc("source/images/unlocked.png");
		}
		if (inValue.DAC1_L === inValue.DAC1_R) {
			this.$.DAC1Link.setSrc("source/images/locked.png");
		}
		else {
			this.$.DAC1Link.setSrc("source/images/unlocked.png");
		}
		var control;
		for(var control in inValue) {
			if (control === "returnValue") {
				break;
			}
			else if (this.$[control].kind === "ToggleButton") {
				this.$[control].setState(inValue[control]);
			}
			else if (this.$[control].kind === "Slider") { 
				this.$[control].setPositionImmediate(inValue[control]);
				this.$[control].doChanging(this.$[control].position);
			}
		}
		//enyo.scrim.hide();
		//this.$.spinnerLarge.setShowing(false);
	},
	
	showValue: function(inSender,inValue) {
		var percLoc = enyo.byId(inSender.id + "_button").style.left.slice(0,-1);
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
	},

	setOutputToggle: function(inSender, inValue) {
	var value="\"media_headset\"";
	
	if (inValue === 1) {
		value = "\"media_back_speaker\""; 
	}
	this.$.setlunaVolume.call(
	{
		target: "media/setCurrentScenario",
		control: "scenario", 
		value: value
	});
	},
	
	switchLunaVolume: function(inSender, inValue) {
		inSender.doChanging(inValue);
		var controlName = inSender.name.toLowerCase();
		var vol = "volume";
		if (controlName === "media") {
			this.$.setlunaVolume.call(
			{
				target: controlName + "/setVolume",
				control: vol, 
				value: inValue,
				scenario: "media_headset"
			});
			this.$.setlunaVolume.call(
			{
				target: controlName + "/setVolume",
				control: vol, 
				value: inValue,
				scenario: "media_back_speaker"
			});		
		}
		else {
			this.$.setlunaVolume.call(
			{
				target: controlName + "/setVolume",
				control: vol, 
				value: inValue,
				scenario: ""
			});
		}
	},
		
	setDefaults: function() {
		this.$.HeadphoneLink.setSrc("source/images/locked.png");
		this.$.DAC1Link.setSrc("source/images/locked.png");
		this.$.AIF1DAC1_EQ_On.doChange(false);
		this.$.AIF1DAC1_EQ_On.setState(false);
		this.$.AIF1DAC1_3D_Stereo_On.doChange(false);
		this.$.AIF1DAC1_3D_Stereo_On.setState(false);
		this.$.Headphone.setPositionImmediate(45);
		this.$.Headphone.doChange(45);
		this.$.Balance.setPositionImmediate(45);
		this.$.Balance.doChange(45);
		this.$.AIF1DAC1_3D_Stereo.setPositionImmediate(0);
		this.$.AIF1DAC1_3D_Stereo.doChange(0);
		this.$.AIF1_Boost.setPositionImmediate(0);
		this.$.AIF1_Boost.doChange(0);
		this.$.DAC1_L.setPositionImmediate(96);
		this.$.DAC1_L.doChange(96);
		this.$.DAC1_R.setPositionImmediate(96);
		this.$.DAC1_R.doChange(96);
		this.$.IMic.setPositionImmediate(27);
		this.$.IMic.doChange(27);
		this.$.EMic.setPositionImmediate(13);
		this.$.EMic.doChange(13);
		
		var control;
		for(var control in this.$) {
			if (control.slice(0,-1) === "AIF1DAC1_EQ") {
				this.$[control].doChange(12);
				this.$[control].setPositionImmediate(12);
			}
						
			if (this.$[control].kind === "Slider") { 
				// color vals on all sliders at reset
				this.$[control].doChanging(this.$[control].position);
			}
		}
	},
			
	showIT: function(inSender) {
		// quirk workaround - expanding volume pane will push trailing bar off screen
		// there are no elements in the area being pushed, workaround fix rowheight on first expand
		if (!sessionStorage.getItem("fixed")) {
			this.$.TopRow.applyStyle("height",this.$.OUTPUT_box.getBounds().height + "px");
			sessionStorage.setItem("fixed", 1);
		}
		
		var caption = inSender.getCaption();
		var sender = inSender.name;
		var name = sender.substr(0,sender.indexOf("_") + 1) + "box";
		
		if (caption.substr(-1) === "+") {
			if (name.substr(0,sender.indexOf("_")) === "OUTPUT") {
				//quirk avoidance - bleed through from a portion of replaced panel on EQ_box
				// not sure why atm, move EQ_box off screen and return
				this.$.EQ_box.applyStyle("-webkit-transform","translate(-500px,0)");
			}
			
			this.$[name].applyStyle("width","100%");
			inSender.setCaption(caption.substr(0,caption.length - 1) + "-");
		}
		else {
			if (name.substr(0,sender.indexOf("_")) === "OUTPUT") {
				//quirk avoidance - bleed through from a portion of replaced panel on EQ_box
				this.$.EQ_box.applyStyle("-webkit-transform","translate(0,0)");
			}
			this.$[name].applyStyle("width","0%");
			inSender.setCaption(caption.substr(0,caption.length - 1) + "+");
		}
	},
	
	changeLink: function(inSender, inValue) {
		
		if (inSender.src.substr(-11) === "/locked.png"){
			inSender.setSrc("source/images/unlocked.png");
			}
		else {
			inSender.setSrc("source/images/locked.png");
			if (inSender.name === "HeadphoneLink") {
				if (this.$.Headphone.position < this.$.Balance.position) {
					this.$.Balance.doChange(this.$.Headphone.position);
				}
				else {
					this.$.Headphone.doChange(this.$.Balance.position);
				}
			}
			if (inSender.name === "DAC1Link") {
				if (this.$.DAC1_L.position < this.$.DAC1_R.position) {
					this.$.DAC1_R.doChange(this.$.DAC1_L.position);
				}
				else {
					this.$.DAC1_L.doChange(this.$.DAC1_R.position);
				}
			}
		}
		
		},

	setVolumeControl: function(inSender, inValue) {	
		var headlink = this.$.HeadphoneLink.src;
		var daclink = this.$.DAC1Link.src;
		if (headlink.substr(-11) === "/locked.png") {
			if (inSender.name === "Headphone") {
				this.$.Balance.setPositionImmediate(inSender.position);
				this.$.Balance.doChanging(inSender.position);
			}	
			else if (inSender.name === "Balance") {
					this.$.Headphone.setPositionImmediate(inSender.position);
					this.$.Headphone.doChanging(inSender.position);
			}
		}
		if (daclink.substr(-11) === "/locked.png") {
				if (inSender.name === "DAC1_L") {
					this.$.DAC1_R.setPositionImmediate(inSender.position);
					this.$.DAC1_R.doChanging(inSender.position);
				}
				else if (inSender.name === "DAC1_R") {
					this.$.DAC1_L.setPositionImmediate(inSender.position);
					this.$.DAC1_L.doChanging(inSender.position);
				}
					
		}
		
		inSender.doChanging(inValue);  //in case of point click on a slider, rerun the icon selector
		var controlName = "'" + inSender.name.replace(/_/g, " ") + "'";
		var value = inValue;
		if (inSender.name === "Balance" || inSender.name === "Headphone") {
				controlName = "Headphone";
				var value = this.$.Headphone.position + "," + this.$.Balance.position;
		}	
		
		if (inSender.name.substring(0,4) === "DAC1") {
				controlName = "DAC1";
				var value = this.$.DAC1_L.position + "," + this.$.DAC1_R.position;
		}
		
		if (inSender.name === "IMic") {
			controlName = "IN1L";
		}
		if (inSender.name === "EMic") {
			controlName = "IN2L";
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
			
		if (inValue === true) {
			value = "on";
			}
		else { value = "off" }
			
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
				Balance: 50,
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
		
		if (controls["Headphone"] !== undefined || controls["Balance"] !== undefined) {
			if (controls["Headphone"] === controls["Balance"]) {
				this.$.HeadphoneLink.setSrc("source/images/locked.png");
			}
			else if (controls["Headphone"] !== controls["Balance"]) {
				this.$.HeadphoneLink.setSrc("source/images/unlocked.png");
			}
		}
		if (controls["DAC1_L"] !== undefined || controls["DAC1_R"] !== undefined) {
			if (controls["DAC1_L"] === controls["DAC1_R"]) {
				this.$.DAC1Link.setSrc("source/images/locked.png");
			}
			else {
				this.$.DAC1Link.setSrc("source/images/unlocked.png");
			}
		}
		
		for (key in controls) {
			
			if (this.$[key].kind === "Slider") {
				this.$[key].setPositionImmediate(controls[key]);
			}
			if (this.$[key].kind === "ToggleButton") {
				this.$[key].setState(controls[key]);
			}
			// skip process of compound controls if first of two settings to prevent async service execution
			if (key === "Headphone" && controls["Balance"] !== undefined) {
				continue;
			}
			if (key === "DAC1_L" && controls["DAC1_R"] !==  undefined) {
				continue;
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
		var i=0;
		if (this.count > 0) {
			var bounds = this.$.list.getBounds();
			this.cellCount = Math.floor(bounds.width / 170);
			this.$.cells.destroyControls();
			this.cells = [];
			for (var i=0; i<this.cellCount; i++) {
				var c = this.$.cells.createComponent({kind: "VFlexBox", width: "110px", align: "center", onmousehold:"launchMinipopup", style: "overflow:visible;border-style:solid;border-width:0px;padding: 10px 0px 20px 0px;margin: 0px 30px 0px 30px", owner: this, idx: i, onclick: "cellClick"});
				c.createComponent({kind: "Image", style: "padding: 4px; height: 96px;"});
				c.createComponent({content: "File: " + i});
				this.cells.push(c);
			}
		}
	},
	
	listSetupRow: function(inSender, inIndex) {
		var i=0;
		var idx = inIndex * this.cellCount;
		if (idx >= 0 && idx < this.count) {
			for (var i=0, c; c=this.cells[i]; i++, idx++) {
				if (idx < this.count) {
					var path = this.profiles[(idx * 2) +1]
					c.$.control.content = this.profiles[idx * 2];								
					if (this.$.selection.isSelected(idx)) {
						c.applyStyle("background", "url('source/images/highlight.png') no-repeat center");
						clearTimeout(this.t);
						this.t=setTimeout(function() {this.deselectHighlight();}.bind(this), 2000);
					}
					else {
						c.applyStyle("background", "url('')");
					}
					
				} else {
					path = "";
					c.$.control.content = "";
					//c.applyStyle("background", "url('')");
					c.applyStyle("display","none");
				}
				c.$.image.setSrc(path);
			}
		return true;	
		}
		
	},
	
	deselectHighlight: function() {
		this.$.selection.clear();
		this.$.list.refresh();
		},

	cellClick: function(inSender, inEvent, inRowIndex) {
		var idx = inEvent.rowIndex * this.cellCount + inSender.idx;
		this.$.selection.select(idx);
		this.processProfile("cellClick", "filler", idx);
		this.$.list.refresh();
	},
});
