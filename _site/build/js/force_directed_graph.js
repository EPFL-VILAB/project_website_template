// d3 = this.d3;
// Based on http://bl.ocks.org/mbostock/4062045
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

var width = 960,
    height = 900;

//position scale
var labelwidth = 500,
labelheight = 13;

var color_by_scheme = $color_by_scheme ;    
var color = d3.scale.category20();
// var weightcolor = d3.interpolateRgb("white", "blue");
var weightcolor = d3.scale.linear()
    .domain([0, 0.5, 1])
    .range(["red", "white", "blue"]);

var affinitycolor = d3.scale.linear()
    .domain([0, 1])
    .range(["white", "green"]);

function color_by(type, node){
    if (type == 'group'){
        return color(node.group)
    }
    if (type == 'affinity'){
        return affinitycolor(node.nweight)
    }
    else {
        return weightcolor(node.nweight)
    }
}

function stroke_color(type, node){
    if (type == 'group'){
        return color(node.group)
    }
    if (type == 'affinity'){
        return affinitycolor(node.nweight + 0.3)
    }
    else {
        return weightcolor(node.nweight < 0.5 ? node.nweight - 0.3 : node.nweight + 0.3)
    }
}



var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(100)
    // .linkStrength(0.1)
    .size([width, height - 6 * labelheight]);

// force.linkStrength(function(link) {
//        return sigmoid( link.value - 1 );
//     });

d3.select("#maindiv").selectAll("svg").remove();
var svg = d3.select("#maindiv").append("svg")
    .attr("width", width)
    .attr("height", height);



svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
  .enter().append("svg:marker")    // This section adds in the arrows
  .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 16)
    .attr("refY", 0)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .attr('xoverflow','visible')
  .append("svg:path")
    .attr('fill', '#aaaaaa')
    .attr("d", "M0,-5L10,0L0,5");

//d3.json("miserables.json", function(error, graph) {
//  if (error) throw error;
var graph = $data ;

force
  .nodes(graph.nodes)
  .links(graph.links)
  .start();

var link = svg.selectAll(".link")
  .data(graph.links)
  .enter().append("line")
  .attr("class", "link")
  .attr('marker-end','url(#end)')
  .style("stroke-width", function(d) { return 3; })
  .style("stroke", function(d) {  return '#aaaaaa'; })
  .style("fill", function(d) { return '#aaaaaa'; });




// Create the groups under svg
var gnodes = svg.selectAll('g.gnode')
  .data(graph.nodes)
  .enter()
  .append('g')

  .classed('gnode', true);

// Add one circle in each group
var node = gnodes.append("circle")
  .attr("class", "node")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", function(d) { return d.r })
  .style("fill", function(d) { return color_by(d.color_by, d); })
  .style("stroke", function(d) { return stroke_color(d.color_by, d); })  
  .style("stroke-width", function(d) { return 1; })  
  .call(force.drag);


if (color_by_scheme != 'group'){
    var labels = gnodes.append("text")
    // .attr("class", "node")
    .attr("dx", -20)
    .text(function(d) { return d.name; })
    .attr("font-size", function(d) { return d.text_size; })
    .style("stroke", function(d) { return d3.rgb('white'); })    
    .style("stroke-width", function(d) { return 4; })  
    .attr("fill", function(d) { return d3.rgb('white'); })
}

// Append the labels to each group
var labels = gnodes.append("text")
  // .attr("class", "node")
  .attr("dx", -20)
  .text(function(d) { return d.name; })
  .attr("font-size", function(d) { return d.text_size; })
  .attr("fill", function(d) { return d3.rgb(color_by(d.color_by, d)).darker(2); });



force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    
    // // Translate the groups
    gnodes.attr("transform", function(d) { 
        return 'translate(' + [d.x, d.y] + ')'; 
    });    
});




/************************************************************
 *                       COLORBAR                           *
 ************************************************************/

if (color_by_scheme != 'group'){
    var colorbardata = [
        {offset: "0%", color: "red"},
        {offset: "50%", color: "white"},
        {offset: "100%", color: "blue"} ];
    

    var data = [{
        color: 'red',
        label: '0%'
        }, {
        color: 'white',
        label: '50%'
        }, {
        color: 'blue',
        label: '100%'
        }];
    
    if (color_by_scheme == 'affinity') {
        colorbardata = [
            {offset: "0%", color: "white"},
            {offset: "100%", color: "green"} ];

        var data = [{
            color: 'white',
            label: '0%'
            }, {
            color: 'green',
            label: '100%'
            }]
    }

    var colorbar2 = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradientMulti")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%")
        .selectAll("stop")
        .data(colorbardata)
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    var colorbar = svg.append("rect")
        .attr("x", (width - labelwidth) / 2).attr("y", height - 3 * labelheight)
        .attr("width", labelwidth).attr("height", labelheight)
        .style("fill", "url(#legendGradientMulti)");

    var g = svg.append('g')
        .selectAll('.label')  
        .data(data)
        .enter();

    g.append('text')
        .text(function(d){
        return d.label;
        })
        .attr("text-anchor", "middle")    
        .attr("font-size", "12.5px")    
        .attr("font-family", "calibri")    
        .attr('transform',function(d,i){
        return 'translate(' + (((width - labelwidth) / 2) + xPos(d, i) + 2) + ',' + ((height - 2 * labelheight) + 12) + ')';
        });

    function xPos(d, i){
        return ((labelwidth - 25) / (data.length - 1)) * i + 8;
    }

    
}


d3.select("#download")
.on("mouseover", writeDownloadLink);

function writeDownloadLink(){
    var html = d3.select("svg")
        .attr("title", "Taskonomy API")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    d3.select(this)
        .attr("href-lang", "image/svg+xml")
        .attr("href", "data:image/svg+xml;base64,\n" + btoa(html))
        // .on("mousedown", function(){
        //     if(event.button != 2){
        //         d3.select(this)
        //             .attr("href", null)
        //             .html("Right click and 'save as'");
        //     }
        // })
        // .on("mouseout", function(){
        //     d3.select(this)
        //         .html("Download");
        // });
};
