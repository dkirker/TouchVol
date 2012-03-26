enyo.kind({
name: "touchvolDash",
kind: "HFlexBox",
style: "color: white; background-color: #343434;",
components: [
	{kind: "ApplicationEvents", onLoad: "startup", onWindowActivated: "update"},
	{kind: "PalmService", service: "palm://com.wordpress.touchcontrol.touchvol",
			components:[
				{name: "amixerSet",			method: "change"},
				{name: "amixerGet",			method: "get", 			onResponse: "processMic"},
				{name: "setlunaVolume", 	method: "lunaSender"},
				{name: "getlunaVolume", 	method: "lunaGetter", onResponse: "processLunaInfo"},
				//{name: "reclunaVolume", 	method: "lunaRecieve", 	subscribe:true, onResponse: "processLunaInfo"},
	]},
	/*
	{kind:"PalmService", service:"palm://com.palm.audio/media/",
		    	components:[{name:"getMediaVolume", method:"status", subscribe:true, onResponse:"processLunaInfo"}]
	},*/
{kind: "Image", name:"MediaImg", src:"../Main/source/images/media.png", style:"margin:5px 10px 0px 5px", onclick:"switchDash"},
{kind: "Image", name:"SystemImg", src:"../Main/source/images/system.png", style:"margin:5px 10px 0px 5px",showing:false, onclick:"switchDash"},
{kind: "Image", name:"MicImg", src:"../Main/source/images/mic.png", style:"margin:5px 10px 0px 5px",showing:false, onclick:"switchDash"},
{kind: "Slider", name:"MediaSlider", flex:1, minimum:0, maximum: 100, style:"margin-right:10px", onChange: "setVolume"},
{kind: "Slider", name:"SystemSlider", flex:1, minimum:0, maximum: 100, showing:false, style:"margin-right:10px", onChange: "setVolume"},
{kind: "Slider", name:"MicSlider", flex:1, minimum:0, maximum: 31, showing:false, style:"margin-right:10px", onChange: "setVolume"}
],
startup: function() {
	//trying change from subscribe to event call on user dash interaction
	//this.$.getMediaVolume.call ();
	//this.$.reclunaVolume.call ();
	this.$.getlunaVolume.call({control:"media"});
	this.$.getlunaVolume.call({control:"system"});
	this.$.amixerGet.call ();
},
update: function() {
	this.$.amixerGet.call ();
	this.$.getlunaVolume.call({control:"media"});
	this.$.getlunaVolume.call({control:"system"});
},
switchDash: function (inSender) {
	if (inSender.name === "MediaImg") {
		this.$.MediaImg.hide();
		this.$.MediaSlider.hide();
		this.$.SystemImg.show();
		this.$.SystemSlider.show();
	}
	if (inSender.name === "SystemImg") {
		this.$.SystemImg.hide();
		this.$.SystemSlider.hide();
		this.$.MicImg.show();
		this.$.MicSlider.show();
	}
	if (inSender.name === "MicImg") {
		this.$.MicImg.hide();
		this.$.MicSlider.hide();
		this.$.MediaImg.show();
		this.$.MediaSlider.show();
	}
},
processLunaInfo: function(inSender, inValue) {
		if (inValue.returnValue) {
			if (inValue.scenario.substr(0,5) === "media") {	
				if (inValue.volume !== undefined) {
					this.$.MediaSlider.setPositionImmediate(inValue.volume); 
				}
			}
			else {
				if(inValue.volume != 'undefined') {
					this.$.SystemSlider.setPositionImmediate(inValue.volume); 
				}
			};
		};	
			
},
processMic: function(inSender, inValue) {
	if (inValue.IMic) {
		this.$.MicSlider.setPositionImmediate(inValue.IMic);
	}
},
setVolume: function(inSender, inValue) {	
		var controlName = inSender.name.replace(/Slider/g, "").toLowerCase();
		var vol = "volume";
		if (controlName === "mic") {
			this.$.amixerSet.call(
			{
				control: "IN1L", 
				value: inValue
			});
		}
		else if (controlName === "media") {
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

});

