const SearchView = BaseView.extend({
    init: function(){
        this._super();
        log("Init Search");
        this.facets();
    },
    normalize: function(value){
        return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,-=]/g, "").replace(/^'|'$/g, '').replace(/^"|"$/g, "").trim()
    },
    facetSearch: function(e){
        const $input = $(e.currentTarget);
        const $box = $input.closest(".facet");
        const value = e.data.self.normalize($input.val());
        if(value){
            $box.find("ul li").each(function(){
                const text = e.data.self.normalize($(this).find("a").text());
                if(text.includes(value)) $(this).show()
                else $(this).hide()
            })
        }else{
            $box.find("ul li").show()
        }
    },
    facets: function(){
        $(".facet:not(.facet-p)").each(function(){
            if($(this).find("ul").height() > 262){
                $(this).find("ul").addClass("scrollbar");
                $(`<div class="facet-search">
                    <input type="search" name="search" placeholder="Buscar" class="form-control mb-1" />
                </div>`).insertBefore($(this).find("ul"));
            }
        });
        $("body").off("keyup.convertize", ".facet-search input");
        $("body").on("keyup.convertize", ".facet-search input", { self: this }, this.facetSearch);
    },
    bind_events: function(){
        this._super();
        if($(".applied-filters .filter").length){
            $(".btn-open-filters .badge").html($(".applied-filters .filter").length);
        }
        $("body").off("click.convertize", ".filter");
        $("body").on("click.convertize", ".filter", async function(e){
            e.preventDefault();
            const $el = $(this);
            const $form = $("#temp-formFilter form").length ? $("#temp-formFilter form"):$("#formFilter form");
            $form.find(`input[name="map"]`).attr("value", $el.data("rel"));
            if($("body").hasClass("is_mobile")){
                let url = $form.attr("action");
                if(url.indexOf('?') > -1) url += "&not_ajax=1";
                else url += "?not_ajax=1";

                $("#floating-sidebar .sidebar").addClass("loading");

                const response = await axios.post(url, $form.serialize());

                if(response.status == 200 && response.data){
                    const html = $.parseHTML(response.data);
                    $("#floating-sidebar .sidebar").html($(html).find(".sidebar").html());
                    if(!$("#temp-formFilter").length) $("body").append(`<div id="temp-formFilter" style="display:none;"></div>`);
                    $("#temp-formFilter").html($(html).find("#formFilter").html());
                };

                $("#floating-sidebar .sidebar").removeClass("loading");

            }else{
                $form.submit();
            }
        });

        $("body").off("click.convertize2", "#floating-sidebar .close");
        $("body").on("click.convertize2", "#floating-sidebar .close", function(e){
            $("#temp-formFilter").remove();
        });

        $("body").off("click.convertize2", "#applyFilter");
        $("body").on("click.convertize2", "#applyFilter", function(e){
            $("#temp-formFilter form").submit();
        });
    },
});