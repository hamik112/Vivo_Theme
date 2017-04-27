/**
 * infinite loop carousel
 * @author newdongyuwei@gmail.com
 * @param  {Object} config 
 * @return {Object} this
 */
$.fn.infiniteCarousel = function(config){
    config = $.extend({
        itemsPerMove : 2,
        duration : 1000,
        vertical : false
    },config);

    var viewportEl = this.find('.viewport'), listEl = viewportEl.find('.list');
    var first = listEl.children(":first"), last = listEl.children(":last");
    
    var distance, prevProp, nextProp;
    if(config.vertical){
        distance = Math.max(first.outerHeight(true),last.outerHeight(true)) * config.itemsPerMove;
        prevProp = { 'scrollTop' : "-=" + distance };
        nextProp = { 'scrollTop' : distance }; 
    }else{
        distance = Math.max(first.outerWidth(true),last.outerWidth(true)) * config.itemsPerMove;
        prevProp = { 'scrollLeft' : "-=" + distance };
        nextProp = { 'scrollLeft' : '+=' + distance };
    }

    function move(config) {
        if (config.dir === 'next') {
            viewportEl.stop().animate(nextProp,{
                duration : config.duration,
                complete : function() {
                    config.vertical ? viewportEl.scrollTop(0) : viewportEl.scrollLeft(0);
                    repeatRun(function(){
                        listEl.children(":last").after(listEl.children(":first"));
                    },config.itemsPerMove);
                  	$('div.item').removeClass("step_suits_inner_active");
                  	$('.viewport .list div.item:nth-child(2)').addClass("step_suits_inner_active");
                }
            });
        }

        if (config.dir === 'pre') {
            for(var i = 0; i < config.itemsPerMove; i++){
                listEl.prepend(listEl.children(":last"));
            }
            viewportEl[config.vertical ? 'scrollTop' : 'scrollLeft'](distance)
            .stop().animate(prevProp, {
                duration : config.duration,
				});
                            	$('div.item').removeClass("step_suits_inner_active");
                  	$('.viewport .list div.item:nth-child(2)').addClass("step_suits_inner_active");
						// alert("complete");
        }
    }

    function repeatRun(func,times){
        for(var i = 0; i < times; i++){
            func();
        }
    }

    this.find('.pre').click(function() {
        move($.extend(config,{
            dir: "pre"
        }));
    });

    this.find('.next').click(function() {
        move($.extend(config,{
            dir: "next"
        }));
    });

    return this;
};