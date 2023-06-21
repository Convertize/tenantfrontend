//$('#container').prepend('<div class="center"><ul class="messages"><li class="info">A Nativo Exclusive se preocupa com a segurança dos dados dos clientes e com a experiência de compra realizada em nosso site. Dessa forma, utilizamos a Clear Sale, um sistema antifraude para garantir que a sua compra seja feita com segurança e tranquilidade, além de, é claro, proteger os seus dados. Em algumas situações, o sistema poderá entrar em contato para assegurar que a compra não é fraude. Mas fique tranquilo(a)! É apenas um procedimento padrão para garantir que tudo está dentro dos conformes.<span class="close-message"><i class="icon-close"></i></span></li></ul></div><div class="clear"></div>')

$('.img-lazy:not(.loaded)').show().lazyload({data_attribute:'src', effect: 'show'});

var reg = RegExp('retirar ');

window.cvz.events.bind('cart_update', function(data, events){
    if(!data) return;
	
	//CONTADOR FRETE GRÁTIS
    if(data.shipping_info && data.shipping_info.zipcode){

     var min_value = null;
     var total = data.totalizers.total_price;

     function valid_tracks(value, tracks){
         for (i = 0; i < tracks.length; i++){
             if(parseInt(value) >= tracks[i][0] && parseInt(value) <= tracks[i][1]) return true;
         };
         return false;
     };            

     if(["SP"].indexOf(data.address.state) !== -1 || valid_tracks(data.shipping_info.zipcode, Array([01000000,19999999]))){
         min_value = 199.90;
     }else if(["BA","DF","GO","MG","MS","PA","PB","PR","RJ","RS","SC"].indexOf(data.address.state) !== -1 || valid_tracks(data.shipping_info.zipcode, Array([40000000,48999999],[70000000,72799999],[73000000,73699999],[72800000,72999999],[73700000,76799999],[30000000,39999999],[79000000,79999999],[66000000,68899999],[58000000,58999999],[80000000,87999999],[20000000,28999999],[90000000,99999999],[88000000,89999999]))){
         min_value = 399.90;
     };

     if(min_value){
         var resto = min_value - total;
         var porcentagem = ((total/min_value)*100);

         if(!$('.free-shipping-checkout').length){
             $('#checkout .top-content').append('<div class="free-shipping-checkout">\
                 <div class="col-sm-6 col-xs-12 pd">\
                     <span class="size14"><i class="icon-round-info dib"></i>Frete grátis em compras acima de <strong class="min_value">R$ '+ min_value.toFixed(2).replace('.',',') +'</strong></span>\
                 </div>\
                 <div class="col-sm-5 col-xs-12">\
                     <div class="msg align-c">\
                     </div>\
                 </div>\
                 <div class="col-sm-1 col-xs-12">\
                     <i class="icon-delivery-truck">\
                     </i>\
                 </div>\
             </div>');
         }else{
             $('#checkout .top-content .free-shipping-checkout .min_value').html('R$ '+min_value.toFixed(2).replace('.',','));
         };

         if(resto <= 0){
             var delay = 0;
             if(!$('.free-shipping-checkout .msg').find('.ganhou').length){
                 $('.free-shipping-checkout .msg').html('<span class="ganhou">Parabéns, você conseguiu <strong>frete grátis</strong>!</span>');
                 $('.free-shipping-checkout .msg').append('<br /><div class="score">\
                     <span style="width: 0;"></span>\
                 </div>');
                 delay = 50;
             };

             setTimeout(function(){
                 $('.free-shipping-checkout .msg .score > span').css('width', '100%');
             }, delay);

             $('.icon-delivery-truck').toggleClass('icon-trophy').fadeIn(3000).removeClass('icon-delivery-truck');

             if(!data.shipping_info) return;

             for(var i = 0; i < data.shipping_info.freights.length; i++){
                 var f = data.shipping_info.freights[i];
                 if(f.service == 'gratis' && data.shipping_info.selected.shipping_type != 'gratis'){
                     $('body').append('<div class="modal fade" id="boxFreeShipping" style="background: rgba(0, 0, 0, 0.2);"> \
                         <div class="modal-dialog"> \
                             <div class="modal-content"> \
                                 <div class="modal-header"> \
                                     <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                 </div> \
                                 <div class="modal-body lh21 align-c"> \
                                     <div class="iconFreeShipping">\
                                         <i class="icon-trophy dib"></i>\
                                     </div>\
                                     <div class="size14" style="font-weight:normal; color:#5b5b5b;"> \
                                         Parabéns, você conseguiu frete grátis :) \
                                         <br /> \
                                     </div> \
                                     <br /> \
                                     <div class="align-c"> \
                                         <a class="btn btn-xs btn-success pd" style="margin:0px 5px 5px 0px;"> \
                                             Ativar frete grátis \
                                         </a> \
                                     </div> \
                                     <div style="clear:both;"></div> \
                                 </div> \
                             </div> \
                         </div> \
                     </div>');
                     if(!$.cookie('set_FreeShipping')) $('#boxFreeShipping').modal({backdrop: false, keyboard: false});
                     $('#boxFreeShipping').on('hidden.bs.modal', function (e){
                         $('#boxFreeShipping').remove();
                         $.cookie('set_FreeShipping', true, { expires: 1, path:'/' });
                     });
                     $('#boxFreeShipping').find('.btn-success').unbind('click.convertize').bind('click.pote', function(e){
                         e.preventDefault();
                         $('#boxFreeShipping').modal('hide');
                         events.setFreight('gratis');
                     });
                     break
                 };
             };
         }else{
             $.removeCookie('set_FreeShipping', { path: '/' });
             var delay = 0;

             if(!$('.free-shipping-checkout .msg').find('.falta').length){
                 $('.free-shipping-checkout .msg').html('<span class="falta"> Faltam R$ '+ resto.toFixed(2).replace('.',',') +' para seu benefício</span>');
                 $('.free-shipping-checkout .msg').append('<br /><div class="score" style="width: 300px;">\
                     <span style="width: 0;"></span>\
                 </div>');
                 delay = 50;
             };
             setTimeout(function(){
                 $('.free-shipping-checkout .msg .score > span').css('width', porcentagem + '%');
                 $('.free-shipping-checkout .msg .falta').html('Faltam R$ '+resto.toFixed(2).replace('.',',') +' para seu benefício');
             }, delay);
             $('.icon-trophy').toggleClass('icon-delivery-truck').fadeIn(3000).removeClass('icon-trophy');
         }
     }else{
         $('#checkout .top-content .free-shipping-checkout').remove();
         $.removeCookie('set_FreeShipping', { path: '/' });
     };
    };
    //FINAL CONTADOR FRETE GRÁTIS

    if(!$('.dropdown-freight').find('.freight-shipping-retirada-na-loja').length){
        $('.dropdown-freight .dropdown-menu').append('<li class="freight-shipping-retirada-na-loja"> \
            <a href="javascript:void(0);" style="line-height:12px;"> \
                Retirar na Loja - Grátis \
                <br /> \
                <small class="size11">(até 4 dias úteis após a confirmação do pagamento)</small> \
            </a> \
        </li>');
    };
    showModalWithdraw(data, events);
    $('.dropdown-freight .freight-shipping-retirada-na-loja a').unbind('click.convertize').bind('click.convertize', function(e){
        e.preventDefault();
        $('#ModalWithdraw').modal({
            keyboard: true,
            backdrop: 'fixed'
        });
    });
    window.dataEvents = events;
    
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            $('.freight-shipping-retirada-na-loja').addClass('active');
        }else{
            $('.freight-shipping-retirada-na-loja').removeClass('active');
        };
        if(reg.test(data.shipping_info.selected.shipping_name.toLowerCase())){
            $('.nav-tabs li[class*="tab-deliverypay-"]').remove();
            $('.box-step-checkout .payments #deliverypay-1').remove();
        };
        if(reg.test(data.shipping_info.selected.shipping_name.toLowerCase())){
            $('.nav-tabs li[class*="tab-deliverypay-"]').remove();
            $('.box-step-checkout .payments #deliverypay-1').remove();
        };
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
                    "1180": {
                        "items": options.hasOwnProperty("items") ? options["items"]:3
                    },
                    "990": {
                        "items": 2
                    },
                    "0": {
                        "items": 1
                    }
                };
            };

            if(options.hasOwnProperty('startPosition') && options['startPosition'] == 'auto') options['startPosition'] = $item.find(".item.active").index();

            if(options['autoWidth']) options["onLoadedLazy"] = fixOwl;

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
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            is_withdraw_selected = true;
            freight_active = data.shipping_info.selected.shipping_type;
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

