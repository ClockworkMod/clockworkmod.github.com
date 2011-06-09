// Developer >> Rom List >> Rom Details
$(document).ready(function() {

    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data) {
        $.each(data.devices,function(i, val) {
            $("select.filter").append('<option value = "' + val.key + '">' + val.key + '</option>');
        });
    },
    "jsonp"
    );


    //Get developer names and display them in the first tab
    $.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data) {
        $.each(data.manifests,function(i, val) {
            $("ul.devlist").append('<li><a class="dev" href="">' + val.developer + '</a></li>');
        });

        // Clicking developer name should create new tab for his roms,
        // hide the developer tab, and show the new tab
        $("a.dev").click(function(event) {
            event.preventDefault();
            $('.tabs').append('<li><a href="#romList">ROM LIST</a></li>');
            $('.newTab').append('<div class = "tabContent" id = "romList"></div>');
        });

    },
    "jsonp"
    );
});