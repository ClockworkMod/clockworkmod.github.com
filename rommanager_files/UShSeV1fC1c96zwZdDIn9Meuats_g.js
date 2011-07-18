var image_map = {};
function get_img_url(b) {
    var g = "https:" == document.location.protocol ? "https_url": "http_url";
    if (!image_map[b] || typeof image_map[b][g] === "undefined") {
        console.log("get_img_url failed for", b);
        return false
    }
    return image_map[b][g]
};
if (typeof window.console === "undefined") window.console = {
    log: function() {
        return true
    }
};
if (typeof window.TAPP === "undefined") window.TAPP = {};
$._ajax = $.ajax;
$.ajax = function(b) {
    var g = b.success;
    b.success = function(c, f, h) {
        var a = c && c.result ? c.result: null,
        d = c && c.value ? c.value: "ajax failed",
        e = c && c.text ? c.text: "ajax failed";
        if (a && a !== "ok") this.error && this.error(h, d, e);
        else g && g(c, f, h)
    };
    return $._ajax(b)
};
 (function() {
    var b = "";
    $.browser.firefox && (b += " firefox");
    $.browser.msie && (b += " ie");
    $.browser.opera && (b += " opera");
    $.browser.chrome && (b += " chrome");
    $.browser.webkit && (b += " webkit");
    b += " v" + $.browser.version;
    $("html").addClass(b)
})(); (function(b, g) {
    var c = b.Widget.prototype,
    f = {
        pos: "left",
        pos2: "right",
        dim: "width"
    },
    h = {
        pos: "top",
        pos2: "bottom",
        dim: "height"
    };
    b.widget("ui.carousel", {
        oldClass: null,
        options: {
            itemsPerPage: "auto",
            itemsPerTransition: "auto",
            orientation: "horizontal",
            noOfRows: 1,
            pagination: true,
            insertPagination: null,
            nextPrevActions: true,
            insertNextAction: null,
            insertPrevAction: null,
            speed: "normal",
            easing: "swing",
            startAt: null,
            init: null,
            beforeAnimate: null,
            afterAnimate: null
        },
        _create: function() {
            this.itemIndex = 1;
            this._elements();
            this._addClasses();
            this._defineOrientation();
            this._addMask();
            this._setMaskDim();
            this._setItemDim();
            this._setNoOfItems();
            this._setNoOfPages();
            this._setRunnerWidth();
            this._setLastPos();
            this._setLastItem();
            this._addPagination();
            this._addNextPrevActions();
            this.options.startAt && this.goToItem(this.options.startAt, false);
            this._updateUi();
            this._trigger("init", null, this._getData())
        },
        _elements: function() {
            var a = this.elements = {};
            a.mask = this.element.find(".mask");
            a.runner = this.element.find("ul");
            a.items = a.runner.children("li");
            a.pagination = null;
            a.nextAction = null;
            a.prevAction = null
        },
        _addClasses: function() {
            if (!this.oldClass) this.oldClass = this.element.attr("class");
            this._removeClasses();
            var a = this.widgetBaseClass,
            d = [];
            d.push(a);
            d.push(a + "-" + this.options.orientation);
            d.push(a + "-items-" + this.options.itemsPerPage);
            d.push(a + "-rows-" + this.options.noOfRows);
            this.element.addClass(d.join(" "))
        },
        _removeClasses: function() {
            var a = [],
            d,
            e;
            this.element.removeClass(function(i, j) {
                j = j.split(" ");
                b.each(j,
                function(k) {
                    d = j[k];
                    e = d.split("-");
                    e[0] ===
                    "ui" && e[1] === "carousel" && a.push(d)
                });
                return a.join(" ")
            })
        },
        _defineOrientation: function() {
            if (this.options.orientation === "horizontal") {
                this.isHorizontal = true;
                this.helperStr = f
            } else {
                this.isHorizontal = false;
                this.helperStr = h;
                this.options.noOfRows = 1
            }
        },
        _addMask: function() {
            var a = this.elements;
            if (!a.mask.length) {
                a.mask = a.runner.wrap('<div class="mask" />').parent();
                this.maskAdded = true
            }
        },
        _setMaskDim: function() {
            this.maskDim = this.elements.mask[this.helperStr.dim]()
        },
        _setItemDim: function() {
            this.itemDim = this.elements.items["outer" +
            this.helperStr.dim.charAt(0).toUpperCase() + this.helperStr.dim.slice(1)](true)
        },
        _getItemsPerPage: function() {
            if (typeof this.options.itemsPerPage === "number") return this.options.itemsPerPage;
            return Math.floor(this.maskDim / this.itemDim)
        },
        _setNoOfItems: function() {
            this.noOfItems = Math.ceil(this.elements.items.length / this.options.noOfRows);
            if (this.options.noOfRows > 1 && this.noOfItems < this._getItemsPerPage()) this.noOfItems = this._getItemsPerPage()
        },
        _setNoOfPages: function() {
            this.noOfPages = Math.ceil((this.noOfItems -
            this._getItemsPerPage()) / this._getItemsPerTransition()) + 1
        },
        _getItemsPerTransition: function() {
            if (typeof this.options.itemsPerTransition === "number") return this.options.itemsPerTransition;
            return this._getItemsPerPage()
        },
        _setRunnerWidth: function(a) {
            if (this.isHorizontal) this.elements.runner.width(this.itemDim * (a || this.noOfItems))
        },
        _setLastPos: function() {
            var a = this.elements.items.eq(this.noOfItems - 1);
            if (a.length) this.lastPos = a.position()[this.helperStr.pos] + this.itemDim - this.maskDim - parseInt(a.css("margin-" +
            this.helperStr.pos2), 10)
        },
        _setLastItem: function() {
            this.lastItem = this.noOfItems - (this._getItemsPerPage() - 1)
        },
        _addPagination: function() {
            if (this.options.pagination) {
                var a = this,
                d = this.elements,
                e = this.options,
                i = [],
                j;
                this._removePagination();
                for (j = 1; j <= this.noOfPages; j++) i[j] = '<li><a href="#page-' + j + '">' + j + "</a></li>";
                d.pagination = b('<ol class="pagination-links" />').append(i.join("")).delegate("a", "click.carousel",
                function() {
                    a.goToPage(this.hash.split("-")[1]);
                    return false
                });
                b.isFunction(e.insertPagination) ?
                e.insertPagination.apply(d.pagination[0]) : d.pagination.insertAfter(d.mask)
            }
        },
        _removePagination: function() {
            if (this.elements.pagination) {
                this.elements.pagination.remove();
                this.elements.pagination = null
            }
        },
        goToPage: function(a, d) {
            var e = (a - 1) * this._getItemsPerTransition() + 1;
            this.oldItemIndex = this.itemIndex;
            this.itemIndex = e;
            this._slide(d)
        },
        goToItem: function(a, d) {
            if (typeof a !== "number") a = b(a).index() + 1;
            this.oldItemIndex = this.itemIndex;
            this.itemIndex = a;
            this._slide(d)
        },
        _addNextPrevActions: function() {
            if (this.options.nextPrevActions) {
                var a =
                this,
                d = this.elements,
                e = this.options;
                this._removeNextPrevActions();
                d.prevAction = b('<a href="#" class="prev">Prev</a>').bind("click.carousel",
                function() {
                    a.prev();
                    return false
                });
                d.nextAction = b('<a href="#" class="next">Next</a>').bind("click.carousel",
                function() {
                    a.next();
                    return false
                });
                b.isFunction(e.insertPrevAction) ? e.insertPrevAction.apply(d.prevAction[0]) : d.prevAction.appendTo(this.element);
                b.isFunction(e.insertNextAction) ? e.insertNextAction.apply(d.nextAction[0]) : d.nextAction.appendTo(this.element)
            }
        },
        _removeNextPrevActions: function() {
            var a = this.elements;
            if (a.nextAction) {
                a.nextAction.remove();
                a.nextAction = null
            }
            if (a.prevAction) {
                a.prevAction.remove();
                a.prevAction = null
            }
        },
        next: function() {
            this.oldItemIndex = this.itemIndex;
            this.itemIndex += this._getItemsPerTransition();
            this._slide()
        },
        prev: function() {
            this.oldItemIndex = this.itemIndex;
            this.itemIndex -= this._getItemsPerTransition();
            this._slide()
        },
        _updateUi: function() {
            var a = this.elements,
            d = this.itemIndex,
            e = this.noOfItems <= this._getItemsPerPage();
            if (this.options.pagination) e ?
            a.pagination.addClass("void") : a.pagination.children("li").removeClass("current").eq(this._getPage() - 1).addClass("current");
            if (this.options.nextPrevActions) {
                var i = a.nextAction.add(a.prevAction);
                i.removeClass("disabled");
                if (e) i.addClass("void");
                else {
                    i.removeClass("void");
                    if (d === this.lastItem) a.nextAction.addClass("disabled");
                    else d === 1 && a.prevAction.addClass("disabled")
                }
            }
        },
        _getPage: function(a) {
            a = a !== g ? a: this.itemIndex;
            a -= 1;
            return Math.ceil(a / this._getItemsPerTransition()) + 1
        },
        _slide: function(a) {
            var d =
            this;
            a = a === false ? 0: this.options.speed;
            var e = {},
            i;
            i = this._getPos();
            e[this.helperStr.pos] = -i;
            this._trigger("beforeAnimate", null, this._getData());
            this.elements.runner.stop().animate(e, a, this.options.easing,
            function() {
                d._trigger("afterAnimate", null, d._getData())
            });
            this._updateUi()
        },
        _getPos: function() {
            var a;
            if (this.itemIndex > this.lastItem) this.itemIndex = this.lastItem;
            else if (this.itemIndex < 1) this.itemIndex = 1;
            a = this.elements.items.eq(this.itemIndex - 1).position()[this.helperStr.pos];
            if (a > this.lastPos) a =
            this.lastPos;
            return a
        },
        _getData: function() {
            return {
                index: this.itemIndex,
                page: this._getPage(),
                oldIndex: this.oldItemIndex,
                oldPage: this._getPage(this.oldItemIndex),
                noOfItems: this.noOfItems,
                noOfPages: this.noOfPages,
                elements: this.elements
            }
        },
        refresh: function(a) {
            this.elements.items = a || this.elements.runner.children("li");
            this._addClasses();
            this._setMaskDim();
            this._setItemDim();
            this._setNoOfItems();
            this._setRunnerWidth();
            this._setLastPos();
            this._setLastItem();
            this._setNoOfPages();
            this._addPagination();
            this.goToItem(this.itemIndex,
            false);
            this._updateUi()
        },
        _setOption: function(a, d) {
            var e = this.elements,
            i = this.options;
            c._setOption.apply(this, arguments);
            switch (a) {
            case "itemsPerPage":
                this.refresh();
                break;
            case "itemsPerTransition":
                this.refresh();
                break;
            case "noOfRows":
                if (this.isHorizontal) this.refresh();
                else i.noOfRows = 1;
                break;
            case "orientation":
                e.runner.width("");
                e.runner.css(this.helperStr.pos, "");
                this._defineOrientation();
                this.refresh();
                break;
            case "pagination":
                if (d) {
                    this._addPagination();
                    this._updateUi()
                } else this._removePagination();
                break;
            case "nextPrevActions":
                if (d) {
                    this._addNextPrevActions();
                    this._updateUi()
                } else this._removeNextPrevActions()
            }
        },
        destroy: function() {
            var a = this.elements,
            d = {};
            this.element.removeClass().addClass(this.oldClass);
            this.maskAdded && a.runner.unwrap(".mask");
            d[this.helperStr.pos] = "";
            d[this.helperStr.dim] = "";
            a.runner.css(d);
            this._removePagination();
            this._removeNextPrevActions();
            c.destroy.apply(this, arguments)
        }
    });
    b.ui.carousel.version = "0.7.4"
})(jQuery); (function(b) {
    var g = b.ui.carousel.prototype;
    b.widget("ui.carousel", b.ui.carousel, {
        options: {
            pause: 8E3,
            autoScroll: false
        },
        _create: function() {
            g._create.apply(this);
            if (this.options.autoScroll) {
                this._bindAutoScroll();
                this._start()
            }
        },
        _bindAutoScroll: function() {
            if (!this.autoScrollInitiated) {
                this.element.bind("touchstart." + this.widgetName + " mouseover." + this.widgetName, b.proxy(this, "_stop")).bind("touchend." + this.widgetName + " mouseout." + this.widgetName, b.proxy(this, "_start"));
                this.autoScrollInitiated = true
            }
        },
        _unbindAutoScroll: function() {
            this.element.unbind("mouseover." + this.widgetName).unbind("mouseout." + this.widgetName);
            this.autoScrollInitiated = false
        },
        _start: function() {
            var c = this;
            this.interval = setInterval(function() {
                c.itemIndex === c.lastItem ? c.goToItem(1) : c.next()
            },
            this.options.pause)
        },
        _stop: function() {
            clearInterval(this.interval)
        },
        _setOption: function(c, f) {
            g._setOption.apply(this, arguments);
            switch (c) {
            case "autoScroll":
                this._stop();
                if (f) {
                    this._bindAutoScroll();
                    this._start()
                } else this._unbindAutoScroll()
            }
        },
        destroy: function() {
            g.destroy.apply(this);
            this._stop()
        }
    })
})(jQuery); (function(b) {
    var g = b.ui.carousel.prototype;
    b.widget("ui.carousel", b.ui.carousel, {
        options: {
            continuous: true
        },
        _create: function() {
            g._create.apply(this, arguments);
            if (this.options.continuous) {
                this.options.pagination && this.noOfItems % this._getItemsPerTransition() != 0 && console && console.warn && console.warn("jquery.ui.carousel: number of items isn't divisible by itemsPerTransition meaning current page cannot be accurately deteremined");
                this._addClonedItems();
                this._setRunnerWidth(this.elements.runner.children("li").length /
                this.options.noOfRows);
                this.options.startAt || this.goToItem(0, false)
            }
        },
        _addClonedItems: function() {
            var c = this.elements,
            f = this._getItemsPerTransition() + this._getItemsPerPage(),
            h = this.noOfItems - this._getItemsPerTransition() - 1;
            this._removeClonedItems();
            c.clonedBeginning = b(this.elements.items.eq(f).prevAll().clone().removeAttr("id").addClass("ui-carousel-cloned").get().reverse());
            c.clonedEnd = this.elements.items.eq(h).nextAll().clone().removeAttr("id").addClass("ui-carousel-cloned").prependTo(this.elements.runner);
            c.clonedBeginning.appendTo(c.runner);
            c.clonedEnd.prependTo(c.runner)
        },
        _removeClonedItems: function() {
            var c = this.elements;
            c.clonedBeginning && c.clonedBeginning.remove();
            c.clonedEnd && c.clonedEnd.remove()
        },
        _getPos: function() {
            if (this.options.continuous) {
                var c = this.elements,
                f = {};
                if (this.itemIndex > this.noOfItems - 1) {
                    var h = this.noOfItems - 1 - this.oldItemIndex;
                    h = this._getItemsPerTransition() - 1 - h;
                    f[this.helperStr.pos] = -c.clonedEnd.eq(h).position()[this.helperStr.pos];
                    c.runner.css(f);
                    this.itemIndex = h
                } else if (this.itemIndex <
                0) {
                    f[this.helperStr.pos] = -c.clonedBeginning.eq(this.oldItemIndex).position()[this.helperStr.pos];
                    c.runner.css(f);
                    this.itemIndex = this.noOfItems - (this._getItemsPerTransition() - this.oldItemIndex)
                }
                return c.items.eq(this.itemIndex).position()[this.helperStr.pos]
            } else return g._getItemIndex.apply(this, arguments)
        },
        refresh: function(c) {
            if (this.options.continuous) {
                c = this.elements.runner.children("li");
                g.refresh.call(this, c.filter(":not(.ui-carousel-cloned)"));
                this._setRunnerWidth(this.elements.runner.children("li").length /
                this.options.noOfRows)
            } else g.refresh.apply(this, arguments)
        },
        _setOption: function(c, f) {
            g._setOption.apply(this, arguments);
            switch (c) {
            case "continuous":
                if (f) this._addClonedItems();
                else {
                    this._removeClonedItems();
                    this._setLastPos()
                }
                this.refresh()
            }
        },
        destroy: function() {
            this._removeClonedItems();
            g.destroy.apply(this)
        }
    })
})(jQuery); (function(b) {
    function g(d) {
        var e = {},
        i = /^jQuery\d+$/;
        b.each(d.attributes,
        function(j, k) {
            if (k.specified && !i.test(k.name)) e[k.name] = k.value
        });
        return e
    }
    function c() {
        var d = b(this);
        if (d.val() === d.attr("placeholder") && d.hasClass("placeholder")) d.data("placeholder-password") ? d.hide().next().attr("id", d.removeAttr("id").data("placeholder-id")).show().focus() : d.val("").removeClass("placeholder")
    }
    function f() {
        var d,
        e = b(this),
        i = this.id;
        if (e.val() === "") {
            if (e.is(":password")) {
                if (!e.data("placeholder-textinput")) {
                    try {
                        d =
                        e.clone().attr({
                            type: "text"
                        })
                    } catch(j) {
                        d = b("<input>").attr(b.extend(g(this), {
                            type: "text"
                        }))
                    }
                    d.removeAttr("name").data("placeholder-password", true).data("placeholder-id", i).bind("focus.placeholder", c);
                    e.data("placeholder-textinput", d).data("placeholder-id", i).before(d)
                }
                e = e.removeAttr("id").hide().prev().attr("id", i).show()
            }
            e.addClass("placeholder").val(e.attr("placeholder"))
        } else e.removeClass("placeholder")
    }
    var h = "placeholder" in document.createElement("input"),
    a = "placeholder" in document.createElement("textarea");
    if (h && a) {
        b.fn.placeholder = function() {
            return this
        };
        b.fn.placeholder.input = b.fn.placeholder.textarea = true
    } else {
        b.fn.placeholder = function() {
            return this.filter((h ? "textarea": ":input") + "[placeholder]").bind("focus.placeholder", c).bind("blur.placeholder", f).trigger("blur.placeholder").end()
        };
        b.fn.placeholder.input = h;
        b.fn.placeholder.textarea = a
    }
    b(function() {
        b("form").bind("submit.placeholder",
        function() {
            var d = b(".placeholder", this).each(c);
            setTimeout(function() {
                d.each(f)
            },
            10)
        })
    });
    b(window).bind("unload.placeholder",
    function() {
        b(".placeholder").val("")
    })
})(jQuery); (function(b) {
    var g = {};
    b.publish = function(c, f) {
        g[c] && b.each(g[c],
        function() {
            this.apply(b, f || [])
        });
        return false
    };
    b.subscribe = function(c, f) {
        g[c] || (g[c] = []);
        g[c].push(f);
        return [c, f]
    };
    b.unsubscribe = function(c) {
        var f = c[0];
        g[f] && b.each(g[f],
        function(h) {
            this == c[1] && g[f].splice(h, 1)
        })
    }
})(jQuery); (function(b) {
    $.fn.waiting = function(c) {
        var f = $(this),
        h = f.html();
        f.text(c);
        return function(a) {
            f.html(a ? a: h);
            return h
        }
    };
    var g = false;
    b.landing_page = {
        disable_sharing_widget: function() {
            $("body").delegate(".btnx .app-download-link", "click",
            function() {
                return false
            })
        },
        enable_sharing_widget: function() {
            $(".btnx .app-download-link").bind("click",
            function(c) {
                c.preventDefault();
                g = g ? g: $("#dialog .title-markup").html();
                $("#dialog .title-markup").remove();
                $("#dialog").dialog({
                    modal: true,
                    resizable: false,
                    draggable: false,
                    title: g,
                    width: 600
                });
                $("#dialog input").placeholder();
                if (!$(this).data("saw_modal")) {
                    $.post("/api/log_stat_event", {
                        stat_id: 13,
                        app_id: page_context.app_id
                    });
                    $(this).data("saw_modal", true)
                }
                return false
            });
            $("#dialog form").bind("submit",
            function(c) {
                var f = $(this),
                h = f.data("app-pk"),
                a = $("input", f),
                d = $("button", f),
                e = d.html(),
                i;
                $("#dialog .error").hide();
                c.preventDefault();
                if (a.val().length < 10 && a.val().indexOf("@") < 0) $("#dialog .error.invalid").show();
                else {
                    i = d.waiting("Sending...");
                    if (!f.data("sending")) {
                        f.data("sending",
                        true);
                        $.ajax({
                            type: "POST",
                            url: "/api/send_link",
                            data: {
                                to: a.val(),
                                pk: h
                            },
                            success: function() {
                                i("Sent!");
                                $(".widget-body-action").addClass("no-display");
                                $(".widget-body-success").removeClass("no-display");
                                $(".widget-body-success .success-message span").text(a.val());
                                setTimeout(function() {
                                    $("#dialog").dialog("close");
                                    a.val("");
                                    d.html(e);
                                    $("#dialog .error").hide();
                                    $(".widget-body-action").removeClass("no-display");
                                    $(".widget-body-success").addClass("no-display")
                                },
                                2E3)
                            },
                            error: function(j, k, l) {
                                console.log(l);
                                e = i();
                                a.val("");
                                if (l === "email") $("#dialog .error.email").show();
                                else l === "sms" ? $("#dialog .error.sms").show() : $("#dialog .error.generic").show()
                            },
                            complete: function() {
                                f.data("sending", false)
                            }
                        })
                    }
                }
            })
        },
        enable_carousel: function() {
            $(".screenshot-carousel .picture-holder li").length > 1 && $(".screenshot-carousel .picture-holder").carousel({
                itemsPerTransition: 1,
                pagination: false,
                autoScroll: true
            })
        },
        placeholder: function() {
            $("input, textarea").placeholder()
        },
        forms: function() {
            $("body").delegate("input[name=permalink]",
            "click",
            function() {
                this.select()
            })
        }
    };
    $.each(b.landing_page,
    function(c, f) {
        $.subscribe(c, f)
    })
})(TAPP);
$(document).ready(function() {
    if (page_context.readyView) $.isArray(page_context.readyView) ? $.each(page_context.readyView,
    function(b, g) {
        $.publish(g)
    }) : $.publish(page_context.readyView)
});
