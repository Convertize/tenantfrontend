const BaseView = $.Class.create({
    api: axios.create({
        baseURL: "/api/1.0/public"
    }),
    storage: window.localStorage,
    init: function(){
        log("Init BaseView");
        this.cart();
        this.seals();
        this.carousel();
        this.addProduct();
        this.formSearch();
        this.bind_events();
        this.fixedHeader();
        // this.horizontalScroll();
        this.api.interceptors.request.use(request => {
            // log('Starting Request')
            // JSON.stringify(request, null, 2)
            return request
        })
    },
    seals: function(){
        // $(".item-product .buy_max_pay_low").each(function(){
        //     if($(this).closest(".item-product").find(".box-seal-leve-pague").length || !$(this).closest(".item-product").find("input[name=price]").length) return;
        //     const value = ($(this).closest(".item-product").find("input[name=price]").val() / $(this).attr("buy") * $(this).attr("pay")).toCurrency();
        //     const $box = $(`<div class="float box-seal-leve-pague"><p>Leve ${$(this).attr("buy")} e pague <span>${value}</span> cada </p></div>`);
        //     $(this).closest(".item-product").find(".box-prices").append($box);
        // });
        // $(".item-product .percent_off_second").each(function(){
        //     if($(this).closest(".item-product").find(".box-seal-off-segunda-uni").length || !$(this).closest(".item-product").find("input[name=price]").length) return;
        //     const value = (($(this).closest(".item-product").find("input[name=price]").val() * $(this).attr("qtd") - $(this).closest(".item-product").find("input[name=price]").val() * $(this).attr("percentage")) / $(this).attr("qtd")).toCurrency();
        //     const $box = $(`<div class="float box-seal-off-segunda-uni"><p>Na compra da 2ª unidade sai por <br /><span>${value}</span> cada</p></div>`);
        //     $(this).closest(".item-product").find(".box-prices").append($box);
        // });
        $(".item-product .seal-desconto-progressivo").each(function(){
            if($(this).closest(".item-product").find(".box-seal-leve-pague").length || !$(this).closest(".item-product").find("input[name=price]").length) return;
            // const price = fromCurrencyToFloat($(this).closest(".item-product").find(".sale-price").text());
            // const value = roundToTwo(price - (price * $(this).attr("percentage"))).toCurrency();
            // const quantity = $(this).attr("qtd");
            // const $box = $(`<div class="float box-seal-leve-pague desconto-progressivo"><p>Na compra da ${quantity}ª unidade sai por <br /><span>${value}</span> cada</p></div>`);
            // $(this).closest(".item-product").find(".box-prices").append($box);
            $(this).closest(".item-product").find(".seals").append(`<span class="seal multipack_product"><span>Leve mais</span></span>`);
        });
    },
    fixedHeader: function(){
        $("body").addClass("fixed");
        $("#main-wrapper").css("paddingTop", `${$("#main-wrapper > .header").height()}px`);
    },
    baseFunctions: function(){
        $(".img-lazy:not(.loaded)").show().lazyload({
            data_attribute:"src",
            effect: "show"
        });
        $("input[name=quantity]").spinner({
            min: 1
        });
        if($("body").hasClass("is_mobile")){
            $("body").off("click.convertize", ".ui-spinner-input")
            $("body").on("click.convertize", ".ui-spinner-input", function(e){
                const val = $(this).val();
                $(this).removeAttr("readonly").val("").val(val).focus();
            });
            $("body").off("blur.convertize", ".ui-spinner-input")
            $("body").on("blur.convertize", ".ui-spinner-input", function(e){
                $(this).attr("readonly", "readonly");
            });
        }
    },
    bind_events: function(){
        const self = this;
        this.baseFunctions();
        $("body").off("click.convertize", ".bt-open-page");
        $("body").on("click.convertize", ".bt-open-page", function(e){
            e.preventDefault();
            const target = $(this).data("target");

            if(target == "#mini-cart" && $(target).hasClass("loading")){
                self.loadCart();
            }else if(target == "#floating-menu" && $("#menuMobile").is(":empty")){
                $("#menuMobile").html(menuMobileTemplate)
            }else if(target == "#floating-sidebar"){
                const sidebarHTML = $("#main-wrapper .sidebar").clone();
                $("#floating-sidebar .content-page").html(sidebarHTML);
            };

            $("html,body").addClass("open-page");
            $(".floating-page").removeClass("active");
            $(target).addClass("active");
            setTimeout(function(){
                if($(target).find(".autofocus").length){
                    const val = $(target).find(".autofocus").val();
                    $(target).find(".autofocus").val("").val(val).focus();
                };
            }, 100);
        });

        $("body").off("click.convertize", ".mask-floating-page, .floating-page .close");
        $("body").on("click.convertize", ".mask-floating-page, .floating-page .close", function(e){
            e.preventDefault();
            $("html,body").removeClass("open-page");
            $(".floating-page").removeClass("active");
        });

        $(".countdown").each(function(){
            const finalDate = $(this).data("datetime");
            $(this).countdown(finalDate, function(event){
                $(this).html(`<div class="d-flex justify-content-around">
                    <div class="day">
                        ${event.strftime("%D")}
                    </div>
                    <div class="hour">
                        ${event.strftime("%H")}
                    </div>
                    <div class="minute">
                        ${event.strftime("%M")}
                    </div>
                    <div class="second">
                        ${event.strftime("%S")}
                    </div>
                </div>`);
            });
        });

        $("body").off("click.convertize", "#nav-inside .content-nav-inside a");
        $("body").on("click.convertize", "#nav-inside .content-nav-inside a", self.mobileNavbar);

        $("body").off("click.convertize", ".bt-menu-navbar");
        $("body").on("click.convertize", ".bt-menu-navbar", function(e){
            e.preventDefault();
            $(this).addClass("active");
            $("#menuDepartament").addClass("active");
        });
        $("body").off("click.convertize", "#menuDepartament .mask");
        $("body").on("click.convertize", "#menuDepartament .mask", function(e){
            e.preventDefault();
            $("#menuDepartament, .bt-menu-navbar").removeClass("active");
        });

        // Close elements by ESC
        $(document).keyup(function(e){
            if(e.key === "Escape"){
                if($("#menuDepartament, .bt-menu-navbar").hasClass("active")) $("#menuDepartament, .bt-menu-navbar").removeClass("active");
                if($("html,body").hasClass("open-page")){
                    $("html,body").removeClass("open-page");
                    $(".floating-page").removeClass("active");
                };
                if($(".autocomplete").removeClass("hasClass")){
                    $(".autocomplete").parent().find("input[type=text]").blur();
                    $(".autocomplete").removeClass("active");
                }
                $(".modal").modal("hide");
            }
        });
    },
    formSearch: function(){
        const self = this;
        $("body").off("focus.convertize", ".form-search.desktop input");
        $("body").on("focus.convertize", ".form-search.desktop input", function(e){
            e.preventDefault();
            $(this).parent().find(".autocomplete").addClass("active");
        });

        $("body").off("click.convertize", ".form-search .close");
        $("body").on("click.convertize", ".form-search .close", function(e){
            e.preventDefault();
            $(this).closest(".form-search").find(".autocomplete").removeClass("active");
        });

        $("body").off("keyup.convertize", ".form-search input");
        $("body").on("keyup.convertize", ".form-search input", function(e){
            e.preventDefault();
            const $form = $(this).closest("#floating-search").length ? $(this).closest("#floating-search"):$(this).closest(".form-search");
            if($(this).val()){
                $form.find(".not-results").hide();
                $form.find(".results").show();
            }else{
                $form.find(".not-results").show();
                $form.find(".results").hide();
            };
        });

        if(typeof menuPopularWordsTemplate !== "undefined"){
            $(".popular-words").html(menuPopularWordsTemplate);
        };

        $(".form-search input").autocomplete({
            source: async function(request){
                const response = await axios.get(`${window.__url_path__}busca/suggest/?query_term=${request.term}`);
                if(response.status == 200 && response.data && response.data.result_list){
                    const listItems = [];
                    response.data.result_list.map(function(item){
                        log(item);
                        if(item.type === "sku"){
                            listItems.push(`<a href="/${item.url}/p" class="d-flex align-items-center mb-2 mt-2">
                                ${item.image ?
                                    `<span class="item-image mr-2"><img src="${window.__media_prefix__}${item.image.replace("/small/", "/mini/")}" width="65" height="65" alt="" /></span>`
                                :
                                    `<span class="item-image mr-2"><img src="${window.__static_prefix__}img/blank.png" width="65" height="65" alt="" /></span>`
                                }
                                <span class="title">
                                    ${item.name}
                                </span>
                            </a>`);
                        }
                    })
                    $("#floating-search, .form-search .autocomplete").find(".results").html(listItems.join(""))
                }
            },
            minLength: 2,
            select: function(event, ui){
                log( "Selected: " + ui.item.value + " aka " + ui.item.id );
            }
        });

        $("body").off("submit.convertize", ".form-search form")
        $("body").on("submit.convertize", ".form-search form", function(e){
            const value = $(this).find("input[name=q]").val();
            const words = JSON.parse(self.storage.getItem("cvz_last_search") || "[]");
            words.unshift(value)
            self.storage.setItem("cvz_last_search", JSON.stringify(words.filter((v, i, a) => a.indexOf(v) === i)))
        });

        $(document).on("click", function(e){
            if(!$(e.target).closest(".form-search").length) $(".autocomplete.active").removeClass("active");
        });

        const words = JSON.parse(self.storage.getItem("cvz_last_search") || "[]");

        if(words.length){
            $("#floating-search, .form-search .autocomplete").find(".not-results").prepend(`
                <p class="h6">Últimas pesquisas</p>
                <ul class="last-search mb-3"></ul>
            `);
            words.slice(0,6).map(function(w){
                $("#floating-search, .form-search .autocomplete").find("ul.last-search").append(`<li>
                    <a href="#" data-word="${w}">
                        <i class="icon-history mr-2"></i>
                        ${w}
                    </a>
                    <i class="icon-trash remove" data-word="${w}"></i>
                </li>`);
            });
            $("#floating-search, .form-search .autocomplete").find("ul.last-search a").on("click.convertize", function(e){
                e.preventDefault();
                const $form = $(this).closest("#floating-search").length ? $(this).closest("#floating-search"):$(this).closest(".form-search");
                $form.find("input[name=q]").val($(this).data("word"));
                $form.find("form").trigger("submit.convertize");
            });
            $("#floating-search, .form-search .autocomplete").find("ul.last-search .remove").on("click.convertize", function(e){
                const word = $(this).data("word");
                const words = JSON.parse(self.storage.getItem("cvz_last_search") || "[]");
                self.storage.setItem("cvz_last_search", JSON.stringify(words.filter((v) => v != word)))
                $(this).closest("li").hide();
            });
        }
    },
    addProduct: function(){
        const self = this;

        $("body").off("click.convertize", ".product-form .btn-checkout");
        $("body").on("click.convertize", ".product-form .btn-checkout", function(e){
            e.preventDefault();

            const $bt = $(this);
            const $form = $(this).closest(".product-form");

            $bt.addClass("loading").prop("disabled", true);

            if($form.data("validator")){
                $form.submit();
                return true;
            };

            const data_rules = {};
            const data_messages = {};

            $form.find(".form-group.required select, .form-group.required input[type=radio]").each(function(){
                const name = $(this).attr("name");
                data_rules[name] = {
                    required: true
                };
                data_messages[name] = {
                    required: "Selecione uma opção!"
                };
            });

            $form.validate({
                rules: data_rules,
                messages: data_messages,
                errorElement: "p",
                errorPlacement: function(error, element){
                    element.closest(".variations").addClass("error");
                    var ul = $(`<div class="errorlist" />`).html(error);
                    if(!error.html()) return;
                    element.closest(".variations").append(ul);            
                },
                submitHandler: async function(form, event){
                    event.preventDefault();

                    const body = {
                        options: []
                    }
                    $(form).serializeArray().map(function(item){
                        if(item.name.indexOf("option_") >= 0){
                            body.options.push(item.value);
                        }else{
                            body[item.name] = item.value;
                        };
                    });
                    body.quantity = parseInt(body.quantity || "1");

                    try{
                        const response = await self.api.post("/order/", {
                            products: [body]
                        });
                        const resp = response.data;
                        self.renderCart(resp);
                        $bt.addClass("added");
                        setTimeout(function(){
                            $bt.removeClass("added");
                        }, 5000);
                    }catch(err){
                        if(err.response && err.response.data && err.response.data.messages){
                            err.response.data.messages.map(function(message){
                                $.toast({
                                    hideAfter: 7000,
                                    icon: message.level.toLowerCase(),
                                    text: message.message,
                                    position: "bottom-center",
                                    showHideTransition: "plain",
                                    beforeShow: function(){
                                        $(".jq-toast-loader").addClass("jq-toast-loaded")
                                    }
                                });
                            });
                        };
                    }

                    $bt.removeClass("loading").prop("disabled", false);

                    return false;
                }
            });
            $form.trigger("submit.validate");
        });
    },
    cart: function(){
        const self = this;
        $("body").off("blur.convertize", "#mini-cart input[name=quantity]");
        $("body").on("blur.convertize", "#mini-cart input[name=quantity]", async function(e){
            e.preventDefault();
            const $this = $(this);
            const uuid = Cookies.get("convertize_cart_id");
            const url = `/order/${uuid}/${$this.closest("li").find("input[name=_id]").val()}/`;

            $(this).closest("li").addClass("loading");

            try{
                const response = await self.api.put(url, {
                    quantity: $this.val()
                });
                const resp = response.data;
                self.renderCart(resp);
            }catch(err){
                log(err)
            };

            $(this).closest("li").removeClass("loading");
        });

        $("body").off("click.convertize", "#mini-cart .remove-item");
        $("body").on("click.convertize", "#mini-cart .remove-item", async function(e){
            e.preventDefault();
            const uuid = Cookies.get("convertize_cart_id");
            const url = `/order/${uuid}/${$(this).closest("li").find("input[name=_id]").val()}/`;

            $(this).closest("li").addClass("loading");

            try{
                const response = await self.api.delete(url);
                const resp = response.data;
                self.renderCart(resp);
                return;
            }catch(err){
                log(err)
            };

            $(this).closest("li").removeClass("loading");

        });

        $("body").off("click.convertize", "#mini-cart .codes a");
        $("body").on("click.convertize", "#mini-cart .codes a", async function(e){
            e.preventDefault();
            const $this = $(this);
            const uuid = Cookies.get("convertize_cart_id");
            const url = `/order/${uuid}/coupons/`;

            $(this).addClass("loading");

            try{
                const response = await self.api.delete(url, {
                    code: $this.text()
                });
                const resp = response.data;
                self.renderCart(resp);
                return;
            }catch(err){
                log(err)
            };

            $(this).removeClass("loading");

        });

        this.functionsCart();
    },
    functionsCart: function(){
        const self = this;
        let interval = false;
        $("#mini-cart .content-cart input[name=quantity]").spinner({
            min: 1, 
            classes: {
                "ui-spinner": "ui-corner-all",
                "ui-spinner-down": "icon-minus",
                "ui-spinner-up": "icon-plus"
            },
            spin: function(event, ui){
                if(interval){
                    clearTimeout(interval);
                    interval = false;
                };
                interval = setTimeout(function(){
                    var value = $(event.target).val()
                    interval = true
                    $(event.target).blur();
                }, 250);
            }
        });
        $("#mini-cart .coupon").validate({
            rules: {
                coupon: {
                    required: true,
                }
            },
            messages: {
                coupon: {
                    required: ""
                }
            },
            errorElement: "p",
            errorPlacement: function(error, element){
                element.closest(".variations").addClass("error");
                var ul = $('<div class="errorlist" />').html(error);
                if(!error.html()) return;
                element.closest('.variations').append(ul);
            },
            submitHandler: async function(form, event){
                event.preventDefault();
                const uuid = Cookies.get("convertize_cart_id");
                const url = `/order/${uuid}/coupons/`;

                $(form).find("button").button("loading");

                try{
                    const response = await self.api.post(url, {
                        code: $(form).find("[name=coupon]").val()
                    });
                    const resp = response.data;
                    self.renderCart(resp);
                    return;
                }catch(err){
                    log(err)
                };

                $(form).find('button').button("reset");
            }
        });
    },
    loadCart: async function(){
        const self = this;
        const uuid = Cookies.get("convertize_cart_id");
        if(!uuid){
            $("#mini-cart").removeClass("loading");
			$("#mini-cart .content-cart ul").html(`<li class="empty">
                <div class="empty-cart"><span class="face">:(</span><span class="text"><strong>Ops!</strong><br />Seu carrinho está vazio</span></div>
            </li>`);
            return;
        }
        $("#mini-cart .content-cart ul").html("");
        try{
            const response = await self.api.get(`/order/${uuid}/`);
            const resp = response.data;
            self.renderCart(resp);
            $("#mini-cart").removeClass("loading");
        }catch(err){
            log(err);
            if(err.response && err.response.status === 404){
                $("#mini-cart .content-cart ul").html(`<li class="empty">
                    <div class="empty-cart"><span class="face">:(</span><span class="text"><strong>Ops!</strong><br />Seu carrinho está vazio</span></div>
                </li>`);
                Cookies.remove("convertize_cart_id")
            }
            $("#mini-cart").removeClass("loading");
        }
    },
    renderCart: function(data){
        let total = data.totalizers.total_price;
        let discount = 0;

        if(data.totalizers.shipping_total && data.totalizers.shipping_total != 0) total += data.totalizers.shipping_total;
        if(data.totalizers.discount && data.totalizers.discount != 0) discount -= data.totalizers.discount;
        if(data.totalizers.payment_discount && data.totalizers.payment_discount != 0) discount -= data.totalizers.payment_discount;
        if(data.totalizers.interest && data.totalizers.interest != 0) total += data.totalizers.interest;
        total += discount;
        total = parseFloat(total.toFixed(2));

        $(".request__cart__total_price").html(data.totalizers.total_price.toCurrency());
        $(".request__cart__discount_value").html(discount.toCurrency());
        $(".request__cart__total").html(total.toCurrency());
        $(".request__cart__total_quantity").html(data.totalizers.quantity);

        $("#mini-cart .content-cart ul").html("");

        data.items.map(function(item){
            let price = "";
            if(item.discount_value < item.total_price){
                price = `<span class="unit-price">${item.total_price.toCurrency()}</span><br />${item.discount_value.toCurrency()}`;
            }else{
                price = `<span class="sale-price">${item.total_price.toCurrency()}</span>`;
            };
            $("#mini-cart .content-cart ul").append(`<li>
                <input type="hidden" value="${item.id}" name="_id" />
                ${item.image ?
                    `<a href="${item.url}" class="item-image"><img src="${item.image.replace("/small/", "/mini/")}" width="65" height="65" alt="" /></a>`
                :
                    `<a href="${item.url}" class="item-image"><img src="${window.__static_prefix__}img/blank.png" width="65" height="65" alt="" /></a>`
                }
                <div class="item-info">
                    <a href="${item.url}" class="item-title d-block">${item.sku_name}</a>
                    <div class="mt-1">
                        <span class="item-price">${price}</span>
                        <div class="quantity mt-1">
                            <input type="tel" value="${item.quantity}" name="quantity" class="input" />
                        </div>
                    </div>
                </div>
                <a class="remove-item"><i class="icon-close-radius"></i></a>
            </li>`);
        });

        $("#mini-cart footer .codes").html("");

        data.coupons.map(function(value){
            $("#mini-cart footer .codes").append(`<a>${value}</a>`);
        });

        if(data.coupons.length > 0) $("#mini-cart footer .codes").addClass("active");
        else $("#mini-cart .footer .codes").removeClass("active");

        if(data.items.length > 0){
            $("#mini-cart footer").show();
        }else{
            $("#mini-cart footer").hide();
            $("#mini-cart .content-cart ul").html(`<li class="empty">
                <div class="empty-cart"><span class="face">:(</span><span class="text"><strong>Ops!</strong><br />Seu carrinho está vazio</span></div>
            </li>`);
        };

        if(data.messages && data.messages.length){
            data.messages.map(function(message){
                $.toast({
                    hideAfter: 7000,
                    icon: message.level.toLowerCase(),
                    text: message.message,
                    position: "top-center",
                    showHideTransition: "plain",
                    beforeShow: function(){
                        $(".jq-toast-loader").addClass("jq-toast-loaded")
                    }
                });
            });
        };

        this.functionsCart();
    },
    carousel: function(){
        const self = this;

        if($(".carousel").length){

            $(".carousel").each(function(){
                const $this = $(this);
                const fixOwl = function(){
                    log("onInitialized");
                    var $stage = this.$element.find(".owl-stage"),
                        stageW = $stage.outerWidth(),
                        $el = this.$element.find(".owl-item"),
                        elW = 0;
                    $el.each(function() {
                        elW += $(this).outerWidth() + parseFloat($(this).css("margin-right").slice(0, -2));
                    });
                    if (elW > stageW){
                        $stage.width(stageW);
                        $this.trigger("refresh.owl.carousel");
                    };
                };
                const options = $(this).data("owl-carousel") || {};
                options.lazyLoad = true;
                const $item = $(this);
                try{
                    if(!$(this).hasClass("banner") && !options.hasOwnProperty("responsive")){
                        options["responsive"] = {
                            "769": {
                                "items": options.hasOwnProperty("items") ? options["items"]:2
                            },
                            "0": {
                                "items": 1
                            }
                        };
                    };
                    if(options.hasOwnProperty("startPosition") && options["startPosition"] == "auto") options["startPosition"] = $item.find(".item.active").index();
                    if(options["autoWidth"]) options["onLoadedLazy"] = fixOwl;
                    if(!$(this).hasClass("banner") && !$("body").hasClass("is_mobile")) options["margin"] = 15;
                    $item.owlCarousel(options);
                }catch(err){
                    log(err);
                };
            });
        };
    },
    mobileNavbar: function(e){
        if($(this).next(".sub").length || $(this).hasClass("back")){
            e.preventDefault();
            const _this = $(this);
                _parent = $(this).parent();
            
            let level = parseInt($(this).parent().attr("class").match(/level-[\w-]*\b/).join("").match(/\d+/g).join(""));

            if($(this).hasClass("back")) level -= 1;
            else level += 1;

            $("#nav-inside .content-nav-inside").css({left:($("#nav-inside .content-nav-inside").width()*level)*-1});

            if($(this).next(".sub").length){
                $("#nav-inside .content-nav-inside").find(".sub").removeClass("active");
                _parent.find(".sub").css("top", 0);
                _parent.find(".sub").addClass("active");
                _parent.closest(".sub").addClass("active");
            };

        }
    },
    embedYoutube: function(){
        $(".embed-youtube").each(function(){
            const $this = $(this),
                width = $(this).data("width"),
                height = $(this).data("height"),
                code = $(this).data("code");
            $(this).html(`<div class="cover"><img src="//i2.ytimg.com/vi/${code}/hqdefault.jpg" /></div>`);
            $(this).unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $(this).addClass("played video-container");
                $this.html(`<iframe type="text/html" src="//www.youtube.com/embed/${code}?autoplay=1&rel=0&showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`);
            });
            if(width) $(this).css("width", width);
            if(height) $(this).css("height", height);
        });
    },
    searchToObject: function(search){
        return search.substring(1).split("&").reduce(function(result, value){
            const parts = value.split('=');
            if(parts[0]) result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            return result;
        }, {})
    },
    horizontalScroll: function(){
        if($("body").hasClass("is_mobile")) return;

        $(".horizontal-scroll").each(function(){
            const slider = this;
            const preventClick = (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
            let isDown = false;
            let isDragged = false;
            let startX;
            let scrollLeft;

            slider.addEventListener("mousedown", e => {
                isDown = true;
                slider.classList.add("active");
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });
            slider.addEventListener("mouseleave", () => {
                isDown = false;
                slider.classList.remove("active");
            });
            slider.addEventListener("mouseup", (e) => {
                isDown = false;
                const elements = document.querySelectorAll("a");
                if(isDragged){
                    for(let i = 0; i<elements.length; i++){
                        elements[i].addEventListener("click", preventClick);
                    }
                }else{
                    for(let i = 0; i<elements.length; i++){
                        elements[i].removeEventListener("click", preventClick);
                    }
                }
                slider.classList.remove("active");
                isDragged =  false;
            });
            slider.addEventListener("mousemove", e => {
                if (!isDown) return;
                isDragged =  true;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });
        });
    }
});
