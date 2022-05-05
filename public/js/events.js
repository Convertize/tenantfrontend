$(".img-lazy:not(.loaded)").show().lazyload({
    data_attribute:"src",
    effect: "show"
});

$.fn.sortOptions = function(){
    $(this).each(function(){
        var op = $(this).children("option");
        op.sort(function(a, b) {
            return a.text > b.text ? 1 : -1;
        })
        return $(this).empty().append(op);
    });
};

$(window).on('hashchange', function(){
    var page_url = window.location.pathname + window.location.search + window.location.hash;
    if(page_url != '/checkout/#/carrinho') $('.CheckoutFooter, .CheckoutTop').hide();
    else $('.CheckoutFooter, .CheckoutTop').show();
}).trigger('hashchange');

window.cvz.events.bind('cart_update', function(data, events){
    if(!data) return;
    
    if(!$('.footer-cart a.btn-success').length){
        $('.footer-cart button.btn-success').hide();
        $(".footer-cart .btn.btn-default").text("Adicionar mais produtos");
        $('.footer-cart').append('<a href="/checkout/#/endereco" class="btn btn-success pull-right btn-lg"><span>Concluir pedido</span></a>');
    }
    
    $("a[data-value*='(A']").each(function(){
        $(this).find("span:nth-child(2)").html(" - "+$(this).data("value").split(")").pop())
    });
    
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type.indexOf("(A") !== -1){
        $('<span class="delivery_time2">'+data.shipping_info.selected.shipping_type.split(")").pop()+'</span>').insertAfter(".dropdown-freight .delivery_time");
        $(".dropdown-freight .delivery_time").hide();
    }else{
        $(".dropdown-freight .delivery_time").show();
        $(".dropdown-freight .delivery_time2").remove();
    };
    
    var reg = RegExp('retirar');
    if($('.dropdown-freight').find('li[class*=freight-shipping-retirar-]').length){
        if(!$('.dropdown-freight').find('.freight-shipping-retirada-na-loja').length){
            $('.dropdown-freight .dropdown-menu').append('<li class="freight-shipping-retirada-na-loja"> \
                <a href="javascript:void(0);"> \
                    Retirar na Loja - Grátis \
                </a> \
            </li>');
        };
    }else{
        $('.dropdown-freight .freight-shipping-retirada-na-loja').remove();
    };
    
    showModalWithdraw(data, events, false);
    
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            $('.freight-shipping-retirada-na-loja').addClass('active');
        }else{
            $('.freight-shipping-retirada-na-loja').removeClass('active');
        };
    };
    
    $('#ModalWithdraw').modal({
        keyboard: true,
        backdrop: 'fixed',
        show: false
    });
    
    $('#ModalWithdraw').on('show.bs.modal', function () {
        showModalWithdraw(data, events, true);
    });

    $('.dropdown-freight .freight-shipping-retirada-na-loja a').unbind('click.convertize').bind('click.convertize', function(e){
        e.preventDefault();
        $('#ModalWithdraw').modal('show');
    });
    
    if(document.referrer.indexOf('drogamaxi.') >= 0){
        $('.footer-cart').find('.btn-default.pull-left').attr('href',document.referrer);
    };

    $('.carousel').each(function(){
        var $this = $(this);

        var fixOwl = function(){
            console.log('onInitializeds');
            var $stage = this.$element.find('.owl-stage'),
                stageW = $stage.outerWidth(),
                $el = this.$element.find('.owl-item'),
                elW = 0;
            $el.each(function() {
                elW += $(this).outerWidth() + parseFloat($(this).css("margin-right").slice(0, -2));
            });
            if (elW > stageW){
                $stage.width(stageW);
                $this.trigger('refresh.owl.carousel');
            };
        };

        var options = $(this).data('owl-carousel') || {};
        var $item = $(this);
        try{
            if(!$(this).hasClass('banner') && !options.hasOwnProperty('responsive')){
                options["responsive"] = {
                    "1199": {
                        "items": options.hasOwnProperty('items') ? options['items']:5
                    },
                    "990": {
                        "items": 3
                    },
                    "0": {
                        "items": 2
                    }
                };
            };

            if(options.hasOwnProperty('startPosition') && options['startPosition'] == 'auto') options['startPosition'] = $item.find(".item.active").index();

            if(options['autoWidth']) options["onLoadedLazy"] = fixOwl;

            options['margin'] = 10

            $item.owlCarousel(options);
            $item.on('loaded.owl.lazy', function(event){
                base_lazyload(event.element, events);
            });
        }catch(err){
            console.error(err);
        };
    });

});

