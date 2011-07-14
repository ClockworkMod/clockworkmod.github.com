// Developer >> Rom List >> Rom Details
//TODO:  escape!
$(document).ready(function()
 {
    var devCookie = null;
    var sortTypeCookie = null;
    var sortOrderCookie = null;

    //get device cookie
     if(readCookie('deviceCookie'))
     {
        devCookie = readCookie('deviceCookie');
     }
     //get sort cookie
     if(readCookie('sortCookie'))
      {
          sortTypeCookie = readCookie('sortCookie').split('_')[0];
          sortOrderCookie = readCookie('sortCookie').split('_')[1];
      }

     var hash = window.location.hash;
     var mainHash = null;
     var devHash = null;
     var romHash = null;

     mainHash = hash.split('/')[0];
     if (hash.split('/')[1])
         devHash = hash.split('/')[1];
     if (hash.split('/')[2])
         romHash = hash.split(mainHash+"/"+devHash+"/")[1];

    //reacts when the hash changes
    window.addEventListener("hashchange", changeTab, false);
    $("#devTab").addClass("selected");

    // Arrays for holding info on devices, developers and ratings
    var devices = null;
    var developers = null;
    var devRats = null;
    var masterList = [];

    //Grab device info
    var uri = "http://gh-pages.clockworkmod.com/ROMManagerManifest/devices.js";
    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(uri),
    function(data)
    {
        devices = data.devices.sort(function(a, b) {
            var A = a.name.toLowerCase(),
            B = b.name.toLowerCase();
            return sorthelper(0, A, B);
        });
        fillPage();
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
            var A = a.developer.toLowerCase(),
            B = b.developer.toLowerCase();
            return sorthelper(0, A, B);
        });

        fillPage();
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
        fillPage();
    },
    "jsonp"
    );

//============================================================================
//===========================<functions>======================================
//============================================================================
    // Attempt to fill page with content
    function fillPage()
    {
        if (devices == null || developers == null || devRats == null)
        return;

        //Fill masterList
        for (dev in developers)
        {
            var devID = developers[dev].id;
            if (devRats[devID])
            {
                var ratingInfo = devRats[devID];
                var rating = 0;
                if (ratingInfo)
                {
                    if (ratingInfo.ratingCount)
                    rating = ratingInfo.totalRating / ratingInfo.ratingCount;

                    masterList.push({
                        "devName": developers[dev].developer,
                        "id": devID,
                        "icon": null,
                        "summary": developers[dev].summary,
                        "rating": rating,
                        "downloads": ratingInfo.downloadCount + ratingInfo.anonymousDownloadCount,
                        "utcMod": ratingInfo.lastModified
                    });
                }
            }
            else
            {
                masterList.push({
                    "devName": developers[dev].developer,
                    "id": devID,
                    "icon": null,
                    "summary": developers[dev].summary,
                    "rating": 0,
                    "downloads": 0,
                    "utcMod": null
                });
            }

            for (index in masterList)
            {
                for (dev in developers)
                {
                    if (developers[dev].id == masterList[index].id)
                    masterList[index].icon = developers[dev].icon;
                }
            }
        }

        hashControl(mainHash, devHash, romHash);

        //Button and dropdown logic
        buttonMenuLogic();
    }

//==============================hashParse()===================================
    //Use to direct immediate links to the site
    //If a nonsense link: just go through the normal processs
    //If legit hashtag: go further.
    function hashControl(main, dev, rom)
    {
        //load developers
        fillDevTableBy("name", 0);

        if(!(main=="#devInfo")&&!(main=="#romInfo"))
        {
            window.location.hash = "#developers";
            return;
        }

        //load roms
        var devExists=false;
        for(i in developers)
        {
            if(developers[i].id == dev)
            {
                fillDevInfo(dev);
                devExists = true;
                if(rom)
                {
                    var done = false;
                    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[i].manifest),
                    function(data){
                        //load rom
                        for(j in data.roms)
                        {
                            if((rom == data.roms[j].modversion)||(rom == encodeURIComponent(data.roms[j].url))||(rom == data.roms[j].url))
                            {
                                fillRomInfo(dev, j);
                                done=true;
                                break;
                            }   
                        }
                        if(done)
                            return;
                        else
                        {
                            window.location.hash=main+"/"+dev;
                            alert('Invalid rom.');
                            return;
                        }
                    },"jsonp");
                }
            }
        }
        if(!devExists)
        {
            alert('Invalid developer.');
            window.location.hash="#developer";
        }
    }

