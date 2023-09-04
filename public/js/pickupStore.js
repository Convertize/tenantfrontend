"use strict";
const pickupStore = function(data, events){
    _pickupStore.init(data, events);
};

const getDescription = {
    "CLICK_RETIRE": "Você selecionou o Retira em loja, escolha a loja mais próxima de você. Assim que seu pedido estiver disponível para retirada você receberá um e-mail. Leve seu documento para retirar o produto. Caso seja outra pessoa que irá retirar por você, envie um e-mail informando para <span class='color1'>sac@drogalider.com.br</span>",
    "MOTOBOY": "Você selecionou a Entrega Expressa em 3 horas, a modalidade é válida apenas para compras realizadas no cartão de crédito, débito, Pix e PicPay.<br />*A modalidade é válida apenas para a cidade de Piracicaba/SP. Nesta opção de entrega não tem direito a brinde.",
    "CLICK_RETIRE_120": "Você selecionou o Retira em 120 minutos, a modalidade é válida apenas para compras realizadas no cartão de crédito, débito, Pix e PicPay.<br />*O prazo do Retira em 120 minutos começa após a confirmação de pagamento. Nesta opção de retirada não tem direito a brinde."
};

String.prototype.toState = function(){
    return {
        "AC": "Acre",
        "AL": "Alagoas",
        "AP": "Amapá",
        "AM": "Amazonas",
        "BA": "Bahia",
        "CE": "Ceará",
        "DF": "Distrito Federal",
        "ES": "Espírito Santo",
        "GO": "Goiás",
        "MA": "Maranhão",
        "MT": "Mato Grosso",
        "MS": "Mato Grosso do Sul",
        "MG": "Minas Gerais",
        "PA": "Pará",
        "PB": "Paraíba",
        "PR": "Paraná",
        "PE": "Pernambuco",
        "PI": "Piauí",
        "RJ": "Rio de Janeiro",
        "RN": "Rio Grande do Norte",
        "RS": "Rio Grande do Sul",
        "RO": "Rondônia",
        "RR": "Roraima",
        "SC": "Santa Catarina",
        "SP": "São Paulo",
        "SE": "Sergipe",
        "TO": "Tocantins"
    }[this.toUpperCase()] || this.toUpperCase();
};

