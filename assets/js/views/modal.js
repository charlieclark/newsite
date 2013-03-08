var MODAL = new modalClass();

function modalClass(){

	var self = this;
	var copyContext = null;
	var imageArray = null;
	var thumb = null;
	var imageCopyArray = null;
	var el = null;

	self.init = function(_el){

		if(_el)
		{
			el = _el;
		}
		else
		{
			el = $("#modal");
		}

	}
	self.showModal = function(context){

		
		el.empty();

		copyContext = context.copyContext;
		imgArray = context.imgArray;
		thumb = context.thumb;

		imageCopyArray = copyContext.imgCopy;

		compileTemplate( "modal-template" , copyContext , el);

		//image gallery

		initGallery(imgArray)

	
		el.slideDown();

		
		

		$(".modal-close").click(function(){
			self.hideModal();
		});

		resize();
	

	}

	self.hideModal = function(){
		el.slideUp();
	}

	self.resize = function(){
		resize();
	}

	function initGallery(imgArray){

		var galleryWidth = 0;

		for( var i = 0 ; i < imgArray.length ; i++)
		{
			var div = $("<div>" , {
				"class" : "imgArray"
			}).html(imgArray[i]).appendTo(".modal-imageGallery");

		}	

	}

	function resize(){
		$("#modal").width( $("#work").width() - parseInt($(".work-box").css("margin")) *2 );

			//resizing modal gallery images

		$(".imgArray").each(function(){
		 	var img = $(this).find("img")[0]
			var imgDim = UTILS.resizeWithExcessCalc( img.imgDim.w ,  img.imgDim.h , 0 , $(".modal-imageGallery").width() , $(".modal-imageGallery").height()  )

			console.log(img.imgDim.w)
			$(this).css({
				"width" : imgDim.w,
				"height" : imgDim.h,
				"top" : imgDim.t,
				"left": imgDim.l
			})
			 console.log(imgDim);
		})
		
	}

}