//================================fillDevTableby()============================
    function fillDevTableBy(what, updown)
    {
        if (what == "name")
        sortbyName(updown);
        else if (what == "rating")
        sortbyRating(updown);
        else if (what == "downloads")
        sortbyDownloads(updown);
        else if (what == "date")
        sortbyUTC(updown);

        giantString = '<table id="devTable" width="100%">'

        var devFilter = '-'

        if(document.getElementById('filter').value != '-')
            devFilter = document.getElementById('filter').value;

        for (i in masterList)
        {
            var devId = escape(masterList[i].id);
            var devOk = false;
            for (j in developers)
            {
                // Check if developer id works
                if(developers[j].id == devId)
                {
                    // Check if works with the device chosen
                    if ((developers[j].roms[devFilter])||(devFilter=="-"))
                        {
                            devOk = true;
                            break;
                        }
                }
            }

            if(devOk)
            {
                giantString += '<tr id="devRow' + i + '"><td><a class="DEV" id ="devdev' + devId + '" href="#romInfo"><img class="devIcon"  height=100 width=100 src =';

                //Add the icon
                if (masterList[i].icon)
                giantString += masterList[i].icon + '>';
                else
                giantString += '"https://github.com/ClockworkMod/ajaxThing/raw/gh-pages/no_icon.png">';

                // Add dev's name and description
                giantString += masterList[i].devName + '</a><br>' + masterList[i].summary + '<br>';

                // Get the rating
                if (devRats[String(devId)])
                {
                    // Add to list
                    theDev = devRats[String(devId)];
                    totalDL = theDev.anonymousDownloadCount + theDev.downloadCount;

                    //Issue with this?
                    if (masterList[i].utcMod) {
                        lastMod = new Date((masterList[i].utcMod) * 1000);
                        var month = lastMod.getMonth() + 1;
                        var day = lastMod.getDate();
                        var year = lastMod.getFullYear();
                        lastMod = month + "/" + day + "/" + year;
                    }
                    else
                    lastMod = "Never Modified";

                    //Add the rating
                    if (theDev.ratingCount)
                    {
                        var rating = theDev.totalRating / theDev.ratingCount;
                        giantString += '<div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><span style="padding-left:30px"></span>';
                    }
                    else
                    giantString += '<div class="filler">0</div>Not Rated<span style="padding-left:30px"></span>';

                    // Add the number of downloads and the last modified date
                    giantString += '(' +totalDL + ' Downloads)<span style="padding-left:30px"></span> ' + lastMod + '</td></tr>';
                }
                else
                {
                    giantString += '<div class="filler">0</div>Not Rated<span style="padding-left:30px"></span>(0 Downloads) <span style="padding-left:30px"></span>Never Modified</td></tr>';
                }
            }
        }

        $("#devTable").remove();
        $("#devListing").append(giantString + "</table>");
        callJrating();
        // Clicking developer name should create new tab for his roms,
        // hide the developer tab, and show the new tab
        $("a.DEV").click(function(event)
        {
            event.preventDefault();
            var devId = this.id.split("devdev")[1];

            //Fill in developer tab data
            fillDevInfo(devId);
        });

        $("#devTab").click(function(event)
        {
            $("#devInfo").remove();
            $("#romListItemTab").remove();
            $("#romInfoListItem").remove();
            $("#romListTab").remove();
            $("#romInfo").remove();
            $("#romInfoTab").remove();

            $("div.tabContent").addClass("hide");
            $("a.tabItem").removeClass("selected");
            $("div.developers").removeClass("hide");
            $("#devTab").addClass("selected");
        });
    }

