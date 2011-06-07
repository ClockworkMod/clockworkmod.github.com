$.get(
	"http://jsonp.deployfu.com/clean/http%3A%2F%2Fromshare.deployfu.com%2Fmanifest",
	function(data) {
		$.each(data.manifests,function(i, val){
			$('.it').append('<tr class= tx' + i + '><td><a href=' + val.manifest + '>' + val.id + '</a></td>');
			$('.tx' + i).append('<td>'+ val.developer + '</td>');
			$('.tx'+i).append('<td class = "summary">'+ val.summary + '</td></tr>');
		});
	},
	"jsonp"
);

$(document).ready(function(){
	$("a.hide").hide();
	$('td.summary').hide();

	$("a.show").click(function(event){
		event.preventDefault();
		$("a.show").hide();
		$("a.hide").show();
		$("td.summary").show();
	});
	
	$("a.hide").click(function(event){
		event.preventDefault();
		$("a.show").show();
		$("a.hide").hide();
		$("td.summary").hide();
	});
});