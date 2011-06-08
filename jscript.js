var manArr = new Array();

$.get(
"http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
function(data) {


    // Display the developer, his ID, and  the summary
    // Get manifests into an array
    $.each(data.manifests,
    function(i, val) {
        $('.it').append('<tr class= tx' + i + '><td class = "ty' + i + '><a href="" class = "ax' + i + '">' + val.developer + '</a><br><img src="' + val.icon + '" width = "100" height ="100" alt = "' + val.id + '"></td>');
        $('.tx' + i).append('<td class= "summary"><b>ROMS:</b><ol class = ox'+i+'></ol><br><b>ABOUT:</b> '+ val.summary +' </td></tr>');

        manArr.unshift(val.manifest);
    });


    //Display latest 3 roms for each developer
    $.each(manArr, function(i, val){
    	$.get(
    		"http://jsonp.deployfu.com/clean/" + encodeURIComponent(val),
    		function(data){
				for(j=0;j<data.roms.length;j++){
					$('ol.ox' + i).append('<li><a href="'+data.roms[j].url+'">' + data.roms[j].name + '</a></li></tr>');
					if (j>3) {
						j=0;
						break;
					}
				}
    			
    		},
    		"jsonp"
    	);
    });
},
"jsonp"
);