//============================fillDevInfo()===================================
    function fillDevInfo(devId)
    {
        // Change address bar hash
        window.location.hash = "devInfo/" + devId;

        var devIndex = 0;
        for (i in developers)
        {
            if(developers[i].id==devId)
            {
                devIndex = i;
                break;
            }
        }

        $("#devInfo").remove();
        $("#romListItemTab").remove();
        $("#romInfoListItem").remove();
        $("#romListTab").remove();
        $("#romInfo").remove();
        $("#romInfoTab").remove();
        $("div.developers").addClass("hide");
        $(".tabItem").removeClass("selected");

        $('#tabs').append('<li id="romListItemTab"><a id = "romListTab" class = "tabItem selected">' + developers[devIndex].developer + ' Roms</a></li>');
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
        $("#devInfo").append('<img height = 100 width = 100 src = "' + developers[devIndex].icon + '"><p>' + developers[devIndex].summary + '</p><table id="romListTable" width="100%"></table>');
        else
        $("#devInfo").append('<img height = 100 width = 100 src = "https://github.com/ClockworkMod/ajaxThing/raw/gh-pages/no_icon.png"><p>' + developers[devIndex].summary + '</p><table id="romListTable" width="100%"></table>');

        // List the roms
        // Clicking a rom will create a new tab with ratings and a download option
        $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
        function(data)
        {
            var giantRomList = "";

            if (data.roms && data.roms[0])
            {
                urlThing = "http://rommanager.deployfu.com/v2/ratings/";
                $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(urlThing)+devId,
                function(rData)
                {
                    $.each(data.roms,
                    function(i, val)
                    {
                        var devOptions = document.getElementById('filter').value;
                        var romRating = "Not Rated";
                        var romDownloads = 0;
                        if (val.visible == null)
                        {
                            if ((devOptions == '-') || (val.device == devOptions))
                            {
                                giantRomList += '<tr><td><a class = "ROM" id = "' + devId + "___" + i + '" href="#romInfo">' + val.name + '</a><br>' + val.summary;
                                if (rData.result[val.modversion])
                                {
                                    romRating = rData.result[val.modversion].rating;
                                    romDownloads = rData.result[val.modversion].downloads;
                                    if(rData.result[val.modversion].ratingcount)
                                        giantRomList += '<br><div class="jRating" data="'+ parseInt(romRating*4)+'"></div>';

                                    else
                                        giantRomList += '<br>Not Rated';
                                    giantRomList += '<span style="padding-left:30px"></span>(' + romDownloads;
                                }
                                else
                                {
                                    giantRomList += '<br>Not Rated<span style="padding-left:30px"></span>(0';
                                }
                                giantRomList += ' Downloads)</td></tr>';
                            }
                        }
                    });
                    $("#romListTable").append(giantRomList);

                    callJrating();
                    $("a.ROM").click(function(event)
                    {
                        event.preventDefault();
                        var romIndex = parseInt(this.id.split("___")[1]);
                        fillRomInfo(devId, romIndex);
                    });
                },"jsonp");

            }
            else
            {
                giantRomList += '<tr><td>No roms available.</td></tr>';
                $("#romListTable").append(giantRomList);
            }
        },"jsonp");
    }

//=============================fillRomInfo()==================================
    function fillRomInfo(devID, romIndex)
    {
        $("#romInfo").remove();
        $("#romInfoTab").remove();
        $("#romInfoListItem").remove();
        $("div.romList").addClass("hide");
        $(".tabItem").removeClass("selected");

        var devIndex = 0;
        var romName = null;
        var modV = null;

        for (i in developers)
        {
            if (devID == developers[i].id)
                devIndex = i;
        }

        $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(developers[devIndex].manifest),
        function(data)
        {
            romName = String(data.roms[romIndex].name);
            modV = String(data.roms[romIndex].modversion);

            //Create the tab
            $('#tabs').append('<li id="romInfoListItem"><a id = "romInfoTab" class = "tabItem selected">' + romName + '</a></li>');

            // Controls for clicking the rom list tab
            $("#romInfoTab").click(function(event)
            {
                $("div.tabContent").addClass("hide");
                $("a.tabItem").removeClass("selected");
                $("div.romInfo").removeClass("hide");
                $("#romInfoTab").addClass("selected");
            });

            if(modV)
            window.location.hash = "romInfo/" + developers[devIndex].id + "/" + modV;
            else
            window.location.hash = "romInfo/" + developers[devIndex].id + "/" + encodeURIComponent(data.roms[romIndex].url);

            // Tab content starts here
            $('.newTab').append('<div class = "tabContent romInfo" id = "romInfo"></div>');

            var romInfoString = '<center><a href="' + data.roms[romIndex].url + '">Download ROM Here</a><br><br>';

            if (data.roms[romIndex].screenshots)
            {
                var i = 0;
                while (data.roms[romIndex].screenshots[i])
                {
                    romInfoString += '<img height=300 width=200 src=' + data.roms[romIndex].screenshots[i] + '> ';
                    if ((i > 0) && (i % 2))
                    romInfoString += '<br>';
                    i++;
                }
            }

            romInfoString += '</center>';

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

                if (romID)
                {
                    rating = xdata.result[romID].rating.toFixed(1);
                    if (xdata.result[romName])
                    romInfoString += '<div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>' + xdata.result[romName].downloads + ' Downloads<br><br><h2 class="blogger">Comments:</h2>';
                    else if (xdata.result[modV])
                    romInfoString += '<div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>' + xdata.result[modV].downloads + ' Downloads<br><br><h2 class="blogger">Comments:</h2>';
                    else
                    romInfoString += '<div class = "jRating" data = "' + parseInt(4 * rating) + '"></div><br>' + xdata.result[modV.toUpperCase()].downloads + ' Downloads<br><h2 class="blogger">Comments:</h2>';
                    $("#romInfo").append(romInfoString);

                    // Comments
                    var commentUri = "http://rommanager.deployfu.com/ratings/";
                    $.get("http://jsonp.deployfu.com/clean/" + encodeURIComponent(commentUri + developers[devIndex].id + '/' + modV),
                    function(ydata)
                    {
                        $.each(ydata.result.comments,
                        function(j, com) {
                            var rating = com.rating;
                            $("#romInfo").append('<hr><strong>' + com.nickname + '</strong><div class = "jRating comments" data = "' + parseInt(4 * rating) + '"></div><br><i>' + com.comment + '</i><br>');
                            callJrating();
                        });
                    },
                    "jsonp"
                    );
                }
                else
                {
                    $("#romInfo").append("<center>Sorry, no information can be found about this rom.</center>");
                }
            },
            "jsonp"
            );
        },
        "jsonp"
        );
    }

