            // d3.csv("arsdb925", function(error, arData) {
var uniqB = [];
var buttonD = [];
var parseDate = d3.time.format('%X_%d-%m-%Y').parse;

var monthNameFormat = d3.time.format("%b");
var dayMonthFormat = d3.time.format("%e");

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
var sessionCL = [];
var sessionOP = [];

var ardEntry = [];
var datao = "tinyArd.txt";
var datat = "ardData.txt"
d3.csv(datao, function(error, data) {
	console.log(data.length+"ard")
    onlyArd = data.filter(function(d) {
        if (d.mod != "UI") {
            return d;
        }
    })
    for(i=0; i<data.length; i++){
        if (data[i]['sF'] == "CLOSED") {
            sessionCL.push(parseInt(data[i]['timestamp']));
        }
        if (data[i]['sF'] == "OPENED") {
            sessionOP.push(parseInt(data[i]['timestamp']));
        }
    }
	console.log(onlyArd+"not open/close");
	prepArduinoData(onlyArd, sessionCL)
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

function prepArduinoData(onlyArd, sessionCL){
	console.log(sessionCL)
	ardComplete = false;
    for (var i = 0; i < onlyArd.length-1; i++) {	
        var blah = [];
        console.log(onlyArd[i]);
      // if (typeof(onlyArd[i])=="object") {
	    if ((onlyArd[i + 1]['sF']) == "1") {
	        ardEntry.push({
	            "specialID": parseInt(onlyArd[i]['timestamp']) + (onlyArd[i]['id']),
	            "id": parseInt(onlyArd[i]['id']),
	            "mod": onlyArd[i]['mod'],
	            "start": parseInt(onlyArd[i]['timestamp']),
                "fk": sessionCL.filter(function(d) {
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
	    } else if ((onlyArd[i]['sF']) == "1") {
        // console.log()
	        ardEntry.push({
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



var m = [15, 20, 40, 120], //top right bottom left
    w = window.innerWidth - m[1] * 2 - m[3],
    h = window.innerHeight, //- m[3],//m[0] - m[2],
    miniHeight = 40, //laneLength * 12 + 50,
    mainHeight = h - miniHeight - 50;
var radiusMin = 5;
var spaceFactor = radiusMin;

var moduleTypes = ["B","CC","BM","M","L"];

var colorScale = d3.scale.ordinal()
    .domain(moduleTypes)
    .range(d3.scale.category20c().range());

var y = d3.scale.ordinal()
	 .domain(moduleTypes)
    .rangePoints([m[2], m[3]]);

var xStart = m[0];
var xEnd = m[0]*spaceFactor;
var xI = d3.scale.ordinal()
    .domain(inputs)
    .rangePoints([xStart, xEnd]);
var xO = d3.scale.ordinal()
    .domain(outputs)
    .rangePoints([xStart, xEnd]);
var xP = d3.scale.ordinal()
    .domain(programming)
    .rangePoints([xStart, xEnd]);

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
var insides;
var insideDay;

function startTime(){
    // days is our element array of each radial/amoeba combination
    days = svg.selectAll(".day")
      .data(sessionCL); 

    dEntry = ardEntry.filter(function(d) { //NEED TO TAKE OUT UI START AND FINIDH
        return d.sF == "1" && d.mod!="UI"; //d.start < maxExtent && d.end > minExtent && 
    });
    console.log(dEntry)

    insides = svg.selectAll(".inside")
      .data(dEntry); 
    
    var row = 0; 
    var row_two = 0; 

    var interval = 5;

    enteringDay = days.enter()
      .append('g')
      .classed('day', true)
      .attr("transform", function(d,i){
        console.log(i+"II")
        if( i % interval == 0 ){ //7 things a row would be a week 
          row++; 
        }
        console.log(row+"row")
        return "translate(" + (( i % interval + 1 ) * xOffset - .5 * xOffset) + ", "+(row * yOffset - .5 * yOffset)+")";
      });
    enteringDay.append('text')
      .text(function(d){ 
      	return monthNameFormat(new Date(d))+dayMonthFormat(new Date(d));
      })
      .attr('x', 0)
      .attr('y', -70)
      .attr('text-anchor','middle')
      .style('font-size','10px')

// enteringDay.append("line")


//if the data is in a specific range of date
//it goes in that area of the page that is the same as where the session UI is
//so if the end date is same as session UI time
//then it should go in that area
//maybe for the softwware connection that should just be a filled in square if it has been established in software
    insideDay = insides.enter()
      .append('g')
      .classed('inside', true)
      .attr("transform",function(d,i){
//!!!attention changed the offset
        for (j=0; j<sessionCL.length; j++){
            if(parseInt(d.end)==parseInt(sessionCL[j]) || (d.end<=sessionCL[j]&&d.end>=sessionOP[j])){
                return "translate(" + (( j % interval + 1 ) * xOffset/1.2 - .5 * xOffset) + ", "+(row * yOffset/2 - .5 * yOffset)+")";
            }
            else{
            }
          }
      });
opacityLine = .2;
opacityCirc = .6;

insideDay.selectAll(".lineOut")
  .data(moduleTypes)
  .enter()
  .append("line")
  .classed("lineOut",true)
      .attr("x1", function(d){
        console.log(d);
        return xStart;
      })
      .attr("x2", function(d){
        return xEnd;
      })
      .attr("y1", function(d){
        return y(d);
      })
      .attr("y2", function(d){
        return y(d);
      })
      .attr("stroke","grey")
      .attr("opacity", opacityLine)
      .attr("stroke-width", .2);

    insideDay.append('circle')
      .attr("class",function(d){
        return d.from;
      })
      .attr("opacity",opacityCirc)
      .attr("cx",function(d){
        for(j=0; j<programming.length; j++){
            if(d.from==programming[j]){
            return xP(d.from);
            }
        }
        for(j=0; j<inputs.length; j++){
            if(d.from==inputs[j]){
            return xI(d.from);
            }
        }
        for(k=0; k<outputs.length; k++){
            if(d.from==outputs[k]){
            return xO(d.from);
            }
        }
      })
      .attr("cy",function(d){
        console.log(d.mod)
        return y(d.mod);
      })
      .attr("r",function(d){
        //maybe something about how much time has been spent with it
        //d.end - d.start
        //timeRound(d.end - d.start)
        return radiusMin;
      })
      .attr("fill",function(d){
        return colorScale(d.mod);
      })


// thisOther.selectAll(".session")
// 	.data(ardEntry)
// 	.enter()
// 	.append("circle")
// 	.attr("class","session")
// 	.attr("cx",function(d){
// 		for(j=0; j<programming.length; j++){
// 		    if(d.from==programming[j]){
// 				return xP(d.from);
// 		    }
// 		}
// 		for(j=0; j<inputs.length; j++){
// 		    if(d.from==inputs[j]){
// 				return xI(d.from);
// 		    }
// 		}
// 		for(k=0; k<outputs.length; k++){
// 		    if(d.from==outputs[k]){
// 				return xO(d.from);
// 		    }
// 		}
// 	})
// 	.attr("cy",function(d){
// 		// console.log(d);
// 		return y(d.mod);
// 	})
// 	.attr("r",function(d){
// 		//maybe something about how much time has been spent with it
// 		//d.end - d.start
// 		//timeRound(d.end - d.start)
// 		return 20;

// 	})



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

	// var rectz;
 //    rectz = svg.selectAll(".rectIn")
 //    .data(d3.range(1)) //this will be if any occurrences of LED in session
 //    .attr("opacity", 1); //this will be how many any occurrences of LED in session
 //    rectz.enter().append("rect")
 //    .attr("class","rectIn")
 //    .attr("x", margin.left) //this will be multiplied by num sessions / floored
 //    .attr("y", margin.top) //this will be multiplied by num sessions / floored
 //    .attr("width",margin.left) //this will have to be smaller if we are fitting more in etc
 //    .attr("height",margin.left)
 //    .attr("fill","pink") //according to... ?
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
