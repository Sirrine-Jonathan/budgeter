window.onload = function(){
	/*
		Set up Storage
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
	document.getElementById('mainAppOne').style.maxHeight = (window.innerHeight - 50);
	document.getElementById('mainAppTwo').style.maxHeight = (window.innerHeight - 50);
	
	var sections = document.getElementsByClassName('section-title');
	var incomeTotal = document.getElementById('incomeTotal');
	var expenseTotal = document.getElementById('expenseTotal');
	var balanceTotal = document.getElementById('balanceTotal');
	
	for (s = 0; s < sections.length; s++){
		sections[s].addEventListener('click', function(e){
			var className = e.target.classList[0];
			if(className === 'arrow'){
				var title = e.target.parentElement;
			}
			else{
				var title = e.target;
			}
			toggleSection(title);
		});
	};
	
	function toggleSection(elem){

		var inputsDiv = elem.parentElement.children[1];
		var arrow = elem.children[0];
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
		getTotals(document.getElementsByClassName('budgetInput'));
	};
	
	/*
		On input change
	*/
	var inputs = document.getElementsByClassName('budgetInput');
	for(i = 0; i < inputs.length; i++){
		inputs[i].onkeyup = function(){
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
		incomeTotal.innerHTML = totals.income.toFixed(2);
		expenseTotal.innerHTML = totals.expense.toFixed(2);
		balanceTotal.innerHTML = totals.balance.toFixed(2);
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
		curMonth = this.options[this.selectedIndex].text;
		monthIndex = months.indexOf(curMonth);
		document.getElementById('monthDisplay').innerHTML = curMonth+' budget';
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
	var months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	
	var curMonth;
	var monthIndex;
	function setMonth(){
		var date = new Date();
		monthIndex = date.getMonth();
		curMonth = months[monthIndex];
		document.getElementById('monthDisplay').innerHTML = curMonth+' Budget';
		var ele = document.getElementById('month').options[monthIndex];
		ele.setAttribute('selected','selected');
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
				<div class="section-title underline">Entertainment
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
		var sectionExOrIn = document.getElementById('incomeOrExpense').value;
		var newSection = document.createElement('div');
		newSection.classList.add('section');
			var sectionTitle = document.createElement('div');
			sectionTitle.classList.add('section-title');
			sectionTitle.classList.add('underline');
				var node = document.createTextNode(document.getElementById('newTitle').value);
			sectionTitle.appendChild(node);
				var span = document.createElement('span');
				span.classList.add('arrow');
				span.innerHTML = '&#10149';
			sectionTitle.appendChild(span);
		
			var newSectionInput = document.createElement('div');
			newSectionInput.classList.add('section-input'); 
				//loop to add all subcategories
				
				var arr = document.getElementsByClassName('customSub');
				for(a = 0; a < arr.length; a++){
					//make and add customSub input section
					var div = document.createElement('div');
						var label = document.createElement('label');
							var node = document.createTextNode(arr[a].children[1].value);
						label.appendChild(node);
						var input = document.createElement('input');
						
						//input event listener
						input.onkeyup = function(e){
							getTotals(document.getElementsByClassName('budgetInput'));
						}
						
						input.classList.add('budgetInput');
						var dataAttr = document.createAttribute('data-type');
						input.setAttribute('data-type',sectionExOrIn);
						input.setAttribute('type','number');
						input.setAttribute('placeholder','0.00');
					div.appendChild(label);
					div.appendChild(input);
					newSectionInput.appendChild(div);
				}
		
		newSection.appendChild(sectionTitle);
		newSection.appendChild(newSectionInput);

		//addEventListener
		newSection.addEventListener('click', function(e){
			var className = e.target.classList[0];
			if(className === 'arrow'){
				var title = e.target.parentElement;
			}
			else if(className === 'section-title'){
				var title = e.target;
			}
			toggleSection(title);
		});
		
		//find place to put newSection and append it
		if(sectionExOrIn === 'income'){
			console.log(document.getElementById('mainAppOne').children);
		}
		else{
			document.getElementById('mainAppOne').insertBefore(newSection, document.getElementById('balanceSection'));
		}
	});
	
	/*
		Generate graph
	*/

	var startEle = document.getElementById('startMonth').options[monthIndex - 1];
	var endEle = document.getElementById('endMonth').options[monthIndex];
	startEle.setAttribute('selected','selected');
	endEle.setAttribute('selected','selected');
	
	document.getElementById('startMonth').addEventListener('change', function(){
		generateGraph();
	});
	document.getElementById('endMonth').addEventListener('change', function(){
		generateGraph();
	});
	generateGraph();
	function generateGraph(){
		if(true){
			
			
			var canvas = document.getElementById('canvas');
			canvas.width = canvas.width;
			var ctx = canvas.getContext('2d');
			var startIndex = document.getElementById('startMonth').options.selectedIndex;
			var endIndex = document.getElementById('endMonth').options.selectedIndex;
			var step = startIndex;
			
			//find out how many months have data
			var numberOfMonths;
			if(endIndex > startIndex){
				numberOfMonths = endIndex - startIndex;
			}
			else{
				numberOfMonths = 12 - startIndex + endIndex;
			}
			numberOfMonths++;
			
			//divide canvas width by the number of months that have data
			var canvasWidth = document.getElementById('canvas').width;
			var canvasHeight = document.getElementById('canvas').height;
			var sectionWidth = canvasWidth / numberOfMonths;
			
			//divide sections widths by 2 to get increments
			var increments = (sectionWidth / 2) + 15;
			
			//draw text to label months of graph along width dividers
			ctx.font = '12px times'
			ctx.color = 'white';
			for(i = increments; i <= (increments * numberOfMonths); i += increments){
				ctx.fillText(months[step].slice(0,3), i, canvasHeight - 5);
				step++;
			}

			//find max value for income, expense, or balance between all months to set range
			

			//draw range along left side of canvas

			//start income line at first month income value

			//draw line to next month income value

			//continue until end month

			//continue drawing lines for balance and expenses	
		}
	}
	
	/*
		opacity control
	*/
	var sections = document.getElementsByClassName('section');
	sections[0].style.backgroundColor = 'rgba(0,0,0,0.3)';
	
	
	var opacityCntrl = document.getElementById('opacityCntrl');
	opacityCntrl.addEventListener('input', function(e){
		
		//get current settings
		var sections = document.getElementsByClassName('section');
		var curColors = sections[0].style.backgroundColor;
		var regEx = new RegExp(/\)|,|\(/g);
		var curColorsArr = curColors.split(regEx);
		var red = curColorsArr[1];
		var green = curColorsArr[2]
		var blue = curColorsArr[3]
		var trans = curColorsArr[4];
		
		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = 'rgba('+red+','+green+','+blue+','+opacityCntrl.value+')';
			}
		}
	});
	
	/*
		red control
	*/
	var redCntrl = document.getElementById('redCntrl');
	redCntrl.addEventListener('input', function(){

		//get current settings
		var sections = document.getElementsByClassName('section');
		var curColors = sections[0].style.backgroundColor;
		var regEx = new RegExp(/\)|,|\(/g);
		var curColorsArr = curColors.split(regEx);
		var red = curColorsArr[1];
		var green = curColorsArr[2]
		var blue = curColorsArr[3]
		var trans = curColorsArr[4];

		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = 'rgba('+redCntrl.value+','+green+','+blue+','+trans+')';
			}
		}		
	});

	/*
		green control
	*/
	var greenCntrl = document.getElementById('greenCntrl');
	greenCntrl.addEventListener('input', function(){

		//get current settings
		var sections = document.getElementsByClassName('section');
		var curColors = sections[0].style.backgroundColor;
		var regEx = new RegExp(/\)|,|\(/g);
		var curColorsArr = curColors.split(regEx);
		var red = curColorsArr[1];
		var green = curColorsArr[2]
		var blue = curColorsArr[3]
		var trans = curColorsArr[4];

		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = 'rgba('+red+','+greenCntrl.value+','+blue+','+trans+')';
			}
		}		
	});
	
	/*
		blue control
	*/
	var blueCntrl = document.getElementById('blueCntrl');
	blueCntrl.addEventListener('input', function(){

		//get current settings
		var sections = document.getElementsByClassName('section');
		var curColors = sections[0].style.backgroundColor;
		var regEx = new RegExp(/\)|,|\(/g);
		var curColorsArr = curColors.split(regEx);
		var red = curColorsArr[1];
		var green = curColorsArr[2]
		var blue = curColorsArr[3]
		var trans = curColorsArr[4];

		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = 'rgba('+red+','+green+','+blueCntrl.value+','+trans+')';
			}
		}		
	});
};
/*
window.onresize = resize 
function resize(){
	document.getElementById('mainApp').style.height = (window.innerHeight - 50);
}
*/