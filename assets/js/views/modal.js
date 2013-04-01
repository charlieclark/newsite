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

		//clearing previous
		el.empty();

		//getting context/information
		copyContext = context.copyContext;
		imgArray = context.imgArray;
		thumb = context.thumb;
		imageCopyArray = copyContext.imgCopy;
		compileTemplate( "modal-template" , copyContext , el);
	
		//showing div
		resize();
		el.slideDown("slow" , function(){
			GALLERY.init(imgArray);
		});

		//close modal
		$(".modal-close").click(function(){
			self.hideModal();
		});

		
	}

	self.hideModal = function(){

		//fading stuff out, then closing

		$(".modal-imageGallery").fadeOut("slow" , function(){
			el.slideUp();
		})
	}

	self.resize = function(){
		resize();
	}



	

	

	function resize(){
		$("#modal").width( $("#work").width() - parseInt($(".work-box").css("margin")) *2 );

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