

//create somewhere to put the force directed graph
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var radius = 20;


var circleCol_var = "HSK Level"  //sex
var linkCol_var = "type" //type
var label_col = 'Chinese'

var node_data_file = "../chinese_revision.json"
var link_data_file = "../source_targets.json"

run_read(node_data_file,link_data_file, circleCol_var, linkCol_var,label_col)

function run_read(node_data_file,link_data_file,circleCol_var,linkCol_var,label_col) {
    //usage:
    readTextFile(node_data_file, function (text1) {
        var nodes_data = JSON.parse(text1);

        readTextFile(link_data_file, function (text2) {
            var links_data = JSON.parse(text2);

            // console.log(nodes_data)
            // console.log(links_data);


//set up the simulation and add forces
            var simulation = d3.forceSimulation()
                .nodes(nodes_data);

            var link_force = d3.forceLink(links_data)
                .id(function (d) {
                    return d.name;
                });

            var charge_force = d3.forceManyBody()
                .strength(-100);

            var center_force = d3.forceCenter(width / 2, height / 2);

            simulation
                .force("charge_force", charge_force)
                .force("center_force", center_force)
                .force("links", link_force)
            ;



//add tick instructions:
            simulation.on("tick", tickActions);

//add encompassing group for the zoom
            var g = svg.append("g")
                .attr("class", "everything");


//draw lines for the links
            var link = g.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links_data)
                .enter().append("line")
                .attr("stroke-width", 2)
                .style("stroke", linkColour);

//draw circles for the nodes
            var node = g.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes_data)
                .enter()

                //add circle shape below
                .append("circle")
                .attr("r", radius)
                .attr("fill", circleColour);


            // var labels = svg.append("g")
            //       .attr("class", "label")
            //     .selectAll("text")
            //     .data(nodes_data)
            //     .enter().append("text")
            //       .attr("dx", 12)
            //       .attr("dy", ".35em")
            //     .attr('text-anchor', 'middle')
            //    .style("font-size",12)
            //     .text(function(d) { return d[label_col] });
                // .call(d3.drag() //to call on any new element added to graph, so that zoom sets the correct coords again
                //     .on("start", dragstarted)
                //     .on("drag", dragged)
                //     .on("end", dragended));

                // .attr("z-index", 10);

              var labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(nodes_data)
      .enter().append("text")
      .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .style('font-size','20px')
            .text(function(d) { return d[label_col] });


            //add labels
            // var nodeLabels = svg.append("g")
            //     .attr("class", "labels")
            //     .selectAll("text")
            //    .data(nodes_data)
            //    .enter()
            //    .append("text")
            //     // .attr("x",d.x)
            //     // .attr("y",d.y)
            //
            //    .attr({"x":function(d){return d.x;},
            //           "y":function(d){return d.y;},
            //           "class":"nodeLabels",
            //           "stroke":"black"})
            //    .text(function(d){return d[label_col];});




//add drag capabilities
            var drag_handler = d3.drag()
                .on("start", drag_start)
                .on("drag", drag_drag)
                .on("end", drag_end);

            drag_handler(node);
            // drag_handler(labels);


//add zoom capabilities
            var zoom_handler = d3.zoom()
                .on("zoom", zoom_actions);

            zoom_handler(svg);


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

//Drag functions
//d is the node
function drag_start(d) {
 if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

//make sure you can't drag the circle outside the box
function drag_drag(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function drag_end(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//Zoom functions
function zoom_actions(){
    g.attr("transform", d3.event.transform)

}

function tickActions() {
    //update circle positions each tick of the simulation
       node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });


       //to create bounds
    //     node.attr("cx", function(d) {
    //   return d.x = Math.max(radius, Math.min(width - radius, d.x));
    // })
    //   .attr("cy", function(d) {
    //   return d.y = Math.max(radius, Math.min(height - radius, d.y));
    // });


       labels.attr("x", function(d) { return d.x; })
            .attr("y", function(d) { return d.y; });

       // labels.attr("cx", function(d) { return d.x; })
       //      .attr("cy", function(d) { return d.y; });

       // labels.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    //update link positions
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });



}


        });

    });



}
