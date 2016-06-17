var inssDiscount = 0,
	childrenDiscount = 0,
	grossSalary,
	baseSalary,
	salaryBeforeIR,
	salaryAfterIR,
	finalSalary,
	irDiscount = 0,
	pensionVal = 0,
	othersDiscounts = 0,
	vtVal = 0,
	vrVal = 0,
	vaVal = 0,
	savedSalary;

$('.currency').priceFormat({
	prefix: 'R$ ',
	centsSeparator: ',',
	thousandsSeparator: '.',
	limit: 7,
	centsLimit: 2
}).trigger('keyup');

function currencyToNumber(number) {
	return Number(number.replace('R$ ', '').replace('.', '').replace(',', '.'));
}

function numberToCurrency(currency) {
	var currencyString = String(currency),
		real = currencyString.split('.')[0],
		cents = currencyString.split('.')[1];

	if (real.length > 3) {
		real = real.slice(0, real.length - 3) + '.' + real.slice(real.length - 3, real.length);
	}

	if (!cents) {
		cents = '00';
	}

	return 'R$ ' + real + ',' + cents;
}

function calcINSS(grossSalary) {
	var allDiscounts = childrenDiscount + pensionVal + othersDiscounts;
	if (grossSalary < allDiscounts || grossSalary === undefined) {
		return salaryAfterIR = 0.00;
	}

	if (grossSalary <= 1556.94) {
		inssDiscount = (grossSalary * 0.08).toFixed(2);
		baseSalary = grossSalary - inssDiscount;

	} else if (grossSalary >= 1556.95 && grossSalary <= 2594.92) {
		inssDiscount = (grossSalary * 0.09).toFixed(2);
		baseSalary = grossSalary - inssDiscount;

	} else if (grossSalary >= 2594.93 && grossSalary <= 5198.82) {
		inssDiscount = (grossSalary * 0.11).toFixed(2);
		baseSalary = grossSalary - inssDiscount;

	} else if (grossSalary >= 5198.83) {
		inssDiscount = 570.88;
		baseSalary = grossSalary - inssDiscount;

	}
	calcIR(baseSalary);
}

function calcIR(baseSalary) {
	// Descontos
	salaryBeforeIR = baseSalary - (childrenDiscount + pensionVal + othersDiscounts);
	
	var band2 = 922.67,
		band3 = 924.40,
		band4 = 913.63;

	// Cálculo do IRRF
	if (salaryBeforeIR <= 1903.98) {
		irDiscount = 0;
		salaryAfterIR = salaryBeforeIR;

	} else if (salaryBeforeIR >= 1903.99 && salaryBeforeIR <= 2826.65) {
		irDiscount = ((salaryBeforeIR - 1903.98) * 0.075).toFixed(2);
		salaryAfterIR = baseSalary - irDiscount;

	} else if (salaryBeforeIR >= 2826.66 && salaryBeforeIR <= 3751.05) {
		irDiscount = ((band2 * 0.075) + ((salaryBeforeIR - 2826.65) * 0.15)).toFixed(2);
		salaryAfterIR = baseSalary - irDiscount;

	} else if (salaryBeforeIR >= 3751.06 && salaryBeforeIR <= 4664.68) {
		irDiscount = ((band2 * 0.075) + (band3 * 0.15) + ((salaryBeforeIR - 2826.65) * 0.225)).toFixed(2);
		salaryAfterIR = baseSalary - irDiscount;

	} else if (salaryBeforeIR > 4664.68) {
		irDiscount = ((band2 * 0.075) + (band3 * 0.15) + (band4 * 0.225) + ((salaryBeforeIR - 4664.68) * 0.275)).toFixed(2);
		salaryAfterIR = baseSalary - irDiscount;

	}
	return salaryAfterIR;
}

function minusOthersDiscounts(salaryAfterIR) {
	finalSalary = (salaryAfterIR - (vtVal + vrVal + vaVal)).toFixed(2);
	return finalSalary;
}

function calcFinalSalary() {
	calcINSS(grossSalary);
	minusOthersDiscounts(salaryAfterIR);

	$('#liquid-wage').text(numberToCurrency(finalSalary));
	$('#discount-inss').text(numberToCurrency(inssDiscount));
	$('#discount-ir').text(numberToCurrency(irDiscount));
}


function validateInputs() {
	if ($('#name').val().length < 3) {
		Materialize.toast('Opa! Preencha o seu nome ;)', 2000, '', $('#name').focus()); 
		return false;
	} else if (currencyToNumber($("#wage").val()) < 100) {
		Materialize.toast('Opa! Preencha o seu salário ;)', 2000, '', $('#wage').focus()); 
		return false;
	} else {
		return true;
	}
}

// Salário Bruto!
$('#wage').on('keyup', function() {
	grossSalary = currencyToNumber($(this).val());
});

// Dependentes
$('#children').on('change', function() {
	var children = $(this).val();
	childrenDiscount = children * 189.59;
	calcFinalSalary();
});

// Pensão alimentícia
$('#pension').on('keyup', function() {
	pensionVal = currencyToNumber($(this).val());
});

// Pensão alimentícia
$('#others-discounts').on('keyup', function() {
	othersDiscounts = currencyToNumber($(this).val());
});

// Vale Transporte
$('#vt').on('keyup', function() {
	vtVal = currencyToNumber($(this).val());
});

// Vale Refeição
$('#vr').on('keyup', function() {
	vrVal = currencyToNumber($(this).val());
});

// Vale alimentação
$('#va').on('keyup', function() {
	vaVal = currencyToNumber($(this).val());
});

$('.currency').on('keyup', function() {
	calcFinalSalary();
});

$('#save').on('click', function() {

	var nameVal = $('#name').val();

	if (validateInputs() && savedSalary !== nameVal) {
		savedSalary = nameVal;

		var data = new Date();
	  var dia = data.getDate();
	  if (dia.toString().length == 1)
	    dia = "0" + dia;
	  var mes = data.getMonth()+1;
	  if (mes.toString().length == 1)
	    mes = "0" + mes;
	  var ano = data.getFullYear();  
	  var date =  dia + "/" + mes + "/" + ano;


		var newRegistro = {
			name: nameVal,
			grossSalary: $('#wage').val(),
			liquidSalary: $('#liquid-wage').text(),
			inssDiscount: $('#discount-inss').text(),
			irDiscount: $('#discount-ir').text(),
			children: $('#children').val(),
			pension: $('#pension').val(),
			othersDiscounts: $('#others-discounts').val(),
			vt: $('#vt').val(),
			vr: $('#vr').val(),
			va: $('#va').val(),
			date: date
		}
		var registros = storage.getItem('registros');

		if (registros) {
			var oldRegistros = JSON.parse(registros);
			oldRegistros.list.unshift(newRegistro);
			storage.setItem('registros', JSON.stringify(oldRegistros));
		} else {
			storage.setItem('registros', JSON.stringify({"list": [newRegistro]}));
		}

		Materialize.toast('Salário gravado!', 3000, '', callIndex);
		
	} else {
		return false;
	}
});