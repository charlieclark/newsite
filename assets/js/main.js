//global vars

var mainPath = document.URL;
var assetPath = document.URL + "assets";


$(document).ready(function(){
	init();
});

function init(){

	//init preload
	PRELOAD.init(preloadData.allSections , [] );

	//initializing classes
	BASIC.init();
	LAYOUT.init();

	//init render loop
	animate();

	//mouseEvents
	mouseEvents();

	//resize
	$(window).resize();

}

function animate(){
	requestAnimFrame(animate);
}

function render(){
	//render classes here
	BASIC.animate();
}

function mouseEvents(){

	$("#container").mousemove(function(e){
		CONFIG.mouseX = e.pageX;
		CONFIG.mouseY = e.pageY;

		if(UTILS.mouseOverObject($("#title")))
		{
			console.log("over");
		}
	});
}

//resize logic

$(window).resize(function(){

	
		CONFIG.windowHeight = window.innerHeight;;
		CONFIG.windowWidth 	= window.innerWidth;

		BASIC.resize();
		LAYOUT.resize();
});


function compileTemplate( selector , context , dest)
{
	var source   = $("#"+selector).html();
	var template = Handlebars.compile(source);
	var html = template(context);

	if(dest)
		dest.append(html)

	return html;
}


