require.config({
    baseUrl: 'js/lib',
    paths: {
        jquery: [
            'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min',
            'jquery-2.1.4.min'
        ]
    }
});

require(['attributesupport'], function(pre){if(!pre || !pre.animation){window.location.href = "http://www.jltech.cn/upgradeBrowser/";}})


require(['jquery', 'swiper', 'navcollapse'], function(){
	$(function(){

	})
})
