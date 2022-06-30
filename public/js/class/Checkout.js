$(".img-lazy:not(.loaded)").show().lazyload({
    data_attribute:"src",
    effect: "show"
});

const CheckoutView = $.Class.create({
    init: function(){
        log("Init Checkout");
		
        window.cvz.events.bind("cart_update", function(data, events){
            // Carrinho

        });

        window.cvz.events.bind("cart_register", function(data, events){
            // Cadastro

        });

        window.cvz.events.bind("cart_address", function(data, events) {
            // Endereco

        });

        window.cvz.events.bind('payment_update', function(data, events){
            // Pagamento

        });

    },
});