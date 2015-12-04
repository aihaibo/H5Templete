define(function(){

	var styles = window.getComputedStyle(document.documentElement, ''),
		attribute = {};


	var animation = ['animation', 'webkitAnimation'];
	var transition = ['transition', 'webkitTransition'];

	for(var i = 0; i < animation.length; i++){
		if(animation[i] in styles){
			attribute.animation = animation[i];
			attribute.transition = transition[i];
			break;
		}
	}

	return attribute;
})