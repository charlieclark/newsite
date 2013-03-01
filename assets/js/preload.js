var PRELOAD = new preloadClass(); 


function preloadClass(){

	var self = this;
	var allSections ;
	var sectionsLoaded = 0;

	var self = this;

	var preloadTracker = {};

	var currentTag;
	var currentPreloadObj;

	//event constants

	

	var preloadStarted = false;

	var groupSkipArray = [];


	this.init = function( sectionOrder , groupSkip){
		
	

		preloadData.allSections = sectionOrder;

		groupSkipArray = groupSkip;

		if(!preloadStarted)
		{
			preloadStarted = true;
			allSections = preloadData.allSections;
			self.loadNextSection();
		}
		
	}
	
	this.loadNextSection = function(){

		if( sectionsLoaded < allSections.length )
		{
			for( var i = 0 ; i < allSections.length ; i++)
			{	
				var tag = allSections[i];

				if(preloadTracker[tag] == undefined || !preloadTracker[tag].hasLoaded )
				{
					self.loadSection(tag);
					break
				}
			}
		}
		
	}

	this.loadSectionByIndex = function(index){
		self.loadSection( allSections[index] );
	}

	//initializes a preload with a tag
	this.loadSection = function(tag){


		if(currentTag && tag == currentTag || !allSections)
		{
			return;
		}

		prepareSection(tag);

		if( !currentPreloadObj.hasLoaded )
		{
			prepareNextGroup(tag);
		}

		
			
	}

	//setting number of elements to load

	this.numElementsToLoad = function( sectionTag , groupTag , num )
	{
		preloadTracker[sectionTag].groupObj[groupTag].numElementsToLoad = num;
	}

	//gets called when an element is loaded

	this.elementLoaded = function( type  , obj)
	{
		preloadTracker[obj.sectionTag].groupObj[obj.groupTag].elementArray[obj.tag] = obj;

		elementFinished(obj);

		checkElementLoadFinished(obj);
	}

	this.getSectionLength = function(sectionTag)
	{
		return preloadData.sections[sectionTag].length;
	}

	this.getGroupLength = function(groupTag)
	{
		var group = imageGroups[groupTag];

		if(group.array)
			return group.array.length;

	}



	function prepareSection( tag ){

		currentTag = tag;

		// dispatching event		
		var eventObj = sectionMetaData(tag);

		$(PRELOAD).trigger(PRELOAD.SECTION_STARTED , eventObj);
		
		//other stuff

		var isFirst = false;

		if( !preloadTracker[tag] )
		{
			var newObj = {};

			newObj.groupsLoaded = 0;
			newObj.hasLoaded = false;
			newObj.groupObj = {};
			newObj.groupsToLoad = 0;

			preloadTracker[tag] = newObj;
			isFirst = true;
		}
	

		currentPreloadObj = preloadTracker[tag];

		var sectionArray = preloadData.sections[tag];


		// var sectionArray = sectionData;

		//accounting for skipped groups
		var finalSectionArray = [];

		for( var i = 0 ; i < sectionArray.length ; i++)
		{
			var sectionSkipped = false;

			for( var j = 0 ; j < groupSkipArray.length ; j++)
			{
				if( sectionArray[i].tag == groupSkipArray[j])
				{
					sectionSkipped = true;
					break;
				}
			}

			if(!sectionSkipped)
				finalSectionArray.push(sectionArray[i]);
		}

		sectionArray = finalSectionArray;

		preloadTracker[tag].groupsToLoad = finalSectionArray.length;


		if(isFirst)
		{
			for( var i = 0 ; i < preloadTracker[tag].groupsToLoad ; i++)
			{
				var tempObj = {};

				tempObj.numElementsToLoad = 0;
				tempObj.numElementsLoaded = 0;
				tempObj.elementArray = [];

				var metaData = {
					"groupIndex" 	: i,
					"groupTag"		: finalSectionArray[i],
					"sectionIndex"	: getSectionIndex(tag),
					"sectionTag"	: tag

				}	



				tempObj.metaData = metaData;

				console.log(tempObj)

				preloadTracker[tag].groupObj[finalSectionArray[i]] = tempObj ;

			}
		}
	}

	function prepareNextGroup(sectionTag){



		var sectionArray = preloadData.sections[sectionTag];


		groupData = sectionArray[ currentPreloadObj.groupsLoaded ];

		var tag = groupData;
		

		//dispatching event
		var metaData = preloadTracker[currentTag].groupObj[tag].metaData;
		var eventObj = groupMetaData([] , metaData);
		$(PRELOAD).trigger(PRELOAD.GROUP_STARTED , eventObj);

		IMAGES.prepareImageGroup( tag , currentTag);


	}


	function checkElementLoadFinished(obj){

		var tag = obj.sectionTag;

		var sectionArray = preloadData.sections[tag];
		var groupTag =  sectionArray[ preloadTracker[tag].groupsLoaded ];

		var groupObj = preloadTracker[tag].groupObj[ groupTag];

		groupObj.numElementsLoaded ++;

		
		if(	groupObj.numElementsLoaded >= groupObj.numElementsToLoad)
		{

			groupFinished(tag , groupTag)
			checkGroupLoadFinished(tag);
		}

	}

	function checkGroupLoadFinished(tag){

		preloadTracker[tag].groupsLoaded++;

		if( preloadTracker[tag].groupsLoaded >= preloadTracker[tag].groupsToLoad)
		{
			sectionFinished( preloadTracker[tag] );
		}


		if(  preloadTracker[currentTag].groupsLoaded < currentPreloadObj.groupsToLoad && tag == currentTag)
		{		
			prepareNextGroup(currentTag);
		}
	

	}


	//scetion loaded triggers

	function elementFinished(obj){

		console.log("elementFinished")

		var sectionTag = obj.sectionTag;
		var groupTag = obj.groupTag;
		var metaData = preloadTracker[sectionTag].groupObj[groupTag].metaData;
		var eventObj = elementMetaData(obj , metaData); 

		$(PRELOAD).trigger( PRELOAD.ELEMENT_LOADED , eventObj);

	}


	function groupFinished(tag , tagClass){

		console.log("group finished")

		var metaData = preloadTracker[tag].groupObj[tagClass].metaData;
		var curElementArray = preloadTracker[tag].groupObj[tagClass].elementArray;

		var eventObj = groupMetaData( curElementArray , metaData);

		$(PRELOAD).trigger( PRELOAD.GROUP_LOADED , eventObj);
	
	}

	function sectionFinished(tag){

		console.log("section finished")

		var eventObj = sectionMetaData(tag);

		$(PRELOAD).trigger( PRELOAD.SECTION_LOADED , eventObj);

		currentPreloadObj.hasLoaded = true;
		sectionsLoaded++;
		self.loadNextSection();		
	}

	function elementMetaData(obj , metaData){

		var eventObj = {
			"type" 			: "element",
			"el"			: obj,
			"elementIndex" 	: obj.tag,
			"sectionTag" 	: metaData.sectionTag,
			"sectionIndex" 	: metaData.sectionIndex,
			"groupIndex" 	: metaData.groupIndex,
			"groupTag" 		: metaData.groupTag,
			"groupTagClass" : metaData.groupTagClass
		}

		return eventObj;

	}

	function groupMetaData( curElementArray , metaData ){

		var eventObj = {
			"type"			: "group",
			"sectionTag" 	: metaData.sectionTag,
			"sectionIndex" 	: metaData.sectionIndex,
			"groupIndex" 	: metaData.groupIndex,
			"groupTag" 		: metaData.groupTag,
			"groupTagClass" : metaData.groupTagClass,
			"elementArray"	: curElementArray
		}

		return eventObj;

	}

	function sectionMetaData(tag){

		var eventObj = {
			"type" 			: "section",
			"sectionTag" 	: tag,
			"sectionIndex" 	: getSectionIndex(tag)
		}

		return eventObj;

	}


	
	function getSectionIndex( tag ){

		//console.log(tag);

		for( var i = 0 ; i < allSections.length ; i++)
		{
			if(tag == allSections[i])
				return i;
		}
	}


}

