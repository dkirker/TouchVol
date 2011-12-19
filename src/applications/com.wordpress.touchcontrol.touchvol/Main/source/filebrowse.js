/* Much of this function is currently modeled on 'Filebrowser' object of Touchplayer by Zachary Burke - mobilecoder.wordpress.com.  
And while this does not use an explicit copy of that material, I feel credit is due until such time as I rework it to be less similar.
In any event it was exceptionally useful as a model to reference for easy use of Filemgr services (by Jason Robitaille - canuck-software.ca)
*/
enyo.kind({
	name: "TouchVol.Filebrowse",
	kind: enyo.VFlexBox,	
	events: { 
        onSelectFile: ""
  },
	components: [
		{kind: "PalmService", name: "listDirs", service: "palm://ca.canucksoftware.filemgr", method: "listDirs", onSuccess: "gotDirs", onFailure: "errorMessage"},
		{kind: "PalmService", name: "listFiles", service: "palm://ca.canucksoftware.filemgr", method: "listFiles", onSuccess: "gotFiles", onFailure: "errorMessage"},
		{kind: "PalmService", name: "getParent", service: "palm://ca.canucksoftware.filemgr", method: "getParent", onSuccess: "gotParent", onFailure: "errorMessage"},
		
		{kind: "ModalDialog", name: "errorPopup", showKeyboardWhenOpening: false,  layoutKind: "VFlexLayout", caption: "Error Processing last selection, try again.", 
			components: [
				{kind: "Button", caption: "OK", popupHandler: "OK"},
			]
		},
	
		{kind: "HFlexBox", name:"Top", components: [  
			{kind: "VFlexBox", name:"Left", components: [  ]},
			{kind: "VFlexBox", name:"Right", components: [  ]},
		]},
		
		{kind: "VFlexBox", flex: 2,
		components: [
			{kind: "PageHeader", layoutKind: "VFlexLayout",	align: "left", className: "enyo-header-dark",	
				components: [
					{kind: "HFlexBox", components: [  
						{content: "Current Path"},
						{flex:1},
						{kind:"Button", name:"internal", pack:"right", style:"background-color:#2C6399;color:white", caption:"/media/internal", onclick:"changeRoot"},
						{kind:"Button", name:"appspace", pack:"right", style:"background-color:#2C6399;color:white", caption:"App images", onclick:"changeRoot"},
					]},
					{name: "pathText", content: "", className: "enyo-item-secondary"}
				]},
			{kind: "VirtualList", name: "list", onSetupRow: "getSearchListItem", flex: 1,
					components: [
					{kind: "HFlexBox", flex: 1, style:"border-bottom:1px solid;border-color:#2C6399", onclick: "selectItem",
						components: [
							{kind: "Image", name: "icon", style: "padding: 2px; margin-right:10px; height: 24px;"},
							{name: "entry"} ]
					}
					]
			},
			{kind: "PageHeader", layoutKind: "VFlexLayout",	align: "center", className: "enyo-header-dark",	
				components: [
					{kind:"Button", name:"Cancel", style:"background-color:red;color:white", pack:"center", caption:"Cancel", onclick:"cancelFilebrowse"},
				]
			},
		]}
	],
	
	create: function() {
		this.inherited(arguments);
		currentDirectory = "/media/internal/";
		array = [];
		this.navigate(currentDirectory, true);
	
		if (innerWidth < 500 || innerHeight < 500) {
			//var sheet = this.document.styleSheets[0];
			//sheet.insertRule(".enyo-button { padding:2px;}", sheet.cssRules.length);
			//sheet.insertRule(".enyo-header-inner { padding:1px;}", sheet.cssRules.length);
			// so when can i actually override sheets?  oh look undocumented functions...dammitall 
			enyo.loadSheet("source/pre3.css");
		}
	},
	
	gotFiles: function(inSender, inFiles){
		for(var i = 0; i < inFiles.items.length; i++){
		array.push( {item: array.length,
			label: inFiles.items[i].name,
			value: inFiles.items[i].path,
			type: "file"});
		}
		this.$.list.refresh();
	},
	
	gotDirs: function(inSender, inDirs){
		for(var i = 0; i < inDirs.items.length; i++){
			array.push( {item: array.length,
				label: inDirs.items[i].name,
				value: inDirs.items[i].path,
				type: "dir"});
		}
		this.$.list.refresh();
		this.$.listFiles.call({path: currentDirectory});
	},
	
	navigate: function(path, refresh){
		currentDirectory = path;
		this.$.pathText.setContent(currentDirectory);
		
		array = [];
		
		if(refresh){
			this.$.list.punt();
		}
		
		array.push({item:array.length, label: "..", value: "parent", type: "parent"});
		this.$.listDirs.call({path: currentDirectory});
	},
	
	getSearchListItem: function(inSender, inIndex){
		if(array[inIndex]){
			if(array[inIndex].type == "dir") {
				this.$.icon.setSrc("source/images/folder.png");
			}
			if(array[inIndex].type == "file") {
				this.$.icon.setSrc("source/images/file.png");
			}
			this.$.entry.setContent(array[inIndex].label);			
			return true;
		}
	},
	
	selectItem: function(inSender, inEvent){
		if(array[inEvent.rowIndex]){
			var item = array[inEvent.rowIndex];
			if(item.type == "file"){
				//inSender.setStyle("background-color:#2C6399");
				this.doSelectFile(item.value);
			}
			else if(item.type == "dir"){
				this.navigate(item.value, true);
			}
			else if(item.type == "parent"){
				this.$.getParent.call({file: currentDirectory});
				//this.doSelectFile("some file name");
			}
		}
	},
	
	gotParent: function(inSender, parent){
		this.navigate(parent.parent, true);
	},
	
	errorMessage: function(inSender){
		this.$.errorPopup.openAtCenter();
	},
	cancelFilebrowse: function(){
		//this.owner.$.primary.selectViewByName("app");	
		this.doSelectFile();
	},
	changeRoot: function(inSender) {
		var dir = "";
		if (inSender.name == "internal") {
			dir = "/media/internal";
		}
		if (inSender.name == "appspace") {
			dir = "/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/Main/source/images";
		}
		this.navigate(dir, true);
	}
		
});