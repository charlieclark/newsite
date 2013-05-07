var GALLERY = new galleryClass();

function galleryClass(){
	var self = this;

	var slideShowTimer = null;
	var curImageIndex = 1; //image index shown
	var galleryHeight = 300;
	var prevDir = null;
	var cancelAnimate = false;
	var galleryAnimating = false;
	var overallDir = 1;

	self.init = function(imgArray){

		cancelAnimate = false;

		var galleryWidth = 0;

		for( var i = 0 ; i < imgArray.length ; i++)
		{
			var div = $("<div>" , {
				"class" : "imgArray"  
			}).html(imgArray[i]).appendTo(".modal-galleryContainer");//.hide();

			div.attr("data-tag" , i);

		}

		resize();
		showImage(-1 , false);
		showImage(-1 , false);
		startSlideShow();

		$(".galleryButton").click(function(){
			if($(this).hasClass("next"))
			{
				changeImage(1);
			}
			else
			{
				changeImage(-1);
			}
		});
		
		
	}
	self.reset = function(){
		slideShowTimer = null;
		$(".modal-galleryContainer").empty();
		cancelAnimate = true;

	}

	self.resize = function(){
		resize()
	}

	function startSlideShow(){

		if(slideShowTimer)
			clearTimeout(slideShowTimer);

		slideShowTimer = setTimeout(function(){
			if(!cancelAnimate)
			{
				changeImage(overallDir);
				
			}

			
		} , 4000);

	}

	function changeImage(dir){

		if(galleryAnimating)
		{
			return;
		}

		overallDir = dir;
		var newIndex;

		showImage(dir , true);
		startSlideShow();



		// if(dir == 1)
		// {
		// 	newIndex = curImageIndex + 1;
		// }
		// else if(dir==-1)
		// {
		// 	newIndex = curImageIndex -1;
		// }

		// // if(newIndex >= imgArray.length)
		// // 	newIndex = 0;
		// // else if(newIndex <= 0)
		// // 	newIndex = imgArray.length-1;

		// showImage(newIndex)
	}

	function showImage(dir , animate){

		if(dir == -1 && prevDir == 1)
		{
			$(".imgArray").first().before( $(".imgArray").last() );
			var newLeft =  - $(".imgArray").eq(2).position().left +  $(".modal-imageGallery").width()/2  - $(".imgArray").eq(2).width()/2;
			$(".modal-galleryContainer").css("left" , newLeft);
		}
		else if(dir == 1 && prevDir == -1)
		{
			$(".imgArray").last().after( $(".imgArray").first() );
			var newLeft =  - $(".imgArray").eq(1).position().left +  $(".modal-imageGallery").width()/2  - $(".imgArray").eq(2).width()/2;
			$(".modal-galleryContainer").css("left" , newLeft);
		}



		var curDiv =  !!(dir == 1) ? $(".imgArray").eq(1) : $(".imgArray").eq(2) ;
		var nextDiv =  !!(dir == 1) ? $(".imgArray").eq(2) : $(".imgArray").eq(1) ;



		$(".imgArray").removeClass("active");
		nextDiv.addClass("active");

		var curLeft = $(".modal-imageGallery").position().left;

		console.log(nextDiv.position().left);

		var moveChange = -nextDiv.position().left  + $(".modal-imageGallery").width()/2  - nextDiv.width()/2; //curLeft  ;

		galleryAnimating = true;

		$(".modal-galleryContainer").animate({"left" : moveChange} , animate ? 700 : 0 ,  function(){

			var divToMove = !!(dir == 1) ? $(".imgArray").first() : $(".imgArray").last() ;
			var moveNext = !!(dir == 1) ? $(".imgArray").last() : $(".imgArray").first() ;
			
			galleryAnimating = false;
			!!(dir == 1) ? moveNext.after( divToMove ) : moveNext.before(divToMove) ;

			if(dir == 1)
			{
				var newLeft =  - $(".imgArray").first().width() + $(".modal-imageGallery").width()/2  - nextDiv.width()/2;

			}
			else
			{
				var newLeft =  - $(".imgArray").eq(2).position().left +  $(".modal-imageGallery").width()/2  - $(".imgArray").eq(2).width()/2;

			}

			
			$(this).css("left" , newLeft)

			prevDir = dir;

			MODAL.showImageCopy( $(".imgArray.active").attr("data-tag") );

		} );
	
		
	}

	function resize(){
		//resizing modal gallery images

		$(".modal-imageGallery").css({
			"height" : galleryHeight
		})

		$(".imgArray").each(function(){
		 	var img = $(this).find("img")[0];

		 	var height = galleryHeight;
		 	var ratio = height / img.imgDim.h;
		 	var width = Math.floor(img.imgDim.w * ratio);


			// var imgDim = UTILS.resizeWithExcessCalc( img.imgDim.w ,  img.imgDim.h , 0 , $(".modal-imageGallery").width() , $(".modal-imageGallery").height()  )

			$(this).css({
				"width" : width,
				"height" : height,
				// "top" : imgDim.t,
				// "left": imgDim.l
			})
		})
	}
}