//    if(!$('.box-withdraw-in-store-loaded').length){
//        $('<p class="title-box align-c"><i class="icon-house"></i> Quer Receber em Casa?</p>').insertBefore(list_shipping);
//        $('<p class="separator-list-shipping align-c"> \
//                <span>ou</span> \
//            </p> \
//            <p class="title-box align-c"><i class="icon-building"></i> Quer Retirar na Loja?</p> \
//            <ul class="list-shipping"> \
//                <li class="withdraw-in-store '+(is_withdraw_selected ? 'active':'')+'"> \
//                    <a href="javascript:void(0);"> \
//                        <span class="freight-label">'+(freight_active ? freight_active:'Retirar na Loja')+'</span> \
//                        <span class="freight-value">: Grátis </span> \
//                        <span class="freight-delivery-time" style="display:block"><small class="size11">(até 4 dias úteis após a confirmação do pagamento)</small></span> \
//                        <i class="'+(is_withdraw_selected ? 'icon-check-circle-o':'icon-circle')+'"></i> \
//                    </a> \
//                </li> \
//            </ul> \
//            <div class="select_other_store" style="display:'+(is_withdraw_selected ? 'block':'none')+'"> \
//                <a class="btn btn-default btn-block">Selecionar outra Loja</a> \
//                <div class="pd pbz clear"></div> \
//            </div> \
//        ').insertAfter(list_shipping);
//    };

    $('.withdraw-in-store:not(.active), .select_other_store').find('a').unbind('click.convertize').bind('click.convertize', function(e){
        e.preventDefault();
        $('#ModalWithdraw').modal({
            keyboard: true,
            backdrop: 'fixed'
        });
    });

    showModalWithdraw(data, events);

    list_shipping.parent().addClass('box-withdraw-in-store-loaded');
});

