function isEmail(email){
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
};

function add_message(messages, element){
    // console.log(messages);
    element.find('.messages').remove();
    const $ul = $(`<ul class="messages" />`);
    $.each(messages, function(i,m){
        $ul.append(`<li class="${m.level.toLowerCase()}">${m.message}</li>`);
    });
    element.prepend($ul);
};

function showPassword(){
    if(document.getElementById("password_input").type == "password"){
        document.getElementById("password_input").type = "text"
    	document.getElementById('password_eye').innerHTML = '<i class="icon-eye"></i>'
    } else {
    	document.getElementById("password_input").type = "password"
   		document.getElementById('password_eye').innerHTML = '<i class="icon-eye-blocked"></i>'
	}
	return false
}

function hideInitialPage(bool){
		if(bool)
		$('.initial-page')[0].style = 'display:none;'
		else
		$('.initial-page')[0].style = ''
}

function showAccessKeyLogin(bool){
		if(bool){
		hideInitialPage(true);
		setTimeout(() => {
		$('.item-page.right').removeClass("inactive");},50)
		} else {
		hideInitialPage(false);
		}

}

function Authetincator(){
    const bsModal = $.fn.modal.noConflict();
    $.fn.bsModal = bsModal;

    function _login(redirect_uri, _backdrop){
        let bt_close = `<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>`;
        if(_backdrop == "static") bt_close = "";
        $('body').append(`
			<div class="modal fade" id="boxLogin">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="pages">
                            <div class="item-page left">
								<div class="initial-page">
                                <div class="modal-header">
                                    ${bt_close}
                                    <div class="modal-title">
										<div class="container">
											<center><p class="font-weight-bold">Olá!</p></center>
											<p id="subtitle">como quer fazer o login?</p>
										</div>
									</div>
                                </div>
                                <div class="modal-body">
								<form class="form-vertical form-password">
										<li>
                                            <button class="btn btn-block btn-lg btn-success btn-acess_key" onclick="showAccessKeyLogin(true)">
                                                Chave de acesso por email
                                            </button>
                                        </li>					
										<div class="required form-group li-email">
                                            <label class="required font-weight-bold">Entrar com E-mail e senha *</label>
                                            <input type="email" name="email" placeholder="Digite o email" class="form-control"/>
                                        </div>
                                        <div class="required form-group li-password">
											<div class="input-group">
                                            <input type="password" name="password" autocomplete="new-password" placeholder="Digite sua senha" class="form-control" id="password_input"/>
											<div class="input-group-append" id="button-addon4">
											<a class="btn btn-outline-secondary border-left-0 type="button" id="password_eye" onclick="showPassword()"><i class="icon-eye-blocked"></i></a>
										</div>
											<button id="enter-button" class="btn btn-outline-secondary btn-login-password" data-loading-text="Entrar"><span>Entrar</span></button>
                                        </div>
										</form>
										<div class="d-flex">
										<a href="javascript:void(0)" class="btn btn-link btn-sm btn-block btn-set-password text-left pl-0" id="forgetpass" onclick="hideInitialPage(true)">Esqueci minha senha</a>
                                        <a href="javascript:void(0)" class="btn btn-link btn-sm btn-block btn-set-password mt-0 text-left pl-0" onclick="hideInitialPage(true)">Não tem senha? <u>Cadastre-se</u></a>
                                    	</div>
										</br>
										<div class="row d-flex justify-content-center h6">
										<label class="font-weight-bold text-center">Ou use sua conta</label>
										</div>
									<ul class="list-buttons d-flex justify-content-center">
                                        <li class="li-btncircle">
                                            <button class="btn-default btn-provider-login btn-circle" data-provider="google"><i class="icon-google"></i></button>
                                        </li>
                                        <li class="li-btncircle">
                                            <button class="btn-default btn-provider-login btn-circle" data-provider="facebook"><i class="icon-facebook"></i></button>
                                        </li>
										<li class="li-btncircle">
                                            <button class="btn-default btn-provider-login btn-circle" data-provider="mercadolivre"><i class="icon-mercadolivre"></i></button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
							</div>
                            <div class="item-page right">
                                <form class="form-vertical form-password" style="display:none;">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                                        <h4 class="modal-title">Entrar com email e senha </h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="required form-group li-email">
                                            <label class="required font-weight-bold">Email </label>
                                            <input type="email" name="email" class="form-control"/>
                                        </div>
                                        <div class="required form-group li-password">
                                            <label class="required font-weight-bold">Senha </label>
                                            <input type="password" name="password" autocomplete="new-password" class="form-control" />
                                        </div>
                                        <a href="javascript:void(0)" class="btn btn-link btn-sm btn-block btn-set-password text-left pl-0 text-dark">Esqueci minha senha</a>
                                        <a href="javascript:void(0)" class="btn btn-link btn-sm btn-block btn-set-password mt-0 text-left pl-0 text-dark">Não tem uma senha? Cadastre agora</a>
                                    </div>
                                    <div class="float modal-footer">
                                        <button type="button" class="btn btn-secondary btn-back">Voltar</button>
                                        <button type="button" class="btn btn-success btn-login-password ml-auto" data-loading-text="Entrar">Entrar</button>
                                    </div>
                                </form>
                                <form class="form-vertical form-set-password" style="display:none;">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                                        <h4 class="modal-title">Cadastrar nova senha </h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="required form-group li-email">
                                            <label class="required font-weight-bold">Email </label>
                                            <input type="email" name="email" required class="form-control" placeholder="Digite o email"/>
                                        </div>
                                        <div class="required form-group li-password">
                                            <label class="required font-weight-bold">Nova senha </label>
                                            <input type="password" name="password" autocomplete="new-password" class="form-control" placeholder="Digite sua senha"/>
                                        </div>
                                        <div class="required form-group li-confirm-password">
                                            <label class="required font-weight-bold">Confirmar nova senha </label>
                                            <input type="password" name="confirm_password" id="confirm_password" class="form-control" placeholder="Confirme sua senha"/>
                                        </div>
                                        <div class="required form-group li-acess_key" style="display:none;">
                                            <label class="required font-weight-bold">Código de verificação </label>
                                            <input type="tel" name="acess_key" class="form-control" />
                                            <p class="form-text text-muted">Informe o código de acesso recebido em seu email</p>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary btn-back" onclick="hideInitialPage(false)">Voltar</button>
                                        <button type="button" class="btn btn-success btn-save-password ml-auto">Cadastrar </button>
                                    </div>
                                </form>
                                <form class="form-vertical form-acess_key" style="display:none;">
                                    <div class="step-1">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                                            <h4 class="modal-title">Informar o seu Email </h4>
                                        </div>
                                        <div class="modal-body">
                                            <div class="required form-group li-email">
                                                <label class="required font-weight-bold">Email </label>
                                                <input type="email" name="email" required class="form-control" placeholder="Digite o email"/>
                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary btn-back" onclick="showAccessKeyLogin(false)">Voltar</button>
                                            <button type="button" class="btn btn-success btn-key-email ml-auto" data-loading-text="Entrar">Entrar</button>
                                        </div>
                                    </div>
                                    <div class="step-2">
                                        <div class="modal-header">
                                            <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
                                            <h4 class="modal-title">Informar chave de acesso </h4>
                                        </div>
                                        <div class="modal-body">
                                            <div class="required form-group li-acess_key">
                                                <label class="required font-weight-bold">Código de verificação </label>
                                                <input type="tel" name="acess_key" class="form-control" />
                                                <p class="form-text text-muted">Informe o código de acesso recebido no email: <span class="email"></span></p>
                                            </div>
                                        </div>
                                        <div class="float modal-footer">
                                            <button type="button" class="btn btn-success btn-confirm-key">Entrar</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $("#boxLogin").bsModal({backdrop: _backdrop, keyboard: false});

        const URL_LOGIN = "order/authentication/validate/";
        const URL_ACESS_KEY = "order/authentication/acesskey/";
        const URL_SET_PASSWORD = "order/authentication/set-password/";
        const URL_AUTHENTICATION_PROVIDER = "order/authentication/provider/";

        const api = axios.create({
            baseURL: "/api/1.0/public"
        });

        $("#boxLogin").on("shown.bs.modal", function(e){
            const $this = $(this);

            $this.find(".btn-provider-login").unbind("click.convertize").bind("click.convertize", async function(e){
                e.preventDefault();
                const provider = $(this).attr("data-provider");
                const $bt = $(this);
                $bt.prop("disabled",true);

                try{
                    const formData = new FormData();
                    formData.append("provider", provider);
                    formData.append("next", redirect_uri);
                    const response = await api.post(URL_AUTHENTICATION_PROVIDER, formData);
                    const resp = response.data;
                    if(resp.redirect_uri){
                        window.location = resp.redirect_uri;
                        if(resp.redirect_uri.indexOf('p#') !== -1) window.location.reload();
                    }
                }catch(err){
                    // console.log(err)
                }

                $bt.prop("disabled",false);

            });

            // ACESS KEY
            $(".form-acess_key").validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    acess_key: {
                        required: true
                    }
                },
                messages: {
                    email: {
                        required:"Campo obrigatório",
                        email:"Email inválido"
                    },
                    acess_key: {
                        required:"Campo obrigatório"
                    }
                },
                errorElement: "li",
                errorPlacement: function(error, element){
                    element.addClass("is-invalid").closest(".required.form-group").addClass("error");
                    const ul = $(`<ul class="invalid-feedback" />`).html(error);
                    if (element.prop("type") === "checkbox"){
                        ul.insertAfter(element.parent("label"));
                    } else {
                        ul.insertAfter(element);
                    };
                },
                success: function (label,element){
                    $(element).closest(".required.group").find(".invalid-feedback").remove();
                    $(element).removeClass("is-invalid").addClass("is-valid").closest(".required.group").removeClass("error").addClass("success");
                },
                submitHandler: function(form){
                    const email = $(form).find("input[name=email]").val();
                    $(".btn-key-email").prop("disabled", true);
                    api.post(URL_ACESS_KEY, {
                        email: email
                    }).then(function(response){
                        const resp = response.data;
                        $(".btn-key-email").prop("disabled", false);
                        if(resp.messages) add_message(resp.messages, $(form).find(".modal-body"));
                        if(resp.status == 200){
                            $this.find(".item-page.right .form-acess_key .step-1").hide();
                            $this.find(".item-page.right .form-acess_key .step-2").show();
                            $this.find(".item-page.right .form-acess_key .step-2 .email").text(email);
                            $(".btn-confirm-key").unbind("click.convertize").bind("click.convertize", function(e){
                                const $bt = $(this);
                                if($(form).find("input[name=acess_key]").val()){
                                    $bt.button("loading");
                                    const acess_key = $(form).find("[name=acess_key]").val();
                                    api.post(URL_LOGIN, {
                                        email: email,
                                        acess_key: acess_key
                                    }).then(function(response){
                                        const resp2 = response.data;
                                        $bt.button("reset");
                                        if(resp2.messages) add_message(resp2.messages, $(form).find(".modal-body"));
                                        if(resp2.status == 200){
                                            if(redirect_uri){
                                                window.location = redirect_uri;
                                                if(redirect_uri.indexOf("p#") !== -1) window.location.reload();
                                            }else window.location.reload();
                                        };
                                    }).catch((err) => {
                                        // console.error("ops! ocorreu um erro" + err);
                                    });
                                };
                            });
                        };
                    }).catch((err) => {
                        // console.error("ops! ocorreu um erro" + err);
                        $(".btn-key-email").prop("disabled", false);
                    });
                }
            });
            $this.find(".btn-acess_key").unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $this.find(".item-page.right form, .item-page.right .form-acess_key .step-2").hide();
                $this.find(".item-page.right .form-acess_key, .item-page.right .form-acess_key .step-1").show();
                $this.find(".item-page.right").addClass("inactive");
                $(".btn-key-email").unbind("click.convertize").bind("click.convertize", function(e){
                    e.preventDefault();
                    $(this).closest("form").submit();
                });
            });
            // END ACESS KEY

            // LOGIN PASSWORD
            $(".form-password").validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    }
                },
                messages: {
                    email: {
                        required:"Campo obrigatório",
                        email:"Email inválido"
                    },
                    password: "Campo obrigatório"
                },
                errorElement: "li",
                errorPlacement: function(error, element){
                    element.addClass("is-invalid").closest(".required.form-group").addClass("error");
                    const ul = $(`<ul class="invalid-feedback order-last" />`).html(error);
                    if (element.prop("type") === "checkbox"){
                        ul.insertAfter(element.parent("label"));
                    } else {
                        ul.insertAfter(element);
                    };
                },
                success: function (label,element){
                    $(element).closest(".required.group").find(".invalid-feedback").remove();
                    $(element).removeClass("is-invalid").addClass("is-valid").closest(".required.group").removeClass("error").addClass("success");
                },
                submitHandler: function(form){
                    const email = $(form).find("input[name=email]").val(),
                        password = $(form).find("input[name=password]").val();

                    $(".btn-login-password").prop("disabled",true);

                    api.post(URL_LOGIN, {
                        email: email,
                        password: password
                    }).then(function(response){
                        const data = response.data;
                        if(data.messages) add_message(data.messages, $(form).find(".form-group"));
                        if(data.status == 200){
                            if(redirect_uri){
                                window.location = redirect_uri;
                                if(redirect_uri.indexOf("p#") !== -1) window.location.reload();
                            }else{
                                window.location.reload();
                            }
                        };
                        $(".btn-login-password").prop("disabled",false);
                    }).catch((err) => {
                        // console.error("ops! ocorreu um erro" + err);
                        $(".btn-login-password").prop("disabled",false);
                    });
                }
            });
            $this.find(".btn-password").unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $this.find(".item-page.left form").hide();
                $this.find(".item-page.left .form-password").show();
                $this.find(".item-page.left").addClass("inactive");
                $(".btn-login-password").unbind("click.convertize").bind("click.convertize", function(e){
                    e.preventDefault();
                    $(this).closest("form").submit();
                });
            });
            // END LOGIN PASSWORD

            // SET PASSWORD
            $(".form-set-password").validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    confirm_password: {
                        required: true,
                        equalTo: $("#boxLogin .form-set-password input[name=password]")
                    },
                    acess_key: {
                        required: true
                    }
                },
                messages: {
                    email: {
                        required: "Campo obrigatório",
                        email: "Email inválido"
                    },
                    password: "Campo obrigatório",
                    confirm_password: {
                        required:"Campo obrigatório",
                        equalTo:"Senhas não conferem"
                    },
                    acess_key: "Campo obrigatório"
                },
                errorElement: "li",
                errorPlacement: function(error, element){
                    element.addClass("is-invalid").closest(".required.form-group").addClass("error");
                    const ul = $(`<ul class="invalid-feedback" />`).html(error);
                    if (element.prop("type") === "checkbox"){
                        ul.insertAfter(element.parent("label"));
                    } else {
                        ul.insertAfter(element);
                    };
                },
                success: function (label,element){
                    $(element).closest(".required.group").find(".invalid-feedback").remove();
                    $(element).removeClass("is-invalid").addClass("is-valid").closest(".required.group").removeClass("error").addClass("success");
                },
                submitHandler: function(form){
                    const email = $(form).find("input[name=email]").val(),
                        password = $(form).find("input[name=password]").val(),
                        c_password = $(form).find("input[name=confirm_password]").val(),
                        acess_key = $(form).find("input[name=acess_key]").val();

                    $(".btn-save-password").button("loading");

                    if(!$(form).find('.li-acess_key').is(':visible')){

                        api.post(URL_ACESS_KEY, {
                            email: email
                        }).then(function(response){
                            const data = response.data;
                            if(data.messages) add_message(data.messages, $(form).find(".modal-body"));
                            if(data.status == 200){
                                $(form).find(".li-acess_key").show();
                                $(form).find(".li-password, .li-confirm-password").hide();
                            };
                            $(".btn-save-password").button("reset");
                        }).catch((err) => {
                             console.error("ops! ocorreu um erro" + err);
                        });

                    }else if(password && acess_key){
                        api.post(URL_SET_PASSWORD, {
                            email: email,
                            password: password,
                            acess_key: acess_key
                        }).then(function(response){
                            const data = response.data;
                            if(data.messages) add_message(data.messages, $(form).find(".modal-body"));
                            if(data.status == 200){
                                if(redirect_uri){
                                    window.location = redirect_uri;
                                    if(redirect_uri.indexOf("p#") !== -1) window.location.reload();
                                }else window.location.reload();
                            };
                            $(".btn-save-password").button("reset");
                        }).catch((err) => {
                            // console.error("ops! ocorreu um erro" + err);
                        });
                    }
                }
            });
            $this.find(".btn-set-password").unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $this.find(".item-page.right form").hide();
                $this.find(".item-page.right .form-set-password").show();
                $(".btn-save-password").unbind("click.convertize").bind("click.convertize", function(e){
                    e.preventDefault();
                });
                $(".btn-save-password").unbind("click.convertize").bind("click.convertize", function(e){
                    e.preventDefault();
                    $(this).closest("form").submit();
                });
            });
            // END SET PASSWORD

            $this.find(".btn-back").unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $this.find(".item-page.right form").hide();
                $this.find(".item-page.left").removeClass("inactive");
            });

            $this.find(".btn-back2").unbind("click.convertize").bind("click.convertize", function(e){
                e.preventDefault();
                $this.find(".item-page.right form").hide();
                $this.find(".item-page.right .form-password").show();
            });

            $("form input").unbind("keypress").keypress(function(e){
                if(e.keyCode == 13){
                    $(this).closest("form").submit();
                    return false;
                }
            });

        });

        $("input[name=email]").unbind("keyup.convertize").bind("keyup.convertize", function(e){
            this.value = this.value.toLowerCase();
        });

        $("#boxLogin").on("hidden.bs.modal", function (e){
            $("#boxLogin").remove();
        });

    };
    $("body").off("click.convertize", ".bt_login, .btn-login");
    $("body").on("click.convertize", ".bt_login, .btn-login", function(e){
        e.preventDefault();
        var redirect_uri = "/",
            _backdrop = true;
        if($(this).attr("href")) redirect_uri = $(this).attr("href");
        if($(this).data("backdrop")) _backdrop = $(this).data("backdrop");
        _login(redirect_uri, _backdrop);
    });

    var modal = $.fn.bsModal.noConflict();
    $.fn.modal = modal;

};
Authetincator();