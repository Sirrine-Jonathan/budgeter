/*
	Toggle Expense Sections
*/
window.onload = function(){
	
	/*
		Toggle section display
	*/
	var sections = document.getElementsByClassName('section-title');

	for (s = 0; s < sections.length; s++){
		sections[s].onclick = function(e){
			var inputsDiv = this.parentElement.children[1];
			if(inputsDiv.style.display === 'none'){
				inputsDiv.style.display = 'block';
			}
			else{
				inputsDiv.style.display = 'none';
			}
		};
	};
	
	/*
		On input change
	*/
	var inputs = document.getElementsByClassName('budgetInput');
	console.log(inputs);
	for(i = 0; i < inputs.length; i++){
		inputs[i].onchange = function(e){
			var totals = getTotals(document.getElementsByClassName('budgetInput'));
			console.log(totals);
		}
	}
	function getTotals(inputsArr){
		var totals = {
			income: 0,
			expense: 0,
			balance: 0
		};
		
		for(l = 0; l < inputsArr.length; l++){
			var type = inputs[l].getAttribute('data-type');
			var num = parseFloat(inputs[l].value);
			if(isNaN(num)) num = 0;
			
			if(type === 'expense'){
				totals.balance -= num;
				totals.expense += num;
			}
			else if(type === 'income'){
				totals.balance += num;
				totals.income += num;
			}
		}
		return totals;
	}
	
	
};