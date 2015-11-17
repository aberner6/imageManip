            // d3.csv("arsdb925", function(error, arData) {
var uniqB = [];
var buttonD = [];
var parseDate = d3.time.format('%X_%d-%m-%Y').parse;
var uniqueComplete = false;
var ardComplete = false;

var total = 0;
var totalsArr = [];
var dataL = [];

var inputs = [];
var outputs = [];
var programming = [];
var games = [];
inputs.push("BTN","POT","TMP","ACR","COL","ROT","LDR")
outputs.push("LED","PEZ", "RGB")
programming.push("IF", "Interval", "Fade", "Swap", "Map", "Counter", "Trigger")
games.push("Note", "Random", "PONG", "SimonSays")

var onlyArd;
var sessionUI = [];
var ardEntry = [];
d3.csv("ardData.txt", function(error, data) {
	console.log(data.length+"ard")
    onlyArd = data.filter(function(d) {
        if (d.mod != "UI") {
            return d;
        }
    })
    for(i=0; i<data.length; i++){
        if (data[i]['sF'] == "CLOSED") {
            sessionUI.push(parseInt(data[i]['timestamp']));
        }
    }
	console.log(onlyArd+"not open/close");
	prepArduinoData(onlyArd, sessionUI)
})

d3.csv("buttonData.txt", function(error, data) {
	console.log(data.length+"button")
    for (var i = 0; i < data.length; i++) {
            if(data[i]['button']=="button1"){
            	total++;
	    		totalsArr.push(total);
	    	}
	    	if(data[i]['button']=="button2"){
	    		total--;
	    		console.log(total+" smaller")
	    		totalsArr.push(total);	    		
	    	}
        buttonD.push({
            "buttonType": (data[i]['button']),
            "time": parseDate(data[i]['Timestamp']),
            "photO": data[i]['overview'],
            "photS": data[i]['screenshot'],
            "total": totalsArr[i],
        })
    }
    uniqB = unique(buttonD);
	if(uniqueComplete && ardComplete){
		console.log(ardEntry.length+"arduino data complete")
		console.log(uniqB.length+"button data uniqued");
		console.log(uniqB[0].total+"button 1 yep");
		for (var j=0; j<uniqB.length; j++){
			dataL.push(uniqB[j].total);
		}
		startTime();
	}
})

function prepArduinoData(onlyArd, sessionUI){
	console.log(sessionUI)
	ardComplete = false;
    for (var i = 0; i < onlyArd.length-1; i++) {	
        var blah = [];
	    if ((onlyArd[i + 1]['sF']) == "1") {
	        ardEntry.push({
	            "specialID": parseInt(onlyArd[i]['timestamp']) + (onlyArd[i]['id']),
	            "id": parseInt(onlyArd[i]['id']),
	            "mod": onlyArd[i]['mod'],
	            "start": parseInt(onlyArd[i]['timestamp']),
                "fk": sessionUI.filter(function(d) {
                	// console.log(d);
                    if (d > parseInt(onlyArd[i]['timestamp'])) {
                        // console.log(d[0]);
                        blah.push(d);
                        return 0;
                    }
                }),
	            "end": blah[0],
	            "from": (onlyArd[i]['fromType']),
	            "sF": (onlyArd[i]['sF'])
	        })
	    } else {
	        ardEntry.push({
	        	// "sessionID": 
	            "specialID": parseInt(onlyArd[i]['timestamp']) + (onlyArd[i]['id']),
	            "id": parseInt(onlyArd[i]['id']),
	            "mod": onlyArd[i]['mod'],
	            "start": parseInt(onlyArd[i]['timestamp']),
	            "end": parseInt(onlyArd[i + 1]['timestamp']),
	            "from": (onlyArd[i]['fromType']),
	            "sF": (onlyArd[i]['sF'])
	        })
	    }
	}
		ardComplete = true;		
}


var margin = {top: 100, right: 20, bottom: 20, left: 40},
    w = 960 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom;

