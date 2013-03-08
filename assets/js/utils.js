var UTILS = UTILS || {};

(function(){

	var self = UTILS;

	self.mouseOverObjectHash = {} ;
	self.mouseOverObjectArray = [] ;

	self.mouseOverObject = function(obj){

		var name = obj.attr("id");
		var curObj = self.mouseOverObjectHash[name];

		if(!curObj)
		{
			curObj = {};
			
			curObj.el = obj;

			self.mouseOverObjectHash[name] = curObj;
			self.mouseOverObjectArray.push(name);

		}

		curObj.u = curObj.el.offset().top;
		curObj.l = curObj.el.offset().left;
		curObj.d = curObj.u + curObj.el.height();
		curObj.r = curObj.l + curObj.el.width();
	
		var u,r,d,l;

		u = curObj.u;
		r = curObj.r;
		d = curObj.d;
		l = curObj.l;

		var mouseX = CONFIG.mouseX;
		var mouseY = CONFIG.mouseY;


		if(mouseX > l && mouseX < r && mouseY > u && mouseY < d)
		{
			return true
		}
		else
		{
			return false
		}

	}

	self.mousePosOnObject = function(name){

		var mouseX = CONFIG.mouseX;
		var mouseY = CONFIG.mouseY;

		var objX = self.mouseOverObjectHash[name].l;
		var objY = self.mouseOverObjectHash[name].u;

		var drawX = mouseX - objX;
		var drawY = mouseY - objY;

		var drawObj = {"x": drawX , "y":drawY };
		return drawObj

	}

	self.resizeWithExcessCalc = function(imgW , imgH , _excess , toW , toH){


		var boundH;
		var boundW;

		if( !toW  && !toH)
		{
			 boundH = CONFIG.windowHeight;
       		 boundW = CONFIG.windowWidth;
		}
		else
		{
			boundH = toH;
			boundW = toW;
		}

		console.log(boundH , boundW);
     
        var newWidth;
        var newHeight;
        var excess =  _excess ;
        var hExcess;
        var wExcess;

        //fitting image to smallest orientation
        var whRatio = imgW - imgH;

        if(whRatio > 0)
        {
            wExcess = excess;
            hExcess = imgH / imgW * excess;
            newHeight = boundH;
            newWidth = imgW / ( imgH / newHeight );

        }
        else
        {
            hExcess = excess;
            wExcess = imgW / imgH * excess;
            newWidth = boundW;
            newHeight = imgH / ( imgW / newWidth );
        }
        
        //scaling up if one orientation isnt contained

        var wRatio = newWidth / boundW;
        var hRatio = newHeight / boundH;

        var excessNeeded = 1;

        if(wRatio < 1){
            excessNeeded = wRatio;
        }
        if(hRatio < 1 ){
            excessNeeded = hRatio;
        }
        
        var returnHeight = newHeight / (excessNeeded) + hExcess;
        var returnWidth = newWidth / (excessNeeded) + wExcess;
        var returnLeft = (boundW - returnWidth ) /2;
        var returnTop = (boundH - returnHeight ) /2;
        
        return { "h" : Math.round(returnHeight) , "w": Math.round(returnWidth ), "l" : Math.round(returnLeft) , "t" : Math.round(returnTop) }

    }

    //math

     self.getDist=function( x1 , x2 , y1 , y2 )
    {   
        var distX = Math.abs(x2 - x1);
        var distY = Math.abs(y2 - y1);
        var dist = Math.sqrt( distX * distX +  distY * distY );

        var distObj = { "x" : distX , "y" : distY , "total" : dist}

        return distObj;
    }

    self.getRand = function( v1 , v2)
    {
        return (v1 + Math.random()* ( v2 - v1) )
    }


    //color

    self.hexToRgb = function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	self.createColor = function(r,g,b){
		return ( { "r" : r , "g" : g ,  "b" : g }  );
	}

	//general utils

	 window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


})(UTILS)