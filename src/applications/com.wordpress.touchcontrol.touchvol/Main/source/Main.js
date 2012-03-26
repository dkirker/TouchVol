enyo.kind({
	name: "TouchVol.Main",
	kind: enyo.VFlexBox,
	components: 
	[
		{kind: "ApplicationEvents", onWindowParamsChange: "gotWindowParams"},
		{name: "primary", kind: "Pane", flex: 1, transitionKind: "enyo.transitions.Simple", onSelectView: "viewSelected",
			  components: [
				{name: "about", kind: "TouchVol.About" },	
				{name: "app", kind: "TouchVol.App", onReqFile: "newfunc"},	
				{name: "file", kind: "TouchVol.Filebrowse", lazy:true, onSelectFile: "testfunc"},	
			  ]
		},
	],
	gotWindowParams: function() {
		var params = enyo.windowParams;
		if (params.target) {
			this.$.app.importProfile(params.target);
		}
	},
	
	create: function() {
	// <REMINDER> update this on release
		this.version = "0.1.5";
		this.req = "";
		this.inherited(arguments);
		this.$.primary.selectViewByName("app");
	},
	testfunc: function(inSender, inFile) {
		this.$.primary.selectViewByName("app");	
		
		if (inFile) {
			if (this.req === "background") {
				this.$.app.setBackground("file", inFile);
			}
			if (this.req === "profile") {
				this.$.app.setPopupFile(inFile);
			}
		}
		else {
			if (this.req === "profile") {
				this.$.app.setPopupFile();
			}
		}
		this.req = "";
	},
	newfunc: function(inSender,inRequester){
		this.req = inRequester;
	},
		
	
});