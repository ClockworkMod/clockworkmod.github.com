var manArr = new Array();


$(document).ready(function() {

    $.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data) {


        // Display the developer, his ID, and  the summary
        // Get manifests into an array
        $.each(data.manifests,
        function(i, val) {
            $('.it').append('<tr class= tx' + i + '><td class = "ty' + i + '><a href="" class = "ax' + i + '">' + val.developer + '</a><br><img src="' + val.icon + '" width = "100" height ="100" alt = "' + val.id + '"></td>');
            $('.tx' + i).append('<td class= "summary"><b>ROMS:</b><ol class = ox' + i + '></ol><br><b>ABOUT:</b> ' + val.summary + ' </td></tr>');

            manArr.unshift(val.manifest);
        });


        //Display latest 3 roms for each developer
        $.each(manArr,
        function(i, val) {
            $.get(
            "http://jsonp.deployfu.com/clean/" + encodeURIComponent(val),
            function(data) {
                for (j = 0; j < data.roms.length; j++) {
                    if (j < 3) {
                        $('ol.ox' + i).append('<li><a href="' + data.roms[j].url + '">' + data.roms[j].name + '</a></li></tr>');
                    }
                    else
                    {
                        $('ol.ox' + i).append('<li class = "extra"><a class = "extra" href="' + data.roms[j].url + '">' + data.roms[j].name + '</a></li></tr>');

                    }
                }
                if (data.roms.length > 3)
                {
                    $('ol.ox' + i).append('<br><a class = "extra" href ="">Display older roms.</a>');
                    $('ol.ox' + i).append('<br><a class = "xExtra" href ="">Hide older roms.</a>');
                }

                $("li.extra").hide();
                $("a.xExtra").hide();
            },
            "jsonp"
            );
        });
    },

    "jsonp"
    );


    $("a.extra").click(function(event) {
        event.preventDefault();
        $("li.extra").show('slow');
        $("a.xExtra").show();
        $("a.extra").hide();
    });

    $("a.xExtra").click(function(event) {
        event.preventDefault();
        $("li.extra").hide('slow');
        $("a.xExtra").hide();
        $("a.xExtra").show();
    });

});