PRELOAD.SECTION_STARTED = "section-started";
PRELOAD.SECTION_LOADED = "section-finished";

PRELOAD.GROUP_STARTED = "group-started";
PRELOAD.GROUP_LOADED 	= "group-finished";

PRELOAD.ELEMENT_STARTED = "element-started";
PRELOAD.ELEMENT_LOADED = "element-finished";

//IMAGE LOADER

var IMAGES = new imageLoader();

function imageLoader(){

	this.preloadObj = {
		preloadArray :[]
	};

	this.allImageArray = [];

	var self = this;
	var urlBase = preloadData.imagePath;;

	var setData;
	var setArray;
	var preloadImageArray = [];

	var totalImagesLoaded = 0;

	var preloadRef = PRELOAD;

	this.prepareImageGroup = function(groupTag , sectionTag){

		setData = imageGroups[groupTag];

		preloadImageArray.length = 0;
	

			//check if is array or list

			var types = ["array" , "list" , "selector"];
			var type = null;

			for( var i = 0 ; i < types.length ; i++)
			{
				if(setData[types[i]])
				{
					type = types[i];
					break;
				}
					
			}

			if( type == "array" )
			{
				prepareGroup(groupTag , sectionTag);
			}

			else if(type == "list")
			{
				prepareList(groupTag , sectionTag);
			}

			else if(type == "selector")
			{
				prepareSelector(groupTag , sectionTag);
			}
			else if(type == null)
			{
				//is single
				prepareSingle(groupTag , sectionTag);
			}



		

		
 			

	}

	this.loadImage = function(index){

		var tempImg = preloadImageArray[index];


		tempImg.src = tempImg.preSrc;

		tempImg.onload = function(){
				var imgDim = {w:this.width , h:this.height};
				this.imgDim = imgDim;
				self.loadHandler(this);
			}

			return tempImg;
		

	}

	this.loadHandler = function(obj){



		totalImagesLoaded++;
		obj.overallTag = totalImagesLoaded;
		this.allImageArray.push( obj );


		preloadRef.elementLoaded( "image" , obj );

	}

	function prepareSingle(groupTag , sectionTag){

		var tag = groupTag;

		var img = setData;


		preloadRef.numElementsToLoad( sectionTag , groupTag , 1 );

	
			var tempImg = new Image;

			tempImg.data = img;
			tempImg.globalData = setData;
			tempImg.tag = 0;
			tempImg.groupTag = tag;
			tempImg.sectionTag = sectionTag;

			tempImg.preSrc = urlBase + img.url;
			tempImg.name = img.name;

			preloadImageArray.push( tempImg );

			tempImg.onload = function(){
				var imgDim = {w:this.width , h:this.height};
				this.imgDim = imgDim;
				self.loadHandler(this);
			}

			tempImg.src = tempImg.preSrc;


	}


	function prepareList(groupTag , sectionTag){

		var setList = setData.data;
		var tag = groupTag;

		var startNum = setList.startNum;

		var imagesToLoad = setList.numImages - startNum;

		preloadRef.numElementsToLoad( sectionTag , groupTag , imagesToLoad );

		for( var i = 0 ; i < imagesToLoad ; i++)
		{
			var tempImg = new Image;
		
			tempImg.tag = i;
			tempImg.groupTag = tag;
			tempImg.sectionTag = sectionTag;
			//list difference

			var paddedNumber = 1;

			var tempStartNum = startNum + i;
	
			if(setList.padding )
			{
				if(setList.padding != 1)
				{
					paddedNumber = self.zeroPad( tempStartNum , setList.padding  );
				}
				else
				{
					paddedNumber = tempStartNum;
				}
				
			}
				

			var tempSrc = urlBase + setList.url + paddedNumber + setList.extension ;

			tempImg.preSrc = tempSrc ;

			preloadImageArray.push( tempImg );




			tempImg.onload = function(){
				var imgDim = {w:this.width , h:this.height};
				this.imgDim = imgDim;
				self.loadHandler(this);
			}



			tempImg.src = tempImg.preSrc;
		}

	}

	function prepareGroup(groupTag , sectionTag){


		var tag = groupTag;

		var setArray = setData.array;

		var imagesToLoad = setArray.length;

		preloadRef.numElementsToLoad( sectionTag , groupTag , imagesToLoad );

		for( var i = 0 ; i < setArray.length ; i++)
		{
			var tempImg = new Image;

			tempImg.data = setArray[i];
			tempImg.globalData = setData;
			tempImg.tag = i;
			tempImg.groupTag = tag;
			tempImg.sectionTag = sectionTag;

			console.log(urlBase)
			tempImg.preSrc = urlBase + setArray[i].url;
			tempImg.name = setArray[i].name;

			preloadImageArray.push( tempImg );

			tempImg.onload = function(){
				var imgDim = {w:this.width , h:this.height};
				this.imgDim = imgDim;
				self.loadHandler(this);
			}

			tempImg.src = tempImg.preSrc;

		}

	}

	function prepareSelector(groupTag , sectionTag){

		var selectorInfo = setData.data;
		var tag = groupTag;


		var selection = $( selectorInfo.selector );
		var imagesToLoad = selection.length;

		preloadRef.numElementsToLoad( sectionTag , groupTag , imagesToLoad );

		for( var i = 0 ; i < imagesToLoad ; i++)
		{
			var tempImg = new Image;

			tempImg.globalData = setData;
			tempImg.tag = i;
			tempImg.groupTag = tag;

			//specific to selector
			tempImg.preSrc = selection.eq(i).attr("src");

			preloadImageArray.push( tempImg );
		}
	}

	//utils

	this.zeroPad = function(num, size) 
   {
       var s = "000000000000" + num;
       return s.substr(s.length-size);
   }

	

	this.findImage = function(tag){

		for( var i = 0 ; i <  IMAGES.allImageArray.length ; i++)
		{
			var img = IMAGES.allImageArray[i];
			if( img.data.name == tag )
				return img;
		}

	}
	
}


