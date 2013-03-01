var LAYOUT = new layoutClass(); 


function layoutClass(){
		
		var self = this;

		var numBoxes = 20;
		var curWidth = null;

		var maxWidth = null ;

		//box specific

		var boxMargin = 5;
		var minBoxWidth = 300;
		var maxBoxWidth = 400;
		var maxBoxPerRow = 3;
		var boxAr = 2;

		//object arrays

		var boxArray = [];
		var workBoxesLoaded = 0;




		self.init = function(){

			//pre init
			// numBoxes = PRELOAD.getSectionLength("global");

			//init
			initWork();
			addEventListeners();


		}

		self.resize = function(){
			resize();
		}


		//listening for loads

		function addEventListeners(){

			$(PRELOAD).on( PRELOAD.GROUP_LOADED , function(event,data){ 
				var groupTag = data.groupTag;

				if( groupTag.indexOf("workBox") >= 0 )
				{
					loadWorkBox(data);
				}
			});
		}

		//loadHandlers

		function loadWorkBox(data)
		{
			var elements = data.elementArray;
			var workBoxTag = data.groupTag;
			var boxEl =  $(".work-box").eq(workBoxesLoaded);

			//compiling template copy
			var boxCopy = copyData.workBoxes[workBoxTag];
			var html = compileTemplate("test-template" , boxCopy , boxEl);

			//creating box class with functionality
			var tempBox = new workBoxClass( boxEl , elements , {});
			
			boxArray.push(tempBox);

			workBoxesLoaded++;
		}


		//initing views

		function initWork(){
			
			for( var i = 0 ; i <  numBoxes ; i++)
			{
				//building box containers
				var tempBox = $("<div>" , {
					"class" : "work-box"
				}).appendTo( $("#work") );

				//initing work class
				

			}

			maxWidth = maxBoxWidth * maxBoxPerRow;
		}

		function resize(){

			//general resize

			curWidth = CONFIG.windowWidth;

			if( curWidth > maxWidth)
			{
				curWidth =  maxWidth ;
			}
	
			//figuring out box dim

			var curBoxPerRow = Math.floor( curWidth / ( maxBoxWidth ) );

			var newBoxWidth = curWidth / curBoxPerRow;

			if(newBoxWidth > maxBoxWidth)
			{
				curBoxPerRow++;
			}

			newBoxWidth = curWidth / curBoxPerRow;
			newBoxWidth = Math.max( newBoxWidth , minBoxWidth)

			var numColumns;

			if(curWidth > newBoxWidth)
			{
				numColumns = Math.floor(curWidth / newBoxWidth);
			}
			else
			{
				numColumns = 1;
				newBoxWidth = curWidth;
			}

			newBoxWidth = curWidth / numColumns;

			newBoxWidth = Math.min( newBoxWidth , maxBoxWidth )

			var newBoxHeight = newBoxWidth / boxAr;

			var numRows = Math.ceil( numBoxes / numColumns );

	
			$(".work-box").css({
				"height" : newBoxHeight- boxMargin *2,
				"width"	: newBoxWidth - boxMargin *2,
				"margin" : boxMargin
			});

			//margin on last row to center
			//first box of last row
			
			if(numColumns > 1)
			{
				var fBlR = ( numRows - 1) * numColumns ;
				$(".work-box").eq(fBlR).addClass("fBlR");
				var fBlROffset = (curWidth - (numBoxes - fBlR) * newBoxWidth)/2 + boxMargin;
				$(".fBlR").css("margin-left" , fBlROffset);
			}
			 	
			//resizing container

			$("#work").css({
				"width" : newBoxWidth * numColumns ,
				"height" : newBoxHeight * numRows	
			});

			//individual resize ong boxes

			for( var i = 0 ; i < boxArray.length ; i++)
			{
				boxArray[i].resize();
			}

		}

}

