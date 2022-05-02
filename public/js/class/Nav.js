const Nav = $.Class.create({
    sections: function(section){
        section = this.toTitleCase(section)
        try{
            const view = eval(`${section}View`);
            return view
        }catch(err){
            // log(err)
        }
    },
    init: function(name){
        log("Init Nav");
        this.to();
    },
    to: function(){
        const section = $("body").attr("id");
        const view = this.sections(section)
        if(view){
            log("Go to "+section);
            this.section = new view;
        }else{
            try{
                this.section = new BaseView();
            }catch(err){
                // log(err)
            }
        }
    },
    toTitleCase: function(str){
        return str.replace(
            /\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

});

function log(m){
    if(RegExp(".convertize.com.br").test(window.location.host)) return console.log(m);
}
function info(m){
    if(RegExp(".convertize.com.br").test(window.location.host)) return console.info(m);
}
function error(m){
    if(RegExp(".convertize.com.br").test(window.location.host)) return console.error(m);
}
let nav;
$(window).ready(function() {
    nav = new Nav();
});

Number.prototype.toCurrency = function () {
    var match, centavos, reais, result;

    match = (this).toFixed(2).match(/^-?(\d+)(\.\d+)?$/);
    if (!match) return;

    centavos = match[2] ? (match[2] + "00").substr(1, 2) : "00";
    reais = match[1].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    resultado = "R$ " + reais + "," + centavos;
    if (this < 0) resultado = "-" + resultado;
    return resultado;
};

function fromCurrencyToFloat(valor){
    try{
        valor = valor.toString().replace(/\./g, '').replace(',', '.').replace('R$ ', '');
        return parseFloat(valor);
    }catch(e){}
};
function htmlDecode(value){
  return $('<div/>').html(value).text();
};

if($.widget && $.ui){
    $.widget("ui.spinner", $.ui.spinner, {
        _buttonHtml: function() {
            return `
                <button type="button" class="ui-spinner-button ui-spinner-up" aria-label="Mais">
                    <i class="icon-plus"></i>
                </button>
                <button type="button" class="ui-spinner-button ui-spinner-down" aria-label="Menos">
                    <i class="icon-minus"></i>
                </button>
            `;
        }
    })
}

// if("serviceWorker" in navigator) {
//     window.addEventListener("load", function() {
//         navigator.serviceWorker.register("/sw.js").then(function(registration) {
//             // Registration was successful
//             console.log("ServiceWorker registration successful with scope: ", registration.scope);
//         },function(err){
//             // registration failed :(
//             console.log("ServiceWorker registration failed: ", err);
//         });
//     });
// }