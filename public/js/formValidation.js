(function($){
    $.fn.formValidation = function(options){
        if(typeof $.validator === "undefined") { 
            console.error("validator undefined");
            return true;
        }

        const self = this;
        const settings = $.extend({
            url: this.attr("action"),
            method: this.attr("method") || "POST",
            ajax: this.data("ajax") || true,
            contentType: this.data("content-type") || "application/json",
            formData: this.data("form-data") || false,
            success: (form,response) => {},
            error: (form,error) => {}
        }, options);

        if(settings.ajax && typeof axios === "undefined") { 
            console.error("axios undefined");
            return true;
        }

        const data_rules = {};
        const data_messages = {};

        self.find(".form-group.required select, .form-group.required input, .form-group.required textarea").each(function(){
            const name = $(this).attr("name");
            data_rules[name] = {
                required: true
            };
            data_messages[name] = {
                required: $(this).data("title") ? `Preencha o campo de <b>${$(this).data("title")}</b>`:"Este campo obrigatório"
            };
        });

        self.validate({
            rules: data_rules,
            messages: data_messages,
            errorElement: "p",
            errorPlacement: function(error, element){
                element.closest(".variations").addClass("error");
                const ul = $(`<div class="errorlist" />`).html(error.addClass("text-danger mt-2"));
                if(!error.html()) return;
                element.closest(".form-group").append(ul);
            },
            invalidHandler: function(event, validator){
                self.removeClass("loading");
            },
            submitHandler: async function(form, event){
                event.preventDefault();

                self.addClass("loading");

                if(!settings.ajax){
                    form.submit();
                    return true;
                }

                const config = {
                    url: settings.url,
                    method: settings.method.toLowerCase(),
                    headers: {
                        "Content-Type": settings.contentType
                    }
                };

                const body = settings.formData ? new FormData():{};

                if(settings.formData){
                    $(form).serializeArray().map(function(item){
                        body.append(item.name, item.value);
                    });
                }else{
                    $(form).serializeArray().map(function(item){
                        body[item.name] = item.value;
                    });
                }

                if(config.method == "get") config.params = body;
                else config.data = body;

                axios(config).then(function(response){
                    self.removeClass("loading");
                    settings.success(self,response);
                })
                .catch(function(error){
                    self.removeClass("loading");
                    settings.error(self,error);
                });

            }
        });

        return this;
    };
}(jQuery));