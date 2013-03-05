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

		el.show();
		el.empty();

		copyContext = context.copyContext;
		imgArray = context.imgArray;
		thumb = context.thumb;

		imageCopyArray = copyContext.imgCopy;

		compileTemplate( "modal-template" , copyContext , el);

		//image gallery

		console.log(imgArray);

		for( var i = 0 ; i < imgArray.length ; i++)
		{
			var div = $("<div>" , {
				"class" : "imgArray"
			}).html(imgArray[i]).appendTo(".modal-imageGallery");
		}

		$(".modal-close").click(function(){
			self.hideModal();
		});

		resize();
	

	}

	self.hideModal = function(){
		el.hide();
	}

	self.resize = function(){
		resize();
	}

	function resize(){

		//resizing modal
		var modalOffset = 10;
		var modalWidth = CONFIG.windowWidth - (modalOffset * 2);
		var modalHeight = CONFIG.windowHeight - (modalOffset * 2);

		var modalContainerWidth =modalWidth - (modalOffset * 2);
		var modalContainerHeight = modalHeight - (modalOffset * 2);

		$("#modal").css({
			"width" : modalWidth,
			"height" : modalHeight,
			"margin-left" : - modalWidth / 2,
			"margin-top" : -modalHeight/2
		});

		$("#modal-container").css({
			"width" : modalContainerWidth,
			"height" : modalContainerHeight,
			"margin-left" : - modalContainerWidth / 2,
			"margin-top" : -modalContainerHeight/2
		});
	}

}