
function workBoxClass( _tag , _el , _thumb , _copy, _dataObject ){

	var tag = _tag;
	var self = this;
	var el = _el;
	var thumb = _thumb;
	var copy = _copy;
	var dataObject = _dataObject;
	var imgArray = null;

	//stuff
	var imgEl = null;
	var curImage = null;

	//public 

	self.tag = tag;
	self.copy = copy;
	self.imgArray = null;
	self.thumb = thumb;

	self.resize = function(){
		resize();
	}

	self.imagesLoaded = function(_imgArray){
		self.imgArray = imgArray = _imgArray;
		console.log("image array loaded in");
	}

	//private

	function init(){
		imgEl = el.find(".workBox-img");

		$(thumb);

		curImage = thumb;

		imgEl.html(curImage);

		resize();
	}

	function resize(){
		var imgDim = UTILS.resizeWithExcessCalc( curImage.imgDim.w , curImage.imgDim.h , 0 , el.width() , el.height() );
		imgEl.css( {
			"width" : imgDim.w,
			"height" :imgDim.h,
			"top" : imgDim.t,
			"left" : imgDim.l
		});
		
	}

	init();
}