window.cvz.events.bind('cart_address', function(data, events){
    var is_withdraw_selected = false,
        freight_active = false;
    $("a[data-value*='(A']").each(function(){
        $(this).find("span.freight-delivery-time").html(" - "+$(this).data("value").split(")").pop())
    });
    
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        var reg = RegExp('retirar');
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            is_withdraw_selected = true;
            freight_active = data.shipping_info.selected.shipping_name;
            $('.box-step-shipping .list-shipping').find('.withdraw-in-store').addClass('active');
            $('.box-step-shipping .list-shipping .withdraw-in-store').find('.freight-label').html(freight_active);
            $('.box-step-shipping').find('.select_other_store').show();
            $('.box-step-shipping .list-shipping').find('.withdraw-in-store i').removeClass('icon-circle').addClass('icon-check-circle-o');
        };
    };

    if(!is_withdraw_selected){
        $('.box-step-shipping').find('.select_other_store').hide();
        $('.box-step-shipping .list-shipping').find('.withdraw-in-store').removeClass('active');
        $('.box-step-shipping .list-shipping .withdraw-in-store').find('.freight-label').html('Retirar na Loja');
        $('.box-step-shipping .list-shipping').find('.withdraw-in-store i').addClass('icon-circle').removeClass('icon-check-circle-o');
    };

    var list_shipping = $('.box-step-shipping').find('.list-shipping');

    if($('.list-shipping li[class*=freight-shipping-retirar-]').length){
        if(!$('.box-withdraw-in-store-loaded').length){
            $('<p class="title-box align-c"><i class="icon-house"></i> Quer Receber em Casa?</p>').insertBefore(list_shipping);
            $('<div class="withdraw-content"> \
                <p class="separator-list-shipping align-c"> \
                    <span>ou</span> \
                </p> \
                <p class="title-box align-c"><i class="icon-building"></i> Quer Retirar na Loja?</p> \
                <ul class="list-shipping"> \
                    <li class="withdraw-in-store '+(is_withdraw_selected ? 'active':'')+'"> \
                        <a href="javascript:void(0);"> \
                            <span class="freight-label">'+(freight_active ? freight_active:'Retirar na Loja')+'</span> \
                            <span class="freight-value">: Grátis </span> \
                            <span class="freight-delivery-time"> </span> \
                            <i class="'+(is_withdraw_selected ? 'icon-check-circle-o':'icon-circle')+'"></i> \
                        </a> \
                    </li> \
                </ul> \
                <div class="select_other_store" style="display:'+(is_withdraw_selected ? 'block':'none')+'"> \
                    <a class="btn btn-default btn-block" data-toggle="modal" data-target="#ModalWithdraw">Selecionar outra Loja</a> \
                    <div class="pd pbz clear"></div> \
                </div> \
            </div>').insertAfter(list_shipping);
        };
    }else{
        $('.box-step-shipping .withdraw-content').remove();
        list_shipping.parent().find('.title-box.align-c').remove();
        list_shipping.parent().removeClass('box-withdraw-in-store-loaded');
    };

    showModalWithdraw(data, events, false);

    $('.withdraw-in-store:not(.active)').find('a').unbind('click.convertize').bind('click.convertize', function(e){
        e.preventDefault();
        $('#ModalWithdraw').modal({
            keyboard: true,
            backdrop: 'fixed'
        });
    });

    $('#ModalWithdraw').on('show.bs.modal', function () {
        showModalWithdraw(data, events, true);
    });

    if($('.list-shipping li[class*=freight-shipping-retirar-]').length) list_shipping.parent().addClass('box-withdraw-in-store-loaded');
});

