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
			
			addEventListeners();

			


		}

		self.resize = function(){
			resize();
		}


		//listening for loads

		function addEventListeners(){

			$(PRELOAD).on( PRELOAD.GROUP_LOADED , function(event,data){ 
				var groupTag = data.groupTag;
				var elementArray = data.elementArray;

				if( groupTag.indexOf("thumbnails") >= 0 )
				{
					initWorkBoxes(elementArray);

				}

				if( groupTag.indexOf("project") >= 0 )
				{
					loadWorkBoxImages(elementArray , groupTag);
				}
			});
		}

		//loadHandlers

		function loadWorkBoxImages(images , groupTag)
		{

			for( var i = 0 ; i < boxArray.length ; i++)
			{
				if(boxArray[i].tag == groupTag)
				{
					boxArray[i].imagesLoaded(images);
				}
			}
		
			workBoxesLoaded++;
		}


		//initing views

		function initWorkBoxes( images ){

			
			for( var i = 0 ; i <  numBoxes ; i++)
			{
				var tempBox = $("<div>" , {
					"class" : "work-box"
				}).appendTo( $("#work") );
				
			}

			for( var i = 0 ; i < images.length ; i++)
			{
				
				var tag = images[i].name;
				var boxEl =  $(".work-box").eq(i);

				//compiling template copy
				var boxCopy = copyData.workBoxes[tag];
				var html = compileTemplate("test-template" , boxCopy , boxEl);
				//init box class
				var tempBox = new workBoxClass( tag , boxEl , images[i] , boxCopy , {});
				boxArray.push(tempBox);
			}

			workBoxTouchListeners();
			maxWidth = maxBoxWidth * maxBoxPerRow;
			resize();
		}

		function workBoxTouchListeners(){
			$(".work-box").hover( 
				function(){
					$(this).find(".workBox-copy").show();	
				},
				function(){
					$(this).find(".workBox-copy").hide();
				}
			).click(function(){

				var index = $(this).index();
				var context = {};
				context.copyContext = boxArray[index].copy;
				context.imgArray = boxArray[index].imgArray;
				context.thumb = boxArray[index].thumb;

				MODAL.showModal(context);

			})
		}



		function resize(){

			//general resize

			curWidth = CONFIG.windowWidth * 0.9;

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

