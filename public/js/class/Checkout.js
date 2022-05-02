$(".img-lazy:not(.loaded)").show().lazyload({
    data_attribute:"src",
    effect: "show"
});

const CheckoutView = $.Class.create({
    init: function(){
        log("Init Checkout");
		$('.logo').css('display','flex').css('padding-right','50px')
		$('.logo').append(`<div id="amb-seguro" style="font-size:40px;margin-left:710px;">
		<i class='icon-lock' style="padding-right:5px;"></div></i>
		<div style="font-size:15px;width:95px;text-align:initial">
		<span>Ambiente</span></br><span style="font-weight: bold;">100% seguro</span></div>`)
		setTimeout(function(){
		this.customElements();
		},1000)
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

function customElements(){
	$('#checkout .footer-cart .btn-default > span').html("<img src='data:image/svg+xml;base64,PCEtLSBHZW5lcmF0ZWQgYnkgSWNvTW9vbi5pbyAtLT4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMjQiIGhlaWdodD0iMTAyNCIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCI+Cjx0aXRsZT48L3RpdGxlPgo8ZyBpZD0iaWNvbW9vbi1pZ25vcmUiPgo8L2c+CjxwYXRoIGQ9Ik00OTAuNjggMTcwLjY4aC02NHYtMTQ5LjM2MWMwLTguNC00LjkyLTE2LTEyLjYtMTkuNDQtNy42NC0zLjQ4LTE2LjY0LTIuMDQwLTIyLjkyIDMuNTZsLTM4NCAzNDEuMzJjLTQuNTYgNC4wNDAtNy4xNiA5Ljg0LTcuMTYgMTUuOTYgMCA2LjA4MCAyLjYgMTEuODggNy4xNiAxNS45NmwzODQgMzQxLjMyYzYuMzIgNS42NCAxNS4yOCA3IDIyLjkyIDMuNTYgNy42NC0zLjQ4IDEyLjYtMTEuMDgwIDEyLjYtMTkuNDh2LTE0OS44NDJjMi4wODAgMC4wNDAgNC4xMiAwLjEyIDYuMjQgMC4xNiA1IDAuMTYgMTAuMDQwIDAuMjggMTUuMTIgMC4yOCAxNzguMjc4IDAgMzYyLjY4IDk1Ljc2IDM2Mi42OCAyNTYgMCA1OS00MS41MiAxMzMuNjQyLTgwLjEyIDE3OC4wMDItNi43NiA3LjcyLTcgMTkuMTYtMC42NCAyNy4yNCA0LjIgNS4yOCAxMC40IDguMTIgMTYuNzYgOC4xMiAzLjM2IDAgNi43Ni0wLjggOS44NC0yLjQ4IDE1Ny40NC04Mi4yOCAyNjcuNDM4LTI0Ny45NjIgMjY3LjQzOC00MDIuODgzIDAtMjQyLjg0Mi0yNDQuMjQ0LTQ0OC01MzMuMzItNDQ4ek04MjIuMjQxIDkyNi40ODRjMTguNTItMzcuODggMzEuMTYtNzguNjggMzEuMTYtMTE1Ljc2MyAwLTE4Ni45NjItMjA2LjA4MC0yOTguNjgtNDA1LjMyLTI5OC42OC00LjY0IDAtOS4yLTAuMTYtMTMuOC0wLjI4LTUtMC4xNi05Ljg4LTAuMjgtMTQuOC0wLjI4LTUuNCAwLTEwLjggMC4xNi0xNi4xMiAwLjY4LTEwLjkyIDEuMDgwLTE5LjI4IDEwLjI4LTE5LjI4IDIxLjI0djEyMy4xNTZsLTMzMC41OTgtMjkzLjgzNyAzMzAuNTk4LTI5My44Mzd2MTIzLjE1NmMwIDExLjc2IDkuNTYgMjEuMzIgMjEuMzIgMjEuMzJoODUuMzJjMjY1Ljk2NCAwIDQ5MC42OCAxODUuNjQxIDQ5MC42OCA0MDUuMzItMC4wNDAgMTEwLjAzOS02Mi4zNiAyMjYuNTE5LTE1OS4xNiAzMDcuODA0eiI+PC9wYXRoPgo8L3N2Zz4K' width='20'/> Continuar comprando")
}