window.cvz.events.bind('payment_update', function(data, events){

   if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        var reg = RegExp('retira ');
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            $('.box-step-checkout .address').hide();
            $('.box-step-checkout .shipping_info').find('p').html('<b>Retirar na loja:</b> <br />'+data.shipping_info.selected.shipping_type.replace('RETIRA ','')+' - $ 0,00 ');
            $('.box-step-checkout>.content-box>.shipping_info').addClass('btz mtz');
        }else{
            $('.box-step-checkout .address').show();
            $('.box-step-checkout>.content-box>.shipping_info').removeClass('btz mtz');
        }
    };

    if(data && data.shipping_info && data.shipping_info.selected.shipping_name.indexOf('Delivery') >= 0){
        $('.tab-deliverypay-1').show();
        if(!$("#checkout .shipping_info > p > .info").length) $('#checkout .shipping_info > p').append('<span class="info"> - '+data.shipping_info.selected.shipping_type.split(") ").pop()+'</span>');
        $("#checkout .shipping_info > p > span:nth-child(2)").addClass('size0');
    }else{
        $('.tab-deliverypay-1').hide();
        $("#checkout .shipping_info > p > span:nth-child(2)").removeClass('size0');
    };

    // Cashback totalizer
    if(data.payment_data && data.payment_data.giftcards){
        var total_cashback = 0;
        var total_cashback_not_use = 0;
        var total_cashback_balance = 0;

        var giftcards = data.payment_data.giftcards.filter(function(g){
            return g.in_use == true && g.name == 'loyalty-program'
        });

        $.each(giftcards, function(i,l){
            total_cashback += l.value;
        });

        $.each(data.payment_data.giftcards, function(i,l){
            if(l.name == 'loyalty-program'){
                total_cashback_not_use += l.value;
                total_cashback_balance += l.balance;
            };
        });

        var total_payment = 0;

        if(data.totalizers){
            total_payment = data.totalizers.total_price;
            if(data.totalizers.shipping_total && data.totalizers.shipping_total != 0) total_payment += data.totalizers.shipping_total;
            if(data.totalizers.discount && data.totalizers.discount != 0) total_payment -= data.totalizers.discount;
            if(data.totalizers.interest && data.totalizers.interest != 0) total_payment += data.totalizers.interest;
            if(data.totalizers.payment_discount && data.totalizers.payment_discount != 0) total_payment -= data.totalizers.payment_discount;
        };

        if(total_cashback > 0){
            total_payment -= total_cashback;
            if(!$('.order-summary .totalizers .cashback-total').length){
                $('.order-summary .totalizers tbody').append('<tr class="cashback-total"><td><b>Cashback:</b></td><td class="moneyed"></td></tr>');
                $('.order-summary .totalizers tbody').append('<tr class="total-payment"><td><b>Total a pagar:</b></td><td class="moneyed"></td></tr>');
            };
            $('.order-summary .totalizers .cashback-total .moneyed').html('<span>R$ ' +$.number(total_cashback, 2, ',', '.') +'</span>');
            $('.order-summary .totalizers .total-payment .moneyed').html('<span>R$ ' +$.number(total_payment, 2, ',', '.') +'</span>');
        }else{
            $('.order-summary .totalizers .cashback-total, .order-summary .totalizers .total-payment').remove();
        };

        if(total_cashback_not_use){
            $('.box-giftCard-special .item-giftcard p, .box-giftCard-special .item-giftcard span').css('fontSize','0px');
            $('.box-giftCard-special .item-giftcard p .add-gift-card, .box-giftCard-special .item-giftcard p .remove-gift-card').css('fontSize','14px');

            if(!$('.balance-total').length){
                $('.box-giftCard-special .item-giftcard p').prepend('<span class="balance-total fl">\
                    <b>Saldo atual:</b> R$ ' + $.number(total_cashback_balance, 2, ',', '.') + ' \
                    <br /> \
                    <b>Usar: </b> R$ ' + $.number(total_cashback_not_use, 2, ',', '.') + ' \
                    <br /> \
                    <b>Saldo restante: </b> R$ ' + $.number(total_cashback_balance - total_cashback_not_use, 2, ',', '.') + ' \
                </span>');
            };
        }

    }else{
        $('.order-summary .totalizers .cashback-total, .order-summary .totalizers .total-payment').remove();
    };
    // End - Cashback totalizer

    if(data.giftlist && data.is_register && data.giftlist.type_of_delivery != 'buyer'){
        $('#bt-payment').hide();
        if(!$('#form-customer-address').length) $('.box-step-checkout .payments.content-box').prepend(template_address);

        $form = $('#form-customer-address');
        $form.find('.required.group').each(function(){
            $(this).find('input, select').each(function(){
                var name = $(this).attr('name'),
                    _data = $(this).data('validator');
                if(_data){
                    data_rules[name] = {}
                    $.each(_data, function(k,v){
                        if(v && k) data_rules[name][k] = v;
                    });
                };
            });
        });
        $form.validate({
            rules: data_rules,
            errorElement: 'li',
            errorPlacement: function(error, element){
                element.closest('.required.group').addClass('error');
                var ul = $('<ul class="errorlist" />').html(error);
                if(!error.html()) return;
                if(element.prop('type') === 'checkbox') ul.insertAfter(element.parent('label'));
                else ul.insertAfter(element);
            },
            success: function(label,element){
                $(element).closest('.required.group').find('.errorlist').remove();
                $(element).closest('.required.group').removeClass('error').addClass('success');
            },
            submitHandler: function(form){
                var _data = [];
                $('.loader').show();

                $.ajax({
                    type: 'PUT',
                    url: '/api/1.0/public/customer/'+data.customer.uuid+'.json',
                    dataType: 'application/json',
                    data: {
                        zipcode: $(form).find('input[name=zipcode]').val(),
                        address: $(form).find('input[name=address]').val(),
                        number: $(form).find('input[name=number]').val(),
                        complement: $(form).find('input[name=complement]').val(),
                        neighborhood: $(form).find('input[name=neighborhood]').val(),
                        city: $(form).find('input[name=city]').val(),
                        state: $(form).find('select[name=state]').val(),
                        city_id: $(form).find('input[name=city_id]').val(),
                        code_ibge: $(form).find('input[name=code_ibge]').val(),
                        uuid: data.customer.uuid,
                        add_address: true,
                    },
                    complete: function(res){
                        $('.loader').hide();
                        $('.box-step-checkout .tab-pane.active').find('form').submit();
                    }
                });
            }
        });

        $('#form-customer-address input[name*=zipcode]').unmask().mask('00000-000', {onChange : function(zipcode, event, currentField, options){
            if(zipcode.length < 9){
                currentField.closest('form').find('.box-address').hide();
                return;
            };
        }, onComplete: function(zipcode,event,currentField,options){
            currentField.closest('form').find('input[name*=number],input[name*=complement]').val('');
            currentField.addClass('loading');
            $.ajax({
                type: 'GET',
                url: '/ws/zipcode/?zipcode='+zipcode,
                dataType: 'application/json',
                complete: function(res){
                    var json = JSON.parse(res.responseText);
                    if(json.success == true){
                        currentField.removeClass('loading');
                        if(json.success){
                            currentField.closest('form').find('[name$=code_ibge],[name$=city_id]').remove();
                            currentField.closest('form').append('<input type="hidden" name="code_ibge" />');
                            currentField.closest('form').append('<input type="hidden" name="city_id" />');
                            if(json.codigo_ibge) currentField.closest('form').find('[name$=code_ibge]').val(json.codigo_ibge);
                            if(json.localidade_id) currentField.closest('form').find('[name$=city_id]').val(json.localidade_id);

                            if(json.endereco) currentField.closest('form').find('input[name*=address]').val(json.endereco);
                            else currentField.closest('form').find('input[name*=address]').val('');

                            if(json.cidade) currentField.closest('form').find('input[name=city]').val(json.cidade).attr('readonly',true);
                            if(json.uf) currentField.closest('form').find('select[name*=state]').val(json.uf).attr('disabled','disabled');

                            if(json.bairros == undefined) {
                                currentField.closest('form').find('[name*=neighborhood]').val('');
                                currentField.closest('form').find('[name*=neighborhood]').removeAttr("readonly");
                                currentField.closest('form').find('select[name*=neighborhood]').replaceWith('<input type="text" name="neighborhood" id="id_neighborhood" />');
                            }else if(json.bairros.length == 1){
                                currentField.closest('form').find('select[name*=neighborhood]').replaceWith('<input type="text" name="neighborhood" id="id_neighborhood" />');
                                currentField.closest('form').find('input[name*=neighborhood]').val(json.bairros[0]);
                            }else{
                                var selectBairros = '<option value="" selected="selected">---------</option>';
                                for (var i = 0; i < json.bairros.length; i++) selectBairros += '<option value="' + json.bairros[i] + '">' + json.bairros[i] + '</option>';
                                if(currentField.closest('form').find('input[name*=neighborhood]').length) currentField.closest('form').find('input[name*=neighborhood]').replaceWith('<select name="neighborhood" id="id_neighborhood" class="input">' + selectBairros + '</select>');
                                else if(currentField.closest('form').find('select[name*=neighborhood]').length) currentField.closest('form').find('select[name*=neighborhood]').replaceWith('<select name="neighborhood" id="id_neighborhood" class="input">' + selectBairros + '</select>');
                                currentField.closest('form').find('select[name*=neighborhood]').parent().find('label').removeClass('error');
                            };

                            if(json.endereco && json.bairros){
                                currentField.closest('form').find('.address-text .street-text span').html(json.endereco);
                                var info = json.cidade + ' - ' + json.uf;
                                if(currentField.closest('form').find('[name$=neighborhood]').val()) info = currentField.closest('form').find('[name$=neighborhood]').val() + ' - ' + info;
                                currentField.closest('form').find('.address-text .info-text span').html(info);
                                currentField.closest('form').find('.address-text').show();
                                currentField.closest('form').find('.li-address, .li-neighborhood, .li-city').hide();
                            }else{
                                currentField.closest('form').find('.address-text info-text span, .address-text .street-text span').html('');
                                currentField.closest('form').find('.address-text').hide();
                                currentField.closest('form').find('.li-address, .li-neighborhood, .li-city').show();
                            };

                            currentField.closest('form').find('.box-address').show();
                            currentField.closest('.group').removeClass('error').find('.errorlist').remove();

                        }else if(json.status_code == 404){
                            currentField.closest('form').find('.box-address').hide();
                            currentField.closest('.group').addClass('error').find('.errorlist').remove();
                            currentField.parent().append('<ul class="errorlist"><li id="id_zipcode-error" class="error">CEP não encontrado.</li></ul>');
                        }else{
                            currentField.closest('form').find('.box-address').hide();
                            currentField.closest('.group').addClass('error').find('.errorlist').remove();
                            currentField.parent().append('<ul class="errorlist"><li id="id_zipcode-error" class="error">Informe CEP válido.</li></ul>');
                        };

                        currentField.closest('form').find('input:text').each(function(){
                            if(!$(this).val()){
                                $(this).focus();
                                return false;
                            };
                        });
                    };
                }
            });

        }});

        $('.change_address').unbind('click.convertize').bind('click.convertize', function(e){
            e.preventDefault();
            $(this).closest('.box-address').find('.address-text').hide();
            $(this).closest('.box-address').find('.li-address, .li-neighborhood, .li-city').show();
        });

        if(!$('#bt-payment-2').length) $('.order-summary .action-payment').prepend('<button type="button" id="bt-payment-2" class="btn btn-lg btn-success btn-block" data-loading-text="Finalizar Pedido">Finalizar Pedido</button>');

        $('#bt-payment-2').unbind('click.convertize').bind('click.convertize', function(e){
            e.preventDefault();
            $('#form-customer-address').submit();
        });

    };

});

