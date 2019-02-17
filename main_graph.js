// see also
// http://jsfiddle.net/JSDavi/qvco2Ljy
// http://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
// http://bl.ocks.org/mbostock/950642
// http://fontawesome.io/cheatsheet/
// https://jsfiddle.net/t4vzg650/6/ collapse example
// http://stackoverflow.com/questions/8986702/d3-js-is-it-possible-to-animate-between-a-force-directed-graph-and-a-node-link
// Lars Kotthoff
// https://www.airpair.com/javascript/posts/d3-force-layout-internals
// bounded force layout
// http://blockbuilder.org/FrissAnalytics/a7c3f6b1b99eb44563b590694fd6e90e



test_interval_seconds = 2;

var time_col = "Date Revised"
var label_col = "Chinese"

var linkCol_var = "Type"

var circleCol_var = "Category"
var tooltip_col1 = "Pinyin"
var tooltip_col2 = "Meaning"

var filter_col = "Category"

var source_var = "source"
var target_var = "target"

var link_fill = d3.scaleOrdinal(d3.schemeCategory20)
var circle_fill = d3.scaleOrdinal(d3.schemeCategory20)

// chart dimensions
var width  = 1500, height = 800, radius = 390;
var nodeWidth = 80;


//ensure filter_col is defined above
function populateFilters(data){
  var uniqueFilters = new Set();
  data.nodes.forEach(function(l) {
    //console.log(l);
    //console.log(l[filter_col]);
    catFound = l[filter_col];
    if (!!catFound){
      uniqueFilters.add(catFound);
    }
    
  })
  uniqueFilters = Array.from(uniqueFilters);
  uniqueFilters.forEach(function(s){
    //console.log(s);
    var btn = document.createElement("BUTTON");
    btn.value = s;
    btn.id = s;
    btn.text = s;
    btn.innerHTML = "Filter by " + s;
    btn.classList.add("filter-btn");
    btn.type = "button";
    document.getElementById("filterSection").appendChild(btn);
  })

  //find filter section

  //append new buttons to it
  
  

}


// set up svg
var svg = d3.select("#mainContainer")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
  }))
  .append("g");

var forceLink = d3.forceLink().id(function(d) { return d.name; });

var simulation = d3.forceSimulation()
    .force("collide", d3.forceCollide((nodeWidth + 2) / 2))
    .force("link", d3.forceLink().id(function(d) { return d.name; }))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2));


d3.json("data.json", function(error, graph) {
  //console.log(graph);
  var link = svg.append("g")
                .style("stroke", "#aaa")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .style("stroke", link_fill);

  var node = svg.append("g")
            .attr("class", "nodes")
  .selectAll("circle")
            .data(graph.nodes)
    .enter().append("circle")
    
      .attr("r", function(d){return +5})
      .attr("fill", circle_fill)

      //custom attributes for labels
      .attr("filter-col", function (d) { return d[filter_col];})
      .attr('search_id', function (d) {return d[label_col];})
      .attr('time', function (d) {return d[time_col];})
      .attr('id', function (d) {return "n" + d['id'];})
      .style("stroke", function(d){return circle_fill})
      .style("stroke-width", "8px")
      .style("display","block")
  .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));


  var label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .attr('text-anchor', 'middle')
      .attr("class","text-label")
        .attr('dominant-baseline', 'central')

        //custom attributes for labels
        .attr("filter-col", function (d) { return d[filter_col];})
        .attr('search_id', function (d) {return d[label_col];})
        .style('font-size','30px')
        .style("display","block")
        .text(function (d) {return d[label_col];})
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

      
  // tooltip div:
  const tooltip = d3.select('#mainContainer').append("div")
  									.classed("tooltip", true)
  									.style("opacity", 0) // start invisible
  label
  	.on("mouseover", function(d) {
    	tooltip.transition()
    		.duration(100)
    		.style("opacity", 1) // show the tooltip
    	tooltip.html(d[tooltip_col1] + "\n\n >>> " + d[tooltip_col2])
      	.style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth - 5) + "px")
        .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
    })
    .on("mouseleave", function(d) {
    	tooltip.transition()
    		.duration(300)
    		.style("opacity", 0)
    })


  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

//	data stores
var graph_2,store;
if (error) throw error;

	var nodeByID = {};

	graph.nodes.forEach(function(n) {
		nodeByID[n[label_col]] = n;
	});
	// console.log(nodeByID);

	graph.links.forEach(function(l) {
        try {
        // console.log(l[source_var]);
        // console.log(l[target_var]);
        l.sourceGroup = nodeByID[l[source_var]][filter_col].toString();
        l.targetGroup = nodeByID[l[target_var]][filter_col].toString();
    } catch(err) {
        l.sourceGroup = "";
        l.targetGroup = "";

    }

	});

