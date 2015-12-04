require.config({
    baseUrl: '../js/lib',
    paths: {
        jquery: [
            'jquery-2.1.4'
        ]
    }
});

require(['jquery', 'modernizr'], function($){

    var output = $('.demo-output');

    $('.demo-arrow').bind('click', function(){
        $(this).toggleClass('on');
        output.toggleClass('on');
    });

    $('.demo-arrow > i').bind('click', function(){
        var useInfo = $('.use-info');
        if(!$('.use-info-mask').length){
            $('<div class="use-info-mask"></div>').insertBefore(useInfo);
        }
        $('.use-info-mask').fadeIn(200);
        useInfo.fadeIn(250);
        return false;
    })

    $('body').delegate('.use-info-mask', 'click', function(){
        $(this).fadeOut(100);
        $('.use-info').fadeOut(100);
    })


    output.children('textarea').eq(0).text($('body > mark').html().replace(/\s+/, '    '));
    $.ajax({
        url: $('#linkDemo').attr('href'),
        success: function(e){output.children('textarea').eq(1).text(e);}
    });
    if($('#scriptDemo').length){
        output.children('textarea').eq(2).text($('#scriptDemo').text().replace(/\s+/, '    '));
    }



})
