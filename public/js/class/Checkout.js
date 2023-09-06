const reg_pickup_standard = RegExp('retire ');

$(".img-lazy:not(.loaded)").show().lazyload({
    data_attribute:"src",
    effect: "show"
});

const CheckoutView = BaseView.extend({
    bind_events: function(){
        this.baseFunctions();
        this.carousel();
    },
    cart_update: function(data, events){
        const self = this;

        self.storage.setItem("cvz_cart", JSON.stringify(data))

        pickupStore(data, events);

        /* RESTRIÇÃO DE PEDIDO MINIMO */
//        if(window.location.origin != "https://trimais.my.convertize.com.br"){
//            var total_price = data.totalizers.total_price;
//            if(total_price < pedido_minimo){
//                $('#checkout-cart .top-content').siblings().find('.messages').remove();
//                $('#checkout-cart .top-content').siblings().prepend('<ul class="messages"><li class="warning mb-3">*Inclua mais itens em seu carrinho. O valor mínimo por pedido é de '+pedido_minimo.toCurrency()+'</li></ul>');
//                $('#checkout-cart .footer-cart').find('.btn-success').hide();
//            }else{
//                $('#checkout-cart .top-content').siblings().find('.messages').remove();
//                $('#checkout-cart .footer-cart').find('.btn-success').show();
//            };
//        };
        /* FIM RESTRIÇÃO DE PEDIDO MINIMO */
    },
    init: function(){
        log("Init Checkout");

        const self = this;

//        this.bind_events();
		
        window.cvz.events.bind("cart_update", function(data, events){
            // Carrinho
            if(!data) return;
            log("cart_update")
            
            window.events = events;
            
            self.cart_update(data, events)
        });
        
        window.cvz.events.bind("cart_register", function(data, events){
            // Cadastro
        });
        
        window.cvz.events.bind("cart_address", function(data, events) {
            // Endereco
            
            pickupStore(data, events);
        });
        
        window.cvz.events.bind('payment_update', function(data, events){
            // Pagamento
        });
    },
});