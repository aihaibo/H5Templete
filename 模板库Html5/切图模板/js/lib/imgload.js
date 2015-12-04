define(['jquery', 'checkinwindow'], function($, checkinwindow){

    (function($, window, document, undefined){
        $.fn.imgload = function(options){
            var elements = this,
                $window = $(window),
                $container,
                settings = {
                    threshold       : 0,
                    threshold_left  : undefined,
                    threshold_right : undefined,
                    threshold_top   : undefined,
                    threshold_bottom: undefined,

                    failure_limit   : 0,
                    event           : "scroll.imgload",
                    resize          :"resize.imgload",
                    effect          : "fadeIn",
                    container       : window,
                    data_attribute  : "original",
                    skip_invisible  : false,
                    appear          : null,     //在img触发appear事件时执行的回调
                    load            : null,     //在img触发load事件时执行的回调
                    childNode       : "i",
                    trigger_now     : false
            };

            $.extend(settings, options);

            var checkwin = new checkinwindow(settings);

            function update(){
                var counter = 0;

                elements.each(function(){
                    var $this = $(this);
                    if(settings.skip_invisible && !$this.is(":visible")){
                        return;
                    }
                    if(checkwin.abovethetop(this) || checkwin.leftofbegin(this)){
                    }else if(!checkwin.belowthefold(this) && !checkwin.rightoffold(this)){
                        $this.trigger("appear");
                        counter = 0;
                    }else{
                        if(++counter > settings.failure_limit){
                            return false;
                        }
                    }
                });

            }

            /* Cache container as jQuery as object. */
            $container = checkwin.is_window ? $window : $(settings.container);

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if(0 === settings.event.indexOf("scroll")){
                $container.bind(settings.event, function(){
                    if(elements.length === 0){
                        $container.unbind(settings.event);
                        $window.unbind(settings.resize);
                    }
                    return update();
                });
            }

            this.each(function(){
                var self = this;
                var $self = $(self);

                self.loaded = false;

                /* When appear is triggered load original image. */
                $self.one("appear", function(){
                    if(!this.loaded){
                        if(settings.appear){
                            settings.appear.call(self, elements.length, settings);
                        }
                        $("<img />").bind("load", function(){
                            var original = $self.attr("data-" + settings.data_attribute);
                            $self.children(settings.childNode).hide();
                            if(!$self.is("img")){
                                $self.children(settings.childNode).css("background-image", "url('" + original + "')");
                            }else{
                                $self.attr("src", original);
                            }
                            //$self[settings.effect](settings.effect_speed);
                            $self.children(settings.childNode)[settings.effect](settings.effect_speed, function(){
                                $self.addClass('loaded');
                            });

                            self.loaded = true;

                            /* Remove image from array so it is not looped next time. */
                            var temp = $.grep(elements, function(element){
                                return !element.loaded;
                            });
                            elements = $(temp);

                            if(settings.load){
                                settings.load.call(self, elements.length, settings);
                            }
                        }).attr("src", $self.attr("data-" + settings.data_attribute));
                    }
                });

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if(0 !== settings.event.indexOf("scroll")){
                    $self.bind(settings.event, function(){
                        if(!self.loaded){
                            $self.trigger("appear");
                        }
                    });
                }

                if(settings.trigger_now){
                    $self.trigger(settings.event);
                }
            });

            /* Check if something appears when window is resized. */
            $window.bind(settings.resize, function(){
                checkwin.resizewindow();
                update();
            });

            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)){
                $window.bind("pageshow", function(event){
                    if(event.originalEvent && event.originalEvent.persisted){
                        elements.each(function(){
                            $(this).trigger("appear");
                        });
                    }
                });
            }

            /* Force initial check if images should appear. */
            $(document).ready(function(){
                update();
            });

            return this;
        };

    })(jQuery, window, document);
})