window.cvz.events.bind('payment_update', function(data, events){
	if(data.is_register){
		var params = {
			'email': data.customer.email,
			'name': data.customer.name,
			'document': data.customer.document || data.customer.corporate_document,
			'state': data.address.state,
			'city': data.address.city,
			'neighborhood': data.address.neighborhood,
			'address': data.address.address
		};
		var url = '/console/emailmarketing/allin/clicked-email/?action_mode=opened&' + $.param(params);
		$.get(url, function(data){});		
	};
    
    if(data && data.shipping_info && data.shipping_info.selected.shipping_name.indexOf('Nativo Express') >= 0){
        $('li[class*="tab-deliverypay-"]').show();
        if(!$("#checkout .shipping_info > p > .info").length) $('#checkout .shipping_info > p').append('<span class="info"> - '+data.shipping_info.selected.shipping_type.split(") ").pop()+'</span>');
        $("#checkout .shipping_info > p > span:nth-child(2)").addClass('size0');
    }else{
        $('li[class*="tab-deliverypay-"]').hide();
        $("#checkout .shipping_info > p > span:nth-child(2)").removeClass('size0');
    };
    
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type){
        if(reg.test(data.shipping_info.selected.shipping_type.toLowerCase())){
            $('.box-step-checkout .address').hide();
            $('.box-step-checkout .shipping_info').find('p').html('<b>Retirar na loja:</b> <br />'+data.shipping_info.selected.shipping_type.replace('RETIRA ','')+' - $ 0,00 ');
            $('.box-step-checkout>.content-box>.shipping_info').addClass('btz mtz');
        }else{
            $('.box-step-checkout .address').show();
            $('.box-step-checkout>.content-box>.shipping_info').removeClass('btz mtz');
        }
    }
    
});