function showModalWithdraw(data, events, load_data){
    if(!$('#ModalWithdraw').length){
        $('body').append(' \
            <div class="modal fade" id="ModalWithdraw" tabindex="-1" role="dialog"> \
                <div class="modal-dialog modal-lg" role="document" style="width: 900px;"> \
                    <div class="modal-content"> \
                        <div class="modal-header"> \
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                            <h4 class="modal-title">Selecionar Loja</h4> \
                        </div> \
                        <div class="modal-body"> \
                            <div class="row"> \
                                <div class="col-sm-6 col-xs-12 fl"> \
                                    <div class="box form-vertical"> \
                                        <div class="required group"> \
                                            <div class="group-label"> \
                                                <label class="required" for="id_withdraw_city">Selecione o cidade:</label> \
                                            </div> \
                                            <div class="group-input"> \
                                                <div class="field"> \
                                                    <select id="id_withdraw_city" name="withdraw_city" class="select-picker" data-live-search="true"><option value="" selected></option></select> \
                                                </div> \
                                            </div> \
                                        </div> \
                                        <div class="required group" style="display:none;"> \
                                            <div class="group-label"> \
                                                <label class="required" for="id_withdraw_neighborhood">Selecione o bairro:</label> \
                                            </div> \
                                            <div class="group-input"> \
                                                <div class="field"> \
                                                    <select id="id_withdraw_neighborhood" name="withdraw_neighborhood" class="select-picker" data-live-search="true"><option value="" selected></option></select> \
                                                </div> \
                                            </div> \
                                        </div> \
                                        <div class="required group" style="display:none;"> \
                                            <div class="group-label"> \
                                                <label class="required" for="id_withdraw_store">Selecione a Loja:</label> \
                                            </div> \
                                            <div class="group-input"> \
                                                <div class="field"> \
                                                    <select id="id_withdraw_store" name="withdraw_store" class="select-picker" data-live-search="true"><option value="" selected></option></select> \
                                                </div> \
                                            </div> \
                                        </div> \
                                        <div id="store-address" style="display:none;"> \
                                            <div class="clear separator-border mbz"></div> \
                                            <div> \
                                                <div class="dadosloja"> \
                                                    <ul> \
                                                        <li> \
                                                            <i class="icon-pin"></i> \
                                                            <span class="address"></span>, <span class="number"></span> \
                                                            <br />  \
                                                            CEP: <span class="zipcode"></span> \
                                                        </li> \
                                                        <li> \
                                                            <i class="icon-telephone"></i> \
                                                            <strong>Telefone:</strong> <span class="phone"></span> \
                                                            <br /> \
                                                            <strong>Atendimento:</strong> <span class="extra_data__atendimento"></span> \
                                                            <br /> \
                                                            <strong>Estacionamento:</strong> <span class="extra_data__estacionamento"></span> \
                                                        </li> \
                                                        <li> \
                                                            <a class="btn btn-lg btn-success" id="withdraw_select_store">Retirar nesta Loja</a> \
                                                        </li> \
                                                    </ul> \
                                                </div> \
                                            </div> \
                                        </div> \
                                    </div>\
                                </div> \
                                <div class="col-sm-6 col-xs-12 fr">\
                                </div>\
                            </div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        ');
    };

    if(data.shipping_info && data.shipping_info.freights && load_data){
        $('#id_withdraw_city').html('<option value=""></option>');
        $('#id_withdraw_city').selectpicker('destroy');

        $.getJSON("/api/1.0/public/freights/pickup.json", function(StoresJson){

            var _list_stores = [];

            $.each(data.shipping_info.freights, function(i, f){
                $.each(StoresJson, function(ii,s){
                    if(f.service == s.name){
                        _list_stores.push(s);
                        return true;
                    };
                });
            });

            StoresJson = _list_stores;

            // $('#ModalWithdraw').on('show.bs.modal', function (e){
                // var map;
                // var geocoder = new google.maps.Geocoder();

                // var mapOptions = {
                //     zoom: 4,
                //     center: new google.maps.LatLng(-13.149862,-55.7594228)
                // };
                // map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                $.each(StoresJson, function(i,v){
                    if(!$('#id_withdraw_city').find('option[value="'+v.city+'"]').length) $('#id_withdraw_city').append('<option value="'+v.city+'">'+v.city+'</option>');
                    var _location =  {
                        "lat": v.location.lat,
                        "lng": v.location.lng
                    };
                    // var marker = new google.maps.Marker({
                    //     position: _location,
                    //     animation: google.maps.Animation.DROP,
                    //     map: map,
                    // });
                });
                $('#id_withdraw_city').selectpicker('destroy');
                $('#id_withdraw_city').sortOptions();
                $('#id_withdraw_city').val('').selectpicker();

                $('#store-address').hide();
                $('#id_withdraw_neighborhood').closest('.group').hide();
                $('#id_withdraw_store').closest('.group').hide();

                $('#id_withdraw_city').unbind('change.convertize').bind('change.convertize', function(e){
                    e.preventDefault();
                    var value = $(this).val();
                    $('#store-address').fadeOut();
                    if(value){
                        $('#id_withdraw_neighborhood').html('<option value=""></option>');
                        $.each(StoresJson, function(i,v){
                            if(v.city == value && !$('#id_withdraw_neighborhood').find('option[value="'+v.neighborhood+'"]').length){
                                $('#id_withdraw_neighborhood').append('<option value="'+v.neighborhood+'">'+v.neighborhood+'</option>');
                            };
                        });
                        $('#id_withdraw_neighborhood').selectpicker('destroy');
                        $('#id_withdraw_neighborhood').sortOptions();
                        $('#id_withdraw_neighborhood').val('').selectpicker();
                        $('#id_withdraw_neighborhood').closest('.group').fadeIn();
                        $('#id_withdraw_store').closest('.group').fadeOut();
                    }else{
                        $('#id_withdraw_neighborhood').closest('.group').fadeOut();
                        $('#id_withdraw_store').closest('.group').fadeOut();
                    };
                });

                $('#id_withdraw_neighborhood').unbind('change.convertize').bind('change.convertize', function(e){
                    e.preventDefault();
                    var value = $(this).val(),
                        value_city = $('#id_withdraw_city').val();
                    $('#store-address').fadeOut();
                    if(value){
                        $('#id_withdraw_store').html('<option value=""></option>');
                        $.each(StoresJson, function(i,v){
                            if(v.neighborhood == value && v.city  == value_city && !$('#id_withdraw_store').find('option[value="'+v.name+'"]').length){
                               $('#id_withdraw_store').append('<option value="'+v.name+'">'+v.address+','+v.number+'</option>');
                            };
                        });
                        $('#id_withdraw_store').selectpicker('destroy');
                        $('#id_withdraw_store').sortOptions();
                        $('#id_withdraw_store').val('').selectpicker();
                        $('#id_withdraw_store').closest('.group').fadeIn();
                    }else{
                        $('#id_withdraw_store').closest('.group').fadeOut();
                    };
                });

                $('#id_withdraw_store').unbind('change.convertize').bind('change.convertize', function(e){
                    e.preventDefault();
                    var value = $(this).val(),
                        store = false;

                    $.each(StoresJson, function(i,v){
                        if(v.name == value) store = v; return true;
                    });

                    if(store){
                        // geocoder.geocode({
                        //     'address': store.address,
                        //     'componentRestrictions': {
                        //         country: 'BR'
                        //     }
                        // }, function(results, status) {
                        //     map.setZoom(17);
                        //     var _location =  {
                        //         "lat": store.location.lat,
                        //         "lng": store.location.lng
                        //     };
                        //     map.setCenter(_location);
                        // });
                        $.each(store, function(key, val){ 
                            $('#store-address').find('.'+key).html(val);
                        });
                        if(store.extra_data){
                            $.each(store.extra_data, function(key, val){ 
                                $('#store-address').find('.extra_data__'+key).html(val);
                            });
                        };
                        $('#store-address').find('#withdraw_select_store').data('freight', store.name);
                        $('#store-address').fadeIn();
                    }else{
                        $('#store-address').fadeOut();
                    };
                });
                
                $('#ModalWithdraw').on('hidden.bs.modal', function (e){
                    $('#id_withdraw_city').val('');
                    $('#id_withdraw_neighborhood').val('');
                });

                $('#withdraw_select_store').unbind('click.convertize').bind('click.convertize', function(e){
                    e.preventDefault();
                    // if($(this).data('freight') && list_shipping.find('.freight-shipping-'+slugify($(this).data('freight'))).length){
                    events.setFreight($(this).data('freight'));
                    $('#ModalWithdraw').modal('hide');
                    // };
                });
            // });
        });
    };
};

