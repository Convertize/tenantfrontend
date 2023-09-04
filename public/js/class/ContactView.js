const ContactView = BaseView.extend({
    init: function(){
        log("Init Contact");
        this._super();
    },
    bind_events: function(){
		this._super();
        $("#form-contact").formValidation({
            success: (form, response) => {
                if(response.status == 200 && response.data){
                    const parser = new DOMParser();
                    const htmlDoc = parser.parseFromString(response.data, "text/html");
                    const html = $(htmlDoc).find(".messages").clone();
                    form.find(".messages").remove();
                    form.prepend(html);
                    if($(html).find(".alert-success").length) $(form)[0].reset();
                }
            },
            error: (form, error) => {
                // log(error)
            }
        });
    }
});
