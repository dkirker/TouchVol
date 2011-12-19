enyo.kind({
	name: "TouchVol.Main",
	kind: enyo.VFlexBox,
	components: 
	[
		{name: "primary", kind: "Pane", flex: 1, transitionKind: "enyo.transitions.Simple", onSelectView: "viewSelected",
			  components: [
				{name: "about", kind: "TouchVol.About" },	
				{name: "app", kind: "TouchVol.App", onReqFile: "newfunc"},	
				{name: "file", kind: "TouchVol.Filebrowse", lazy:true, onSelectFile: "testfunc"},	
			  ]
		},
	],
	create: function() {
	// <REMINDER> update this on release
		this.version = "0.1.0";
		this.req = "";
		this.inherited(arguments);
		this.$.primary.selectViewByName("app");
	},
	testfunc: function(inSender, inFile) {
		this.$.primary.selectViewByName("app");	
		
		if (inFile) {
			//this.$.curValue2.setContent(inSender.name + " - " + inFile);
			if (this.req == "background") {
				this.$.app.setBackground("file", inFile);
			}
			if (this.req == "profile") {
				this.$.app.setPopupFile(inFile);
				//this.$.app.$.curValue.setContent("this was a profile req");
			}
		}
		else {
			if (this.req == "profile") {
				this.$.app.setPopupFile();
			}
		}
		this.req = "";
	},
	newfunc: function(inSender,inRequester){
		this.req = inRequester;
	},
		
	
});