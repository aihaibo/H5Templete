define(function(){

	var browser = (function(){
		var ua = window.navigator.userAgent.toLowerCase(), sys = null, s;
		if(s = ua.match(/rv:([\d.]+)\) like gecko/)){sys = {type:'ie',version:s[1]};}
		else if(s = ua.match(/msie ([\d.]+)/)){sys = {type:'ie',version:s[1]};}
		else if(s = ua.match(/firefox\/([\d.]+)/)){sys = {type:'firefox',version:s[1]};}
		else if(s = ua.match(/chrome\/([\d.]+)/)){sys = {type:'chrome',version:s[1]};}
		else if(s = ua.match(/opera.([\d.]+)/)){sys = {type:'opera',version:s[1]};}
		else if(s = ua.match(/version\/([\d.]+).*safari/)){sys = {type:'safari',version:s[1]};}
		else if(s = ua.match(/ucbrowser\/([\d.]+)/)){sys = {type:'uc',version:s[1]};}
		else if(s = ua.match(/micromessenger\/([\d.]+)/)){sys = {type:'wx',version:s[1]};}
		else{sys = {type:'unknown',version:'unknown'};}
		sys.isMobile = !!ua.match(/AppleWebKit.*Mobile.*!/) || !!ua.match(/(iPhone|iPod|Android|ios|iPad)/i);
		return sys;
	})();

	if(browser.type == "ie" && browser.version < 8){
		browser.isoldIE = true;
	}

	return browser;
})