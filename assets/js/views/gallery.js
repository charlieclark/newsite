var GALLERY = new galleryClass();

function galleryClass(){
	var self = this;

	var slideShowTimer = null;
	var curImageIndex = 0;

	self.init = function(imgArray){

		var galleryWidth = 0;

		for( var i = 0 ; i < imgArray.length ; i++)
		{
			var div = $("<div>" , {
				"class" : "imgArray"
			}).html(imgArray[i]).appendTo(".modal-imageGallery");//.hide();

		}	

		showImage(0);
		startSlideShow();
		
	}

	self.resize = function(){
		resize()
	}

	function startSlideShow(){

		if(slideShowTimer)
			clearTimeout(slideShowTimer);

		slideShowTimer = setInterval(function(){
			changeImage(1);
		} , 4000);

	}

	function changeImage(dir){

		var newIndex;

		if(dir == 1)
		{
			newIndex = curImageIndex + 1;
		}
		else if(dir==-1)
		{
			newIndex = curImageIndex -1;
		}

		if(newIndex >= imgArray.length)
			newIndex = 0;
		else if(newIndex <= 0)
			newIndex = imgArray.length-1;

		showImage(newIndex)
	}

	function showImage(index){

		curImageIndex = index;
		var active = $(".imgArray.active");



		// if(active.length)
		// {
		// 	active.removeClass("active").fadeOut(3000);
		// 	$(".imgArray").eq(index).addClass("active").fadeIn(3000);
		// }
		// else{
		// 		$(".imgArray").eq(index).addClass("active").fadeIn(3000);
		// }

		
		
	}

	function resize(){
		//resizing modal gallery images

		$(".imgArray").each(function(){
		 	var img = $(this).find("img")[0]
			var imgDim = UTILS.resizeWithExcessCalc( img.imgDim.w ,  img.imgDim.h , 0 , $(".modal-imageGallery").width() , $(".modal-imageGallery").height()  )

			$(this).css({
				"width" : imgDim.w,
				"height" : imgDim.h,
				"top" : imgDim.t,
				"left": imgDim.l
			})
		})
	}
}