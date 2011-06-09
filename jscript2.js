// Developer >> Rom List >> Rom Details

//Get developer names and display them in the first tab
$.get(
    "http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
    function(data){
        $.each(data.manifests, function(i, val){
            $("ul.devlist").append('<li><a class = "dev", href ="">' + val.developer + '</a></li>');
        });
    },
    "jsonp"
);

$(document).ready(function(){

    // Clicking developer name should create new tab for his roms    
    // !!!!Right now all clicking the developer does is link back to itself!
    $("a.dev").click(function(event){
        event.preventDefault();
        $('.tabs').append('<li><a>ROM LIST</a></li>');
    });
    
});