var cont = document.querySelectorAll('.main_menu_area ul li a ');
var select = localStorage.getItem('selected');
var ul = document.getElementById('nav');

window.onload = function(){
     for (var i=0;i < cont.length; i++) {
            if (select === cont[i].innerHTML) {
                cont[i].className="active";
        }
     }
};
latestSlide = ($.cookie('idx'))
function deleteActive() {
    for (var i=0;i < cont.length; i++) {
        cont[i].className = " ";}
}
function getEventTarget(e) {
    return e.target ;
}

ul.onclick = function(event) {
    var target = getEventTarget(event);
    localStorage.setItem('selected', target.innerHTML);
    deleteActive();
    target.className="active";
};

(function ($, window, i) {
    $.fn.slides = function () {
        return this.each(function () {
            i++;
            var $this = $(this),
                $tabs,
                index = 0,
                $slide = $this.children(),
                fadeTime = parseFloat(500),
                namespace = "rslides",
                namespaceIdx = namespace + i,
                activeClass = namespace + "_here",
                visibleClass = namespaceIdx + "_on",
                $pager = $("<ul class='" + namespace + "_tabs " + namespaceIdx + "_tabs' />"),
                visible = {"float": "left", "position": "relative", "opacity": 1, "zIndex": 2},
                hidden = {"float": "none", "position": "absolute", "opacity": 0, "zIndex": 1};

               if($.cookie('idx')){var latestSlide = ($.cookie('idx'))}else{ latestSlide=0}

                slideTo = function (idx) {
                    $.noop(idx);
                    $slide
                        .stop()
                        .fadeOut(fadeTime, function () {
                            $(this)
                                .removeClass(visibleClass)
                                .css(hidden)
                                .css("opacity", 1);
                        })
                        .eq(idx)
                        .fadeIn(fadeTime, function () {
                            $(this)
                                .addClass(visibleClass)
                                .css(visible);
                            $.noop(idx);
                            index = idx;
                        });
                };

            $slide
                .hide()
                .css(hidden)
                .eq(latestSlide)
                .addClass(visibleClass)
                .css(visible)
                .show();
            $pager = $('#slider3-pager');
            $pager.addClass(namespace + "_tabs " + namespaceIdx + "_tabs");
            $tabs = $pager.find('a');

            selectTab = function (idx) {
                $tabs
                    .closest("li")
                    .removeClass(activeClass)
                    .eq(idx)
                    .addClass(activeClass);
            };
            $tabs.bind("click", function (e) {
                var idx = $tabs.index(this);
                if (index === idx || $("." + visibleClass).queue('fx').length) {
                    return;
                }
                selectTab(idx);
                slideTo(idx);
                $.cookie('idx', idx, {expires: 1, path: "/"});
            })
                .eq(latestSlide)
                .closest("li")
                .addClass(activeClass);

        });

    };
})(jQuery, this, 0);
