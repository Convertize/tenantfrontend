const ProductView = BaseView.extend({
    init: function(){
        log("Init Product");
        this._super();
    },
    bind_events: function(){
        this._super();
        this.zoom();
        this.embedYoutube();
        
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
