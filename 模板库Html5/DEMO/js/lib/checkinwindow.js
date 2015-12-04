define(['jquery'], function(){

    function Checkinwindow(settings){
        this.$window = $(window);
        this.$container = $(settings.container) || $(window);

        this.threshold_left = (typeof settings.threshold_left !== 'undefined') ? settings.threshold_left : settings.threshold;
        this.threshold_right = (typeof settings.threshold_right !== 'undefined') ? settings.threshold_right : settings.threshold;
        this.threshold_top = (typeof settings.threshold_top !== 'undefined') ? settings.threshold_top : settings.threshold;
        this.threshold_bottom = (typeof settings.threshold_bottom !== 'undefined') ? settings.threshold_bottom : settings.threshold;
        this.is_window = settings.container === undefined || settings.container === window;
        this.win_width = this.$window.width();
        this.win_height = this.$window.height();
    }

    Checkinwindow.prototype = {
        constructor: Checkinwindow,
        resizewindow: function(){
            this.win_width = this.$window.width();
            this.win_height = this.$window.height();
        },
        belowthefold: function(element){
                            var fold;

                            if(this.is_window){
                                fold = this.win_height + this.$window.scrollTop();
                            }else{
                                fold = this.$container.offset().top + this.$container.height();
                            }

                            return fold <= $(element).offset().top - this.threshold_bottom;
                        },
        rightoffold: function(element){
                            var fold;

                            if(this.is_window){
                                fold = this.win_width + this.$window.scrollLeft();
                            }else{
                                fold = this.$container.offset().left + this.$container.width();
                            }

                            return fold <= $(element).offset().left - this.threshold_right;
                        },
        abovethetop: function(element){
                            var fold;

                            if(this.is_window){
                                fold = this.$window.scrollTop();
                            }else{
                                fold = this.$container.offset().top;
                            }

                            return fold >= $(element).offset().top + this.threshold_top + $(element).height();
                        },
        leftofbegin: function(element){
                            var fold;

                            if(this.is_window){
                                fold = this.$window.scrollLeft();
                            }else{
                                fold = this.$container.offset().left;
                            }

                            return fold >= $(element).offset().left + this.threshold_left + $(element).width();
                        },
        inviewport: function(element){
                            return !this.rightoffold(element) && !this.leftofbegin(element) && !this.belowthefold(element) && !this.abovethetop(element);
                        }

    }

    return Checkinwindow;

})
