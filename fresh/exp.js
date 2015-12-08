//NEXT STEPS
//SENTIMENT ASPECT
//RESIZABLE STUFF FOR THE SVG
//ZOOM IN ABILITY


var uniqB = [];
var buttonD = [];
var parseDate = d3.time.format('%X_%d-%m-%Y').parse;

var monthNameFormat = d3.time.format("%b");
var dayMonthFormat = d3.time.format("%e");
var hourFormat = d3.time.format("%H");
var minuteFormat = d3.time.format("%M");

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
var dataF = "ard925.txt";
var data_three = "ardData.txt";
var dataT = [];
var minDate, maxDate;

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
    .rangePoints([0, m[2]]);

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
var xG = d3.scale.ordinal()
    .domain(games)
    .rangePoints([xStart, xEnd]);

//set this up like the NYT
var svg = d3.select("body")
    .append("svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("class", "chart");
var xOffset = 167.14, // the xoffset for each day 
    yOffset = 200;//167.14; // the yoffset for each day



d3.csv(dataF, function(error, data) {
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
	// console.log(onlyArd+"not open/close");
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
            "timeIs": parseDate(data[i]['Timestamp']),
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
      dataT.push(uniqB[j].timeIs.getTime())
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
        // console.log(onlyArd[i]);
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

var days;
var enteringDay;
var insides;
var insideDay;
var dataRow = [];
function startTime(){
    // days is our element array of each radial/amoeba combination
  days = svg.selectAll(".day")
    .data(sessionCL); 

  dEntry = ardEntry.filter(function(d) { //NEED TO TAKE OUT UI START AND FINIDH
      return d.sF == "1" && d.mod!="UI"; //d.start < maxExtent && d.end > minExtent && 
  });
  var row = 0; 
  var interval = 5;
  var this_row = 0;
  var  opacityLine = .3, opacityCirc = .3;

  //what we are basically saying is:
  //for whatever day you are part of
  //place you in the row for that day
  //if that entry is the right time, then it is that row too...
  for (var j=0; j<sessionCL.length; j++){
    if(j % interval == 0 ){ //7 things a row would be a week 
      this_row++;
    }
  // }   
      for(var i=0; i<dEntry.length; i++){
      // for (var j=0; j<sessionCL.length; j++){
        if(dEntry[i].end==sessionCL[j] || (dEntry[i].end<=sessionCL[j]&&dEntry[i].end>=sessionOP[j])){
          dEntry[i].row = this_row;
        } else{}
      }
      for(var i=0; i<uniqB.length; i++){
        if(j>=0){
          if(uniqB[i].timeIs.getTime()<=sessionCL[j]&&uniqB[i].timeIs.getTime()>=sessionCL[j-1]){
            uniqB[i].row = this_row;
            dataRow.push(this_row);
          } else{}
        } 
      }
  }
  // prepSVG();


  enteringDay = days.enter()
    .append('g')
    .classed('day', true)
    .attr("transform", function(d,i){
      if( i % interval == 0 ){ //7 things a row would be a week 
        row++; 
      }
      return "translate(" + (( i % interval + 1 ) * xOffset - .5 * xOffset) + ", "+(row * yOffset - .5 * yOffset)+")";
    });
  enteringDay.append('text')
    .text(function(d){ 
      var thisDate = new Date(d);
    	return monthNameFormat(thisDate)+dayMonthFormat(thisDate)+" "+hourFormat(thisDate)+":"+minuteFormat(thisDate);
    })
    .attr('x', 22)
    .attr('y', -radiusMin*2)
    .attr('text-anchor','middle')
    .style('font-size','10px');

  enteringDay
    .selectAll(".lineOut")
    .data(moduleTypes)
    .enter()
    .append("line")
    .classed("lineOut",true)
    .attr("x1", xStart)
    .attr("x2", xEnd)
    .attr("y1", function(d,i){
      return y(d);
    })
    .attr("y2", function(d,i){
      return y(d);
    })
    .attr("stroke",function(){
      return "grey"
    })
    .attr("opacity", opacityLine)
    .attr("stroke-width", .2);



  // enteringDay
  //   .selectAll(".lineEFB")
  //   .data(uniqB)
  //   .enter()
  //   .append("")
  //       if(j>=0){
  //         if(uniqB[i].timeIs.getTime()<=sessionCL[j]&&uniqB[i].timeIs.getTime()>=sessionCL[j-1]){
  //           // console.log(uniqB[i].timeIs.getTime()+"WHO")
  //           uniqB[i].row = this_row;
  //         } else{}






//if the data is in a specific range of date
//it goes in that area of the page that is the same as where the session UI is
//so if the end date is same as session UI time
//then it should go in that area
//maybe for the softwware connection that should just be a filled in square if it has been established in software
  insides = svg.selectAll(".inside")
    .data(dEntry); 

  insideDay = insides.enter()
    .append('g')
    .classed('inside', true)
    .attr("transform",function(d,i){
      for (var j=0; j<sessionCL.length; j++){
          if(d.end==sessionCL[j] || (d.end<=sessionCL[j]&&d.end>=sessionOP[j])){
              return "translate(" + (( j % interval + 1 ) * xOffset - .5 * xOffset) + ", "+(d.row * yOffset - .5 * yOffset)+")";
          }
          else{
          }
        }
    });

  insideDay.append('circle')
    .attr("class",function(d){
      return d.end+"end"+d.from+"from"+d.row;
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
      for(j=0; j<outputs.length; j++){
          if(d.from==outputs[j]){
          return xO(d.from);
          }
      }
      for(j=0; j<games.length; j++){
          if(d.from==games[j]){
          return xG(d.from);
          }
      }
    })
    .attr("cy",function(d){
      // console.log(d.mod)
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
	// mItems = ardEntry.filter(function(d) {
	//     return d.start < maxExtent && d.end > minExtent && d.sF == "1" && d.mod == "M";
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
  minDate = d3.min(dataT);
  maxDate = d3.max(dataT);
  minTotal = d3.min(dataL);
  maxTotal = d3.max(dataL);
  // doPath();
}







//continuous line below the boxes of the days



var xPath, yPath, minTotal, maxTotal, path, index, line, svgPath;
function prepSVG(){
  index = 0;
  var mini = 4;
  xPath = d3.scale.linear()
      .range([xOffset/2, w]);
  yPath = d3.scale.linear()
      .range([yOffset/mini, 0]);
  line = d3.svg.line()
      .x(function(d, i) { return xPath(d.timeIs); })
      .y(function(d, i) { return yPath(d.total); })
      .interpolate("linear");

      // .attr("width", w)
      // .attr("height", yOffset/mini)
  path = svg.append("g")
    // .attr("clip-path", "url(#clip)")
    .append("path")
    .attr("class","path")
  // svgPath.append("g")
  //     .attr("class", "x axis")
  //     .call(d3.svg.axis().scale(xPath).ticks(d3.time.minute,15).orient("bottom"));
  // svgPath.append("g")
  //     .attr("class", "y axis")
  //     .call(d3.svg.axis().scale(yPath).orient("left"));  
}
function doPath(){
  xPath.domain([minDate, maxDate]) //should be related to time
  yPath.domain([minTotal, maxTotal])
  // if(uniqB[0].row>=0){
  	path
  		.datum(uniqB)
      .attr("transform", function(d,i){
        console.log(d[i].row)
      // return "translate(0," + h/mini + ")";
      //(d.row * yOffset - .5 * yOffset)
        return "translate(" + 0 + ", "+(d[i].row*yOffset-yOffset/2)+")";
      })
  		.attr("d", line);
  // }
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
