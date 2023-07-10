$(document).ready(function () {
    //Hide template success information
    $(".cz-preloading-success").hide();

    //toast options configuration
    toastr.options = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-full-width",
        preventDuplicates: true,
        onclick: null,
        showDuration: "1000",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };

    $.validator.addMethod(
        "phoneBR",
        function (phone_number, element) {
            phone_number = phone_number.replace(/[^\d]+/g, "");
            return phone_number.match(
                /^(?:(?:(?:\+|)(?:55|)|))(?:0|)(?:(?:(?:1[1-9]|2[12478]|3[1-8]|6[1-9]|7[134579]|8[1-9]|9[1-9]|4[1-9]|5[1-5])(?:9\d{8}|\d{8})))$/
            );
        },
        "Número Inválido"
    );

    $.validator.addMethod(
        "valid_name",
        function(value, element){
            return value.trim().split(" ").length > 1
        },
        "Digite seu nome completo"
    );

    $.validator.addMethod(
        "cpf",
        function (value) {
            // Removing special characters from value
            value = value.replace(/([~!@#$%^&*()_+=`{}\[\]\-|\\:;'<>,.\/? ])+/g, "");
            if (value == "") return true;
            // Checking value to have 11 digits only
            if (value.length !== 11) {
                return false;
            }
            var sum = 0,
                firstCN,
                secondCN,
                checkResult,
                i;
            firstCN = parseInt(value.substring(9, 10), 10);
            secondCN = parseInt(value.substring(10, 11), 10);
            checkResult = function (sum, cn) {
                var result = (sum * 10) % 11;
                if (result === 10 || result === 11) {
                    result = 0;
                }
                return result === cn;
            };
            // Checking for dump data
            if (
                value === "" ||
                value === "00000000000" ||
                value === "11111111111" ||
                value === "22222222222" ||
                value === "33333333333" ||
                value === "44444444444" ||
                value === "55555555555" ||
                value === "66666666666" ||
                value === "77777777777" ||
                value === "88888888888" ||
                value === "99999999999"
            ) {
                return false;
            }
            // Step 1 - using first Check Number:
            for (i = 1; i <= 9; i++) {
                sum = sum + parseInt(value.substring(i - 1, i), 10) * (11 - i);
            }
            // If first Check Number (CN) is valid, move to Step 2 - using second Check Number:
            if (checkResult(sum, firstCN)) {
                sum = 0;
                for (i = 1; i <= 10; i++) {
                    sum = sum + parseInt(value.substring(i - 1, i), 10) * (12 - i);
                }
                return checkResult(sum, secondCN);
            }
            return false;
        },
        "CPF inválido."
    );
	
	$(".btn-cnpj").click(function(){
		$(this).addClass('d-none')
		let span = $(".handle-cnpj").find('span')
		$('.handle-cnpj').addClass('d-flex align-items-center')
		$('.discard').removeClass("d-none")
		span.removeClass("d-none")
		$(".cnpj").removeClass('d-none')
		
		$('.discard').click(function(){
			$('.discard').addClass('d-none')
			span.addClass("d-none")
			$('.handle-cnpj').removeClass('d-flex align-items-center')
			$(".btn-cnpj").removeClass('d-none')
			$(".cnpj").addClass('d-none')
		})
	})
	
	$(".ie_isento").change(function(e){
		if (e.currentTarget.checked) {
			$('.ie').attr("disabled", "");
		} else {
			$('.ie').attr("disabled",false);
		}
	})
	

    // validação do CNPJ

    $.validator.addMethod(
        "cnpj",
        function (value) {
            value = value.replace(/[^\d]+/g, "");
            if (value == "") return false;
            if (value.length != 14) return false;
            // Elimina CNPJs invalidos conhecidos
            if (
                value == "00000000000000" ||
                value == "11111111111111" ||
                value == "22222222222222" ||
                value == "33333333333333" ||
                value == "44444444444444" ||
                value == "55555555555555" ||
                value == "66666666666666" ||
                value == "77777777777777" ||
                value == "88888888888888" ||
                value == "99999999999999"
            )
                return false;

            // Valida DVs
            tamanho = value.length - 2;
            numeros = value.substring(0, tamanho);
            digitos = value.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
            if (resultado != digitos.charAt(0)) return false;

            tamanho = tamanho + 1;
            numeros = value.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
            if (resultado != digitos.charAt(1)) return false;

            return true;
        },
        "Informe um CNPJ valido."
    ); // Mensagem padrão

    $.fn.serializeObject = function () {
        var o = {};
        // var disabled = this.find(':disabled').removeAttr('disabled');
        var a = this.serializeArray();
        // disabled.attr('disabled', 'disabled');
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || "");
            } else {
                o[this.name] = this.value || "";
            }
        });
        return o;
    };

    let data_rules = {};

    // validacoes
    $("#form-cadastrese")
        .find(".required")
        .each(function () {
            var name = $(this).attr("name"),
                data = $(this).data("validator");

            if (data) {
                data_rules[name] = {};
                $.each(data, function (k, v) {
                    // document
                    if (v && k) data_rules[name][k] = v;
                    //if(name == 'document' && k == 'required'){
                    //		data_rules[name][k] = function(element){
                    //				return !$('#id_corporate_document').val();
                    //			}
                    //		}
                });
                $(this).find("input, select").removeAttr("data-validator");
            }
        });
    $("#form-cadastrese").submit(function (e) {
        e.preventDefault();
    });

    const validator = $("#form-cadastrese").validate({
        lang: "en",
        rules: data_rules,
        errorElement: "li",
        errorPlacement: function (error, element) {
            // exibe o erro para o frontend
            element.closest(".form-group").addClass("error");
            var ul = $('<ul class="errorlist" />').html(error);
            if (!error.html()) return;
            if (element.prop("type") === "checkbox") {
                ul.insertAfter(element.parent("label"));
            } else {
                ul.insertAfter(element);
            }
        },
        success: function (label, element) {
            $(element).closest(".form-group").find(".errorlist").remove();
            $(element)
                .closest(".form-group")
                .removeClass("error")
                .addClass("success");
        },
        submitHandler: function (form) {
            // faz o POST com os dados
            $("#go-to-cadastrese").button("loading");
            var formData = $("form.cadastrese").serializeObject();
            //formData.group_id = 1;
            //formData.blocked = true;
            formData.inscricao_estadual_isento = true;
            axios({
                    method: "POST",
                    url: "/api/v1/public/customer/",
                    data: formData,
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                })
                .then(function (data) {
                    document.getElementById("form-cadastrese").reset()
                    $(".cz-preloading-success").show();
                    //addModal("cadstro-msg", "<b>Cadastro realizado com sucesso!<br/>Agora basta aguardar a aprovação do cadastro.</b>");
                    toastr.success("<div style='text-align:center;font-size:1rem'>Cadastro realizado com sucesso!</div>");
                    $('#go-to-cadastrese').button('reset');

                    setInterval(function successPage() {
                        $(".cz-preloading-success").hide();
                        $("#form-cadastrese").hide();
                        $("#registerSuccess").show();
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        });
                    }, 2000);

                })
                .catch(function (data, status) {
                    toastr.error("<div style='text-align:center;font-size:1rem'><b>Erro ao realizar o cadastro!<br /> Corrija os campos e tente novamente.</b></div>");
                    //addModal("cadstro-msg", "<b>Erro ao realizar o cadastro!</b>");
                    //$('#modal-toggle').toggleClass('modal-estilization modal-estilization--denied');
                    $('#go-to-cadastrese').button('reset');
                });

            $(form).find("input:disabled").val("").removeAttr("disabled");
            return false;
        },
    });

    // mascara
    const loadZipcode = async function(zipcode, currentField, validator){
        const $form = currentField.closest("form")
        $form.find("[name$=code_ibge],[name$=city_id]").remove();
        $form.find("[name$=state]").val("");

        try{
            const response = await axios.get(`/ws/zipcode/?zipcode=${zipcode}`);
            const resp = response.data;
            if(response.status == 200 && resp.success){
                log(resp);
                $form.append(`<input type="hidden" name="code_ibge" value="${resp.codigo_ibge || ""}" />`);
                $form.append(`<input type="hidden" name="city_id" value="${resp.localidade_id || ""}" />`);

                $form.find("input[name$=address]").val(resp.endereco || "");
                $form.find("input[name$=city]").val(resp.cidade || "").attr("readonly", !!resp.cidade);

                if(resp.bairros && resp.bairros.length == 1){
                    $form.find("[name$=neighborhood]").replaceWith(`<input class="form-control" type="text" name="${$form.find("[name$=neighborhood]").attr("name")}" id="${$form.find("[name$=neighborhood]").attr("id")}" value="${resp.bairros[0]}" required maxlength="100" />`);
                }else if(resp.bairros && resp.bairros.length > 1){
                    const options = resp.bairros.map(function(b){
                        return `<option value="${b}">${b}</option>`
                    });
                    $form.find("[name$=neighborhood]").replaceWith(`<select class="form-control" name="${$form.find("[name$=neighborhood]").attr("name")}" id="${$form.find("[name$=neighborhood]").attr("id")}" required><option value="">---------</option>${options.join("")}</select>`);
                }else{
                    $form.find("[name$=neighborhood]").replaceWith(`<input class="form-control" type="text" name="${$form.find("[name$=neighborhood]").attr("name")}" id="${$form.find("[name$=neighborhood]").attr("id")}" value="" required maxlength="100" />`);
                }

                if(resp.uf){
                    $form.find("[name$=state]").val(resp.uf).attr("disabled","disabled");
                    $form.find("[name$=state]").parent().append(`<input type="hidden" name="${$form.find("[name$=state]").attr("name")}" value="${resp.uf}" />`);
                }else{
                    $form.find("[name$=state][type=hidden]").remove();
                    $form.find("[name$=state]").removeAttr("disabled");
                }

            }else{
                validator.showErrors({
                    zipcode: "CEP não encontrado!",
                });
                $form.find("input[name$=city]").val("");
                $form.find("[name$=neighborhood]").replaceWith(`<input class="form-control" type="text" name="${$form.find("[name$=neighborhood]").attr("name")}" id="${$form.find("[name$=neighborhood]").attr("id")}" value="" required maxlength="100" />`);
                $form.find("[name$=state][type=hidden]").remove();
                $form.find("[name$=state]").removeAttr("disabled");
            }
        }catch(err){
            validator.showErrors({
                zipcode: "CEP não encontrado!",
            });
            $form.find("input[name$=city]").val("");
            $form.find("[name$=neighborhood]").replaceWith(`<input class="form-control" type="text" name="${$form.find("[name$=neighborhood]").attr("name")}" id="${$form.find("[name$=neighborhood]").attr("id")}" value="" required maxlength="100" />`);
            $form.find("[name$=state][type=hidden]").remove();
            $form.find("[name$=state]").removeAttr("disabled");
        }

        currentField.closest("form").removeClass("loading");
        currentField.removeAttr("readonly");
    };

    $(".cep_with_callback").mask("00000-000", {
        onChange : function(zipcode, event, currentField, options){
            if(zipcode.length < 9){
                currentField.removeAttr("readonly").removeClass("loading");
                return;
            };
        },
        onComplete: function (zipcode, event, currentField, options){
            currentField.closest("form").addClass("loading");
            currentField.attr("readonly",true);
            loadZipcode(zipcode, currentField, validator);
        }
    }).unbind("keypress.convertize").bind("keypress.convertize", function(e){
        if(e.keyCode == 13) return false;
    });
    $("input[name=document]").mask("000.000.000-00");
    $("input[name=corporate_document]").mask("00.000.000/0000-00");
    $("input[name=inscricao_estadual]").mask("000.000.000.000");


    const maskBehavior = function(val){
        return val.replace(/\D/g, '').length === 11 ? "(00) 00000-0000" : "(00) 0000-00009";
    },
    options = {
        onKeyPress: function(val, e, field, options){
            field.mask(maskBehavior.apply({}, arguments), options);
        }
    };
    $("input[name*=phone]").unmask().mask(maskBehavior, options);

    // end mask

    $("#id_email").on("blur", function () {
        const email = $(this).val();
        axios({
                method: "post",
                url: "/api/v1/public/customer/identify/",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                },
                responseType: "json",
                data: JSON.stringify({
                    email: email,
                    update: true
                }),
            })
            .then(function (response) {
                if (response.data.is_register === false) {
                    validator.showErrors({
                        email: "E-mail já cadastrado",
                    });
                }
            })
            .catch(function (data, status) {
                console.log(data, status);
            });
    });
    $("#id_document").on("blur", function () {
        const email = $(this)
            .val()
            .replace(/[^0-9]/g, "");
        axios({
                method: "post",
                url: "/api/v1/public/customer/identify/",
                headers: {
                    "content-type": "application/json",
                    Accept: "application/json",
                },
                responseType: "json",
                data: JSON.stringify({
                    email: email,
                    update: true
                }),
            })
            .then(function (response) {
                if (response.data.is_register === false) {
                    validator.showErrors({
                        document: "Documento já cadastrado",
                    });
                }
            })
            .catch(function (data, status) {
                console.log(data, status);
            });
    });
});