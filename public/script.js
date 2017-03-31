window.onload = function(){
	
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyD9Mw3siaRMEE6JDhSAc6dgMuElay0CIZk",
		authDomain: "budgeter5000.firebaseapp.com",
		databaseURL: "https://budgeter5000.firebaseio.com",
		storageBucket: "budgeter5000.appspot.com",
		messagingSenderId: "468889857587"
	};
	firebase.initializeApp(config);
	
	//set up script object
	var profile = {
				'userInfo':{
					'username':''
				},
				'months': {
				},
				'personalization':{
					'background':'https://i.imgur.com/bgkdbSo.jpg',
					'rgba':'rgba(0,0,0,0.3)'
				}
		};
		
	/*
		set up date
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
	var curMonth = setMonth();
		
	/*
		get user info
	*/
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			//start animation
			var loadingImg = document.createElement('img');
			loadingImg.setAttribute('id','loadingImg');
			loadingImg.setAttribute('src','https://media.24ways.org/2009/15/assets/img/spinner.png');
			loadingImg.setAttribute('alt','loading');
			loadingImg.setAttribute('class','loading');
			document.getElementById('errorMsg').appendChild(loadingImg);
			
			// User is signed in.
			curUID = user.uid;
			setTimeout(function(){
			var ref = firebase.database().ref('/profiles/'+curUID).once('value').then(function(snapshot) {
						updatePage();
					  });
			},2000);
		} else {
			// No user is signed in.
			console.log('logged out');
		}
	});
	
	/*
		update RGBA
	*/
	function updataRGBA(){
		var sections = document.getElementsByClassName('section');
		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = profile.personalization.rgba;
			}
		}
	}
	
	function updatePage(){
		//month data
		putDataforMonth();
		
		//personalization
		var url;
		firebase.database().ref('/profiles/'+curUID+'/personalization').once('value').then(function(snapshot) {
			if(snapshot.val()){
				profile.personalization = snapshot.val();
			}
			else{
				profile = {
				'userInfo':{
					'username':''
				},
				'months': {
				},
				'personalization':{
					'background':'https://i.imgur.com/bgkdbSo.jpg',
					'rgba':'rgba(0,0,0,0.3)'
				}
		};
			}
			url = profile.personalization.background;
			document.getElementsByTagName('html')[0].style.backgroundImage = 'URL('+url+')';
			document.getElementsByTagName('body')[0].style.backgroundImage = 'URL('+url+')';
			updataRGBA();
			
			//run animation in errorMsg elem
			
			//on animation end run:
			document.getElementById('login-wrapper').style.display = 'none';
			document.getElementById('budgeter5000').style.display = 'inline-block';
			makeSquares();
			//remove animation class from errMsg and innerHTML of pic
			
			
			backgrounds = ['https://i.imgur.com/bgkdbSo.jpg',url];
			curIndex = 1;
		});
		
	};
		
	
	document.getElementById('registerBtn').addEventListener('click', function(){
		var usernameNew = document.getElementById('userHtml').value;
		var passwordNew = document.getElementById('passHtml').value;
		var err = false;
		var errHtml = document.getElementById('errorMsg');
		
		//validation
		if(usernameNew === '' && passwordNew === ''){
			err = 'You forgot to type stuff in';
		}
		else if(usernameNew === ''){
			err = 'You forgot a username';
		}
		else if(passwordNew === ''){
			err = 'You forgot a password';
		}

		if(err){
			errHtml.innerHTML = err;
		}
		else{
			document.getElementById('errorMsg').innerHTML = 'Registered';
			firebase.auth().createUserWithEmailAndPassword(usernameNew, passwordNew).catch(function(error) {
				errHtml.innerHTML = error.code + ' : ' + error.message;
			}).then(function(){
				var user = firebase.auth().currentUser;
				user.sendEmailVerification().then(function() {
					// Email sent.
					console.log('email sent');
				}, function(error) {
					// An error happened.
					console.log(error);
				});
			});
		}

	});
	
	/*
		Login Btn
	*/
	document.getElementById('loginBtn').addEventListener('click', function(){
		var usernameNew = document.getElementById('userHtml').value;
		var passwordNew = document.getElementById('passHtml').value;
		var err = false;
		var errHtml = document.getElementById('errorMsg');
		
		//validation
		if(usernameNew === '' && passwordNew === ''){
			err = 'You forgot to type stuff in';
		}
		else if(usernameNew === ''){
			err = 'You forgot your email';
		}
		else if(passwordNew === ''){
			err = 'You forgot your password';
		}
		
		if(err){
			errHtml.innerHTML = err;
		}
		else{
			document.getElementById('errorMsg').innerHTML = '';
			firebase.auth().signInWithEmailAndPassword(usernameNew, passwordNew)
			.catch(function(error) {
				errHtml.innerHTML = error.message;
			});
		};
	});
	
	document.getElementById('passHtml').addEventListener('keypress', function(e){
		if(e.key === 'Enter'){
			var usernameNew = document.getElementById('userHtml').value;
			var passwordNew = document.getElementById('passHtml').value;
			var err = false;
			var errHtml = document.getElementById('errorMsg');
			
			//validation
			if(usernameNew === '' && passwordNew === ''){
				err = 'You forgot to type stuff in';
			}
			else if(usernameNew === ''){
				err = 'You forgot your email';
			}
			else if(passwordNew === ''){
				err = 'You forgot your password';
			}
			
			if(err){
				errHtml.innerHTML = err;
			}
			else{
				document.getElementById('errorMsg').innerHTML = '';
				firebase.auth().signInWithEmailAndPassword(usernameNew, passwordNew)
				.catch(function(error) {
					errHtml.innerHTML = error.message;
				});
			};
		}
	});

	
	/*
		Logout Btn
	*/
	document.getElementById('logoutBtn').addEventListener('click', function(){
		var errHtml = document.getElementById('errorMsg');
		
		firebase.auth().signOut().then(function() {
			
			// Sign-out successful.
			//prompt to save user data
			document.getElementById('login-wrapper').style.display = 'block';
			document.getElementById('budgeter5000').style.display = 'none';
			document.getElementById('errorMsg').innerHTML = '';
		}).catch(function(error) {
			
			// An error happened.
			console.log(error); 
			
		});
	});
	
	/*
		forgot password
	*/
	document.getElementById('forgotPassword').addEventListener('click', function(){
		var errHtml = document.getElementById('errorMsg');
		var auth = firebase.auth();
		var usernameNew = document.getElementById('userHtml').value;
		var err; 
		
		//validation
		if(usernameNew === ''){
			err = 'You forgot to put your email';
		}
		
		if(err){
			errHtml.innerHTML = err;
			return null;
		}
		else{
			auth.sendPasswordResetEmail(usernameNew).then(function() {
				// Email sent.
				errHtml.innerHTML = 'Email sent';
			}, function(error) {
				// An error happened.
				console.log(error);
				errHtml.innerHTML = error.message;
			});
		}
	});
	
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
		if(!elem){return false};
		
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
		remove section
	*/
	var closes = document.getElementsByClassName('close');
	for(c = 0; c < closes.length; c++){
		closes[c].addEventListener('click', function(){
			//newSection.remove();
			this.parentElement.remove();
		});
	}
	
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
	}
	
	/*
		Save
	*/
	
	document.getElementById('save').addEventListener('click', saveProgress);
	function saveProgress(){
		
		//save budget data to script object
		saveInputsToCurMonth(curMonth);
		
		//personalization data is saved on change cause it was easier that way.
		
		var ref = firebase.database().ref('profiles/'+curUID);
		ref.update(profile);
	}
	
	/*
		save inputs to current month function
		parameter should be curMonth
	*/
	function saveInputsToCurMonth(month){
		var sectionsArr = [];
		var mainAppOneChildren = document.getElementById('mainAppOne').children;
		for(i = 0; i < mainAppOneChildren.length; i++){
			if(mainAppOneChildren[i].classList.contains('section')){
				var section = mainAppOneChildren[i];
				var title = '';
				var category = '';
				var subtitles = [];
				var sectionChildren = section.children;
				var subtitlesArr = [];
				for(s = 0; s < sectionChildren.length; s++){
					if(sectionChildren[s].classList.contains('section-title')){
						title = sectionChildren[s].children[0].innerHTML;
					}
					if(sectionChildren[s].classList.contains('section-input')){
						var sectionInput = sectionChildren[s];
						var inputDivs = sectionInput.children;
						for(x = 0; x < inputDivs.length; x++){
							var subTitle = inputDivs[x].children[0].innerHTML;
							var subValue = inputDivs[x].children[1].value;
							if(subValue === ''){
								subValue = 0.00;
							}
							var obj = {
								'subTitle':subTitle,
								'subValue':subValue
							};
							subtitlesArr.push(obj);
						}
						
						var inputDivChildren = sectionChildren[s].children;
						var firstInput = inputDivChildren[0].children[1];
						category = firstInput.getAttribute('data-type');
						
					}
				}
				
				sectionsArr.push({
					'title':title,
					'category':category,
					'subtitles':subtitlesArr
				});
			}
		};
		profile.months[month] = sectionsArr;
	}
	
	/*
		Put data into html for current month
	*/
	function putDataforMonth(){
		firebase.database().ref('/profiles/'+curUID+'/months/').once('value').then(function(snapshot) {
			if(snapshot.val()){
				profile.months = snapshot.val();
			}
			else{
				profile = {
				'userInfo':{
					'username':user.email
				},
				'months': {
				},
				'personalization':{
					'background':'https://i.imgur.com/bgkdbSo.jpg',
					'rgba':'rgba(0,0,0,0.3)'
				}
		};
			}

			var dataMonths = profile.months;
			//put dummy data into empty slot
			if(!dataMonths.hasOwnProperty(curMonth)){
				dataMonths[curMonth] = [
					{
						'title':'Person 1',
						'category':'income',
						'subtitles':[	
							{
								'subTitle':'salary',
								'subValue':1000
							}
						]
					},
					{
						'title':'Person 2',
						'category':'income',
						'subtitles':[	
							{
								'subTitle':'salary',
								'subValue':500
							}
						]
					},
					{
						'title':'Home',
						'category':'expense',
						'subtitles':[	
							{
								'subTitle':'rent',
								'subValue':500
							},
							{
								'subTitle':'power',
								'subValue':100
							}
						]
					}
				];
			}
			var sectionArr = dataMonths[curMonth];
			
			//remove current section elements
			var mainAppOneChildren = document.getElementById('mainAppOne').children;
			for(l = 0; l < mainAppOneChildren.length; l++){
				if(mainAppOneChildren[l].classList.contains('section')){
					mainAppOneChildren[l].remove();
					l--;
				}
			}
			
			sectionArr.forEach(function(curVal, index, arr){
				
				//update cur month data
				var newSection = document.createElement('div');
				newSection.classList.add('section');
					var sectionTitle = document.createElement('div');
					sectionTitle.classList.add('section-title');
					sectionTitle.classList.add('underline');
						var titleSpan = document.createElement('span');
						titleSpan.classList.add('title');
						titleSpan.innerHTML = curVal.title;
					sectionTitle.appendChild(titleSpan);
						var span = document.createElement('span');
						span.classList.add('arrow');
						span.innerHTML = '&#10149';
					sectionTitle.appendChild(span);
				
					var newSectionInput = document.createElement('div');
					newSectionInput.classList.add('section-input'); 
						//loop to add all subcategories
						
						var arr = curVal.subtitles;
						for(a = 0; a < arr.length; a++){
							
							//make and add customSub input section
							var div = document.createElement('div');
								var label = document.createElement('label');
									var node = document.createTextNode(arr[a].subTitle);
								label.appendChild(node);
								var input = document.createElement('input');
								
								//input event listener
								input.onkeyup = function(e){
									getTotals(document.getElementsByClassName('budgetInput'));
								}
								
								input.classList.add('budgetInput');
								var dataAttr = document.createAttribute('data-type');
								input.setAttribute('data-type',curVal.category);
								input.setAttribute('type','number');
								input.setAttribute('placeholder','0.00');
								input.value = arr[a].subValue;
							div.appendChild(label);
							div.appendChild(input);
							newSectionInput.appendChild(div);
						}
					var newClose = document.createElement('span');
					newClose.classList.add('close');
					newClose.innerHTML = 'X';
				newSection.appendChild(sectionTitle);
				newSection.appendChild(newSectionInput);
				newSection.appendChild(newClose);

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
				
				newSection.style.backgroundColor = profile.personalization.rgba;
				
				makeSquares();
				newClose.addEventListener('click', function(e){
					newSection.remove();
				});
				
				//find place to put newSection and append it
				if(curVal.category === 'income'){
					document.getElementById('mainAppOne').insertBefore(newSection, document.getElementById('expenseSection'));
				}
				else{
					document.getElementById('mainAppOne').insertBefore(newSection, document.getElementById('balanceSection'));
				}
						
					
					
			});
			getTotals(document.getElementsByClassName('budgetInput'));
		});
	}
		
	/*
		On month change
	*/
	document.getElementById('month').addEventListener('change', function(){
		saveInputsToCurMonth(curMonth);
		
		var ref = firebase.database().ref('profiles/'+curUID);
		ref.update(profile);
		
		curMonth = this.options[this.selectedIndex].text;
		putDataforMonth()
		
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
	//getNewAdvice();
	//var handle = setInterval(getNewAdvice, 2000 * 60);
	
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
		var index = backgrounds.indexOf(curURL);
		curIndex = index+1;
		backgrounds.splice(curIndex, 0, url);
		
		//backgrounds.push(url);
		document.getElementsByTagName('html')[0].style.backgroundImage = 'URL('+url+')';
		document.getElementsByTagName('body')[0].style.backgroundImage = 'URL('+url+')';
		profile.personalization.background = url;
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
	
	var monthIndex;
	function setMonth(){
		var date = new Date();
		monthIndex = date.getMonth();
		curMonth = months[monthIndex];
		document.getElementById('monthDisplay').innerHTML = curMonth+' Budget';
		var ele = document.getElementById('month').options[monthIndex];
		ele.setAttribute('selected','selected');
		return curMonth;
	}
	
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
		var err = document.getElementById('customSectionErr');
		
		//check that everything is filled out
		var customSubsHaveValues = true;
		var customSubDivsArr = document.getElementsByClassName('customSub');
		for(b = 0; b < customSubDivsArr.length; b++){
			var customSubs = customSubDivsArr[b].children;
			for(a = 0; a < customSubs.length; a++){
				if(customSubs[a].classList.contains('customInput')){
					if(!customSubs[a].value){
						customSubsHaveValues = false;
					}
				}
			}
		}
		
		if(document.getElementById('newTitle').value && customSubsHaveValues){
			var sectionExOrIn = document.getElementById('incomeOrExpense').value;
			var newSection = document.createElement('div');
			newSection.classList.add('section');
				var sectionTitle = document.createElement('div');
				sectionTitle.classList.add('section-title');
				sectionTitle.classList.add('underline');
					var titleSpan = document.createElement('span');
					titleSpan.classList.add('title');
					titleSpan.innerHTML = document.getElementById('newTitle').value;
				sectionTitle.appendChild(titleSpan);
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
				var newClose = document.createElement('span');
				newClose.classList.add('close');
				newClose.innerHTML = 'X';
			newSection.appendChild(sectionTitle);
			newSection.appendChild(newSectionInput);
			newSection.appendChild(newClose);
			newSection.style.backgroundColor = profile.personalization.rgba;
			
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
			
			makeSquares();
			newClose.addEventListener('click', function(e){
				newSection.remove();
			});
			
			//find place to put newSection and append it
			if(sectionExOrIn === 'income'){
				document.getElementById('mainAppOne').insertBefore(newSection, document.getElementById('expenseSection'));
			}
			else{
				document.getElementById('mainAppOne').insertBefore(newSection, document.getElementById('balanceSection'));
			}
			
			err.innerHTML = '';
			var ref = firebase.database().ref('profiles/'+curUID);
			ref.update(profile);
		}
		{
			var subSectionsHaveTitles = true;
			var subSectionTitles = document.getElementsByClassName('newCategory');
			for(h = 0; h < subSectionTitles.length; h++){
				if(subSectionTitles[h].value === '' && subSectionTitles[h].style){
					subSectionsHaveTitles = false;
				}
			}
			if(!document.getElementById('newTitle').value && !customSubsHaveValues){
				err.innerHTML = 'You forgot to write stuff';
			}
			else if(!document.getElementById('newTitle').value){
				err.innerHTML = 'You forgot to put in a title';
			}
			else if(!subSectionsHaveTitles){
				err.innerHTML = 'You forgot to name your subsection';
			}
		}
		makeSquares();
	});
	

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
		profile.personalization.rgba = 'rgba('+red+','+green+','+blue+','+opacityCntrl.value+')';
		
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
		profile.personalization.rgba = 'rgba('+redCntrl.value+','+green+','+blue+','+trans+')';
		
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
		profile.personalization.rgba = 'rgba('+red+','+greenCntrl.value+','+blue+','+trans+')';
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
		profile.personalization.rgba = 'rgba('+red+','+green+','+blueCntrl.value+','+trans+')';
		for(ele in sections){
			if(sections[ele].style){
				sections[ele].style.backgroundColor = 'rgba('+red+','+green+','+blueCntrl.value+','+trans+')';
			}
		}		
	});
	
	/*
		dynamic styling
	*/
	function resizeElemHeight(element) {
	  var height;
	  var body = window.document.body;
	  if (window.innerHeight) {
		  height = window.innerHeight;
	  } else if (body.parentElement.clientHeight) {
		  height = body.parentElement.clientHeight;
	  } else if (body && body.clientHeight) {
		  height = body.clientHeight;
	  }
	  element.style.height = (height - element.offsetTop - 15 + 'px');
	}

	window.onresize = resize 
	function resize(){
		//resizeElemHeight(document.getElementById('budgeter5000'));
		resizeElemHeight(document.getElementById('login-wrapper'));
	}
	resize();
	
	var buttons = document.getElementsByClassName('btn');
	for(b = 0; b < buttons.length; b++){
		if(buttons[b].style){
			buttons[b].addEventListener('mousedown', function(){
				this.style.boxShadow = 'none';	
				this.style.top = '2px';  //buttons[b] button has position set to relative
				this.style.left = '2px';
			});
			buttons[b].addEventListener('mouseup', function() {
				this.style.boxShadow = '1px 2px 0 0 black';
				this.style.top = '0';
				this.style.left = '0';
			});
		}
	}
	/*
		make square buttons
	*/
	var addRect = document.getElementById('addSubBtn').getBoundingClientRect();
	document.getElementById('addSubBtn').style.width = addRect.height + 'px';
	var subRect = document.getElementById('subSubBtn').getBoundingClientRect();	
	document.getElementById('subSubBtn').style.width = subRect.height + 'px';
	
	function makeSquares(){
		var addRect = document.getElementById('addSubBtn').getBoundingClientRect();
		document.getElementById('addSubBtn').style.width = addRect.height + 'px';
		var subRect = document.getElementById('subSubBtn').getBoundingClientRect();	
		document.getElementById('subSubBtn').style.width = subRect.height + 'px';
		var closes = document.getElementsByClassName('close'); 
		
		for(s = 0; s < closes.length; s++){
			var rect = closes[s].getBoundingClientRect();
			closes[s].style.width = rect.height + 'px';
		}
	}
	makeSquares();

};