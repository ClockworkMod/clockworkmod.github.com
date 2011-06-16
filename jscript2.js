// Developer >> Rom List >> Rom Details
//TODO:  escape!
$(document).ready(function()
 {
    $("#devTab").addClass("selected");

    var devices = null;
    var developers = null;
    var devRats = null;

    // Attempt to fill page with content
    function doStuff()
    {
        if (devices == null || developers == null || devRats == null)
        {
            return;
        }

        //Fill developer list
        $.each(developers,
        function(i, val)
        {
            // Get the rating
            var rating = 0;
            var devId = escape(val.id);
            if (devRats[String(devId)])
            {
                // Add to list
                if (devRats[String(devId)].ratingCount)
                {
                    theDev = devRats[String(devId)];
                    totalDL = theDev.anonymousDownloadCount + theDev.downloadCount;
                    rating = theDev.totalRating / theDev.ratingCount;
                    var ratImage = null

                    if (rating >= 4.75)
                    ratImage = "five_star.gif";
                    else if (rating < 4.75 && rating >= 4.25)
                    ratImage = "four_half_star.gif";
                    else if (rating < 4.25 && rating >= 3.75)
                    ratImage = "four_star.gif";
                    else if (rating < 3.75 && rating >= 3.25)
                    ratImage = "three_half_star.gif";
                    else if (rating < 3.25 && rating >= 2.75)
                    ratImage = "three_star.gif";
                    else if (rating < 2.75 && rating >= 2.25)
                    ratImage = "two_half_star.gif";
                    else if (rating < 2.25 && rating >= 1.75)
                    ratImage = "two_star.gif";
                    else if (rating < 1.75 && rating >= 1.25)
                    ratImage = "one_half_star.gif";
                    else if (rating < 1.25 && rating >= .75)
                    ratImage = "1_star.gif";
                    else
                    ratImage = "half_star.gif";

                    lastMod = Date((theDev.lastModified) * 1000);
                    if (val.icon)
                    $("#devlist").append('<tr><td><a class="DEV" id = "dev' + i + '" href="#romList"><img  height = 100 width = 100 src = ' + val.icon + '><br>' + val.developer + '</a></td><td><img src ="' + ratImage + '"></td><td> ' + totalDL + '</td><td> ' + lastMod.split(" ")[0] +' ' + lastMod.split(" ")[1] +' ' + lastMod.split(" ")[2] + ', ' + lastMod.split(" ")[3] +  ' </td></tr>');
                    else
                    $("#devlist").append('<tr><td><a class="DEV" id = "dev' + i + '" href="#romList"><img  height = 100 width = 100 src = "no_icon.png"><br>' + val.developer + '</a></td><td><img src ="' + ratImage + '"></td><td> ' + totalDL + '</td><td> ' + lastMod.split(" ")[0] +' ' + lastMod.split(" ")[1] +' ' + lastMod.split(" ")[2] + ', ' + lastMod.split(" ")[3] + ' </td></tr>');

                }
                else {
                    if (val.icon)
                    $("#devlist").append('<tr><td><a class="DEV" id = "dev' + i + '" href="#romList"><img  height = 100 width = 100 src = ' + val.icon + '><br>' + val.developer + '</a></td><td> - </td><td>  - </td><td> - </td></tr>');
                    else
                    $("#devlist").append('<tr><td><a class="DEV" id = "dev' + i + '" href="#romList"><img  height = 100 width = 100 src = "no_icon.png"><br>' + val.developer + '</a></td><td> - </td><td>  - </td><td> - </td></tr>');
                }
            }
        });

        // Fill drop down list
        $.each(devices,
        function(i, val)
        {
            $("select.filter").append('<option value = "' + val.key + '">' + val.name + '</option>');
        });

        // Clicking button will narrow down developer list to device in drop down
        $("input.fButton").click(function(event)
        {
            $('a').removeClass("hideDev");
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
                        {
                            $("#dev" + i).addClass("hideDev");
                        }
                    });
                });
            }
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

            $('#tabs').append('<li><a id = "romListTab" class = "tabItem selected" href="#romList">' + developers[devIndex].developer + '</a></li>');
            $('.newTab').append('<div class = "tabContent romList" id = "devInfo"></div>');

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
            $("#devInfo").append('<img height = 100 width = 100 src = "' + developers[devIndex].icon + '">');
            else
            $("#devInfo").append('<img height = 100 width = 100 src = "no_icon.png">');

            $("#devInfo").append('<p>' + developers[devIndex].summary + '</p><ol id= "romOL"></ol>');

            // List the roms
            // Clicking a rom will create a new tab with ratings and a download option
            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
            function(data) {
                $.each(data.roms,
                function(i, val)
                {
                    $("#romOL").append('<li class = "devRom"><a class = "ROM"  id = "' + developers[devIndex].id + "__" + devIndex + "__" + i + '" href="#romInfo">' + val.name + '</a></li>');
                });

                $("a.ROM").click(function(event)
                {
                    event.preventDefault();
                    $("#romInfo").remove();
                    $("#romInfoTab").remove();
                    $("div.romList").addClass("hide");
                    $(".tabItem").removeClass("selected");

                    // Get the indicies and the rom name
                    var devIndex = parseInt(this.id.split("__")[1]);
                    var romIndex = parseInt(this.id.split("__")[2]);
                    var romName = null;
                    var modV = null;

                    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
                    function(data)
                    {
                        romName = String(data.roms[romIndex].name);
                        modV = String(data.roms[romIndex].modversion);


                        //Create the tab
                        $('#tabs').append('<li><a id = "romInfoTab" class = "tabItem selected" href="#romInfo">' + romName + '</a></li>');

                        // Controls for clicking the rom list tab
                        $("#romInfoTab").click(function(event)
                        {
                            $("div.tabContent").addClass("hide");
                            $("a.tabItem").removeClass("selected");
                            $("div.romInfo").removeClass("hide");
                            $("#romInfoTab").addClass("selected");
                        });

                        // Tab content starts here
                        $('.newTab').append('<div class = "tabContent romInfo" id = "romInfo"></div>');

                        $("#romInfo").append('<a href="' + data.roms[romIndex].url + '">Download ROM Here</a><br><br>');

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

                            rating = xdata.result[romID].rating.toFixed(2);

                            if (rating >= 4.75)
                            ratImage = "five_star.gif";
                            else if (rating < 4.75 && rating >= 4.25)
                            ratImage = "four_half_star.gif";
                            else if (rating < 4.25 && rating >= 3.75)
                            ratImage = "four_star.gif";
                            else if (rating < 3.75 && rating >= 3.25)
                            ratImage = "three_half_star.gif";
                            else if (rating < 3.25 && rating >= 2.75)
                            ratImage = "three_star.gif";
                            else if (rating < 2.75 && rating >= 2.25)
                            ratImage = "two_half_star.gif";
                            else if (rating < 2.25 && rating >= 1.75)
                            ratImage = "two_star.gif";
                            else if (rating < 1.75 && rating >= 1.25)
                            ratImage = "one_half_star.gif";
                            else if (rating < 1.25 && rating >= .75)
                            ratImage = "1_star.gif";
                            else
                            ratImage = "half_star.gif";

                            if (xdata.result[romName])
                            $("#romInfo").append('Overall Rating: <img src ="' + ratImage + '"><br>Total Downloads: ' + xdata.result[romName].downloads + '<br><br><h2>Comments:</h2>');
                            else if (xdata.result[modV])
                            $("#romInfo").append('Overall Rating: <img src ="' + ratImage + '"><br>Total Downloads: ' + xdata.result[modV].downloads + '<br><br><h2>Comments:</h2>');
                            else
                            $("#romInfo").append('Overall Rating: <img src ="' + ratImage + '"><br>Total Downloads: ' + xdata.result[modV.toUpperCase()].downloads + '<br><h2>Comments:</h2>');

                            var commentUri = "http://rommanager.deployfu.com/ratings/";
                            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(commentUri + developers[devIndex].id + '/' + modV),
                            function(ydata)
                            {
                                $.each(ydata.result.comments,
                                function(j, com) {

                                    var rating = com.rating

                                    if (rating >= 4.75)
                                    ratImage = "five_star.gif";
                                    else if (rating < 4.75 && rating >= 4.25)
                                    ratImage = "four_half_star.gif";
                                    else if (rating < 4.25 && rating >= 3.75)
                                    ratImage = "four_star.gif";
                                    else if (rating < 3.75 && rating >= 3.25)
                                    ratImage = "three_half_star.gif";
                                    else if (rating < 3.25 && rating >= 2.75)
                                    ratImage = "three_star.gif";
                                    else if (rating < 2.75 && rating >= 2.25)
                                    ratImage = "two_half_star.gif";
                                    else if (rating < 2.25 && rating >= 1.75)
                                    ratImage = "two_star.gif";
                                    else if (rating < 1.75 && rating >= 1.25)
                                    ratImage = "one_half_star.gif";
                                    else if (rating < 1.25 && rating >= .75)
                                    ratImage = "1_star.gif";
                                    else
                                    ratImage = "half_star.gif";

                                    $("#romInfo").append('<hr><strong>User: </strong>' + com.nickname + '<br> <strong>Rating: </strong><img src ="' + ratImage + '"><br><strong>Comment: </strong>' + com.comment + '<br>');
                                });

                            },
                            "jsonp"
                            );

                        },
                        "jsonp"
                        );

                        // Comments
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


    // Messing with the back button
    $(window).unload(function(event)
    {
       if(document.getElementById('devListing').class == "hide")
       {
           event.preventDefault();
           if(document.getElementById('devInfo').class == "hide")
           {
               $("#romInfo").remove();
               $("#romInfoTab").remove();
               $("#devInfo").removeClass("hide");
           }
           else
           {
               $("#devInfo").remove();
               $("#romInfoTab").remove();
               $("#devListing").removeClass("hide");
           }
        }
    });


    //Will be used to alphabetize the drop down menu by first character
    function sortDevices(itemList)
    {
        for (i = 1; i < itemList.length; i++)
        {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].name[0].toLowerCase() > temp.name[0].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }
            while (j >= 0 &&
            itemList[j].key[0].toLowerCase() == temp.name[0].toLowerCase() &&
            itemList[j].key[1].toLowerCase() > temp.name[1].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }

            itemList[j + 1] = temp;
        }
    }

    //Will be used to alphabetize the drop down menu by first character
    function sortDevs(itemList) {
        for (i = 1; i < itemList.length; i++)
        {
            var temp = itemList[i];
            var j = i - 1;

            while (j >= 0 && itemList[j].developer[0].toLowerCase() > temp.developer[0].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }
            while (j >= 0 &&
            itemList[j].developer[0].toLowerCase() == temp.developer[0].toLowerCase() &&
            itemList[j].developer[1].toLowerCase() > temp.developer[1].toLowerCase())
            {
                itemList[j + 1] = itemList[j];
                j = j - 1;
            }

            itemList[j + 1] = temp;
        }
    }

    //Grab device info
    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data)
    {
        devices = data.devices;
        sortDevices(devices);
        doStuff();
    },
    "jsonp"
    );

    //Get developers
    $.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data)
    {
        developers = data.manifests;
        sortDevs(developers);
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
