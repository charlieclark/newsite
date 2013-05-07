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

		
		
		var hasGoneLower = false;




		self.init = function(){


			window.addEventListener('DOMMouseScroll', handleScroll, false);
			window.onmousewheel = document.onmousewheel = handleScroll;

			$("body").addClass("splashMode")

			//pre init
			// numBoxes = PRELOAD.getSectionLength("global");

			//init
			
			addEventListeners();

			//scroll listener

			window.scrollTo(0,0);

			$(window).scroll(function(){
				// if($(this).css("scrollTop"))

				if( $(this).scrollTop() > minScroll )
				{
					hasGoneLower = true;
				}
				else
				{
					if(hasGoneLower)
					{
						// triggerMenu(false);
						hasGoneLower = false;
					}
					
				}
			})

			


		}

		self.resize = function(){
			resize();
		}

		self.triggerMenu = function(truth){
			triggerMenu(truth)
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

		function handleScroll(evt){

			

			if(!isMenuOpen)
			{
				evt.preventDefault();
				triggerMenu(true);
			}

		}

		function triggerMenu(truth){
			if(truth == isMenuOpen || splashAnimating)
			{
				return;
			}
			
			console.log("Getting called")

			if(truth)
			{
				splashAnimating = true;
				BASIC.stopAnimating();

				$("#title").fadeOut();

				$("#splash").animate({
					"height" : menuOffset
				} , 1000 , function(){
					$("#work").fadeIn();
					isMenuOpen = true;
					splashAnimating = false;
					BASIC.menuCenter();
				})

				// setTimeout(function(){

				// 	$("#splash").animate({
					
				
				// } , 2000 , function(){

				// function(){
				// 		$("#work").fadeIn();
				// 		splashAnimating = false;
				// 	})
	

			


				// } , 200)

				
			}
			else
			{
				splashAnimating = true;
				$("#work").fadeOut("fast" , function(){
					$("#splash").animate({
					"height" : CONFIG.windowHeight
				} , 1000 , function(){
					BASIC.startAnimating();
					$("#title").fadeIn();
					splashAnimating = false;
					isMenuOpen = false;
				});


				});


				
			}
		}



		function resize(){

			//general resize

			$("#main-content").css("height" , CONFIG.windowHeight - menuOffset);

			

			curWidth = CONFIG.windowWidth - (siteOffset * 2) + boxMargin *2;

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

