var image_map = {};
function get_img_url(d) {
    var g = "https:" == document.location.protocol ? "https_url": "http_url";
    if (!image_map[d] || typeof image_map[d][g] === "undefined") {
        console.log("get_img_url failed for", d);
        return false
    }
    return image_map[d][g]
};
if (typeof window.console === "undefined") window.console = {
    log: function() {
        return true
    }
};
if (typeof window.TAPP === "undefined") window.TAPP = {};
$._ajax = $.ajax;
$.ajax = function(d) {
    var g = d.success;
    d.success = function(b, f, h) {
        var a = b && b.result ? b.result: null,
        c = b && b.value ? b.value: "ajax failed",
        e = b && b.text ? b.text: "ajax failed";
        if (a && a !== "ok") this.error && this.error(h, c, e);
        else g && g(b, f, h)
    };
    return $._ajax(d)
}; (function(d, g) {
    var b = d.Widget.prototype,
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
    d.widget("ui.carousel", {
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
            c = [];
            c.push(a);
            c.push(a + "-" + this.options.orientation);
            c.push(a + "-items-" + this.options.itemsPerPage);
            c.push(a + "-rows-" + this.options.noOfRows);
            this.element.addClass(c.join(" "))
        },
        _removeClasses: function() {
            var a = [],
            c,
            e;
            this.element.removeClass(function(i, j) {
                j = j.split(" ");
                d.each(j,
                function(k) {
                    c = j[k];
                    e = c.split("-");
                    e[0] ===
                    "ui" && e[1] === "carousel" && a.push(c)
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
                c = this.elements,
                e = this.options,
                i = [],
                j;
                this._removePagination();
                for (j = 1; j <= this.noOfPages; j++) i[j] = '<li><a href="#page-' + j + '">' + j + "</a></li>";
                c.pagination = d('<ol class="pagination-links" />').append(i.join("")).delegate("a", "click.carousel",
                function() {
                    a.goToPage(this.hash.split("-")[1]);
                    return false
                });
                d.isFunction(e.insertPagination) ?
                e.insertPagination.apply(c.pagination[0]) : c.pagination.insertAfter(c.mask)
            }
        },
        _removePagination: function() {
            if (this.elements.pagination) {
                this.elements.pagination.remove();
                this.elements.pagination = null
            }
        },
        goToPage: function(a, c) {
            var e = (a - 1) * this._getItemsPerTransition() + 1;
            this.oldItemIndex = this.itemIndex;
            this.itemIndex = e;
            this._slide(c)
        },
        goToItem: function(a, c) {
            if (typeof a !== "number") a = d(a).index() + 1;
            this.oldItemIndex = this.itemIndex;
            this.itemIndex = a;
            this._slide(c)
        },
        _addNextPrevActions: function() {
            if (this.options.nextPrevActions) {
                var a =
                this,
                c = this.elements,
                e = this.options;
                this._removeNextPrevActions();
                c.prevAction = d('<a href="#" class="prev">Prev</a>').bind("click.carousel",
                function() {
                    a.prev();
                    return false
                });
                c.nextAction = d('<a href="#" class="next">Next</a>').bind("click.carousel",
                function() {
                    a.next();
                    return false
                });
                d.isFunction(e.insertPrevAction) ? e.insertPrevAction.apply(c.prevAction[0]) : c.prevAction.appendTo(this.element);
                d.isFunction(e.insertNextAction) ? e.insertNextAction.apply(c.nextAction[0]) : c.nextAction.appendTo(this.element)
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
            c = this.itemIndex,
            e = this.noOfItems <= this._getItemsPerPage();
            if (this.options.pagination) e ?
            a.pagination.addClass("void") : a.pagination.children("li").removeClass("current").eq(this._getPage() - 1).addClass("current");
            if (this.options.nextPrevActions) {
                var i = a.nextAction.add(a.prevAction);
                i.removeClass("disabled");
                if (e) i.addClass("void");
                else {
                    i.removeClass("void");
                    if (c === this.lastItem) a.nextAction.addClass("disabled");
                    else c === 1 && a.prevAction.addClass("disabled")
                }
            }
        },
        _getPage: function(a) {
            a = a !== g ? a: this.itemIndex;
            a -= 1;
            return Math.ceil(a / this._getItemsPerTransition()) + 1
        },
        _slide: function(a) {
            var c =
            this;
            a = a === false ? 0: this.options.speed;
            var e = {},
            i;
            i = this._getPos();
            e[this.helperStr.pos] = -i;
            this._trigger("beforeAnimate", null, this._getData());
            this.elements.runner.stop().animate(e, a, this.options.easing,
            function() {
                c._trigger("afterAnimate", null, c._getData())
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
        _setOption: function(a, c) {
            var e = this.elements,
            i = this.options;
            b._setOption.apply(this, arguments);
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
                if (c) {
                    this._addPagination();
                    this._updateUi()
                } else this._removePagination();
                break;
            case "nextPrevActions":
                if (c) {
                    this._addNextPrevActions();
                    this._updateUi()
                } else this._removeNextPrevActions()
            }
        },
        destroy: function() {
            var a = this.elements,
            c = {};
            this.element.removeClass().addClass(this.oldClass);
            this.maskAdded && a.runner.unwrap(".mask");
            c[this.helperStr.pos] = "";
            c[this.helperStr.dim] = "";
            a.runner.css(c);
            this._removePagination();
            this._removeNextPrevActions();
            b.destroy.apply(this, arguments)
        }
    });
    d.ui.carousel.version = "0.7.4"
})(jQuery); (function(d) {
    var g = d.ui.carousel.prototype;
    d.widget("ui.carousel", d.ui.carousel, {
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
                this.element.bind("touchstart." + this.widgetName + " mouseover." + this.widgetName, d.proxy(this, "_stop")).bind("touchend." + this.widgetName + " mouseout." + this.widgetName, d.proxy(this, "_start"));
                this.autoScrollInitiated = true
            }
        },
        _unbindAutoScroll: function() {
            this.element.unbind("mouseover." + this.widgetName).unbind("mouseout." + this.widgetName);
            this.autoScrollInitiated = false
        },
        _start: function() {
            var b = this;
            this.interval = setInterval(function() {
                b.itemIndex === b.lastItem ? b.goToItem(1) : b.next()
            },
            this.options.pause)
        },
        _stop: function() {
            clearInterval(this.interval)
        },
        _setOption: function(b, f) {
            g._setOption.apply(this, arguments);
            switch (b) {
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
})(jQuery); (function(d) {
    var g = d.ui.carousel.prototype;
    d.widget("ui.carousel", d.ui.carousel, {
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
            var b = this.elements,
            f = this._getItemsPerTransition() + this._getItemsPerPage(),
            h = this.noOfItems - this._getItemsPerTransition() - 1;
            this._removeClonedItems();
            b.clonedBeginning = d(this.elements.items.eq(f).prevAll().clone().removeAttr("id").addClass("ui-carousel-cloned").get().reverse());
            b.clonedEnd = this.elements.items.eq(h).nextAll().clone().removeAttr("id").addClass("ui-carousel-cloned").prependTo(this.elements.runner);
            b.clonedBeginning.appendTo(b.runner);
            b.clonedEnd.prependTo(b.runner)
        },
        _removeClonedItems: function() {
            var b = this.elements;
            b.clonedBeginning && b.clonedBeginning.remove();
            b.clonedEnd && b.clonedEnd.remove()
        },
        _getPos: function() {
            if (this.options.continuous) {
                var b = this.elements,
                f = {};
                if (this.itemIndex > this.noOfItems - 1) {
                    var h = this.noOfItems - 1 - this.oldItemIndex;
                    h = this._getItemsPerTransition() - 1 - h;
                    f[this.helperStr.pos] = -b.clonedEnd.eq(h).position()[this.helperStr.pos];
                    b.runner.css(f);
                    this.itemIndex = h
                } else if (this.itemIndex <
                0) {
                    f[this.helperStr.pos] = -b.clonedBeginning.eq(this.oldItemIndex).position()[this.helperStr.pos];
                    b.runner.css(f);
                    this.itemIndex = this.noOfItems - (this._getItemsPerTransition() - this.oldItemIndex)
                }
                return b.items.eq(this.itemIndex).position()[this.helperStr.pos]
            } else return g._getItemIndex.apply(this, arguments)
        },
        refresh: function(b) {
            if (this.options.continuous) {
                b = this.elements.runner.children("li");
                g.refresh.call(this, b.filter(":not(.ui-carousel-cloned)"));
                this._setRunnerWidth(this.elements.runner.children("li").length /
                this.options.noOfRows)
            } else g.refresh.apply(this, arguments)
        },
        _setOption: function(b, f) {
            g._setOption.apply(this, arguments);
            switch (b) {
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
})(jQuery); (function(d) {
    function g(c) {
        var e = {},
        i = /^jQuery\d+$/;
        d.each(c.attributes,
        function(j, k) {
            if (k.specified && !i.test(k.name)) e[k.name] = k.value
        });
        return e
    }
    function b() {
        var c = d(this);
        if (c.val() === c.attr("placeholder") && c.hasClass("placeholder")) c.data("placeholder-password") ? c.hide().next().attr("id", c.removeAttr("id").data("placeholder-id")).show().focus() : c.val("").removeClass("placeholder")
    }
    function f() {
        var c,
        e = d(this),
        i = this.id;
        if (e.val() === "") {
            if (e.is(":password")) {
                if (!e.data("placeholder-textinput")) {
                    try {
                        c =
                        e.clone().attr({
                            type: "text"
                        })
                    } catch(j) {
                        c = d("<input>").attr(d.extend(g(this), {
                            type: "text"
                        }))
                    }
                    c.removeAttr("name").data("placeholder-password", true).data("placeholder-id", i).bind("focus.placeholder", b);
                    e.data("placeholder-textinput", c).data("placeholder-id", i).before(c)
                }
                e = e.removeAttr("id").hide().prev().attr("id", i).show()
            }
            e.addClass("placeholder").val(e.attr("placeholder"))
        } else e.removeClass("placeholder")
    }
    var h = "placeholder" in document.createElement("input"),
    a = "placeholder" in document.createElement("textarea");
    if (h && a) {
        d.fn.placeholder = function() {
            return this
        };
        d.fn.placeholder.input = d.fn.placeholder.textarea = true
    } else {
        d.fn.placeholder = function() {
            return this.filter((h ? "textarea": ":input") + "[placeholder]").bind("focus.placeholder", b).bind("blur.placeholder", f).trigger("blur.placeholder").end()
        };
        d.fn.placeholder.input = h;
        d.fn.placeholder.textarea = a
    }
    d(function() {
        d("form").bind("submit.placeholder",
        function() {
            var c = d(".placeholder", this).each(b);
            setTimeout(function() {
                c.each(f)
            },
            10)
        })
    });
    d(window).bind("unload.placeholder",
    function() {
        d(".placeholder").val("")
    })
})(jQuery); (function(d) {
    var g = {};
    d.publish = function(b, f) {
        g[b] && d.each(g[b],
        function() {
            this.apply(d, f || [])
        });
        return false
    };
    d.subscribe = function(b, f) {
        g[b] || (g[b] = []);
        g[b].push(f);
        return [b, f]
    };
    d.unsubscribe = function(b) {
        var f = b[0];
        g[f] && d.each(g[f],
        function(h) {
            this == b[1] && g[f].splice(h, 1)
        })
    }
})(jQuery); (function(d) {
    $.fn.waiting = function(b) {
        var f = $(this),
        h = f.html();
        f.text(b);
        return function(a) {
            f.html(a ? a: h);
            return h
        }
    };
    var g = false;
    d.landing_page = {
        enable_sharing_widget: function() {
            $(".btnx .app-download-link").bind("click",
            function(b) {
                b.preventDefault();
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
                    $.post("/api/log_stat_event",
                    {
                        stat_id: 13,
                        app_id: page_context.app_id
                    });
                    $(this).data("saw_modal", true)
                }
                return false
            });
            $("#dialog form").bind("submit",
            function(b) {
                var f = $(this),
                h = f.data("app-pk"),
                a = $("input", f),
                c = $("button", f),
                e = c.html(),
                i;
                $("#dialog .error").hide();
                b.preventDefault();
                if (a.val().length < 10 && a.val().indexOf("@") < 0) $("#dialog .error.invalid").show();
                else {
                    i = c.waiting("Sending...");
                    if (!f.data("sending")) {
                        f.data("sending", true);
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
                                    c.html(e);
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
                                else l === "sms" ? $("#dialog .error.sms").show() :
                                $("#dialog .error.generic").show()
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
            $("body").delegate("input[name=permalink]", "click",
            function() {
                this.select()
            })
        }
    };
    $.each(d.landing_page,
    function(b, f) {
        $.subscribe(b, f)
    })
})(TAPP);
$(document).ready(function() {
    if (page_context.readyView) $.isArray(page_context.readyView) ? $.each(page_context.readyView,
    function(d, g) {
        $.publish(g)
    }) : $.publish(page_context.readyView)
});
