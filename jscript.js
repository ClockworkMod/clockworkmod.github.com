$.get(
	"http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
	function(data) {
		$.each(data.manifests,function(i, val){
			$('.it').append('<a href=' + val.manifest + '>' + val.id + '</a>\n<br>');
		});
	},
	"jsonp"
);
