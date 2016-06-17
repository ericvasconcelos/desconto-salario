$('ul.tabs').tabs();

var lista = JSON.parse(storage.getItem('registros'));
var listaCompleta = '';

if (lista) {
	$('#liquidsalary').show();
} else {
	$('#empty-data').show();
}

if (lista) {
	lista.list.map(function(item) {
		listaCompleta += '<tr>\
			<td>' + item.name + '</td>\
			<td>' + item.grossSalary + '</td>\
	    <td>' + item.liquidSalary + '</td>\
	    <td>' + item.inssDiscount + '</td>\
	    <td>' + item.irDiscount + '</td>\
	    <td>' + item.children + '</td>\
	    <td>' + item.pension + '</td>\
	    <td>' + item.othersDiscounts + '</td>\
	    <td>' + item.vt + '</td>\
	    <td>' + item.vr + '</td>\
	    <td>' + item.va + '</td>\
	    <td>' + item.date + '</td>\
	  </tr>'
	});
}

$("#list").html(listaCompleta);

$('.acao-limpar').on('click', function () {
	$('#liquidsalary-table').fadeOut(300, function() {
		storage.removeItem('registros');
		$('#empty-data').fadeIn(300);
	});
});
