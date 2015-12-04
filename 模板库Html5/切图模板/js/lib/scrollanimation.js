define(['jquery', 'checkinwindow', 'attributesupport'], function($, checkinwindow, pre){
    function Scrollanimation(obj, options){
        var s = this;
        s.$container = null;
        s.$window = $(window);
        s.settings = {
            duration        : '1s',
            function        : 'linear',
            delay           : '0s',
            count           : '1',
            direction       : 'normal',

            threshold       : 0,
            threshold_left  : undefined,
            threshold_right : undefined,
            threshold_top   : undefined,
            threshold_bottom: undefined,
            container       : window,
            scroll_event    : "scroll." + ( "scrollanimation" + Math.random() ).replace( /\./, "" ),
            resize_event    : "resize." + ( "scrollanimation" + Math.random() ).replace( /\./, "" ),
            trigger_now     : false,
            endfunc         : undefined
        };

        $.extend(s.settings, options);

        s.checkwin = new checkinwindow(s.settings);

        s.$container = s.checkwin.is_window ? s.$window : $(s.settings.container);

        s.nodeSet = [];
        s.prefix2 =       [pre.animation + 'Duration', pre.animation + 'TimingFunction', pre.animation + 'Delay', pre.animation + 'IterationCount',  pre.animation + 'Direction'];
        s.prefix =        ['duration',                  'function',                        'delay',                  'count',                            'direction'                 ];
        s.prefix_unit =   [s.settings.duration,         s.settings.function,               s.settings.delay,         s.settings.count,                   s.settings.direction        ];

        for(var i = 0; i < obj.length; i++){
            s.temp_unit = obj[i];
            s.temp_style = {};
            s.is_array_stat = false;
            s.is_random = !!(s.temp_unit.random && s.temp_unit.random == true);
            $.merge(s.nodeSet, s.temp_unit.node);


            if($.isArray(s.temp_unit.name)){
                s.temp_unit.node.each(function(i){
                    if(s.is_random){
                        $(this).attr('data-ani-name', s.temp_unit.name[Math.floor(s.temp_unit.name.length * Math.random())]);
                    }else{
                        $(this).attr('data-ani-name', s.temp_unit.name[i % s.temp_unit.name.length]);
                    }

                })
            }else{
                s.temp_unit.node.attr('data-ani-name', s.temp_unit.name);
            }

            for(var j = 0; j < s.prefix.length; j++){
                if($.isArray(s.temp_unit[s.prefix[j]])){
                    s.temp_unit[s.prefix[j] + 'Array'] = true;
                    s.is_array_stat = true;
                }else if(typeof s.temp_unit[s.prefix[j]] !== 'undefined'){
                    s.temp_unit[s.prefix[j] + 'Array'] = false;
                }else{
                    s.temp_unit[s.prefix[j] + 'Array'] = false;
                    s.temp_unit[s.prefix[j]] = s.prefix_unit[j];
                }
                s.temp_style[s.prefix2[j]] = s.temp_unit[s.prefix[j]];
            }

            if (s.is_array_stat){
                for(var m = 0; m < s.temp_unit.node.length; m++){
                    for(var n = 0; n < s.prefix.length; n++){
                        if(s.temp_unit[s.prefix[n] + 'Array']){
                            if(s.is_random){
                                s.temp_style[s.prefix2[n]] = s.temp_unit[s.prefix[n]][Math.floor(s.temp_unit[s.prefix[n]].length * Math.random())];
                            }else{
                                s.temp_style[s.prefix2[n]] = s.temp_unit[s.prefix[n]][m % s.temp_unit[s.prefix[n]].length];
                            }

                        }
                    }
                    s.temp_unit.node.eq(m).css(s.temp_style);
                }
            }else{
                s.temp_unit.node.css(s.temp_style);
            }
        }

        s.temp_unit = null;
        s.temp_style = null;

        s.update();

        s.$container.bind(s.settings.scroll_event, function(){
            s.update();
            if(s.nodeSet.length === 0){
                s.$window.unbind(s.settings.scroll_event);
                s.$window.unbind(s.settings.resize_event);
            }
        });

        s.$window.bind(s.settings.resize_event, function(){
            s.checkwin.resizewindow();
            s.update();
        });
    }

    Scrollanimation.prototype = {
        constructor: Scrollanimation,
        update: function(){
                    var that = this;
                    $(this.nodeSet).each(function(){
                        var self = this;
                        if(!$(this).hasClass('scrollAnimated') && that.checkwin.inviewport(this)){
                            $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                if(that.settings.endfunc !== undefined){
                                    that.settings.endfunc.call(that, this);
                                }
                            })
                            $(this).addClass($(this).attr('data-ani-name') + ' scrollAnimated');

                            that.nodeSet = $.grep(that.nodeSet, function(v){
                                return v !== self;
                            })
                        }
                    });
                }
    }

    return Scrollanimation;

})
