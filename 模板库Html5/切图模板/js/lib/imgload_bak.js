define(['jquery', 'modernizr'], function(){

    (function($, window, document, undefined) {
        var $window = $(window);

        $.fn.imgload = function(options) {
            var elements = this;
            var $container;
            var settings = {
                threshold       : 0,
                failure_limit   : 0,
                event           : "scroll",
                effect          : "fadeIn",
                container       : window,
                data_attribute  : "original",
                data_bg         : "bg",
                skip_invisible  : false,
                appear          : null,
                load            : null,
                bgsize          : "normal",
                childNode       : "i",
                trigger_now     : false

            };

            function update() {
                var counter = 0;

                elements.each(function() {
                    var $this = $(this);
                    if (settings.skip_invisible && !$this.is(":visible")) {
                        return;
                    }
                    if ($.abovethetop(this, settings) ||
                        $.leftofbegin(this, settings)) {
                        /* Nothing. */
                    } else if (!$.belowthefold(this, settings) &&
                        !$.rightoffold(this, settings)) {
                        $this.trigger("appear");
                        /* if we found an image we'll load, reset the counter */
                        counter = 0;
                    } else {
                        if (++counter > settings.failure_limit) {
                            return false;
                        }
                    }
                });

            }

            if(options) {
                /* Maintain BC for a couple of versions. */
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit;
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed;
                    delete options.effectspeed;
                }
                $.extend(settings, options);
            }

            if(settings.trigger_now){
                settings.event = "immediate";
            }

            /* Cache container as jQuery as object. */
            $container = (settings.container === undefined ||
            settings.container === window) ? $window : $(settings.container);

            /* Fire one scroll event per scroll. Not one scroll event per image. */
            if (0 === settings.event.indexOf("scroll")) {
                $container.bind(settings.event, function() {
                    return update();
                });
            }

            this.each(function() {
                var self = this;
                var $self = $(self);

                self.loaded = false;

                /* When appear is triggered load original image. */
                $self.one("appear", function() {
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings);
                        }
                        $("<img />")
                            .bind("load", function() {

                                var original = $self.attr("data-" + settings.data_attribute),
                                    single_bg = $self.attr("data-" + settings.data_bg);

                                if(!single_bg || !(single_bg == "cover" || single_bg == "contain" || single_bg == "normal")){
                                    single_bg = false;
                                }

                                $self.children(settings.childNode).hide();

                                if(Modernizr.backgroundsize){
                                    if(!single_bg){
                                        single_bg = settings.bgsize;
                                    }

                                    if(single_bg == "normal"){
                                        single_bg = "100% 100%";
                                    }

                                    $self.children(settings.childNode).css({'background-image': "url('" + original + "')", 'background-size': single_bg});
                                }

                                $self.children(settings.childNode)[settings.effect](settings.effect_speed, function(){
                                    $self.addClass('loaded');
                                });

                                self.loaded = true;

                                /* Remove image from array so it is not looped next time. */
                                var temp = $.grep(elements, function(element) {
                                    return !element.loaded;
                                });
                                elements = $(temp);

                                if (settings.load) {
                                    var elements_left = elements.length;
                                    settings.load.call(self, elements_left, settings);
                                }
                            })
                            .attr("src", $self.attr("data-" + settings.data_attribute));
                    }
                });

                /* When wanted event is triggered load original image */
                /* by triggering appear.                              */
                if (0 !== settings.event.indexOf("scroll")) {
                    $self.bind(settings.event, function() {
                        if (!self.loaded) {
                            $self.trigger("appear");
                        }
                    });
                }

                if(settings.trigger_now){
                    $self.trigger(settings.event);
                }

            });

            /* Check if something appears when window is resized. */
            $window.bind("resize", function() {
                update();
            });

            /* With IOS5 force loading images when navigating with back button. */
            /* Non optimal workaround. */
            if ((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)) {
                $window.bind("pageshow", function(event) {
                    if (event.originalEvent && event.originalEvent.persisted) {
                        elements.each(function() {
                            $(this).trigger("appear");
                        });
                    }
                });
            }

            /* Force initial check if images should appear. */
            $(document).ready(function() {
                update();
            });

            return this;
        };

        /* Convenience methods in jQuery namespace.           */
        /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

        $.belowthefold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height();
            }

            return fold <= $(element).offset().top - settings.threshold;
        };

        $.rightoffold = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width();
            }

            return fold <= $(element).offset().left - settings.threshold;
        };

        $.abovethetop = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop();
            } else {
                fold = $(settings.container).offset().top;
            }

            return fold >= $(element).offset().top + settings.threshold  + $(element).height();
        };

        $.leftofbegin = function(element, settings) {
            var fold;

            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft();
            } else {
                fold = $(settings.container).offset().left;
            }

            return fold >= $(element).offset().left + settings.threshold + $(element).width();
        };

        $.inviewport = function(element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) &&
                !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
        };

        /* Custom selectors for your convenience.   */
        /* Use as $("img:below-the-fold").something() or */
        /* $("img").filter(":below-the-fold").something() which is faster */

        $.extend($.expr[":"], {
            "below-the-fold" : function(a) { return $.belowthefold(a, {threshold : 0}); },
            "above-the-top"  : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-screen": function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-screen" : function(a) { return !$.rightoffold(a, {threshold : 0}); },
            "in-viewport"    : function(a) { return $.inviewport(a, {threshold : 0}); },
            /* Maintain BC for couple of versions. */
            "above-the-fold" : function(a) { return !$.belowthefold(a, {threshold : 0}); },
            "right-of-fold"  : function(a) { return $.rightoffold(a, {threshold : 0}); },
            "left-of-fold"   : function(a) { return !$.rightoffold(a, {threshold : 0}); }
        });

    })(jQuery, window, document);



})


