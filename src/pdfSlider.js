/**
 * @author alexwebgr
 * @title pdfSlider
 * @desc simple slider originally created for pdf files but can be used for any content
 */

(function ($)
{
    var
        options = {},

        defaults =
        {
            container : "#carousel",
            item : "object",
            itemWidth : $(window).width() - 40,
            itemHeight : $(window).height() - 60,
            speed : 1000,
            activeSlideIndex : 0,

            _slides : null,
            _rootContainer : "pdfSlider_rootContainer",
            _slidesContainer : "pdfSlider_slidesContainer",
            _navButton : "pdfSlider_button",
            _prevButton : "pdfSlider_prev",
            _nextButton : "pdfSlider_next",
            _closeButton : "pdfSlider_close",
            _hideControlsButton : "pdfSlider_hideControls",
            _thumbsContainer : "pdfSlider_thumbsContainer",
            _controlsContainer : "pdfSlider_controlsContainer",
            _activeThumb : "pdfSlider_activeThumb",
            _activeSlide : "activeSlide",
            _slideWrapper : "pdfSlider_slideWrapper",

            _startMargin : "0px",
            _endMargin : "-3000px",
            _animatedProperty : "margin-left"
        },

        methods =
        {
            init : function (opts)
            {
                options = $.extend(defaults, opts);

                methods._create();
                methods._setActiveSlideIndex();
                methods._createControls();
                methods._createThumbs();
                methods._setActiveSlide();
                methods._attachEventHandlers();
            },

            _setSlides : function(slides)
            {
                options._slides = slides;
            },

            _setActiveSlide : function ()
            {
                options._slides
                    .css(options._animatedProperty, options._startMargin)
                    .removeClass(options._activeSlide)
                ;

                $.each(options._slides, function(index)
                {
                    if (index < options.activeSlideIndex)
                    {
                        $(this).css(options._animatedProperty, options._endMargin);
                    }
                });

                methods._setActiveThumb();
                options._slides.eq(options.activeSlideIndex).addClass(options._activeSlide);

                options.container.show();
                options._controlsContainer.show();
            },

            _setActiveThumb : function()
            {
                options._thumbsContainer.find("." + options._activeThumb).removeClass(options._activeThumb);
                options._thumbsContainer.find("a").eq(options.activeSlideIndex).addClass(options._activeThumb);
            },

            _setActiveSlideIndex : function()
            {
                if(options.activeSlideIndex < 0)
                    options.activeSlideIndex = 0;

                if(options.activeSlideIndex > options.container.find(options.item))
                    options.activeSlideIndex = options.container.find(options.item).length - 1;
            },

            _create : function ()
            {
                options.container = $(options.container).addClass(options._slidesContainer);
                options._rootContainer = $("<div />")
                    .addClass(options._rootContainer)
                    .css({
                        height : options.itemHeight,
                        width : options.itemWidth
                    })
                ;
                options._thumbsContainer = $("<div />").addClass(options._thumbsContainer);
                options._controlsContainer = $("<div />").addClass(options._controlsContainer).addClass("isVisible");
                options._slideWrapper = $("<div />").addClass(options._slideWrapper);

                options.container.wrap(options._rootContainer);
                options.container.after(options._controlsContainer);
                options.container.before(options._thumbsContainer);

                options.container.find(options.item).wrap(options._slideWrapper);

                var slides = options.container.children();

                methods._setSlides(slides);

                $.each(options._slides, function(key, value)
                {
                    var zIndex = -($(value).index() * 10) + (10 * options._slides.length);
                    $(value)
                        .css({
                            height : options.itemHeight,
                            width : options.itemWidth,
                            zIndex : zIndex
                        })
                    ;
                });
            },

            _createControls : function()
            {
                var prev = $("<div />").addClass(options._navButton).addClass(options._prevButton);
                var next = $("<div />").addClass(options._navButton).addClass(options._nextButton);
                var close = $("<div />").addClass(options._navButton).addClass(options._closeButton);
                var hideControls = $("<div />").addClass(options._navButton).addClass(options._hideControlsButton);
                var anchor = $("<a href='#'></a>").text("hideControls");

                hideControls.html(anchor);

                options._controlsContainer.append(prev);
                options._controlsContainer.append(next);
                options._controlsContainer.append(close);
                options._controlsContainer.append(hideControls);
            },

            _createThumbs : function()
            {
                var html = "";
                var listItem = $("<ul><li><a href='#'> </a></li></ul>");

                $.each(options._slides, function(key, value)
                {
                    var caption = $(value).find(options.item).data("caption");
                    if(caption == undefined)
                    {
                        var i = parseInt(key) + 1;
                        caption = "slide " + i;
                    }

                    listItem.find("a").text(caption);
                    html += listItem.html();
                });

                options._thumbsContainer.html(html);
            },

            destroy : function ()
            {
                options._controlsContainer.hide();
                options.container
                    .hide()
                    .find("." + options._activeSlide).removeClass(options._activeSlide)
                ;
                options.activeSlideIndex = 0;
                options._slides.css(options._animatedProperty, options._startMargin);
                options._thumbsContainer.find("a").removeClass(options._activeThumb);
            },

            //todo remove hard-coded animated property
            next : function()
            {
                if (options.activeSlideIndex < options._slides.length - 1)
                {
                    var activeSlide = options._slides.eq(options.activeSlideIndex);

                    activeSlide.animate(
                        {
                            marginLeft : options._endMargin
                        },
                        options.speed,
                        function ()
                        {
                            activeSlide.removeClass(options._activeSlide);
                            activeSlide.next(options._slideWrapper).addClass(options._activeSlide);
                        }
                    );
                    options.activeSlideIndex++;

                    methods._setActiveThumb();
                }
            },

            //todo remove hard-coded animated property
            prev : function()
            {
                if (options.activeSlideIndex > 0)
                {
                    var activeSlide = options._slides.eq(options.activeSlideIndex);

                    activeSlide.removeClass(options._activeSlide);
                    activeSlide.prev(options._slideWrapper)
                        .addClass(options._activeSlide)
                        .animate(
                        {
                            marginLeft : options._startMargin
                        },
                        options.speed
                    )
                    ;
                    options.activeSlideIndex--;

                    methods._setActiveThumb();
                }
            },

            _hideControls : function()
            {
                options._controlsContainer.toggleClass("isVisible");
                options._controlsContainer.find("." + options._navButton).not("." + options._hideControlsButton).toggle();

                if(options._controlsContainer.hasClass("isVisible"))
                    $("." + options._hideControlsButton).find("a").text("hideControls");
                else
                    $("." + options._hideControlsButton).find("a").text("showControls");
            },

            _attachEventHandlers : function()
            {
                options._controlsContainer
                    .on({
                        click : function()
                        {
                            if($(this).hasClass(options._prevButton))
                                methods.prev();

                            if($(this).hasClass(options._nextButton))
                                methods.next();

                            if($(this).hasClass(options._closeButton))
                                methods.destroy();

                            if($(this).hasClass(options._hideControlsButton))
                                methods._hideControls();

                            return false;
                        }
                    }, "." + options._navButton)
                ;

                options._thumbsContainer
                    .on({
                        click : function()
                        {
                            options.activeSlideIndex = $(this).parent().index();

                            methods._setActiveSlide();

                            return false;
                        }
                    }, "a")
                ;
            }
        }
        ;

    $.fn.pdfSlider = function (method)
    {
        // Method calling logic
        if (methods[method])
        {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === "object" || !method)
        {
            return methods.init.apply(this, arguments);
        }
        else
        {
            console.log("Method " + method + " does not exist");

            return false;
        }
    };
})(jQuery);