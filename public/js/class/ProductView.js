const ProductView = BaseView.extend({
    init: function(){
        log("Init Product");
        this._super();
    },
    bind_events: function(){
        this._super();
        this.zoom();
        this.embedYoutube();

        if($(".bundles").length) this.bundles();

        const self = this;
        
        // Desconto percentual no boleto
        if($('.product-detail .descont').length){
            var _unit_price = fromCurrencyToFloat($('.product-detail .unit-price > span').html());
            var _price_boleto = fromCurrencyToFloat($('.product-detail .sale-price > strong').html());
            var _discount = (((_price_boleto*100) / _unit_price - 100) * -1).toFixed(0);
            $('.product-detail .descont > span').html(_discount+'%');
        };

        $(".box-calculate-shipping").formValidation({
            success: (form,response) => {
                if(response.status == 200 && response.data && response.data.length){
                    const $list = $(`<ul class="list-group"></ul>`);
                    response.data.map((item) => {
                        $list.append(`<li class="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-2">
                            <span><b>${item.label}</b> - A partir de ${item.delivery_time} dia${item.delivery_time != 1 ? 's':''} út${item.delivery_time != 1 ? 'eis':'il'}*</span>
                            <span class="price">${parseFloat(item.absolute_value.replace(".","").replace(",",".")).toCurrency()}</span>
                        </li>`);
                    });
                    form.find(".form-return").html($list);
                    form.find(".form-return").append("<small>*O prazo de entrega inicia-se no 1º dia útil após a confirmação do pagamento.</small>");
                }else{
                    form.find(".form-return").html(`<p class="text-danger">Ocorreu um erro na pesquisa. Verifique o seu CEP e tente novamente</p>`);
                }
            },
            error: (form, error) => {
                form.find(".form-return").html(`<p class="text-danger">Ocorreu um erro na pesquisa. Verifique o seu CEP e tente novamente</p>`);
            }
        });

        $("body").off("click.convertize", ".thumbs .item");
        $("body").on("click.convertize", ".thumbs .item:not(.video)", { self: this }, this.openImage);
        $("body").on("click.convertize", ".thumbs .item.video", { self: this }, this.openVideo);

        $("body").off("click.convertize", ".expand-image");
        $("body").on("click.convertize", ".expand-image", ()=>this.openGallery());

        $("body").off("click.convertize", ".btn-let-me-know");
        $("body").on("click.convertize", ".btn-let-me-know", ()=>this.letMeKnow());

        if(window.location.search && this.searchToObject(window.location.search)["p"]){
            const position = $("#product-ratings").position();
            $("html, body").scrollTop(position.top - 10);
        }

        $("body").on("click.convertize", ".get_installments", { self: self }, function(e, self){
			e.data.self.get_installments(this);
		});

    },
    bundles: function(){
        const self = this;

        $(".bundles select[name*=bundle_]").each(function(){
            $(this).hide();

            const selected = $(this).find("option[selected]"),
                  options = [];

            $(this).find("option").each(function(){
                options.push(`<li class="${$(this).attr("selected") ? "active":""}">
                    <a class="dropdown-item" data-id="${$(this).val()}"><i class="icon-circle-line"></i> ${$(this).text()}</a>
                </li>`);
            });

            $(`<div class="dropdown">
                <button id="${$(this).attr("name")}" type="button" data-toggle="dropdown" data-display="static" aria-haspopup="true" aria-expanded="false">
                    <img src="${selected.data("cover").replace("/small/","/mini/")}" />
                </button>
                <ul class="dropdown-menu" aria-labelledby="${$(this).attr("name")}" style="max-height: 300px;overflow-y: scroll;">
                    ${options.join("")}
                </ul>
            </div>`).insertBefore(this);

            $(this).appendTo($(this).closest(".form-group").find(".dropdown"));
        });

        $("body").off("change.convertize", ".bundles [name*=bundle_]");
        $("body").on("change.convertize", ".bundles [name*=bundle_]", function(){
            const selected = $(this).find(`option[selected="selected"]`);

            $(this).parent().find("img").attr("src", selected.data("cover").replace("/small/","/mini/"));

            if($(this).parent().hasClass("dropdown")){
                $(this).parent().find(".dropdown-menu li").removeClass("active");
                $(this).parent().find(`.dropdown-menu a[data-id="${$(this).val()}"]`).parent().addClass("active");
                if($(this).val()) $(this).parent().find("button").addClass("active");
                else $(this).parent().find("button").removeClass("active");
            };

            const list_selected = [];
            $(this).closest(".bundles").find("select option[selected=selected]").each(function(){
                list_selected.push($(this).data("sale-price"))
            });

            const total_bundle = list_selected.reduce(function(a,b){
                return parseFloat(a) + parseFloat(b)
            });

            if(total_bundle){
                $(".product-detail").find(".sale-price").html(total_bundle.toCurrency());
                if($(".product-detail .boleto-price").length){
                    $(".product-detail .boleto-price strong").html((total_bundle - (total_bundle * ($(".product-detail .boleto-price").data("discount")/100))).toCurrency());
                }

                // if($('.product .get_card_price').length){
                //     $('.product .get_installments').data('price', total_bundle.toCurrency());
                //     $('.product .get_card_price, .product-inline .get_card_price').html((total_bundle / parseFloat($(".product .get_min_installments").html().replace(/\D/g, ''))).toCurrency());
                // };
                // $('.all_installments ul').html('');
            };

        });

        $("body").off("click.convertize", ".bundles .dropdown a");
        $("body").on("click.convertize", ".bundles .dropdown a", function(){
            $(this).closest(".dropdown").find("select option").removeAttr("selected");
            $(this).closest(".dropdown").find(`select option[value="${$(this).data('id')}"]`).attr("selected", "selected");
            $(this).closest(".dropdown").find("select").val($(this).data("id")).trigger("change.convertize");
            if($(this).closest(".product-form").attr("novalidate")) $(this).closest(".dropdown").find("select").valid();
        });

        $("body").off("click.convertize", ".product-detail .product-form .btn-checkout");
        $("body").on("click.convertize", ".product-detail .product-form .btn-checkout", function(e){
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
                    required: $(this).data("title") ? `Selecione a opção de <b>${$(this).data("title")}</b>`:"Selecione uma opção"
                };
            });

            $form.validate({
                rules: data_rules,
                messages: data_messages,
                errorElement: "p",
                ignore: [],
                errorPlacement: function(error, element){
                    element.closest(".variations").addClass("error");
                    const ul = $(`<div class="errorlist" />`).html(error.addClass("text-danger mt-2"));
                    if(!error.html()) return;
                    element.closest(".form-group").append(ul);            
                },
                invalidHandler: function(event, validator){
                    $bt.removeClass("loading").prop("disabled", false);
                },
                submitHandler: async function(form, event){
                    event.preventDefault();

                    const body = new FormData();

                    body.append("add_cart", true);

                    $(form).serializeArray().map(function(item){
                        if(item.name.indexOf("bundle_") >= 0 || item.name == "quantity"){
                            body.append(item.name, item.value);
                        };
                    });

                    axios({
                        url: $(form).attr("action"),
                        method: $(form).attr("method"),
                        data: body,
                        headers: {
                            "X-Requested-With": "XMLHttpRequest"
                        }
                    }).then(async function(response){
                        if(response.status == 200 && response.data && !response.data.error){
                            await self.loadCart();
                            $("body").addClass("open-page");
                            $("#mini-cart").addClass("active").removeClass("loading");
                        }else{
                            $.toast({
                                hideAfter: 7000,
                                icon: "error",
                                text: response.data.error,
                                position: "bottom-center",
                                showHideTransition: "plain",
                                beforeShow: function(){
                                    $(".jq-toast-loader").addClass("jq-toast-loaded")
                                }
                            });
                        }
                        $bt.removeClass("loading").prop("disabled", false);
                    })
                    .catch(function(error){
                        $bt.removeClass("loading").prop("disabled", false);
                    });


                    return false;
                }
            });
            $form.trigger("submit.validate");

        });

    },
    updateImages: function(sku){
        if(sku.images){
            $(".product-image .thumbs li").hide().removeClass("show-more").find(".counter").remove();
            sku.images.sort(function(a,b){
                if(a.position > b.position) return 1;
                if(a.position < b.position) return -1;
                return 0;
            }).map(function(item, index){
                const srcMini = `${window.__media_prefix__}${item.image.replace("/small/", "/mini/")}`;
                $(`.product-image .thumbs img[data-src*="${srcMini}"]`).closest("li").show();
            });
            const cover = `${window.__media_prefix__}${sku.cover.replace("/small/", "/mini/")}`;
            $(`.product-image .thumbs img[src*="${cover}"]`).closest("li").trigger("click.convertize");


            if($(".product-image .thumbs li:visible").length > 6){
                let visibleCount = 0;
                $(".product-image .thumbs li:visible:eq(5)").addClass("show-more");
                $(".product-image .thumbs li:visible").map(function(i){
                    if(i > 5){
                        visibleCount += 1;
                        $(this).hide();
                    };
                });
                $(".thumbs .item.show-more").append(`<span class="counter d-none">+ ${visibleCount+1}</span>`);
            }
        }
    },
    get_installments: function(element){
        var self = $(element);

        $('.all_installments ul').html('<li>carregando...</li>');

        axios.get(window.location.pathname + '/installments/?price='+parseFloat(self.data('price'))).then(function(response){
            $('.all_installments ul').html('');
            if(response.status == 200){
                $.each(response.data, function(i, v){
                    $('.all_installments ul').append('<li>'+v.msg+'</li>');
                });
            }
        });
    },
    zoom: function(){
        if(!$(".zoom").length) return;
        $(".zoom").zoom({
            url: $(".zoom img").data("src").replace("/medium/","/large/"),
            touch: false
        })
    },
    openImage: function(e, self){
        e.preventDefault();
        const $item = $(e.currentTarget);
        $(".big-image").find("iframe").remove();
        $item.closest("ul").find(".item").removeClass("active");
        $item.addClass("active");
        $(".zoom").trigger("zoom.destroy");
        const image = $item.find("img").data("src");
        $(".zoom img").data("src", image.replace("/mini/","/large/")).attr("src", image.replace("/mini/","/medium/")).show();
        e.data.self.zoom();
    },
    openVideo: function(e){
        const $item = $(e.currentTarget);
        const height = $(".big-image").height();
        $item.closest("ul").find(".item").removeClass("active");
        $item.addClass("active");
        $(".zoom").trigger("zoom.destroy");
        $(".big-image").find("img").hide();
        $(".big-image").find("iframe").remove();
        $(".big-image").append(`<iframe class="float" width="100%" height="${height}" src="//www.youtube.com/embed/${$item.data("video")}?rel=0&autoplay=1&showinfo=0&iv_load_policy=3" frameborder="0" allowfullscreen></iframe>`);
    },
    openGallery: function(){
        this.loadGallery();
        const images = [];
        let index = 0;
        if($("body").hasClass("is_mobile")){
            index = $(".product-image .owl-item.active .item").data("index");
        }else if($(".product-image .item:not(.video).active").length){
            index = $(".product-image .item:not(.video).active").data("index");
        };
        $(".product-image .item:not(.video)").each(function(){
            images.push({
                src: $(this).find("img").data("src").replace("/mini/","/large/").replace("/medium/","/large/"),
                w: 1000,
                h: 1000
            });
        });
        const gallery = new PhotoSwipe(document.getElementById("gallery-product"), PhotoSwipeUI_Default, images, {
            fullscreenEl: false,
            shareEl: false,
            bgOpacity: 0.7,
            index: index
        });
        gallery.init();
    },
    letMeKnow: function(){
        log("letMeKnow");

        $("body").append(`<div id="modal-letMeKnow" class="modal fade">
            <div id="modal-letMeKnow" class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h5 class="modal-title font-weight-bold">Receba uma notificação</h5>
                    </div>
                    <div class="modal-body">
                        Carregando...
                    </div>
                </div>
            </div>
        </div>`);

        const loadLetMeKnow = function(response){
            if(response.status == 200){
                $("#modal-letMeKnow .modal-body").html(response.data);
                $("#modal-letMeKnow form").formValidation({
                    success: (form, response) => {
                        loadLetMeKnow(response)
                    },
                    error: (form, error) => {
                        log(error)
                    }
                });
            }
        }

        $("#modal-letMeKnow").on("show.bs.modal", function(event){
            const url = `${window.location.pathname}/avise-me?sku=${window.dataProduct.sku}`;
            log(url)
            axios.get(url).then(function(response){
                loadLetMeKnow(response)
            });
        });

        $("#modal-letMeKnow").on("hidden.bs.modal", function (event){
            $("#modal-letMeKnow").remove();
        });

        $("#modal-letMeKnow").modal("show");

    },
    loadGallery: function(){
        if($("body .pswp").length) return;
        $("body").append(`<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true" id="gallery-product">
            <div class="pswp__bg"></div>
            <div class="pswp__scroll-wrap">
                <div class="pswp__container">
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>
                <div class="pswp__ui pswp__ui--hidden">
                    <div class="pswp__top-bar">
                        <div class="pswp__counter"></div>
                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                        <button class="pswp__button pswp__button--share" title="Share"></button>
                        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                              <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div> 
                    </div>
                    <button class="pswp__button pswp__button--arrow--left" title="Anterior"></button>
                    <button class="pswp__button pswp__button--arrow--right" title="Próximo"></button>
                    <div class="pswp__caption">
                        <div class="pswp__caption__center"></div>
                    </div>
                </div>
            </div>
        </div>`);
    }
});
