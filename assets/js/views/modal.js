var MODAL = new modalClass();

function modalClass(){

	var self = this;
	var copyContext = null;
	var imageArray = null;
	var thumb = null;
	var imageCopyArray = null;
	var el = null;
	var galleryAnimating = false;
	

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

		if(galleryAnimating)
		{
			return;
		}

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
		galleryAnimating = true;
		el.slideDown("slow" , function(){
			GALLERY.init(imgArray);
			$(".modal-imageGallery").hide().fadeIn("slow" , function(){
				galleryAnimating = false;
			})
		});

		//close modal
		$(".modal-close").click(function(){
			if(!galleryAnimating)
			{
				self.hideModal();
			}
			
		});

		
	}

	self.showImageCopy = function(index){

		var copyEl = $(".modal-image-copy");

		if(copyEl.html().length > 0)
		{
			copyEl.fadeOut("slow" , function(){
				changeCopy()
			});
		}
		else
		{
			copyEl.hide();
			changeCopy();
		}

		function changeCopy(){
			var curCopy = "";
			for( var i = 0 ; i < imageCopyArray.length ; i++)
			{
				console.log(imageCopyArray)
				for(key in imageCopyArray[i])
				{
					if( key == "frame" + index)
					{
						curCopy = imageCopyArray[i][key];
						break;
					}
				}
			}

			$(".modal-image-copy").html(curCopy).fadeIn("slow");
		}
	}

	self.hideModal = function(){

		//fading stuff out, then closing
		galleryAnimating = true;

		$(".modal-imageGallery").fadeOut("slow" , function(){
			
			el.slideUp("slow" , function(){
				galleryAnimating = false;
			});
			GALLERY.reset();
		})
	}

	self.resize = function(){
		resize();
	}



	

	

	function resize(){
		$("#modal").width(  CONFIG.windowWidth ); //$("#work").width() - parseInt($(".work-box").css("margin")) *2 );

		//resizing modal gallery images

		// $(".imgArray").each(function(){
		//  	var img = $(this).find("img")[0]
		// 	var imgDim = UTILS.resizeWithExcessCalc( img.imgDim.w ,  img.imgDim.h , 0 , $(".modal-imageGallery").width() , $(".modal-imageGallery").height()  )

		// 	$(this).css({
		// 		"width" : imgDim.w,
		// 		"height" : imgDim.h,
		// 		"top" : imgDim.t,
		// 		"left": imgDim.l
		// 	})
		// })
		
	}

}