//global vars

var mainPath = document.URL;
var assetPath = document.URL + "assets";

//config
var siteOffset = 0;
var minScroll = 50;
var menuOffset = 50;
var squareSize = 10;

var isMenuOpen = false;
var splashAnimating = false;


$(document).ready(function(){
	init();
});

function init(){

	//init preload
	PRELOAD.init(preloadData.allSections , [] );

	//initializing classes
	MODAL.init();
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
	render();
}

function render(){
	//render classes here
	BASIC.animate();
}

function mouseEvents(){

	$("body").mousemove(function(e){

		CONFIG.mouseX = e.pageX;
		CONFIG.mouseY = e.pageY;

		// if(UTILS.mouseOverObject($("#title")))
		// {
		// 	console.log("over");
		// }
	});
}

//resize logic

$(window).resize(function(){

	
		CONFIG.windowHeight = window.innerHeight;
		CONFIG.windowWidth 	= window.innerWidth;

		BASIC.resize();
		LAYOUT.resize();
		MODAL.resize();
		GALLERY.resize();



	
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


