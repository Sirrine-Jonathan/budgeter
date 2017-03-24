/*GRAPH ALGORIGTHM*/

//get data

var falseData = {
	"months": {
		"Jan": {
			"income": 500,
			"expense": 300,
			"balance": 200
		},
		"Feb": {
			"income": 600,
			"expense": 100,
			"balance": 500
		},
		"Mar": undefined
	},
	"userData": {
		"username":'Enirrisky',
		"password":'123456'
	},
	"settings": {
		"background":'http://i.imgur.com/bgkdbSo.jpg'
	}
}

//if user has data for more than one month stored, start graph
window.onload = function(){
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
}