// var svg = d3.select("body").append("svg")
//     .attr("width", w + margin.left + margin.right)
//     .attr("height", h + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// function prepSVG(){
	// var index = 0;
	// var margin = {top: 100, right: 20, bottom: 20, left: 40},
	//     width = 960 - margin.left - margin.right,
	//     height = 500 - margin.top - margin.bottom;
	// var x = d3.scale.linear()
	//     .range([0, width]);
	// var y = d3.scale.linear()
	//     .range([height, 0]);
	// var line = d3.svg.line()
	//     .x(function(d, i) { return x(i); })
	//     .y(function(d, i) { return y(d); });
	// var svg = d3.select("body").append("svg")
	//     .attr("width", width + margin.left + margin.right)
	//     .attr("height", height + margin.top + margin.bottom)
	//   .append("g")
	//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// svg.append("defs").append("clipPath")
	//     .attr("id", "clip")
	//   .append("rect")
	//     .attr("width", width)
	//     .attr("height", height);
	// svg.append("g")
	//     .attr("class", "x axis")
	//     .attr("transform", "translate(0," + y(0)/2 + ")")
	//     .call(d3.svg.axis().scale(x).orient("bottom"));
	// svg.append("g")
	//     .attr("class", "y axis")
	//     .call(d3.svg.axis().scale(y).orient("left"));	
	// var path = svg.append("g")
	// 	.attr("clip-path", "url(#clip)")
	// 	.append("path")
// }



var m = [20, 15, 15, 120], //top right bottom left
    w = window.innerWidth - m[1] * 2 - m[3],
    h = window.innerHeight, //- m[3],//m[0] - m[2],
    miniHeight = 40, //laneLength * 12 + 50,
    mainHeight = h - miniHeight - 50;

var y = d3.scale.linear()
    .range([50, h / 2]);
var xIn = d3.scale.ordinal()
    .domain(inputs)
    .rangePoints([m[0], m[3]]);



//set this up like the NYT
// var chart = d3.select("body")
//     .append("svg")
//     .attr("width", w + m[1] + m[3])
//     .attr("height", h + m[0] + m[2])
//     .attr("class", "chart");
// chart.append("defs").append("clipPath")
//     .attr("id", "clip")
//     .append("rect")
//     .attr("width", w)
//     .attr("height", mainHeight);
// var main = chart.append("g")
//     .attr("transform", "translate(" + m[3] + "," + 10 + ")")
//     .attr("width", w)
//     .attr("height", mainHeight)
//     .attr("class", "main");    
// var softSpot = main.append("g")
//     .attr("clip-path", "url(#clip)");

var width = 1170, 
    height = 900;
var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var xOffset = 167.14, // the xoffset for each day 
    yOffset = 167.14; // the yoffset for each day

var days;
var enteringDay;

