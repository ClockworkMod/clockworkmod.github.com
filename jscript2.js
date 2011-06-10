// Developer >> Rom List >> Rom Details
$(document).ready(function() {

    var devices = null;
    var developers = null;

    // Attempt to fill page with content
    function doStuff() {
        if (devices == null || developers == null) {
            return;
        }

        //Fill developer list
        $.each(developers,
        function(i, val) {
            $("ul.devlist").append('<li><a class="DEV" id = "dev' + i + '" href="">' + val.developer + '</a></li>');
        });

        // Fill drop down list
        $.each(devices,
        function(i, val) {
            $("select.filter").append('<option value = "' + val.key + '">' + val.key + '</option>');
        });



        // Clicking developer name should create new tab for his roms,
        // hide the developer tab, and show the new tab
        $("a.dev").click(function(event) {
            event.preventDefault();
            $('.tabs').append('<li><a href="#romList">ROM LIST</a></li>');
            $('.newTab').append('<div class = "tabContent" id = "romList"></div>');
        });


        // Clicking button will narrow down developer list to device in drop down
        $("input.fButton").click(function(event) {
            $('a').removeClass("hideDev");
            var listVal = String(document.getElementById('filter').value);

            if (listVal != "-") {

                $.each(developers,
                function(i, val) {

                    // Check to see if developer supports device
                    $.each(val.roms,
                    function(j, rList) {
                        // Add class to hide developers that don't support the device
                        if (j != listVal) {
                            $("#dev" + i).addClass("hideDev");
                        }
                    });

                });

            }
        });
    }

    //Will be used to alphabetize the drop down menu by first character
    function sortDevices(itemList) {
        for (i = 1; i < itemList.length; i++) {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].key[0].toLowerCase() > temp.key[0].toLowerCase()) {
                    itemList[j + 1] = itemList[j];
                    j = j - 1;
            }
            while (j >= 0 && itemList[j].key[0].toLowerCase() == temp.key[0].toLowerCase() && itemList[j].key[1].toLowerCase() > temp.key[1].toLowerCase()) {
                    itemList[j + 1] = itemList[j];
                    j = j - 1;
            }

            itemList[j + 1] = temp;
        }
    }

    //Will be used to alphabetize the drop down menu by first character
    function sortDevs(itemList) {
        for (i = 1; i < itemList.length; i++) {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].developer[0].toLowerCase() > temp.developer[0].toLowerCase()) {
                    itemList[j + 1] = itemList[j];
                    j = j - 1;
                }
            while (j >= 0 && itemList[j].developer[0].toLowerCase() == temp.developer[0].toLowerCase() && itemList[j].developer[1].toLowerCase() > temp.developer[1].toLowerCase()) {
                    itemList[j + 1] = itemList[j];
                    j = j - 1;
                }

            itemList[j + 1] = temp;
        }
    }

    //Grab device info
    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data) {
        devices = data.devices;
        sortDevices(devices);
        doStuff();
    },
    "jsonp"
    );

    //Get developers
    $.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data) {
        developers = data.manifests;
        sortDevs(developers);
        doStuff();
    },
    "jsonp"
    );
});
