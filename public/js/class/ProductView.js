const ProductView = BaseView.extend({
    init: function(){
        log("Init Product");
        this._super();
    },
    bind_events: function(){
        const self = this;
        this._super();
        this.zoom();
        this.embedYoutube();
        setTimeout(function(){
            self.loadOffers();    
        }, 300)
        
        $("body").off("click.convertize", ".thumbs .item");
        $("body").on("click.convertize", ".thumbs .item:not(.video)", { self: this }, this.openImage);
        $("body").on("click.convertize", ".thumbs .item.video", { self: this }, this.openVideo);

        $("body").off("click.convertize", ".expand-image");
        $("body").on("click.convertize", ".expand-image", ()=>this.openGallery());

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
    },
    loadOffers: async function(){
        try{
            const response = await this.api.get(`/offers/search/?skus=${window.dataProduct.skuId}`);
            const resp = response.data;
            this.renderSeals(resp.results)
        }catch(err){
            log(err);
        }
    },
    renderSeals: function(results){
        results.map(function(offer){
            const gifts = [];
            if(offer.type_offer == 12){
                offer.gifts.map(function(gift){
                    gifts.push(gift);
                });
            }else if(offer.type_offer == 9){
                offer.progressive_discount.map(function(item){
                    if(!$(`.product-detail .seal-offer-${offer.id}-${item.quantity}`).length){
                        if(item.discount){
                            $(".product-detail .seals").append(`<div class="box-seal-off-segunda-uni desconto-progressivo seal-offer-${offer.id}-${item.quantity}">
                                <p>Na compra da ${item.quantity}ª unidade sai por <span>${roundToTwo(Math.floor((window.dataProduct.salePrice - (window.dataProduct.salePrice * (item.discount/100))) * 100) / 100).toCurrency()}</span> cada</p>
                            </div>`);
                        }else if(item.unit_price){
                            const discount = ((item.unit_price*100) / window.dataProduct.salePrice - 100) * -1;
                            $(".product-detail .seals").append(`<div class="box-seal-off-segunda-uni desconto-progressivo seal-offer-${offer.id}-${item.quantity}">
                                <p>Na compra da ${item.quantity}ª unidade sai por <span>${item.unit_price.toCurrency()}</span> cada</p>
                            </div>`);
                        };
                    };
                });
            };
            if(gifts.length && !$('.content-offers .offer-12').length){
                $(".content-offers").append(`<div class="offer-12 brinde mt-5 mb-3">
                    <h4 class="h6 mb-3">Na compra deste item você ganha:</h4>
                    <div class="row"></div>
                </div>`);
                gifts.map(function(g){
                    $(".content-offers .offer-12 .row").append(`<div class="col-12">
                        <div class="brindeInfo d-flex bg-white p-3 rounded align-items-center">
                            <img src="${g.images.mini}" alt="" class="mr-2" />
                            <strong>${g.name}</strong>
                        </div>
                    </div>`);
                });
            }
        })
    }
});
