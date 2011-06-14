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
                    lastMod = Date((theDev.lastModified) * 1000);
                    $("ul.devlist").append('<li><a class="DEV" id = "dev' + i +
                    '" href="#"><img  height = 100 width = 100 src = ' + val.icon + '> ' +
                    val.developer + ' | Rating: ' + rating.toFixed(2) + ' | Downloads: ' +
                    totalDL + ' | Last Modified: ' + lastMod + ' </a></li>');
                }
                else
                $("ul.devlist").append('<li><a class="DEV" id = "dev' + i + '" href="#">' + val.developer + ' </a></li>');
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

            var devIndex = parseInt(this.id[this.id.length - 1]);

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
            $("#devInfo").append('<img height = 100 width = 100 src = "' + developers[devIndex].icon + '">');
            $("#devInfo").append('<p>' + developers[devIndex].summary + '</p><ol id= "romOL"></ol>');

            // List the roms
            // Clicking a rom will create a new tab with ratings and a download option
            $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
            function(data) {
                $.each(data.roms,
                function(i, val)
                {
                    $("#romOL").append('<li class = "devRom"><a class = "ROM"  id = "' + developers[devIndex].id + devIndex + i + '" href="#">' + val.name + '</a></li>');
                });

                $("a.ROM").click(function(event)
                {
                    event.preventDefault();
                    $("#romInfo").remove();
                    $("#romInfoTab").remove();
                    $("div.romList").addClass("hide");
                    $(".tabItem").removeClass("selected");

                    // Get the indicies and the rom name
                    var devIndex = parseInt(this.id[this.id.length - 2]);
                    var romIndex = parseInt(this.id[this.id.length - 1]);
                    var romName = null;

                    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
                    function(data)
                    {
                        romName = data.roms[romIndex].name;

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

                        // Rating & number of downloads
                        var romRatUri = "http://rommanager.deployfu.com/v2/ratings/";
                        $.get("http://jsonp.deployfu.com/clean/"+encodeURIComponent(romRatUri+developers[devIndex].id),
                        function(xdata)
                        {
                            if(xdata.result[romName])
                                $("#romInfo").append('Rating: ' + xdata.result[romName].rating.toFixed(2) + '<br> Downloads: '+ xdata.result[romName].downloads + '<br><br>');
                        },
                        "jsonp"
                        );

                        // Comments
                        var commentUri = "http://rommanager.deployfu.com/ratings/";
                        $.get("http://jsonp.deployfu.com/clean/"+encodeURIComponent(commentUri+developers[devIndex].id + '/' + romName),
                        function(ydata)
                        {
                            $("#romInfo").append('<h3>Comments:</h3>');
                            $.each(ydata.result.comments, function(j, com){
                                $("#romInfo").append('<hr><strong>User:</strong> ' + com.nickname +'<br><strong>Rating:</strong> ' + com.rating  + '/5 <br><strong>Comment: </strong>' + com.comment + '<br>');
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
