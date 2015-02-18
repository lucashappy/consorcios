/*jshint -W098 */
/*globals Modernizr*/
"use strict";


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

function navigateToPage(pageName) {



    if (!pageName) {
        pageName = window.location.hash.split("#").pop();
    }




        pages.hideAll();
        $("#"+pageName).fadeIn();





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


  //  if (Modernizr.history) {
     //   e.preventDefault();
      //  var pageName = $(this).attr("href");
     //   window.history.pushState(null, "", pageName);
        $("#mainMenu a").removeClass("activeMenuItem");
        $(this).addClass("activeMenuItem");
        navigateToPage();
   // }
});

$(window).on('popstate', function (e) {

    this._popStateEventCount++;

    if (Modernizr.history && this._popStateEventCount === 1) {
        return;
    }

    navigateToPage();
});
