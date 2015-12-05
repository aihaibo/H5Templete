define(['jquery'], function(){

    (function($, window){
        $.fn.floatad = function(options){
            var s = this,
                $window = $(window),
                w_width = $window.width(),
                w_height = $window.height(),
                s_width = s.width(),
                s_height = s.height(),
                s_left = s.position().left,
                s_top = s.position().top,
                xon = 0,
                yon = 0,
                interval,
                event = 'resize.' + ( "floatad" + Math.random() ).replace( /\./, "" ),
                settings = {
                    step: 2,
                    delay: 30,
                    pause: true,
                    close_btn: 'i'
                };

            $.extend(settings, options);

            $window.bind(event, function(){
                w_width = $window.width();
                w_height = $window.height();
            })

            function floatAdChangePos(){
                s_top = s_top + (yon > 0 ? settings.step : -settings.step);

                if(s_top < 0){
                    yon = 1;
                    s_top = 0;
                }else if(s_top >= w_height - s_height){
                    yon = 0;
                    s_top = w_height - s_height;
                }

                s_left = s_left + (xon > 0 ? settings.step: -settings.step);

                if(s_left < 0){
                    xon = 1;
                    s_left = 0;
                }else if(s_left >= w_width - s_width){
                    xon = 0;
                    s_left = w_width - s_width;
                }

                s.css({'top': s_top, 'left': s_left});
            }

            function floatAdStart(){
                interval = setInterval(floatAdChangePos, settings.delay);
            }

            s.hover(function(){
                clearInterval(interval);
            },function(){
                interval = setInterval(floatAdChangePos, settings.delay);
            })

            s.find(settings.close_btn).bind('click', function(){
                clearInterval(interval);
                $window.unbind(event);
                s.remove();
                return false;
            })

            floatAdStart();
        };

    })(jQuery, window);
})
