/*
	Toggle Expense Sections
*/
window.onload = function(){
	/*
		Toggle section display
	*/
	document.getElementById('mainApp').style.maxHeight = (window.innerHeight - 50);
	
	var sections = document.getElementsByClassName('section-title');
	var incomeTotal = document.getElementById('incomeTotal');
	var expenseTotal = document.getElementById('expenseTotal');
	var balanceTotal = document.getElementById('balanceTotal');
	
	for (s = 0; s < sections.length; s++){
		sections[s].onclick = function(e){
			getTotals(document.getElementsByClassName('budgetInput'));
			var inputsDiv = this.parentElement.children[1];
			var arrow = this.children[0];
			if(inputsDiv.style.display === 'block' || inputsDiv.style.display === ''){
				inputsDiv.style.display = 'none';
				
				//flip arrow vertical
				arrow.style['-webkit-transform'] =  'rotate(90deg) scaleY(-1)';
				arrow.style['-moz-transform'] =  'rotate(90deg) scaleY(-1)';
				arrow.style['-o-transform'] = 'rotate(90deg) scaleY(-1)';
				arrow.style['transform'] = 'rotate(90deg) scaleY(-1)';
			}
			else{
				inputsDiv.style.display = 'block';;
				
				//flip arrow vertical
				arrow.style['-webkit-transform'] =  'rotate(270deg) scaleY(1)';
				arrow.style['-moz-transform'] =  'rotate(270deg) scaleY(1)';
				arrow.style['-o-transform'] = 'rotate(270deg) scaleY(1)';
				arrow.style['transform'] = 'rotate(270deg) scaleY(1)';
			}
		};
	};
	
	/*
		On input change
	*/
	var inputs = document.getElementsByClassName('budgetInput');
	for(i = 0; i < inputs.length; i++){
		inputs[i].onkeyup = function(e){
			getTotals(document.getElementsByClassName('budgetInput'));
		}
	}
	function getTotals(inputsArr){
		var totals = {
			income: 0,
			expense: 0,
			balance: 0
		};
		
		for(l = 0; l < inputsArr.length; l++){
			var display = inputs[l].parentElement.parentElement.style.display;
				if(display === 'block' || display === ''){
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
		}
		
		//updateHTML
		incomeTotal.innerHTML = totals.income;
		expenseTotal.innerHTML = totals.expense;
		balanceTotal.innerHTML = totals.balance;
		if(totals.balance < 0){
			balanceTotal.style.color = 'red';
		}
		else{
			balanceTotal.style.color = 'white';
		}
		//console.log(totals);
	}
	
	/*
		On month change
	*/
	document.getElementById('month').addEventListener('change', function(){
		console.log(this.innerHTML);
		document.getElementById('monthDisplay').innerHTML = this.value+' budget';
	});
	
	/*
		advice XHR
	*/
	var req = new XMLHttpRequest(),
		method = 'GET';
		url = 'http://api.adviceslip.com/advice';
		req.onreadystatechange = function(){
			handleNewAdvice(req.response);
		}
	function getNewAdvice(){
		req.open(method, url, true);
		req.send();
	}
	getNewAdvice();
	var handle = setInterval(getNewAdvice, 1000 * 60);
	
	function handleNewAdvice(adviceJson){
		var adviceObj = JSON.parse(adviceJson);
		var advice = adviceObj.slip.advice;
		console.log(advice);
		document.getElementById('advice').innerHTML = advice;
	}
	
	/*
		background change
	*/
	document.getElementById('changeBackground').addEventListener('click', function(){
		var url = document.getElementById('backgroundURL').value;
		document.getElementsByTagName('html')[0].style.backgroundImage = 'URL('+url+')';
		document.getElementsByTagName('body')[0].style.backgroundImage = 'URL('+url+')';		
	});
	
	document.getElementById('undoBackground').addEventListener('click', function(){
		var url = 'http://i.imgur.com/bgkdbSo.jpg';
		document.getElementsByTagName('body')[0].style.backgroundImage = 'URL('+url+')';
		document.getElementsByTagName('html')[0].style.backgroundImage = 'URL('+url+')';		
	});
	
	/*
		set month
	*/
	
	function setMonth(){
		var date = new Date();
		var month = date.getMonth();
		switch(month){
			case 0:
				document.getElementById('monthDisplay').innerHTML = 'January';
			break;
			case 1:
				document.getElementById('monthDisplay').innerHTML = 'February';
			break;
			
			case 2:
				//var test = document.getElementById('month').value;
				//document.getElementById('month').value = "Mar";
				//document.getElementById('month').innerHTML = 'Mar';
				document.getElementById('monthDisplay').innerHTML = 'Mar';
			break;
			case 3:
				document.getElementById('monthDisplay').innerHTML = 'Apr';
			break;
			
			case 4:
				document.getElementById('monthDisplay').innerHTML = 'May';
			break;
			case 5:
				document.getElementById('monthDisplay').innerHTML = 'Jun';
			break;
			case 6:
				document.getElementById('monthDisplay').innerHTML = 'Jul';
			break;
			case 7:
				document.getElementById('monthDisplay').innerHTML = 'Aug';
			break;
			case 8:
				document.getElementById('monthDisplay').innerHTML = 'Oct';
			break;
			case 9:
				document.getElementById('monthDisplay').innerHTML = 'Sep';
			break;
			case 10:
				document.getElementById('monthDisplay').innerHTML = 'Nov';
			break;
			case 11:
				document.getElementById('monthDisplay').innerHTML = 'Dec';
			break;
		}
	}
	setMonth();
};

window.onresize = resize 
function resize(){
	document.getElementById('mainApp').style.height = (window.innerHeight - 50);
}