graph_2 = graph;
store = $.extend(true, {}, graph);
populateFilters(graph);
//	svg selection and sizing
// var svg = d3.select("svg"),
//     width = +svg.attr("width"),
//     height = +svg.attr("height"),
//     radius = 10;

//	d3 color scales
var color = d3.scaleOrdinal(d3.schemeCategory20);

link = svg.selectAll(".link"),
node = svg.selectAll(".node");
//
// //	force simulation initialization
// var simulation = d3.forceSimulation()
// 	.force("link", d3.forceLink()
// 		.id(function(d) { return d.id; }))
// 	.force("charge", d3.forceManyBody()
// 		.strength(function(d) { return -500;}))
// 	.force("center", d3.forceCenter(width / 2, height / 2));




//	filtered types
typeFilterList = [];


//filter button click logic
//	filter button event handlers
$(".filter-btn").on("click", function() {

if ($(this).innerHTML == "Clear Filters"){
  typeFilterList = [];
}

	var id = $(this).attr("id");
	if (typeFilterList.includes(id)) {
		typeFilterList.splice(typeFilterList.indexOf(id), 1)
	} else {
		typeFilterList.push(id.toString());
	}
	console.log(id + " filter button selected");
  console.log(typeFilterList);
	filter();
	//update();
});



$(".randomized-test").on("click", function() {

  randomized_test(test_interval_seconds);
});

//	data read and store
// d3.json("../data.json", function(err, g) {


	
// });

//	general update pattern for updating the graph
function update()  {
	//	UPDATE
	node = node.data(graph_2.nodes, function(d) { return d.id;});
	//	EXIT
	node.exit().remove();
	//	ENTER
	var newNode = node.enter().append("circle")
		.attr("class", "node")
		// .attr("r", radius)
		.attr("fill", function(d) {return color(d[filter_col]);})
		.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
        )

    console.log(filter_col);
    newNode.append("title")
      .text(function(d) { return "group: " + d[filter_col] + "\n" + "id: " + d.id; });
	//	ENTER + UPDATE
	node = node.merge(newNode);

	//	UPDATE
	link = link.data(graph_2.links, function(d) { return d.id;});
	//	EXIT
	link.exit().remove();
	//	ENTER
	newLink = link.enter().append("line")
		.attr("class", "link")
    .attr('stroke','black') // add this line
    .attr("stroke-width", 2); 

	newLink.append("title")
      .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target; });
	//	ENTER + UPDATE
  console.log(link);
	link = link.merge(newLink);

	//	update simulation nodes, links, and alpha
	simulation
		.nodes(graph_2.nodes)
		.on("tick", ticked);

  	simulation.force("link")
  		.links(graph_2.links);

  	simulation.alpha(1).alphaTarget(0).restart();
}

//	filter function
function filter() {
  if (typeFilterList.length < 1)
    $('.text-label').show();
  else
    $('.text-label').hide();  

  for (var k in typeFilterList){
    v = typeFilterList[k];
    search = 'text[filter-col="' + v + '"]';
    $(search).show();
    }

  }


//randomized_test function
//hides all text first,then gradually shows nodes and/or texts in a flashcard manner

function randomized_test(seconds){
  var all_text_labels = $('.text-label');
  all_text_labels.hide();

  var newNum = 0;
  var bucket = [];

  for (var i=0;i<=all_text_labels.length;i++) {
      bucket.push(i);
  }


  function getRandomFromBucket() {
   var randomIndex = Math.floor(Math.random()*bucket.length);
   return bucket.splice(randomIndex, 1)[0];
}
  

  

  

  function myCallback() {
   // Your code here
   newNum = getRandomFromBucket()
    all_text_labels[newNum].style.display = "block";

  }

  var intervalID = window.setInterval(myCallback, seconds*1000);


}



  function ticked() {

    //update link positions
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });


    // update label positions
    label
        .attr("x", function(d) { return d.x; })
        .attr("y", function (d) { return d.y; })

    //node
    node
    .attr("x", function(d) { return d.x; })
    .attr("y", function (d) { return d.y; })
    // .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  }


  // when the input range changes update the circle
  d3.select("#id1").on("input", function() {
    var value = +this.value;
    d3.select("#id2").html(value);
  });

});




function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

/** Functions **/

//Function to choose what color circle we have
//Let's return blue for males and red for females
//todo: visualization config
function circleColour(d){
	if(d[circleCol_var] == "M"){
		return "blue";
	} else {
		return "pink";
	}
}

//Function to choose the line colour and thickness
//If the link type is "A" return green
//If the link type is "E" return red
function linkColour(d){
	if(d[linkCol_var] == "A"){
		return "green";
	} else {
		return "blue";
	}
}
