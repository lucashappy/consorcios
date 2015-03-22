/*jshint -W098 */
/*jshint -W030 */
/*globals Modernizr,tinycolor,alert*/
"use strict";

var estados = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];

$.each(estados, function (val, text) {
    $('.estados').append($('<li></li>').val(val).html(text));
});

var animationEnds = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
var currentPage = "",
    consorciosLoaded = false;

function loadConsorcios() {

    if (!consorciosLoaded) {
        // "?jsoncallback=?" allows cross domain request
        $.getJSON("consorcios.json", function () {
                console.log("consorcios loaded");
            })
            .done(function (data) {

                var thumb = "<div class='thumb'><p>%1%</p>" +
                    "<aside><div class='close'>X</div>" +
                    "<div class='estado' style='background-color:%6%;'>%2%</div>" +
                    "<div class='areas'>" +
                    "<div class='triangle'></div>" +
                    "<div class='agua %3%' ></div>" +
                    "<div class='esgoto %3%'></div>" +
                    "<div class='residuos %4%'></div>" +
                    "<div class='regulacao %5%'></div></div></aside></div>";

                //for (i = 0; i < data.length; i++) {

                var content = "";

                console.log("data length " + data.length);
                $.each(data, function (i, consorcio) {

                    content += thumb.replace("%1%", consorcio.name)
                        .replace("%2%", consorcio.uf)
                        .replace("%6%", "#" + tinycolor.fromRatio({
                            h: estados.indexOf(consorcio.uf) / 27.0,
                            s: 0.52,
                            v: 0.68
                        }).toHex());

                    switch (consorcio.area) {
                    case "1":
                        content = content.replace(/%3%/g, "")
                            .replace("%4%", "hidden")
                            .replace("%5%", "hidden");
                        break;
                    case "2":
                        content = content.replace(/%3%/g, "hidden")
                            .replace("%4%", "")
                            .replace("%5%", "hidden");
                        break;
                    case "3":
                        content = content.replace(/%3%/g, "")
                            .replace("%4%", "")
                            .replace("%5%", "hidden");
                        break;
                    case "4":
                        content = content.replace(/%3%/g, "hidden")
                            .replace("%4%", "hidden")
                            .replace("%5%", "");
                        break;
                    default:
                        content = content.replace(/%3%/g, "hidden")
                            .replace("%4%", "hidden")
                            .replace("%5%", "hidden");
                        break;

                    }
                });

                $("#consorciosThumbs").append(content);


                $('.thumb').click(function () {
                    console.log("expand");
                    $(this).addClass("consorcioExpanded");
                });
                $('.close').click(function (event) {
                    console.log("collapse");
                    $('.consorcioExpanded').removeClass("consorcioExpanded");
                    event.stopPropagation();
                });
                consorciosLoaded = true;
                // }


            })
            .fail(function () {
                console.log("consorcios loading error");
            })
            .always(function () {
                console.log("consorcios loading complete");
            });
    }
}






/*** Buscar consórcios ***/

$('#searchBox').keyup(function () {
    var query = $(this).val();
    $("#consorciosThumbs .thumb p").each(function () {
        ($(this).text().search(new RegExp(query, "i")) < 0) ? $(this).parent().hide(): $(this).parent().show();
    });
});

/***** Handle URLs and History *****/

var pages = [$("#pesquisa"), $("#consorcios"), $("#publicacoes"), $("#contato")];
pages.hideAll = function () {

    for (var i = 0; i < pages.length; i++) {
        pages[i].hide();
    }
};


function getPageName() {


    var pathName = window.location.pathname,
        pageName = "";

    if (pathName.indexOf("/") !== -1) {
        pageName = pathName.split("/").pop();
    } else {
        pageName = pathName;
    }

    return pageName;
}

function navigateToPage(pageName, menu) {

    console.log("Navigate to page");

    if (!pageName) {
        pageName = window.location.hash.split("#").pop();
    }

    console.log("pg  " + pageName);
    if (pageName === "") {

        if ($('.content').css("visibility") === "visible") {
            $(".content").addClass('animated slideOutRight');
            $('.content').one(animationEnds, function () {
                $('.content').css("visibility", "hidden");
                $('.content').removeClass('animated slideOutRight');
            });
        }
        currentPage = "";
    } else if (pageName !== currentPage) {

        $("#mainMenu a").removeClass("activeMenuItem");
        $(menu).addClass("activeMenuItem");

        if ($('.content').css("visibility") === "hidden") {
            $('.content').css("visibility", "visible");
            $(".content").addClass('animated slideInRight');
            $('.content').one(animationEnds, function () {
                $('.content').removeClass('animated slideInRight');
            });
        }

        pages.hideAll();

        if (pageName === "consorcios") {
            loadConsorcios();
        }
        $("#" + pageName).fadeIn();
        currentPage = pageName;

    }





    if (window.location.hash) {
        console.log("Hash " + window.location.hash.split("#").pop());
        // var pageNumber = window.location.hash.split("-").pop();
        // console.log("PAGE " + pageNumber);
        // $("#newsPagination").pagination('selectPage', pageNumber);
    } else {
        //  pages.hideAll();
        //  $(".mainPage").fadeIn();
        //  $("#newsPagination").pagination('selectPage', 1);

    }

    $.get(pageName, function (response) {

        /*     var
            // Wrap the resulting HTML string with a parent node
            // so jQuery can properly select against it.
                markup = $("<div>" + response + "</div>"),

            // Extract the fragment out of the markup.
                fragment = markup.find(".site-wrapper").html();

            $(".site-wrapper").html(fragment);*/



    });
}

$("a[data-role='ajax']").click(function (e) {


    if (Modernizr.history) {
        e.preventDefault();
        var pageName = $(this).attr("href");
        if(pageName !== currentPage){
            window.history.pushState(null, "", pageName);
            navigateToPage(pageName, $(this));
        }

    }
});

$(window).on('popstate', function (e) {

    this._popStateEventCount++;

    if (Modernizr.history && this._popStateEventCount === 1) {
        return;
    }

    navigateToPage();
});
