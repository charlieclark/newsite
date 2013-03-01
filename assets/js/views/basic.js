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
	var squareSize = 10;
	var numColumns , numRows;

	var offsetMax = 5;
	var curOffset= null;

	var colorArray = [ "#109878" , "#110989" , "#FF9988" , "#000000" , "#FFFFFF" , "#56ea98" ]

	var hex1 = "#000000";
	var hex2 = "#FF0000";

	var color1Obj , color2Obj;

	var color1Dest = createColor();
	var color2Dest = createColor();

	//color ticker
	var colorTickerMax = 2000;

	// debugging
	var debugPause = true;

	//public methods
	this.init = function(){

		changeColor(0);
		changeColor(1);
		
		$("#title").css({
			"color" : hex2,
			"border-color" : hex2
		})

		canvasEl = $("#canvas");
		init();


		$("#splash").mousemove(function(e){
			mouseX = e.pageX;
			mouseY = e.pageY;
		});

		$("#splash").mousedown(function(){
			offsetMax = 10;
		});

		$("#splash").mouseup(function(){
			offsetMax = 0;
		});

		generateGrid();

		if(!debugPause)
			self.startAnimating();

		setInterval(function(){ changeColor() } , 5000);
	}

	//private methods


	self.startAnimating = function(){
		if(!isAnimating)
			isAnimating = true;

	}

	self.stopAnimating = function(){
		if(isAnimating)
			isAnimating = false;

	}

	self.animate = function(){
		if(isAnimating)
		{
			calculate();
			render();
		}
	}

	self.resize = function(){
		resize();
	}

	

	function calculate(){

		var perX = mouseX / wWidth;
		var perY = mouseY / wHeight;

		squareX = Math.floor( perX * numColumns );
		squareY = Math.floor( perY * numRows);

	}

	function render(){
		generateGrid();
	}

	function init(){
		buildCanvas();

		// initColors
		color1Obj = getColor(hex1);
		color2Obj = getColor(hex2);

		// color1Obj = createColor(0,100,100);
		// color2Obj = createColor(200,200,200);


		

	



		
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

		// console.log(color1Dest, color2Dest);

	

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
		var c = canvasRef = canvasEl[0];
		var ctx = ctxRef = c.getContext("2d");
	}

	function generateGrid(){

			$("#title").css({
			"color" :  "rgb(" + color2Obj.r +"," + color2Obj.g + "," + color2Obj.b + ")" ,
			"border-color" : "rgb(" + color2Obj.r +"," + color2Obj.g + "," + color2Obj.b + ")" 
		})

		var c = canvasRef; 
		var ctx = ctxRef ;

		ctx.canvas.height = CONFIG.windowHeight;
		ctx.canvas.width = CONFIG.windowWidth;

		//clearing canvas
		ctx.clearRect(0 , 0 , ctx.width , ctx.height );

		numColumns = Math.ceil( wWidth / squareSize);
		numRows = Math.ceil( wHeight / squareSize);

		var maxDist = dist(numColumns , numRows);
		var newDist = maxDist /2 ;
		var mDistX = Math.abs( mouseX - wWidth/2);
		var mDistY = Math.abs( mouseY - wHeight/2);
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

						
						ctx.fillStyle = "rgba(" + tempColor.r + "," + tempColor.g + "," + tempColor.b +","+ 1 +")";
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

		function letterArea(x , y)
		{
			var isLetter = false;
			for( var i = 0 ; i < letterArray.length ; i++)
			{
				if( x == letterArray[i][0] && y == letterArray[i][1])
				{
					isLetter = true;
					break;
				}
			}
			return isLetter;
		}

		function dist(x , y)
		{
			return  Math.sqrt((x * x) + (y * y))
		}


		
	}

	function getNewColor( c1 , c2 , m , i)
		{
			// console.log(c1 , c2 , m)

			if(i)
			{
				// console.log(c1.r);
			}

			function getValue(v1 , v2 , mx)
			{
				// console.log(mx)

				
					



				// console.log(v1 , v2 , mx)
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

		function getColorInc(c1 , c2){


			function getValue(v1 , v2)
			{
				// console.log(mx)

				var mx = 0.01;

					



				// console.log(v1 , v2 , mx)
				var dir;

				(v1 >= v2)? dir = 1 : dir = -1;

				return Math.floor( v1 + mx * -dir * Math.abs(v1 - v2) );
			}

			var r = getValue(c1.r , c2.r , m);
			var g = getValue(c1.g , c2.g , m);
			var b = getValue(c1.b , c2.b , m);

			

			return { "r" : r , "g" : g , "b" : b}
		}

	function resize(){


		
		wWidth = CONFIG.windowWidth;
		wHeight = CONFIG.windowHeight;

		$("#splash").css({
			"width" : wWidth,
			"height" : wHeight
		})

		

	}

}