function showModalWithdraw(data, events){
    if(!$('#ModalWithdraw').length){
        $('body').append(' \
            <div class="modal fade" id="ModalWithdraw" tabindex="-1" role="dialog"> \
                <div class="modal-dialog" role="document"> \
                    <div class="modal-content"> \
                        <div class="modal-header"> \
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                            <h4 class="modal-title">Selecionar Loja</h4> \
                        </div> \
                        <div class="modal-body"> \
                            <div class="row"> \
                                <div class="col-xs-12 fl"> \
                                    <div class="box form-vertical"> \
                                        <ul id="list_withdraw" class="list"></ul> \
                                    </div>\
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                </div> \
            </div> \
        ');
    };
    
    var select_withdraw = "";
    if(data.shipping_info && data.shipping_info.selected && data.shipping_info.selected.shipping_type) select_withdraw = data.shipping_info.selected.shipping_type;
    var list_withdraw = "";
    if(data.shipping_info && data.shipping_info.freights){
        $.each(data.shipping_info.freights, function(i,v){
            // console.log(v);
            if(reg.test(v.service.toLowerCase())){
                var class_icon = "icon-circle";
                if(select_withdraw === v.service) class_icon = "icon-check-circle-o";
                list_withdraw += "<li><a class='plz prz' style='min-height:10px;cursor:pointer;' data-freight='"+v.service+"'><i class='"+class_icon+" size16 dib valign-m'></i> <span class='dib valign-m'>"+v.label+"</span></a></li>"
            };
        });
    };

    //console.log(list_withdraw);
    
    $('#list_withdraw').html(list_withdraw);

    $('#list_withdraw a').unbind('click.convertize').bind('click.convertize', function(e){
        e.preventDefault();
        events.setFreight($(this).data('freight'));
        $('#list_withdraw').find('i').removeClass('icon-check-circle-o').addClass('icon-circle');
        $(this).find('i').removeClass('icon-circle').addClass('icon-check-circle-o');
        $('#ModalWithdraw').modal('hide');
    });

};

function base_lazyload(element, events_checkout){
    var self = this;
    var data_rules = {};
    var data_messages = {};
    var $bt = element.closest('.item-product').find('.btn-checkout');

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
            element.closest('.required.form-group').addClass('error');
            var ul = $('<div class="errorlist" />').html(error);
            if(!error.html()) return;
            if(element.prop('type') === 'checkbox' || element.prop('type') === 'radio'){
                element.closest('.form-group').append(ul);
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

    element.closest('.item-product').find('.variations input:radio').unbind('change.pote').bind('change.pote', function(){
        var _this = $(this);
        var list_values = [];

        $.each(_this.closest('div.form-group').prevAll().find('input:radio:checked'), function(){
            if($(this).val()) list_values.push('option:'+$(this).val());
        });
        if(_this.val()) list_values.push('option:'+_this.val());
        var url = decodeURI(list_values).replace(/,/g, '&').replace(/:/g,'=');

        _this.closest('.product-form').addClass('loading');

        _this.closest('div.form-group').find('label').removeClass('checked');
        _this.closest('label').addClass('checked');

        $.get(element.closest('.item-product').find('.link').attr('href')+'/options/?'+url, data={}, function(){}, 'json').done(function(data){
            _this.closest('div.form-group').nextAll().find('input:radio').attr('checked',false).attr('disabled',true).closest('label').removeClass('checked').addClass('disabled');

            if(data){
                $.each(data, function(index, item){
                    if(item.available){
                        _this.closest('.variations').find('input:radio[name=option_'+item.option_id+'][value='+item.value_id+']').removeAttr('disabled').closest('label').removeClass('disabled');
                    }
                });

                if(!$.isEmptyObject(data)){
                    var image = window.__media_prefix__+data[0].image;
                    if(element.closest('.item-product').find('.item-image img').attr('src') != image){
                        element.closest('.item-product').find('.item-image img').attr('src', image.replace('/small/','/medium/'));
                    };
                    //var sale_price = data[0].sale_price;
                    //if(!sale_price){
                       //sale_price = data[0].unit_price;
                        //element.closest('.item-product').find('.price-off .line-through').html('').closest('.price-off').hide();
                    //}else{
                        //element.closest('.item-product').find('.price-off .line-through').html(data[0].unit_price).closest('.price-off').show();
                    //};

                    if(data[0].descont_percentage) element.closest('.item-product').find('.discount span').html(String(data[0].descont_percentage).replace('-','')+'%').show();
                    else element.closest('.item-product').find('.discount span').html('').hide();

                    element.closest('.item-product').find('.sale-price').html(sale_price);
                };

                _this.closest('.product-form').removeClass('loading');
            }
        });
    });
};