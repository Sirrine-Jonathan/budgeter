/*
	Toggle Expense Sections
*/
window.onload = function(){
	/*
		Toggle section display
	*/
	console.log(window.innerHeight);
	document.getElementById('mainApp').style.maxHeight = (window.innerHeight - 50);
	
	var sections = document.getElementsByClassName('section-title');
	var incomeTotal = document.getElementById('incomeTotal');
	var expenseTotal = document.getElementById('expenseTotal');
	var balanceTotal = document.getElementById('balanceTotal');
	
	for (s = 0; s < sections.length; s++){
		sections[s].onclick = function(e){
			var inputsDiv = this.parentElement.children[1];
			if(inputsDiv.style.display === 'block' || inputsDiv.style.display === ''){
				inputsDiv.style.display = 'none';
				
				//flip arrow vertical
			}
			else{
				inputsDiv.style.display = 'block';;
				
				//flip arrow vertical
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
		
		//updateHTML
		incomeTotal.innerHTML = totals.income;
		expenseTotal.innerHTML = totals.expense;
		balanceTotal.innerHTML = totals.balance;
		if(totals.balance < 0){
			balanceTotal.style.color = 'red';
		}
		else{
			balanceTotal.style.color = 'black';
		}
		return totals;
	}
	
	
};

window.onresize = resize 
function resize(){
	document.getElementById('mainApp').style.height = (window.innerHeight - 50);
}