const _pickupStore = {
    init: function(data, events){
        console.log("Init pickupStore");
        if(data && data.shipping_info && data.shipping_info.freights){
            this.data = data;
            this.events = events;
            this.bind_events();
        }
    },
    bind_events: function(){
        const self = this;
		
        const freightsPickups = this.data.shipping_info.freights.filter(function(i){
            return i.pickup_store
        });

        freightsPickups.map(function(i){
            $(`.freight-shipping-${slugify(i.service)}`).addClass("freight-pickup");
        });
		
		
		
        $("body").off("click.convertize", ".freight-pickup");
        $("body").on("click.convertize", ".freight-pickup", async function(e){
            e.preventDefault();
			$(".loader").show();
			
            const name = $(this).find("a").data("value");
            const freight = freightsPickups.find(function(i){
                return i.service === name;
            });
            let stores = await self.loadPickups();
            stores = stores.filter(function(i){
                return freight.pickups.indexOf(i.id) >= 0;
            });
            self.showModal(freight, stores);
			$(".loader").hide();
        });

        if(!$(".select-shipping-type").length){
            $(`<div class="select-shipping-type">
                <a class="home">Receber em casa</a>
                <a class="store">Retirar na loja</a>
            </div>`).insertBefore(".box-step-shipping.active .list-shipping");
            $("body").off("click.convertize", ".select-shipping-type a");
            $("body").on("click.convertize", ".select-shipping-type a", function(e){
                e.preventDefault();
                $(this).parent().find("a").removeClass("active");
                $(this).addClass("active");
                if($(this).hasClass("store")){
                    $(".list-shipping li").hide();
                    $(".list-shipping .freight-pickup").show();
                }else{
                    $(".list-shipping li").show();
                    $(".list-shipping .freight-pickup").hide();
                }
            });
            if(this.data.shipping_info.selected && this.data.shipping_info.selected.pickup_store) $(".select-shipping-type .store").trigger("click.convertize");
            else $(".select-shipping-type .home").trigger("click.convertize");
        };

    },
    loadPickups: async function(){
        const response = await $.getJSON("/api/1.0/public/freights/pickup/", function(){
            // success
        }).done(function(response){
            return response;
        }).fail(function(){
            return [];
        });
        return response;
    },
    showModal: function(freight, stores){
        this.createModal();

        const self = this;

        $("#pickupStoreModal .pickupStoreDescription").html("").hide();

        if(!freight || stores.length === 0){
            $("#pickupStoreModal .box-fail").show();
            $("#pickupStoreModal .box-loading, #pickupStoreModal .box-success").hide();
            $("#pickupStoreModal").modal("show");
            return true;
        };

        const description = getDescription[freight.service];
        if(description) $("#pickupStoreModal .pickupStoreDescription").html(description).show();

        $("#pickupStoreModal .box-fail").hide();
        $("#pickupStoreModal .box-loading").show();
        $("#pickupStoreModal select").empty();
        $("#pickupStoreModal select[name=withdraw_state]").append(`<option value="" selected></option>`);

        stores.map(function(v){
            if($("#pickupStoreModal select[name=withdraw_state]").find(`option[value="${v.state}"]`).length) return;
            $("#pickupStoreModal select[name=withdraw_state]").append(`<option value="${v.state}">${v.state.toState()}</option>`);
        });

        $("#pickupStoreModal .store-address").hide();
        $("#pickupStoreModal select[name=withdraw_state]").selectpicker("destroy");
        $("#pickupStoreModal select[name=withdraw_state]").sortOptions();
        $("#pickupStoreModal select[name=withdraw_state]").val("").selectpicker();
        $("#pickupStoreModal select[name=withdraw_state]").closest(".group").nextAll(".group").hide();

        $("#pickupStoreModal select[name=withdraw_state]").unbind("change.convertize").bind("change.convertize", function(e){
            e.preventDefault();

            const value = $(this).val();
            if(value){
                $("#pickupStoreModal select[name=withdraw_city]").empty().append(`<option value="" selected></option>`);

                stores.filter(function(i){
                    return i.state === value;
                }).map(function(v){
                    if($("#pickupStoreModal select[name=withdraw_city]").find(`option[value="${v.city}"]`).length) return;
                    $("#pickupStoreModal select[name=withdraw_city]").append(`<option value="${v.city}">${v.city}</option>`);
                });

                $("#pickupStoreModal select[name=withdraw_city]").closest(".group").fadeIn();
                $("#pickupStoreModal select[name=withdraw_city]").selectpicker("destroy");
                $("#pickupStoreModal select[name=withdraw_city]").sortOptions();
                $("#pickupStoreModal select[name=withdraw_city]").val("").selectpicker();
            }else{
                $(this).closest(".group").nextAll(".group").hide();
            };
        });

        $("#pickupStoreModal select[name=withdraw_city]").unbind("change.convertize").bind("change.convertize", function(e){
            e.preventDefault();
            const value = $(this).val();
            if(value){
                $("#pickupStoreModal select[name=withdraw_neighborhood]").html(`<option value=""></option>`);

                stores.filter(function(i){
                    return i.state === $("#pickupStoreModal select[name=withdraw_state]").val() && i.city === value;
                }).map(function(v){
                    if($("#pickupStoreModal select[name=withdraw_neighborhood]").find(`option[value="${v.neighborhood}"]`).length) return;
                    $("#pickupStoreModal select[name=withdraw_neighborhood]").append(`<option value="${v.neighborhood}">${v.neighborhood}</option>`);
                });

                $("#pickupStoreModal select[name=withdraw_neighborhood]").selectpicker("destroy");
                $("#pickupStoreModal select[name=withdraw_neighborhood]").sortOptions();
                $("#pickupStoreModal select[name=withdraw_neighborhood]").val("").selectpicker();
                $("#pickupStoreModal select[name=withdraw_neighborhood]").closest(".group").fadeIn();
            }else{
                $(this).closest(".group").nextAll(".group").hide();
            };
        });

        $("#pickupStoreModal select[name=withdraw_neighborhood]").unbind("change.convertize").bind("change.convertize", function(e){
            e.preventDefault();
            const value = $(this).val();
            const value_state = $("#pickupStoreModal select[name=withdraw_state]").val();
            const value_city = $("#pickupStoreModal select[name=withdraw_city]").val();
            $("#pickupStoreModal .store-address").fadeOut();
            if(value){
                $("#pickupStoreModal select[name=withdraw_store]").html(`<option value=""></option>`);

                stores.filter(function(i){
                    return i.state === value_state && i.city === value_city && i.neighborhood === value;
                }).map(function(v){
                    if($("#pickupStoreModal select[name=withdraw_store]").find(`option[value="${v.name}"]`).length) return;
                    $("#pickupStoreModal select[name=withdraw_store]").append(`<option value="${v.name}">${v.address},${v.number}</option>`);
                });
                $("#pickupStoreModal select[name=withdraw_store]").selectpicker("destroy");
                $("#pickupStoreModal select[name=withdraw_store]").sortOptions();
                $("#pickupStoreModal select[name=withdraw_store]").val("").selectpicker();
                $("#pickupStoreModal select[name=withdraw_store]").closest(".group").fadeIn();
            } else {
                $(this).closest(".group").nextAll(".group").hide();
            };
        });

        $("#pickupStoreModal select[name=withdraw_store]").unbind("change.convertize").bind("change.convertize", function(e){
            e.preventDefault();
            const value = $(this).val();
            const store = stores.find(function(v){
                return v.name === value;
            })
            if(store){
                $.each(store, function(key, val){
                    $("#pickupStoreModal .store-address").find(`.${key}`).html(val);
                });
                $("#pickupStoreModal .store-address").fadeIn();
            }else{
                $("#pickupStoreModal .store-address").fadeOut();
            }
        });

        $("#pickupStoreModal .pickupStoreSelect").unbind('click.convertize').bind('click.convertize', function(e){
            e.preventDefault();
			$(".loader").show();
            const store = stores.find(function(v){
                return v.name === $("#pickupStoreModal select[name=withdraw_store]").val();
            });
            $.ajax({
                url: `/api/1.0/public/order/${$.cookie("convertize_cart_id")}/freights/`,
                type: "POST",
                data: JSON.stringify({
                    freight: freight.service,
                    pickup_store: store.id
                }),
                contentType: "application/json",
                dataType: "json",
                success: function(data){
                    if(self.events.loadCart){
                        self.events.loadCart();
                    }else{
                        $("li[class*=freight-shipping-]").removeClass("active");
                        $(`li.freight-shipping-${slugify(data.shipping_info.selected.shipping_type)}`).addClass("active");
                    };
                    $("#pickupStoreModal").modal("hide");
					//$("#pickupStoreModal").remove();
					$(".loader").hide();
                },
				error: function (xhr, ajaxOptions, thrownError) {
					alert("ERRO AO SELECIONAR A LOJA");
					$("#pickupStoreModal").modal("hide");
					//$("#pickupStoreModal").remove();
					$(".loader").hide();
				}
            });
        });

        $(".box-loading").hide();
        $(".box-success").show();
        $("#pickupStoreModal").modal("show");

    },
    createModal: function(){
        if($("#pickupStoreModal").length) return;
        $("body").append(`<div class="modal withdraw fade" id="pickupStoreModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-lg" role="document" style="width: 600px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Selecionar Loja</h4>
                    </div>
                    <div class="modal-body ptz">
                        <div class="row">
                            <div class="col-xs-12">
                                <div class="box-loading pd20">
                                </div>
                                <div class="box-fail pd20" style="display:none">
                                    Infelizmente esse(s) produto(s) não estão disponíveis para essa modalidade de entrega
                                </div>
                                <div class="box form-vertical box-success" style="display:none">
                                    <div class="pickupStoreDescription pd20 plz prz">
                                    </div>
									<div><p style="padding-top: 10px;">Você optou pelo serviço de "Retirada na loja" Por gentileza, selecione a loja mais próxima de sua localidade. Assim que o seu pedido estiver preparado para retirada, enviaremos um e-mail de notificação. Ao comparecer à loja, leve consigo um documento de identificação válido para efetuar a retirada do produto.</p></div>
                                    <div class="required group">
                                        <div class="group-label">
											<label class="required">Selecione o estado:</label>
                                        </div>
                                        <div class="group-input">
                                            <div class="field">
                                                <select name="withdraw_state" class="select-picker" data-live-search="true"></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="required group">
                                        <div class="group-label">
                                            <label class="required">Selecione o cidade:</label>
                                        </div>
                                        <div class="group-input">
                                            <div class="field">
                                                <select name="withdraw_city" class="select-picker" data-live-search="true"></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="required group" style="display:none;">
                                        <div class="group-label">
                                            <label class="required">Selecione o bairro:</label>
                                        </div>
                                        <div class="group-input">
                                            <div class="field">
                                                <select name="withdraw_neighborhood" class="select-picker" data-live-search="true"></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="required group" style="display:none;">
                                        <div class="group-label">
                                            <label class="required">Selecione a Loja:</label>
                                        </div>
                                        <div class="group-input">
                                            <div class="field">
                                                <select name="withdraw_store" class="select-picker" data-live-search="true"></select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="store-address" style="display:none;">
                                        <div class="clear separator-border mbz"></div>
                                        <div class="pd20 plz prz size14">
                                            <ul>
                                                <li>
                                                    <strong>Endereço:</strong> <span class="address"></span>, <span class="number"></span>
                                                    <br /> 
                                                    <strong>CEP:</strong> <span class="zipcode"></span>
                                                </li>
                                                <li>
                                                    <strong>Telefone:</strong> <span class="phone"></span>
                                                </li>
                                                <li>
                                                    <a class="btn btn-lg btn-success pickupStoreSelect fr">Escolher essa Loja</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
		
		setTimeout(function(){ 
			console.log("Hello"); 
			$('#pickupStoreModal').on('hidden.bs.modal', function () {
				console.log("TESTE");
				$("#pickupStoreModal").remove();
			});
		}, 1000);
    }
};

$.fn.sortOptions = function(){
    $(this).each(function(){
        var op = $(this).children("option");
        op.sort(function(a, b) {
            return a.value > b.value ? 1 : -1;
        })
        return $(this).empty().append(op);
    });
};