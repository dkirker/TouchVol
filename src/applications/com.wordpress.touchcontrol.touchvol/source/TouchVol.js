enyo.kind({
	name: "TouchVol",
	kind: enyo.VFlexBox, 
	components: [
		{	kind: "PalmService", service: "palm://com.wordpress.touchcontrol.touchvol",
			components:[
			{name: "amixerSetVolume",	method: "change"},
			{name: "amixerGetVolume",	method: "get", onResponse: "processAmixerInfo"},
			{name: "amixerSaveState",   method: "save", onResponse: "testoverlay"},
			{name: "setlunaVolume", method: "lunaSender"},
			{name: "getlunaVolume", method: "lunaGetter", onResponse: "processLunaInfo"},
		
			{name: "reclunaVolume", method: "lunaRecieve", onResponse: "processLunaInfo"}

		]},
		{name: "AppManager", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
		{kind: "ApplicationEvents", onLoad: "startup", onUnload: "quit", onOpenAppMenu: "openAppMenu", onCloseAppMenu: "closeAppMenu"},
		{kind: "AppMenu", automatic: false, onBeforeOpen: "beforeAppMenuOpen", components: [
			{kind: "EditMenu"},
			{caption: "Help", onclick: "appHelp"},
			{caption: "About", onclick: "appAbout"},
		]},
		
		{kind:enyo.HFlexBox, height:"380px", name:"Top-row", components: [
		
		{kind:enyo.VFlexBox, flex:1, name:"TopLeft", style:"border-right: 1px solid;border-color:#5AA6EC", components: [
			
				{kind: "Toolbar", components: [
					{kind:"Button", caption:"Equalizer controls +", style:"background-color:#5AA6EC;color:white", name:"EQ_Button", onclick:"showIT"},
					{kind:"ToggleButton", name:"AIF1DAC1_EQ_On", state: true, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
				]},
				{kind: "Control", layoutKind: "VFlexLayout", style:"padding:0px 20px 0px 20px", components: [
					{kind:"Slider", name:"AIF1DAC1_EQ1", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ2", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ3", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ4", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},
					{kind:"Slider", name:"AIF1DAC1_EQ5", minimum:0, maximum: 24, onChange: "setVolumeControl", onChanging:"showValue"},		
					{kind: enyo.HFlexBox, components: [	
						{content: "3D Effect", style:"padding: 10px 0px 0px 0px"},
						{kind:"ToggleButton", name:"AIF1DAC1_3D_Stereo_On", state: false, onChange: "setVolToggle", onLabel:"On", offLabel:"Off"},
						{kind:"Slider", name:"AIF1DAC1_3D_Stereo", flex:1, minimum:0, maximum: 15, onChange: "setVolumeControl", onChanging:"showValue"},
				]},
				]},
		]}, /* end Topleft */
		{kind:enyo.VFlexBox, flex:1, name:"TopRight", style:"border-left: 1px solid;border-color:#5AA6EC", components: [
			{name:"paneltest"},	
				{kind: "Toolbar", components: [
					{kind:"Button", caption: "Volume controls +", style:"background-color:#5AA6EC;color:white", name:"Vol_Button", onclick:"showIT"}
					]},
				{kind: "Control", layoutKind: "VFlexLayout", style:"padding:0px 20px 0px 20px", components: [
				{kind: enyo.HFlexBox, components: [		
					{content: "Headphone", style:"padding: 10px 20px 0px 0px"},
					{content: "L", name:"Bal_L", showing:false, style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"Headphone", flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
				]},	
				{content:"Balance", style:"font-size:10pt;padding-left:15px"},
				{kind: enyo.HFlexBox, components: [		
				{kind:"ToggleButton", style:"padding-right:35px", name:"Balance_On", onChange: "switchVolControl", onLabel:"On", offLabel:"Off" },
				{content: "R", name:"Bal_R", showing:false, style:"padding: 10px 20px 0px 0px"},
				{kind:"Slider", name:"Balance", showing: false, flex:1, minimum:0, maximum: 63, onChange: "setVolumeControl", onChanging:"showValue"},
				]},	
				{kind: enyo.HFlexBox, components: [	
					{content: "Media", style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"Media", flex:1, minimum:0, maximum: 100, onChange: "switchMediaVolume", onChanging:"showValue"},
				]},
				{kind: enyo.HFlexBox, components: [	
					{content: "System", style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"System", flex:1, minimum:0, maximum: 100, onChange: "switchSystemVolume", onChanging:"showValue"},
				]},
				{kind: enyo.HFlexBox, components: [	
					{content: "Boost", style:"padding: 10px 20px 0px 0px"},
					{kind:"Slider", name:"AIF1_Boost", flex:1, minimum:0, maximum: 2, onChange: "setVolumeControl", onChanging:"showValue"}
				]},
				
				]},
		]}	/* end Top Right  */
		]}, /* end Toprow */
		{kind: enyo.VFlexBox, flex: 1, name:"Bottom", components:[
			{className: "enyo-divider"},
				{kind: enyo.HFlexBox, components: [
					{kind: "Toolbar", flex:1, components: [
						{kind: enyo.HFlexBox, style:"width:100px", components:[
							{kind:"RadioToolButtonGroup", name:"Output",  onChange: "setOutputToggle", components:[
								{caption:"Headset", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
								{caption:"Speaker", className: "enyo-radiobutton-dark enyo-grouped-toolbutton-dark"},
							]},
						]},
						{kind: "Spacer"},
						{kind:"Button", name:"Reset", style:"background-color:red;color:white", pack:"center", caption:"Reset to Default", onclick:"setDefaults"},
						{kind: "Spacer"},
						// god this next bit is retarded, there must be someway better to center in a toolbar by default
						{kind: enyo.HFlexBox, style:"width:100px" },
						
					]},
				]},
				//coupla debugging areas, <REMINDER> to reset these to showing:false before package
				{name:"curValue", content: "curValue", showing:false},
				{name:"curValue2", content: "curValue2", showing:false},
				{kind: "SpinnerLarge", style:"position:absolute;top:500px;left:45%;"},
				
		]}
	],
	testoverlay: function() {   },
	
	appAbout: function() {
	// placeholder add about screen, changelog, donate button, etc...
	},
	
	appHelp: function() {
	this.$.AppManager.call({target: "http://touchcontrol.wordpress.com"});
	// placeholder add hyperlink to web documentation, maybe local files?
	},
	
	openAppMenu: function() {
		var menu = this.myAppMenu || this.$.appMenu;
		menu.open();
	},
	closeAppMenu: function() {
		var menu = this.myAppMenu || this.$.appMenu;
		menu.close();
	},
	
	quit: function () {
	// sending default as filename postfix, if theres no profile manager remove this call to static name and no parameter
	this.$.amixerSaveState.call ({file:"default"});
	},
	
	startup: function() {
	//Work on this later, async call through commandline, initial thread recieves no info until completed, but to subscribe must be active....   
	//this.$.reclunaVolume.call ({});

	// temp disable
	enyo.scrim.show();
	this.$.spinnerLarge.setShowing(true);
	this.$.getlunaVolume.call ({control:"system"});
	this.$.getlunaVolume.call ({control:"media"});
	this.$.amixerGetVolume.call ({});
	
	},
	
	processLunaInfo: function(inSender, inValue) {
		this.$.curValue.setContent(inSender.name + " - " + 
					   inValue.returnValue + " - " +
					   "Scenario" + " - " +
					   inValue.scenario + " - " +
					   "Volume" + " - " +
					   inValue.volume);  
		if (inValue.returnValue) {
			if (inValue.scenario.substr(0,5) == "media") {	
				this.$.Media.setPositionImmediate(inValue.volume);
				if (inValue.scenario  == "media_back_speaker") {
					this.$.Output.setValue(1);
					this.$.Output.doChange(1);
				}
			}
			else {
				this.$.System.setPositionImmediate(inValue.volume);
			};
		};	
			
	},
		
	processAmixerInfo: function(inSender, inValue) {
	
                this.$.AIF1DAC1_EQ_On.setState(inValue.AIF1DAC1_EQ_On);
                this.$.Balance_On.setState(inValue.Balance_On);
                this.$.AIF1DAC1_3D_Stereo_On.setState(inValue.AIF1DAC1_3D_Stereo_On);
                this.$.AIF1DAC1_EQ1.setPositionImmediate(inValue.AIF1DAC1_EQ1);
                this.$.AIF1DAC1_EQ2.setPositionImmediate(inValue.AIF1DAC1_EQ2);
                this.$.AIF1DAC1_EQ3.setPositionImmediate(inValue.AIF1DAC1_EQ3);
                this.$.AIF1DAC1_EQ4.setPositionImmediate(inValue.AIF1DAC1_EQ4);
                this.$.AIF1DAC1_EQ5.setPositionImmediate(inValue.AIF1DAC1_EQ5);
                this.$.Headphone.setPositionImmediate(inValue.Headphone);
                this.$.AIF1DAC1_3D_Stereo.setPositionImmediate(inValue.AIF1DAC1_3D_Stereo);
                this.$.AIF1_Boost.setPositionImmediate(inValue.AIF1_Boost);
		if (inValue.Balance_On == true) {
                this.$.Balance_On.doChange(inValue.Balance_On);	
		this.$.Balance.setPositionImmediate(inValue.Balance);
		};
		enyo.scrim.hide();
		this.$.spinnerLarge.setShowing(false);
	},
	
	showValue: function(inSender,inValue) {
		this.$.curValue.setContent(inSender.name + " = " + inValue);  
	},

	handleGetMediaVolume: function(inSender, inResponse) {
		this.$.curValue.setContent(inSender + " = " + inResponse);  
	
	},
	
	handleGetSystemVolume: function(inSender, inResponse) {
		this.$.curValue.setContent(inSender + " = " + inResponse);  
	
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
	
	switchMediaVolume: function(inSender, inValue) {
		this.$.curValue.setContent(inSender.name + " = " + inValue);  
		this.$.setlunaVolume.call(
		{
			target: "media/setVolume",
			control: "volume", 
			value: inValue
		});
	
	},
	
	switchSystemVolume: function(inSender, inValue) {
		this.$.curValue.setContent(inSender.name + " = " + inValue);  
		this.$.setlunaVolume.call(
		{
			target: "system/setVolume",
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
		this.$.AIF1DAC1_EQ1.setPositionImmediate(12);
		this.$.AIF1DAC1_EQ1.doChange(12);
		this.$.AIF1DAC1_EQ2.setPositionImmediate(12);
		this.$.AIF1DAC1_EQ2.doChange(12);
		this.$.AIF1DAC1_EQ3.setPositionImmediate(12);
		this.$.AIF1DAC1_EQ3.doChange(12);
		this.$.AIF1DAC1_EQ4.setPositionImmediate(12);
		this.$.AIF1DAC1_EQ4.doChange(12);
		this.$.AIF1DAC1_EQ5.setPositionImmediate(12);
		this.$.AIF1DAC1_EQ5.doChange(12);
		this.$.Headphone.setPositionImmediate(45);
		this.$.Headphone.doChange(45);
		this.$.AIF1DAC1_3D_Stereo.setPositionImmediate(0);
		this.$.AIF1DAC1_3D_Stereo.doChange(0);
		this.$.AIF1_Boost.setPositionImmediate(0);
		this.$.AIF1_Boost.doChange(0);
		
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
			}
		else {
			this.$.Balance.applyStyle("display", "none");
			this.$.Bal_R.applyStyle("display", "none");
			this.$.Bal_L.applyStyle("display", "none");
			this.$.Headphone.doChange(this.$.Headphone.position);
			}
		},

	setVolumeControl: function(inSender, inValue) {	
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
		var value = inValue;
			
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
		
	}
});
