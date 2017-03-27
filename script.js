window.onload = function(){
	/*
		
	*/
	if (typeof(Storage) !== "undefined") {
		var ls = window.localStorage;
	}
	else{
		var ls = {};	
	}
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
		ls.totals = totals;
	}
	
	/*
		On month change
	*/
	document.getElementById('month').addEventListener('change', function(){
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
	var handle = setInterval(getNewAdvice, 2000 * 60);
	
	function handleNewAdvice(adviceJson){
		var adviceObj = JSON.parse(adviceJson);
		var advice = adviceObj.slip.advice;
		document.getElementById('advice').innerHTML = advice;
	}
	
	/*
		background change
	*/
	var curIndex = 0;
	var backgrounds = ["http://i.imgur.com/bgkdbSo.jpg"];
	document.getElementById('changeBackground').addEventListener('click', function(){
		var url = document.getElementById('backgroundURL').value;
		
		//find current url
		var curURL = document.getElementsByTagName('html')[0].style.backgroundImage;
		if(curURL === ""){curURL = "http://i.imgur.com/bgkdbSo.jpg"}
		else{curURL = curURL.split('"')[1]}
		console.log(curURL);
		var index = backgrounds.indexOf(curURL);
		curIndex = index+1;
		backgrounds.splice(curIndex, 0, url);
		
		//backgrounds.push(url);
		document.getElementsByTagName('html')[0].style.backgroundImage = 'URL('+url+')';
		document.getElementsByTagName('body')[0].style.backgroundImage = 'URL('+url+')';		
	});
	
	document.getElementById('undoBackground').addEventListener('click', function(){
		var url;
		if(curIndex - 1 >= 0){
			url = backgrounds[curIndex - 1];
			curIndex--;
		}
		else{
			url = backgrounds[backgrounds.length - 1];
			curIndex = backgrounds.length - 1;
		}
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
	
	/*
		Add/Subtract Sub Sections
	*/
	var addSubBtn = document.getElementById('addSubBtn');
	var subSubBtn = document.getElementById('subSubBtn');
	
	addSubBtn.addEventListener('click', function(){

		/*ADD ELEMENT*/
		
		//used to know where to put element
		var customSubsArr = document.getElementsByClassName('customSub');
		var lastCustomSub = document.getElementsByClassName('customSub')[customSubsArr.length - 1];
		
		//make outer div
		var newCustomSub = document.createElement('div');
		newCustomSub.classList.add('customSub');
		
		//make label
		var newLabel = document.createElement('label');
		var label = document.createTextNode('subsection');
		newLabel.appendChild(label);
		
		//make input
		var input = document.createElement('input');
		input.classList.add('customInput');
		input.setAttribute("id", "newCategory");
		input.setAttribute("type", "text");
		input.setAttribute("placeholder", "category");
		
		//combine elements
		newCustomSub.appendChild(newLabel);
		newCustomSub.appendChild(input);
		
		//insert after last custom sub
		lastCustomSub.parentNode.insertBefore(newCustomSub, lastCustomSub.nextSibling);
		
		
	});
	
	subSubBtn.addEventListener('click', function(){
		/*Remove ELEMENT*/
		
		//used to know where to put element
		var customSubsArr = document.getElementsByClassName('customSub');
		var lastCustomSub = document.getElementsByClassName('customSub')[customSubsArr.length - 1];
		if(customSubsArr.length > 1){
			lastCustomSub.remove();
		}
		
	});
	
	/*
		Create Custom Section
	*/
	var submitSectionBtn = document.getElementById('submitSectionBtn');
	submitSectionBtn.addEventListener('click', function(){
	/*
		<div class="section">
			<div class="section-title underline"">Entertainment
				<span class="arrow">&#10149;</span>
			</div>
			<div class="section-input">
				<div>
					<label>Movies</label>
					<input class="budgetInput" data-type="expense" type="number" placeholder="0.00" />
				</div>
				<div>
					<label>Games</label>
					<input class="budgetInput" data-type="expense" type="number" placeholder="0.00" />
				</div>
				<div>
					<label>Other</label>
					<input class="budgetInput" data-type="expense" type="number" placeholder="0.00" />
				</div>
			</div>
		</div>		
	*/
	
		var newSection = document.createElement('div');
		newSection.classList.add('section');
		
		var sectionTitle
	});
	
	/*
		Generate graph
	*/
	
	if(true){
		
		var canvas = document.getElementById('canvas');
		var ctx = canvas.getContext('2d');
		
		//find out how many months have data
		
		var numberOfMonths = 2;
		
		//divide canvas width by the number of months that have data
		var canvasWidth = document.getElementById('canvas').width;
		var canvasHeight = document.getElementById('canvas').height;
		var sectionWidth = canvasWidth / numberOfMonths;
		
		//divide sections widths by 2 to get increments
		var increments = sectionWidth / 2;
		
		for(i = increments; i <= (increments * numberOfMonths); i += increments){
			ctx.font = '12px times'
			ctx.color = 'white';
			ctx.fillText('month', i, canvasHeight - 5, sectionWidth);
		}

		//find max value for income, expense, or balance between all months to set range
		
		
		//draw text to label months of graph along width dividers
		

		//draw range along left side of canvas

		//start income line at first month income value

		//draw line to next month income value

		//continue until end month

		//continue drawing lines for balance and expenses	
	}
};

window.onresize = resize 
function resize(){
	document.getElementById('mainApp').style.height = (window.innerHeight - 50);
}