function base_lazyload(element, events_checkout){
    var self = this;
    var data_rules = {};
    var data_messages = {};
    var $bt = element.closest('.item-product').find('.bt-checkout');

    $bt.text('incluir no carrinho');

    var text_button = $bt.text();

    element.closest('.item-product').find('.product-form input').each(function(){
        var name = $(this).attr('name')
        data_rules[name] = {required: true};
        data_messages[name] = {required: 'Selecione uma opção!'};
    });

    element.closest('.item-product').find('.product-form').validate({
        rules: data_rules,
        messages: data_messages,
        errorElement: 'p',
        errorPlacement: function(error, element){
            element.closest('.required.group').addClass('error');
            var ul = $('<div class="errorlist" />').html(error);
            if(!error.html()) return;
            if(element.prop('type') === 'checkbox' || element.prop('type') === 'radio'){
                element.closest('.group').append(ul);
            }else{
                ul.insertAfter(element);
            };
        },
        submitHandler: function(form){
            $bt.attr('disabled','disabled');
            $bt.text($bt.attr('data-loading-text'));
            $.ajax({
                type: $(form).attr('method'),
                url: $(form).attr('action'),
                data: $(form).serialize()+'&add_cart=True',
                dataType:'json',
                success: function(data){
                    events_checkout.loadCart();
                    $bt.removeAttr('disabled');
                    $bt.text(text_button);
                    $(form).removeClass('loading');
                    $bt.closest('form').find('.errorlist').remove();
                    if(!data.error){
                        $bt.closest('.item-product').addClass('added');
                    }else{
                        $bt.closest('form').append('<div class="errorlist">'+data.error+'</div>');
                    };

                }
            });
        }
    });

    // element.closest('.item-product').find('input[name=quantity]').spinner({min: 1, icons: { down: 'icon-minus', up: 'icon-plus'}});

    $bt.unbind('click.pote').bind('click.pote', function(e){
        e.preventDefault();
        $(this).closest('.product-form').addClass('loading').submit();
    });

    element.closest('.item-product').find('.options input:radio').unbind('change.pote').bind('change.pote', function(){
        var _this = $(this);
        var list_values = [];

        $.each(_this.closest('div.group').prevAll().find('input:radio:checked'), function(){
            if($(this).val()) list_values.push('option:'+$(this).val());
        });
        if(_this.val()) list_values.push('option:'+_this.val());
        var url = decodeURI(list_values).replace(/,/g, '&').replace(/:/g,'=');

        _this.closest('.product-form').addClass('loading');

        _this.closest('div.group').find('label').removeClass('checked');
        _this.closest('label').addClass('checked');

        $.get(element.closest('.item-product').find('.link').attr('href')+'/options/?'+url, data={}, function(){}, 'json').done(function(data){
            _this.closest('div.group').nextAll().find('input:radio').attr('checked',false).attr('disabled',true).closest('label').removeClass('checked').addClass('disabled');

            if(data){
                $.each(data, function(index, item){
                    if(item.available){
                        _this.closest('.options').find('input:radio[name=option_'+item.option_id+'][value='+item.value_id+']').removeAttr('disabled').closest('label').removeClass('disabled');
                    }
                });

                if(!$.isEmptyObject(data)){
                    var image = window.__media_prefix__+data[0].image;
                    if(element.closest('.item-product').find('.image img').attr('src') != image){
                        element.closest('.item-product').find('.image img').attr('src', image.replace('/small/','/medium/'));
                    };
                    var sale_price = data[0].sale_price;
                    if(!sale_price){
                        sale_price = data[0].unit_price;
                        element.closest('.item-product').find('.price-off .line-through').html('').closest('.price-off').hide();                          
                    }else{
                        element.closest('.item-product').find('.price-off .line-through').html(data[0].unit_price).closest('.price-off').show();
                    };

                    if(data[0].descont_percentage) element.closest('.item-product').find('.descont span').html(String(data[0].descont_percentage).replace('-','')+'%').show();
                    else element.closest('.item-product').find('.descont span').html('').hide();

                    element.closest('.item-product').find('.price').html(sale_price);
                };

                _this.closest('.product-form').removeClass('loading');
            }
        });
    });
};

