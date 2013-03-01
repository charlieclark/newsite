
function workBoxClass( _el , _imgArray , _dataObject ){

	var self = this;
	var el = _el;
	var imgArray = _imgArray;
	var dataObject = _dataObject;

	//stuff
	var imgEl = null;
	var curImage = null;

	//public 
	self.resize = function(){
		console.log("resize called");
		resize();
	}

	//private

	function init(){
		imgEl = el.find(".workBox-img");

		curImage = imgArray[0];

		$(curImage).addClass("scaleBoth");
		
		imgEl.html(curImage);

		resize();
	}

	function resize(){
		console.log(el.width() , el.height())
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