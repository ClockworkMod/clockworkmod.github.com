// Developer >> Rom List >> Rom Details
//TODO:  escape!
$(document).ready(function()
 {
    window.addEventListener("hashchange", barchange, false);

    $("#devTab").addClass("selected");

    var devices = null;
    var developers = null;
    var devRats = null;

    // Messing with the address bar
    // Should allow navigation throught tabs
    // Attempt to fill page with content
    function doStuff()
    {
        if (devices == null || developers == null || devRats == null)
        {
            return;
        }
        window.location.hash = "developers";
        //Fill developer list
        var giantString = null;

        $.each(developers,
        function(i, val)
        {
            // Get the rating
            var devId = escape(val.id);
            if (devRats[String(devId)])
            {
                // Add to list
                theDev = devRats[String(devId)];
                totalDL = theDev.anonymousDownloadCount + theDev.downloadCount;

                //Issue with this?
                if (theDev.lastModified) {
                    lastMod = new Date((theDev.lastModified) * 1000);
                    lastMod = lastMod.toLocaleDateString();
                }
                else
                lastMod = "Never Modified";

                if (theDev.ratingCount)
                {
                    var rating = theDev.totalRating / theDev.ratingCount;

                    if (val.icon)
                    giantString = giantString + '<tr id = "devRow' + i + '"><td width = 400><a class="DEV" id = "dev' + i + '" href="#romList">' + val.developer + '<img class = "devIcon"  height = 100 width = 100 src = ' + val.icon + '></a><br>' + val.summary + '</td><td width = 200><div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><div class="filler">' + rating + '</div></td><td> ' + totalDL + '</td><td><div class = "filler">' + theDev.lastModified + '</div> ' + lastMod + ' </td></tr>';
                    else
                    giantString = giantString + '<tr id = "devRow' + i + '"><td width = 400 ><a class="DEV" id = "dev' + i + '" href="#romList">' + val.developer + '<img class = "devIcon" height = 100 width = 100 src = "https://github.com/ClockworkMod/ajaxThing/raw/gh-pages/no_icon.png"></a><br>' + val.summary + '</td><td width = 200><div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><div class="filler">' + rating + '</div></td><td> ' + totalDL + '</td><td><div class = "filler">' + theDev.lastModified + '</div> ' + lastMod + ' </td></tr>';
                }
                else
                {
                    if (val.icon)
                    giantString = giantString + '<tr id = "devRow' + i + '" ><td width = 400><a class="DEV" id = "dev' + i + '" href="#romList">' + val.developer + '<img class = "devIcon" height = 100 width = 100 src = ' + val.icon + '></a><br>' + val.summary + '</td><td width = 200> <div class="filler">0</div>Not Rated </td><td> ' + totalDL + '</td><td><div class = "filler">' + theDev.lastModified + '</div> ' + lastMod + ' </td></tr>';
                    else
                    giantString = giantString + '<tr id = "devRow' + i + '"><td width = 400><a class="DEV" id = "dev' + i + '" href="#romList">' + val.developer + '<img class = "devIcon" height = 100 width = 100 src = "https://github.com/ClockworkMod/ajaxThing/raw/gh-pages/no_icon.png"></a><br>' + val.summary + '</td><td width = 200> <div class="filler">0</div>Not Rated </td><td> ' + totalDL + '</td><td><div class = "filler">' + theDev.lastModified + '</div> ' + lastMod + ' </td></tr>';
                }
            }
        });

        $("#devlist").append(giantString);

        $('.jRating').jRating({
            step: false,
            // no step
            length: 5,
            // show 5 stars at the init
            isDisabled: true,
            decimalLength: 1,
            // show small stars instead of big default stars
            bigStarsPath: 'https://github.com/ClockworkMod/ajaxThing/raw/gh-pages/stars.png'
        });

        // Fill drop down list
        $.each(devices,
        function(i, val)
        {
            $("select.filter").append('<option value = "' + val.key + '">' + val.name + '</option>');
        });

        // Clicking items in drop down will narrow down developer list
        $("select.filter").click(function(event)
        {
            $('tr').removeClass("hideDev");
            var listVal = String(document.getElementById('filter').value);

            if (listVal != "-")
            {
                $.each(developers,
                function(i, val)
                {

                    // Check to see if developer supports device
                    $.each(val.roms,
                    function(j, rList)
                    {
                        // Add class to hide developers that don't support the device
                        if (j != listVal)
                        $("#devRow" + i).addClass("hideDev");
                    });
                });
            }
        });

        $("input.allButton").click(function(event) {
            $('tr').removeClass("hideDev");
            var devOptions = document.getElementById('filter');
            devOptions.options[0].selected = 1;
        });

        // Clicking developer name should create new tab for his roms,
        // hide the developer tab, and show the new tab
        $("a.DEV").click(function(event)
        {
            event.preventDefault();
            $("#devInfo").remove();
            $("#romList").remove();
            $("#romListTab").remove();
            $("#romInfo").remove();
            $("#romInfoTab").remove();
            $("div.developers").addClass("hide");
            $(".tabItem").removeClass("selected");

            var devIndex = parseInt(this.id.substring(3));

            $('#tabs').append('<li><a id = "romListTab" class = "tabItem selected">' + developers[devIndex].developer + '</a></li>');
            $('.newTab').append('<div class = "tabContent romList" id = "devInfo"></div>');

            // Change address bar hash
            window.location.hash = "romList";

            // Controls for clicking the rom list tab
            $("#romListTab").click(function(event)
            {
                $("div.tabContent").addClass("hide");
                $("a.tabItem").removeClass("selected");
                $("div.romList").removeClass("hide");
                $("#romListTab").addClass("selected");
            });

            //Get icon and summary
            if (developers[devIndex].icon)
            $("#devInfo").append('<img height = 100 width = 100 src = "' + developers[devIndex].icon + '"><p>' + developers[devIndex].summary + '</p><ol id= "romOL"></ol>');
            else
            $("#devInfo").append('<img height = 100 width = 100 src = "no_icon.png"><p>' + developers[devIndex].summary + '</p><ol id= "romOL"></ol>');

            // List the roms
            // Clicking a rom will create a new tab with ratings and a download option
            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
            function(data) {
                var giantRomList = "";
                $.each(data.roms,
                function(i, val)
                {
                    giantRomList += '<li class = "devRom"><a class = "ROM"  id = "' + developers[devIndex].id + "___" + devIndex + "___" + i + '" href="#romInfo">' + val.name + '</a></li>';
                });

                $("#romOL").append(giantRomList);

                $("a.ROM").click(function(event)
                {
                    event.preventDefault();
                    $("#romInfo").remove();
                    $("#romInfoTab").remove();
                    $("div.romList").addClass("hide");
                    $(".tabItem").removeClass("selected");

                    // Get the indicies and the rom name
                    var devIndex = parseInt(this.id.split("___")[1]);
                    var romIndex = parseInt(this.id.split("___")[2]);
                    var romName = null;
                    var modV = null;

                    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
                    function(data)
                    {
                        romName = String(data.roms[romIndex].name);
                        modV = String(data.roms[romIndex].modversion);

                        //Create the tab
                        $('#tabs').append('<li><a id = "romInfoTab" class = "tabItem selected">' + romName + '</a></li>');

                        // Controls for clicking the rom list tab
                        $("#romInfoTab").click(function(event)
                        {
                            $("div.tabContent").addClass("hide");
                            $("a.tabItem").removeClass("selected");
                            $("div.romInfo").removeClass("hide");
                            $("#romInfoTab").addClass("selected");
                        });

                        window.location.hash = "romInfo";

                        // Tab content starts here
                        $('.newTab').append('<div class = "tabContent romInfo" id = "romInfo"></div>');

                        var romInfoString = '<a href="' + data.roms[romIndex].url + '">Download ROM Here</a><br><br>'

                        // Rating & number of downloads
                        var romRatUri = "http://rommanager.deployfu.com/v2/ratings/";
                        $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(romRatUri + developers[devIndex].id),
                        function(xdata)
                        {

                            var ratImage = null;
                            var romID = null
                            var rating = null;

                            if (xdata.result[romName])
                            romID = romName;
                            else if (xdata.result[modV])
                            romID = modV;
                            else if (xdata.result[modV.toUpperCase()])
                            romID = modV.toUpperCase();

                            rating = xdata.result[romID].rating.toFixed(1);

                            if (xdata.result[romName])
                            romInfoString += 'Overall Rating: <div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>Total Downloads: ' + xdata.result[romName].downloads + '<br><br><h2>Comments:</h2>';
                            else if (xdata.result[modV])
                            romInfoString += 'Overall Rating: <div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>Total Downloads: ' + xdata.result[modV].downloads + '<br><br><h2>Comments:</h2>';
                            else
                            romInfoString += 'Overall Rating:<div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>Total Downloads: ' + xdata.result[modV.toUpperCase()].downloads + '<br><h2>Comments:</h2>';

                            // Comments
                            var commentUri = "http://rommanager.deployfu.com/ratings/";
                            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(commentUri + developers[devIndex].id + '/' + modV),
                            function(ydata)
                            {
                                $.each(ydata.result.comments,
                                function(j, com) {

                                    var rating = com.rating;

                                    romInfoString += '<hr><strong>User: </strong>' + com.nickname + '<br> <strong>Rating: </strong><div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br><strong>Comment: </strong>' + com.comment + '<br>';
                                });
                            },
                            "jsonp"
                            );

                            $("#romInfo").append(romInfoString);

                            $('.jRating').jRating({
                                step: false,
                                // no step
                                length: 5,
                                // show 5 stars at the init
                                isDisabled: true,
                                decimalLength: 1,
                                // show small stars instead of big default stars
                                bigStarsPath: 'stars.png'
                            });

                        },
                        "jsonp"
                        );
                    },
                    "jsonp");
                });
            },
            "jsonp"
            );

        });

        $("#devTab").click(function(event)
        {
            $("div.tabContent").addClass("hide");
            $("a.tabItem").removeClass("selected");
            $("div.developers").removeClass("hide");
            $("#devTab").addClass("selected");
        });
    }


    function barchange()
    {
        if (window.location.hash == "#romList")
        {
            $("#romInfo").remove();
            $("#romInfoTab").remove();
            $(".tabContent").addClass("hide");
            $(".tabItem").removeClass("selected");
            $("div.romList").removeClass("hide");
            $("#romListTab").addClass("selected");

        }
        else if (window.location.hash == "#developers")
        {
            $("#devInfo").remove();
            $("#romListTab").remove();
            $(".tabContent").addClass("hide");
            $(".tabItem").removeClass("selected");
            $("#devListing").removeClass("hide");
            $("#devTab").addClass("selected");
        }
    }

    //Grab device info
    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data)
    {
        devices = data.devices.sort(function(a, b) {
            var nameA = a.name.toLowerCase(),nameB = b.name.toLowerCase()
            //sort string ascending
            if (nameA < nameB)
                return - 1
            if (nameA > nameB)
                return 1
            //default return value (no sorting)
            return 0
        });
        doStuff();
    },
    "jsonp"
    );

    //Get developers
    manUri = 'http://gh-pages.clockworkmod.com/ROMManagerManifest/manifests.js';
    $.get(
    "http://jsonp.deployfu.com/clean/" + encodeURIComponent(manUri),
    function(data)
    {
        developers = data.manifests.sort(function(a, b) {
            var devA = a.developer.toLowerCase(),devB = b.developer.toLowerCase()
            //sort string ascending
            if (devA < devB)
                return - 1
            if (devA > devB)
                return 1
            //default return value (no sorting)
            return 0
        });
        doStuff();
    },
    "jsonp"
    );

    //Get dev's ratings
    var ratUri = "http://rommanager.deployfu.com/v2/ratings";
    $.get(
    "http://jsonp.deployfu.com/clean/" + encodeURIComponent(ratUri),
    function(data)
    {
        devRats = data.result;
        doStuff();
    },
    "jsonp"
    );
});