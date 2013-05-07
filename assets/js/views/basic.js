var BASIC = new basicClass(); 


function basicClass(){
	//public vars

	var self = this;

	//private vars
	var canvasRef = null;
	var ctxRef = null;
	var canvasEl = null;

	//global
	var wWidth , wHeight;
	var mouseX,mouseY;
	var squareX , squareY;
	var isAnimating = false;

	//grid 
	
	var numColumns , numRows;

	var offsetMax = 5;
	var curOffset= null;

	var colorArray = [ "#109878" , "#110989" , "#FF9988" , "#000000" , "#56ea98" ]

	var hex1 = "#000000";
	var hex2 = "#FF0000";

	var color1Obj , color2Obj;

	var color1Dest = createColor();
	var color2Dest = createColor();

	//color ticker
	var colorTickerMax = 10000;

	// debugging
	var debugPause = false;

	//dom refs
	var titleRef = null;

	//public methods
	this.init = function(){

		titleRef = $("#title");

		changeColor(0);
		changeColor(1);
		
		titleRef.css({
			"color" : hex2,
			"border-color" : hex2
		})

		canvasEl = $("#canvas");
		init();




		$("#splash").mousedown(function(){
			offsetMax = 100;
		});

		$("#splash").mouseup(function(){
			offsetMax = 0;
		});

		$("#splash").mouseenter(function(){
			if(isMenuOpen)
			{
				self.startAnimating();
			}
		});

		$("#splash").mouseleave(function(){
			if(isMenuOpen)
			{
				self.stopAnimating();
			}
		});

		$("#splash").click(function(){
			if(isMenuOpen)
			{
				LAYOUT.triggerMenu(false);
			}
		})

		// generateGrid();

		if(!debugPause)
			self.startAnimating();

		setInterval(function(){ changeColor() } , 5000);
	}

	//private methods


	self.startAnimating = function(){
		if(!isAnimating)
		{
			isAnimating = true;
		}
		
		

	}

	self.stopAnimating = function(){
		if(isAnimating)
			isAnimating = false;



	}

	self.animate = function(){
		if(isAnimating)
		{
			
			
			render();

		}
	}

	self.resize = function(){
		resize();
	}

	self.menuCenter = function(){
		centerRender();
	}


	function updateColors(){
		var titleColor = "rgb(" + color2Obj.r +"," + color2Obj.g + "," + color2Obj.b + ")";

		titleRef[0].style["color"] = titleColor ;
		titleRef[0].style["border-color"] = titleColor

		$("#splash")[0].style["background-color"] =  titleColor;
		$(".modal-title").css("color" , titleColor);

		$(".apply-bg").each(function(){

			var attr = "background-color";
			applyColor($(this) , attr);

		})

		function applyColor(el , attr){
			if(el.hasClass("color1"))
			{
				el[0].style[attr] = titleColor;
			}
		}
	}

	function centerRender(){
		console.log("geting here")
		CONFIG.mouseY = 0;
		CONFIG.mouseX = CONFIG.windowWidth / 2;
		render();
	}

	function calculate(){

		var perX = CONFIG.mouseX / wWidth;
		var perY = CONFIG.mouseY / wHeight;

		squareX = Math.floor( perX * numColumns );
		squareY = Math.floor( perY * numRows);

	}

	function render(){
		calculate();
		generateGrid();
	}

	function init(){
		buildCanvas();

		// initColors
		color1Obj = getColor(hex1);
		color2Obj = getColor(hex2);


	}
	
	function getColor(hex)
	{
		return UTILS.hexToRgb(hex);
	}

	function createColor( r , g, b){

		return UTILS.createColor( r , g , b);
	}

	function changeColor(n)
	{
		var roll1 = Math.floor(Math.random() * 2);

		if(n != undefined)
			roll1 = n;

		
		
		var myColor; 
		var otherColor;

		if(roll1 == 0)
		{
			myColor = color1Dest;
			otherColor = color2Dest;
		}
		else
		{
			otherColor = color1Dest;
			myColor = color2Dest;
		}

		var newColor = randomColor();
		while( compareColors( newColor , otherColor ) || compareColors( newColor , myColor ) )
		{
			newColor = randomColor();
		}


		(roll1 == 0) ? color1Dest = newColor : color2Dest = newColor;
	

		function randomColor()
		{
			var roll2 = Math.floor(Math.random() * colorArray.length);
			return getColor( colorArray[roll2] );
		}

		function compareColors(c1 , c2)
		{
			if( c1.r == c2.r && c1.g == c2.g && c1.b == c2.b)
			{
				return true;
			}

			return false;
		}	

	}

	function buildCanvas(){
		canvasRef = canvasEl[0];
		ctxRef = canvasRef.getContext("2d");
	}

	function generateGrid(){


		updateColors();

		var c = canvasRef; 
		var ctx = ctxRef;

		//clearing canvas

		canvasRef.width = ctxRef.width = wWidth;
		canvasRef.height = ctxRef.height =  wHeight;

		ctx.clearRect(0 , 0 , ctx.width , ctx.height );


		

		var maxDist = dist(numColumns , numRows);
		var newDist = maxDist / 2 ;
		var mDistX = Math.abs( CONFIG.mouseX - wWidth/2);
		var mDistY = Math.abs( CONFIG.mouseY - wHeight/2);
		var offsetRatio = Math.max( 0.1 , (dist(mDistX , mDistY) / (maxDist/2)) / 10);

		var color1New = getNewColor( (color1Obj) , (color1Dest)  );
		var color2New = getNewColor( (color2Obj) , (color2Dest)  );


		color1Obj = color1New;
		color2Obj = color2New;


		for( var i = 0 ; i < numRows ; i++)
		{
			for( var j = 0 ; j < numColumns ; j++)
			{
				var l = j * squareSize;
				var t = i * squareSize;

				var tempOffset = Math.floor( Math.floor((Math.random() *20)*offsetRatio) + offsetMax * offsetRatio );
					
				var offsetX = Math.floor(-tempOffset + Math.random() * tempOffset*2);
				var offsetY = Math.floor(-tempOffset + Math.random() * tempOffset*2);

			
					var a = calculateDist(i + offsetY , j + offsetX);
					if(a != NaN && color1Dest && color2Dest)
					{	
						if( i == 0 && j == 0)
						{
							// console.log(color1Obj , color1Dest)
						}

						var tempColor =  getNewColor( (color1New) , (color2New) , a  , i);

						
						ctx.fillStyle = "rgb(" + tempColor.r + "," + tempColor.g + "," + tempColor.b + ")";
	    				ctx.fillRect( l , t,squareSize,squareSize);
					}
			}
		}

		

		function calculateDist( i , j)
		{
			var distX = Math.abs(i-squareY);
			var distY = Math.abs(j-squareX);
			var curDist = Math.sqrt((distX * distX) + (distY * distY));

			return curDist/newDist;
		}

		function dist(x , y)
		{
			return  Math.sqrt((x * x) + (y * y))
		}


		
	}

	function getNewColor( c1 , c2 , m )
		{


			function getValue(v1 , v2 , mx)
			{

				var dir;

				(v1 >= v2)? dir = 1 : dir = -1;

				if(mx == undefined)
				{
					mx = 0.1;
				}

				return Math.floor( v1 + mx * -dir * Math.abs(v1 - v2) );
			}

			var r = getValue(c1.r , c2.r , m);
			var g = getValue(c1.g , c2.g , m);
			var b = getValue(c1.b , c2.b , m);

			

			return { "r" : r , "g" : g , "b" : b}
			

		}

	function resize(){

		if(!isMenuOpen){
			$("#splash").css("height" , CONFIG.windowHeight + menuOffset);
		}
		else{
			centerRender();
		}



		var offset = siteOffset;
		
		wWidth = CONFIG.windowWidth - (offset * 2);
		wHeight = CONFIG.windowHeight - (offset * 2);

		if(debugPause)
		{
			canvasRef.width = wWidth;
			canvasRef.height = wHeight;
		}

		numColumns = Math.ceil( wWidth / squareSize);
		numRows = Math.ceil( wHeight / squareSize);

		$("#canvas").css({
			"top" : CONFIG.windowHeight / 2 -wHeight/2,
			"left" : CONFIG.windowWidth / 2 -wWidth/2,
		})

		

	}

}

