$.get(
	"http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
	function(data) {
		$.each(data.manifests,function(i, val){
			$('.it').append('<tr class= tx' + i + '><td><a href=' + val.manifest + '>' + val.id + '</a></td><td>');
			$('.tx' + i).append('<td>'+ val.developer + '</td></tr>');
			$('.tx'+i).append('<td>'+ val.summary + '</td></tr>');
		});
	},
	"jsonp"
);
