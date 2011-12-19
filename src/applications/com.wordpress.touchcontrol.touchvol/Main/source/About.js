enyo.kind({
	name: "TouchVol.About",
	kind: enyo.VFlexBox,
	components: [
	{name: "AppManager", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
	{kind: "ApplicationEvents", onLoad: "startup"},
	{kind: "PageHeader", className:"enyo-header-dark", components: [
		{kind: "HFlexBox", flex:1, components: [
			{content: "<h1><p>TouchVol<p></h1>", style:"color:lightgray"},
			{content: "version", style:"padding-top:30px;font-weight:bold;color:lightgray", name: "versionNumber"},
			//{content: "prerelease-5", style:"padding-top:30px;font-weight:bold;color:lightgray"},
			{flex:1},
			{kind: "Image", name:"donateButton", style:"margin-top:10px", src:"source/images/paypal.gif", onclick:"goWeb"}
		]}
		]},
	{kind: "VFlexBox", components: [
		{content: "A graphical eq for the Touchpad", style:"padding-left:25px;padding-top:5px;font-size:12pt"},
		{content: "and Pre3* under webOS",style:"padding-left:55px;font-size:8pt"} 
	]},
	{kind: "Scroller", flex: 1, components: [
		{kind: "DividerDrawer", caption: "Version History:", open:false, components:[
			{content:"0.0.1 - Initial release."},
			{content:"0.0.2 - Re-release of 0.0.1 to resolve feed issue."},
			{content:"0.0.3 - Bugfix release.  Replace alsactl state loader with ash script to avoid 'muted audio' issue."},
			{content:"0.1.0 - Feature release.  Adds profiles, backgrounds, volume key tracking in media mode, pre3 tweaks, this 'About screen', Launchpoints, launch handler, etc."}
		]},
		{kind: "DividerDrawer", caption: "Usage Guide:", open:false, components:[
		{content:"First and foremost this application's primary platform is the Touchpad. Accomodations will be made when possible for the Pre3.<br><br>"},
		{content:"If you wish to see it improve, come visit us in the Forum and offer to do testing, especially for Pre3 owners.<br><br>"},
		{content:"More Detail will be put in later."}
		]},
		{kind: "DividerDrawer", caption: "Related Links", open:false, components:[
			{kind: "VFlexBox", components: [
				{kind: "RowGroup", components:[
				{kind: "HFlexBox", tapHighlight:true, pack:"center", components: [{name:"appBlog", content: "Touchcontrol blog", onclick:"goWeb"}]},
				{kind: "HFlexBox", tapHighlight:true, pack:"center", components: [{name:"appPage", content: "Precentral App page", onclick:"goWeb"}]},
				{kind: "HFlexBox", tapHighlight:true, pack:"center", components:[ {name:"appThread", content: "Precentral Forum Thread", onclick:"goWeb"}]} 
				]}
			]}
		]},
		{kind: "DividerDrawer", caption: "License Information", open:false, components:[
			{kind: "VFlexBox", components: [
				{kind: "HtmlContent", srcId: "myContent"},
			]}
		]},
		{flex:1},
		{kind: "PageHeader", className:"enyo-header-dark", pack:"center", components: [
		{kind: "Button", name:"Cancel", width:"200px", style:"background-color:red;color:white", pack:"center", caption:"Cancel", onclick:"cancelAbout"}
		]}
		]}
		],
	
	startup: function() {
		this.$.versionNumber.setContent(this.owner.version);
		for (i in this.$.dividerDrawer.controls) {
			
			if (this.$.dividerDrawer.controls[i].content.slice(0,5) == this.$.versionNumber.content) {
				this.$.dividerDrawer.controls[i].applyStyle("background-color", "cornflowerblue");
				break;
			}
			
		}
	},
	
	goWeb: function(inSender) {
		if (inSender.name == "appBlog") {
			this.$.AppManager.call({target: "http://touchcontrol.wordpress.com"});
		}
		if (inSender.name == "appPage") {
			this.$.AppManager.call({target: "http://precentral.net/touchvol"});
		}
		if (inSender.name == "appThread") {
			this.$.AppManager.call({target: "http://forums.precentral.net/webos-homebrew-apps/304265-touchvol.html"});
		}
		if (inSender.name == "donateButton") {
			this.$.AppManager.call({target: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YXRMHUUSG3BMW"});
		}
	},
	cancelAbout: function(){
		this.owner.$.primary.selectViewByName("app");	
	},
	
	
	})