//==============================readCookie()==================================
    function readCookie(name)
    {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
        var regExp = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)','i'),
            match = document.cookie.match(regExp);

        return match && unescape(match[1]);
    }

//=============================callJrating()==================================
    function callJrating()
    {
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
    }

//============================buttonsMenuLogic()===============================
    //Put in logic for dropdown menus and buttons
    function buttonMenuLogic()
    {
      // Fill drop down list
      $.each(devices,
      function(i, val)
      {
          $("select.filter").append('<option value = "' + val.key + '">' + val.name + '</option>');
      });

      if(devCookie)
        {
            document.getElementById('filter').value = devCookie;

              $.each(developers,
              function(i, val)
              {
                  var usesDevice = false;
                  // Check to see if developer supports device
                  $.each(val.roms,
                  function(j, rList)
                  {
                      // Add class to hide developers that don't support the device
                      if (j == devCookie)
                      usesDevice = true;
                  });
                  if (!usesDevice)
                  $("#devRow" + i).addClass("hideDev");
              });
        }

        if(sortTypeCookie && sortOrderCookie)
        {
            document.getElementById('sorty').value = sortTypeCookie;
            document.getElementById('updown').value = sortOrderCookie;
            fillDevTableBy(sortTypeCookie, parseInt(sortOrderCookie));
        }

      // Clicking items in drop down will narrow down developer list
      $("select.filter").change(function(event)
      {
          fillDevTableBy(sortTypeCookie, sortOrderCookie);
          var listVal = String(document.getElementById('filter').value);
          document.cookie = 'deviceCookie='+ listVal;

          if (listVal != "-")
          {
              $.each(developers,
              function(i, val)
              {
                  var usesDevice = false;
                  // Check to see if developer supports device
                  $.each(val.roms,
                  function(j, rList)
                  {
                      // Add class to hide developers that don't support the device
                      if (j == listVal)
                      usesDevice = true;
                  });
                  if (!usesDevice)
                  $("#devRow" + i).addClass("hideDev");
              });

          }
      });

      $("input.allButton").click(function(event) {
          document.cookie = 'deviceCookie=-';
          document.cookie = 'sortCookie=name_0';

          document.getElementById('filter').value = '-';
          document.getElementById('sorty').value = "name";
          document.getElementById('updown').value = 0;

          fillDevTableBy('name', 0);
      });

      // New Dropdown bar needs to filter table contents
      // Clicking items in drop down will narrow down developer list
      $("input.sortButton").click(function(event) {
          var listVal = String(document.getElementById('sorty').value);
          var updown = parseInt(document.getElementById('updown').value);
          document.cookie = 'sortCookie='+listVal+"_"+updown;
          fillDevTableBy(listVal, updown);
      });
    }

//==============================changeTab()===================================
    function changeTab()
    {
        var hash = window.location.hash.split("/")[0];
        if (hash == "#romInfo")
        {
            $(".tabContent").addClass("hide");
            $(".tabItem").removeClass("selected");
            $("div.romInfo").removeClass("hide");
            $("#romInfoListItem").addClass("selected");
        }
        else if (hash == "#developers")
        {
            $(".tabContent").addClass("hide");
            $(".tabItem").removeClass("selected");
            $("#devListing").removeClass("hide");
            $("#devTab").addClass("selected");
        }
    }

//===============================Sorting Functions============================
    function sorthelper(updown, A, B)
    {
        if (updown)
        {
            if (A < B)
            return 1
            if (A > B)
            return - 1
        }
        else
        {
            if (A < B)
            return - 1
            if (A > B)
            return 1
        }
        //default return value (no sorting)
        return 0
    }

    function sortbyName(updown)
    {
        masterList = masterList.sort(function(a, b) {
            var A = a.devName.toLowerCase(),
            B = b.devName.toLowerCase();
            return sorthelper(updown, A, B);

        });
    }
    function sortbyRating(updown)
    {
        masterList = masterList.sort(function(a, b) {
            var A = a.rating,
            B = b.rating;
            return sorthelper(updown, A, B);
        });
    }
    function sortbyDownloads(updown)
    {
        masterList = masterList.sort(function(a, b) {
            var A = a.downloads,
            B = b.downloads;
            return sorthelper(updown, A, B);
        });
    }
    function sortbyUTC(updown)
    {
        masterList = masterList.sort(function(a, b) {
            var A = a.utcMod,
            B = b.utcMod;
            return sorthelper(updown, A, B);
        });
    }

});