var template_address = `<form id="form-customer-address" class="form-vertical col-sm-9 col-xs-12" style="float:right; padding: 0 0 20px 0;">
    <div class="float pd plz prz ptz size14 colorblack">
        Digite seu endereço abaixo:
    </div>
    <div class="float">
        <div class="fl col-s6">
            <div class="required group" aria-required="true">
                <div class="group-label">
                    <label class="required" aria-required="true">CEP </label>
                </div>
                <div class="group-input">
                    <div class="field">
                        <input type="text" name="zipcode" maxlength="9" data-validator='{"required":true}' autocomplete="off" aria-required="true">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="float box-address" style="display: none;">
        <div class="float address-text" style="display: none;">
            <p class="street-text">
                <span></span> &nbsp;&nbsp;
                <a class="change_address" href="javascript:void(0);">Alterar</a>
            </p>
            <p class="info-text">
                <span>
                </span>
            </p>
        </div>
        <div class="float">
            <div class="required group li-address" aria-required="true">
                <div class="group-label">
                    <label class="required" aria-required="true">Endereço </label>
                </div>
                <div class="group-input">
                    <div class="field">
                        <input type="text" maxlength="100" name="address" data-validator='{"required":true}'>
                    </div>
                </div>
            </div>
            <div class="float">
                <div class="fl col-s5 li-number">
                    <div class="required group" aria-required="true">
                        <div class="group-label">
                            <label class="required" aria-required="true">Número </label>
                        </div>
                        <div class="group-input">
                            <div class="field">
                                <input type="text" maxlength="100" name="number" data-validator='{"required":true}'>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="fr col-s7 li-complement">
                    <div class="group">
                        <div class="group-label">
                            <label>Complemento </label>
                        </div>
                        <div class="group-input">
                            <div class="field">
                                <input type="text" maxlength="100" name="complement" data-validator='{"required":false}'>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="required group li-neighborhood" aria-required="true">
                <div class="group-label">
                    <label class="required" aria-required="true">Bairro </label>
                </div>
                <div class="group-input">
                    <div class="field">
                        <input type="text" maxlength="100" name="neighborhood" data-validator='{"required":true}'>
                    </div>
                </div>
            </div>
        </div>
        <div class="float li-city">
            <div class="fl col-s9">
                <div class="required group" aria-required="true">
                    <div class="group-label">
                        <label class="required" aria-required="true">Cidade </label>
                    </div>
                    <div class="group-input">
                        <div class="field">
                            <input type="text" maxlength="100" name="city" data-validator='{"required":true}'>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fr col-s2">
                <div class="required group" aria-required="true">
                    <div class="group-label">
                        <label class="required" aria-required="true">Estado </label>
                    </div>
                    <div class="group-input">
                        <div class="field">
                            <select name="state" data-validator='{"required":true}' class="input mz">
                                <option value="">---------</option>
                                <option value="AC">AC</option>
                                <option value="AL">AL</option>
                                <option value="AP">AP</option>
                                <option value="AM">AM</option>
                                <option value="BA">BA</option>
                                <option value="CE">CE</option>
                                <option value="DF">DF</option>
                                <option value="ES">ES</option>
                                <option value="GO">GO</option>
                                <option value="MA">MA</option>
                                <option value="MT">MT</option>
                                <option value="MS">MS</option>
                                <option value="MG">MG</option>
                                <option value="PA">PA</option>
                                <option value="PB">PB</option>
                                <option value="PR">PR</option>
                                <option value="PE">PE</option>
                                <option value="PI">PI</option>
                                <option value="RJ">RJ</option>
                                <option value="RN">RN</option>
                                <option value="RS">RS</option>
                                <option value="RO">RO</option>
                                <option value="RR">RR</option>
                                <option value="SC">SC</option>
                                <option value="SP">SP</option>
                                <option value="SE">SE</option>
                                <option value="TO">TO</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>`;