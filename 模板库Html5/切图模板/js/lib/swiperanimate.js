define(['attributesupport', 'swiper'], function(pre){

    var tempOutAnimateStack = [],
        timerOn = false,
        OutAniTimeout,
        param = {
        at      : 0,
        from    : 'fadeIn',
        to      : 'fadeOut',
        use     : 'linear',
        during  : 600
    };

    Swiper.prototype.swiperAnimateCache = function() {
        $(this.slides).find('.ani').each(function(){

            $(this).hide().attr("swiper-animate-style-cache", $(this).attr('style') ? $(this).attr('style') : "");

            var slide_in = $(this).attr("data-slide-in"),
                slide_out = $(this).attr("data-slide-out");

            if(slide_in){
                var in_date = slide_in.split(/\s+/);
                $(this).attr({
                    'in_at'     : getprop('at', in_date),
                    'in_from'   : getprop('from', in_date),
                    'in_use'    : getprop('use', in_date),
                    'in_during' : getprop('during', in_date),
                    'in_plus'   : getprop('plus', in_date),
                    'in_force'  : getprop('force', in_date)
                })
            }
            if(slide_out){
                var out_date = slide_out.split(/\s+/);
                $(this).attr({
                    'out_at'    : getprop('at',out_date),
                    'out_to'  : getprop('to',out_date),
                    'out_use'   : getprop('use',out_date),
                    'out_during': getprop('during', out_date),
                    'out_plus'  : getprop('plus',out_date),
                    'out_force' : getprop('force',out_date)
                })
            }
        })
    }

    Swiper.prototype.swiperAnimate = function() {
        clearSwiperAnimate(this);

        $(this.slides).eq(this.activeIndex).find('.ani').each(function(){
            var ob = {};
            ob[pre.animation + 'Duration'] = $(this).attr('in_during') / 1000 + 's';
            ob[pre.animation + 'Delay'] = $(this).attr('in_at') / 1000 + 's';
            ob[pre.animation + 'TimingFunction'] = $(this).attr('in_use');
            ob.display = 'block';

            $(this).addClass($(this).attr('in_from') + ' animated').css(ob);

            if($(this).attr("data-slide-out")){
                var outtime = parseInt($(this).attr('in_during')) + parseInt($(this).attr('in_at')) + parseInt($(this).attr('out_at'));
                tempOutAnimateStack.push({time:outtime, element: $(this)});
            }
        })

        if(tempOutAnimateStack.length){
            tempOutAnimateStack.sort(function(a, b){
                return a.time - b.time;
            })
            executionAnimate();
        }
    }

    function executionAnimate() {
        if(!timerOn){
            timerOn = true;
            OutAniTimeout = setTimeout(executionAnimate, tempOutAnimateStack[0].time);
            return true;
        }

        var nwoOutAni = tempOutAnimateStack.shift().element,
            ob = {};

        ob[pre.animation + 'Duration'] = nwoOutAni.attr('out_during') / 1000 + 's';
        ob[pre.animation + 'TimingFunction'] = nwoOutAni.attr('out_use');

        nwoOutAni.removeClass(nwoOutAni.attr('in_from')).addClass(nwoOutAni.attr('out_to')).css(ob);

        if(tempOutAnimateStack.length){
            OutAniTimeout = setTimeout(executionAnimate, tempOutAnimateStack[0].time - nwoOutAni.time);
        }
    }

    function getprop(prop, data) {
        var pos =data.indexOf(prop);
        if(pos < 0)
            return param[prop];
        return data[pos + 1];
    }

    function clearSwiperAnimate(that) {
        tempOutAnimateStack = [],
        clearTimeout(OutAniTimeout),
        timerOn = false;

        $(that.slides).find('.ani').each(function(){
            $(this).attr('style', $(this).attr('swiper-animate-style-cache')).removeClass($(this).attr('in_from') + ' animated ' + $(this).attr('out_to')).hide();
        })
    }
})