function startTime(){
    // days is our element array of each radial/amoeba combination
    days = svg.selectAll(".day")
      .data(sessionUI); 
    
    var row = 0; 
    enteringDay = days.enter()
      .append('g')
      .classed('day', true)
      .attr("transform", function(d,i){
      	var interval = 5;
        // X, Y offset for each day.
        if( i % interval == 0 ){ //7 things a row would be a week 
          row++; 
        }
        return "translate(" + (( i % interval + 1 ) * xOffset - .5 * xOffset) + ", "+(row * yOffset - .5 * yOffset)+")";
      })

    enteringDay.append('text')
      .text(function(d){ 
      	return "hey"
      	// moment(d.date_str).format('MMM DD, YYYY') 
      })
      .attr('x', 0)
      .attr('y', -70)
      .attr('text-anchor','middle')
      .style('font-size','10px')

    // each day <g> contains several <g> elements that contain all the articles for that section
    // enteringDay.selectAll('.section')
    //   .data(function(day){
    //     return  d3.nest()
    //               .key(function(d) { return d.section })
    //               .entries(day.articles);
    //   })
    //     .enter()
    //       .append('g')
    //         .selectAll('.article')
    //         .data(function(section){ return section.values })
    //         .enter()
    //           .append('line')
    //             .classed('article', true)
    //             .attr('x1',function(d){ return (Math.cos( thetaAxes[ d.date_str ]( d.date ) ) * dayRadii[d.date_str])  })
    //             .attr('y1',function(d){ return (Math.sin( thetaAxes[ d.date_str ]( d.date ) ) * dayRadii[d.date_str])  })
    //             .attr("stroke", function(d){ return !d.blog_post ? sectionColors[d.section].color : blogColor })
    //             .attr('x2',function(d){ return (Math.cos( thetaAxes[ d.date_str ]( d.date ) ) * (articleLengthScale( d.word_count) + dayRadii[d.date_str]))  })
    //             .attr('y2',function(d){ return (Math.sin( thetaAxes[ d.date_str ]( d.date ) ) * (articleLengthScale( d.word_count) + dayRadii[d.date_str]))  })


//eventually needs to be filtered by time
	var circs, rectz;
	// minExtent = brush.extent()[0],
	// maxExtent = brush.extent()[1],

	// visItems = uniqB.filter(function(d) {
	//     return d.timeIs < maxExtent && d.timeIs > minExtent;
	// });

	// bmItems = ardEntry.filter(function(d) {
	//     return d.start < maxExtent && d.end > minExtent && d.sF == "1" && d.mod == "BM";
	// });
	// ccItems = ardEntry.filter(function(d) {
	//     return d.start < maxExtent && d.sF == "1" && d.mod == "CC";
	// });
	// mItems = ardEntry.filter(function(d) {
	//     return d.start < maxExtent && d.end > minExtent && d.sF == "1" && d.mod == "M";
	// });
	// bItems = ardEntry.filter(function(d) {
	//     return d.start < maxExtent && d.end > minExtent && d.sF == "1" && d.mod == "B";
	// });




//set up the softspot svg
//set up the x1 placement
//set up the y placement (same always depending on that row...)
                //SOFTWARE MODULES
      //           var softRects;
      //           softRects = softSpot.selectAll(".brect")
      //               .data(bItems, function(d) {
      //                   return d.specialID;
      //               })
      //               .attr("x", function(d) {
      //                   return x1(d.start);
      //               })
      //               .attr("width", function(d, i) {
      //                   return x1(d.end) - x1(d.start);
      //               });
      //           softRects.enter().append("rect")
      //               .attr("class", "brect")
      //               .attr("x", function(d) {
      //                   return x1(d.start);
      //               })
      //               .attr("y", function(d, i) {
      //                   return yis(d.from);
      //               })
      //               .attr("width", function(d) {
      //                   return x1(d.end) - x1(d.start);
      //               })
      //               .attr("height", standardRect)
      //               .attr("fill", function(d,i) {
						// for(j=0; j<programming.length; j++){
						//     if(d.from==programming[j]){
						//         return "#907c64";
						//     }
						// }
						// for(j=0; j<inputs.length; j++){
						//     if(d.from==inputs[j]){
						//         return "#00A2AF"
						//     }
						// }
						// for(k=0; k<outputs.length; k++){
						//     if(d.from==outputs[k]){
						//         return "red"
						//     }
						// }
      //               })
      //               .attr("stroke", "none")
      //               .attr("opacity", .4)//opacity/5)
      //           softRects.exit().remove();







	//if it is button 2
	//total goes up
	//if it is button 1
	//total goes down
    // x.domain([0, index+1])
    var minTotal = d3.min(dataL);
    var maxTotal = d3.max(dataL);

	var rectz;
    rectz = svg.selectAll(".rectIn")
    .data(d3.range(1)) //this will be if any occurrences of LED in session
    .attr("opacity", 1); //this will be how many any occurrences of LED in session
    rectz.enter().append("rect")
    .attr("class","rectIn")
    .attr("x", margin.left) //this will be multiplied by num sessions / floored
    .attr("y", margin.top) //this will be multiplied by num sessions / floored
    .attr("width",margin.left) //this will have to be smaller if we are fitting more in etc
    .attr("height",margin.left)
    .attr("fill","pink") //according to... ?
}
function doPath(){
    x.domain([0, dataL.length-1])
    y.domain([minTotal, maxTotal])
	path
		.datum(dataL)
		.attr("class", "line")
		.attr("d", line);
		tick();	
}
function tick() {
	index++;
	x.domain([0, index+1])
  // push a new data point onto the back
  dataL.push(uniqB[index].total);
  // console.log(uniqB[index])
    // push a new data point onto the back
  // data.push(random());
  // redraw the line, and slide it to the left
  path
      .attr("d", line)
      .attr("transform", null)
    .transition()
      .duration(500)
      .ease("linear")
      .attr("transform", "translate(" + x(1) + ",0)")
      .each("end", tick);
  // pop the old data point off the front
  // dataL.shift();
}
function unique(obj) {
	uniqueComplete = false;
    var uniqB = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return a - b
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniqB.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniqueComplete = true;
    console.log(uniqueComplete)
    return uniqB;
}

// for(j=0; j<inputs.length; j++){
//     if(d.from==inputs[j]){
//         return "#00A2AF"
//     }
// }
// for(k=0; k<outputs.length; k++){
//     if(d.from==outputs[k]){
//         return "red"
//     }
// }
// for(j=0; j<programming.length; j++){
//     if(d.from==programming[j]){
//         return "#907c64";
//     }
// }