function assetDataBuilder(){

	// init: function(){

	// 	console.log("color found");

	// 	var groupArray = [];
	// 	var self = assetDataBuilder;

	// 	for( var i = 0 ; i < preloadData.allSections.length ; i++)
	// 	{

	// 		console.log("color found");
	// 		var sectionArray = preloadData.sections[preloadData.allSections[i]].preloadArray;
	// 		console.log(sectionArray);
	// 		for( var j = 0 ; j < sectionArray.length ; j++ )
	// 		{
	// 			console.log("color found");
	// 			if(sectionArray[j].autoBuild)
	// 			{
	// 				groupArray.push(sectionArray[j]);
	// 			}
	// 		}
	// 	}


	// 	for( var i = 0 ; i < groupArray.length ; i++)
	// 	{
	// 		var tempObj = self.buildGroup(groupArray[i]);

	// 		console.log(tempObj);
	// 	}
	// },

	// buildGroup : function(obj)
	// {
	// 	var tag = obj.tag;
	// 	var tagClass = obj.tagClass;
	// 	var tagClassArray = tagClass.split("/");

	// 	console.log("color found");

	// 	if( arrayContains( tagClassArray , "color-sequence").truth ||  arrayContains( tagClassArray , "alpha-sequence").truth )
	// 	{
	// 		var colorArray = ["alpha" , "beige"];

	// 		for( var i = 0 ; i < colorArray.length ; i++)
	// 		{
	// 			console.log("color found");

	// 			if( arrayContains( colorArray[i] , tagClassArray ).truth)
	// 			{
	// 				console.log("color found");
	// 			}
	// 		}

	// 		var tempData = 
	// 			{
	// 				url : "sprites/" + colorArray[i],
	// 				extension: ".jpg",
	// 				numImages : 16,
	// 				padding: 1,
	// 				startNum: 1

	// 			}

	// 			return assetDataBuilder.returnObjBuild( tag , tempData , "list");
	// 	}

		
	// },

	// returnObjBuild : function( tag , data , type)
	// {
	// 	var returnObj = {
	// 		"name" : tag,
	// 		"data" : data
	// 	}

	// 	return returnObj;
	// }
}




