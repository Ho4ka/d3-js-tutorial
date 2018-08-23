
// draw a grid


function gridData() {
    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var width = 18;
    var height = 18;


    // iterate for rows
    for (var row = 0; row < 76; row++) {
        data.push( new Array() );

        // iterate for cells/columns inside rows
        for (var column = 0; column < 104; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,

            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
    }
    return data;
}

var gridData = gridData();


var grid = d3.select("#grid")
    .append("svg")
    .attr('id','svg')
    .attr("width","100%")
    .attr("height","510px");

var row = grid.selectAll(".row")
    .data(gridData)
    .enter().append("g")
    .attr("class", "row");

var column = row.selectAll(".square")
    .data(function(d) { return d; })
    .enter().append("rect")
    .attr("class","square")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.width; })
    .attr("height", function(d) { return d.height; })
    .style("fill", "#fff")
    .style("stroke", "silver")



// end of grid

let w = 200,
    h = 100;

   let nodes = [
        {name: 'Comp-1', x: 10, y: 20 },
        {name: 'Comp-2', x: 150 , y: 150},
        {name: 'Comp-3', x: 279, y: 280 },
        {name: 'Comp-4', x: 460, y: 390 },
        {name: 'Comp-5', x: 690, y: 420 }

    ];
        // .map(function(d, i){return (d.fixed = (i !== 5), d)});


console.log(nodes.map(function(d, i){return (d.fixed = (i !== 5), d)}));

let links = [
    { source: 0, target: 1 },
    { source: 1, target: 2},
    { source: 2, target: 3},
    { source: 3, target: 4},

];

let svg  = d3.select('#svg');

let markerW = 9, markerH = 6,
    marker = svg.append('marker')
        .attr('id',"triangle")
        .attr('viewBox',"-5 -5 10 10")
        .attr('refX',"0")
        .attr('refY',0)
        .attr('markerUnits','strokeWidth')
        .attr('markerWidth',markerW)
        .attr('markerHeight',markerH)
        .attr('orient','auto')

let path = marker.append('path')
    .attr('d',"M 0,0 m -5,-5 L 5,0 L -5,5 Z")



let force = d3.layout.force()
    // .size([width, height])
    .nodes(nodes)
    .links(links)

    .linkDistance(w)
    .on("tick", function(e){
        //hack to force IE to do it's job!
        link.each(function() {this.parentNode.insertBefore(this, this); });

        link.attr("d", linkPath);
        node.attr("transform", function (d) {
            return "translate(" + d.q.x + "," + d.q.y + ")";
        })
    });
force.nodes().forEach(function(d) {
    d.q = {};
    Object.keys(d).forEach(function (p) {
        if (!isNaN(d[p])) Object.defineProperty(d.q, p, {
            get: function () {
                return Math.round(d[p])
            }
        });
    })
});

    let connector = d3.svg.line().interpolate("basic")
        .x(function(d){return Math.round(d[0])})
        .y(function(d){return Math.round(d[1])});
    function linkPath(d){
        return connector([[d.source.x + w/2, d.source.y + h/2],
            [d.source.x + w/2, d.target.y + h/2],
            [d.target.x  - markerW , d.target.y + h/2]]);
    }

let link = svg.selectAll('.link')
    .data(links)
    .enter().append('path')
    .attr("stroke-width", "2")
    .attr('marker-end','url(#triangle)')
    .attr('stroke','black')
    .attr("fill", "none");

let defs = svg.append("defs");


let node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    // .attr("transform", function(d){
    //     return "translate("+ d.q.x+","+ d.q.y+")";
    // })
    .call(force.drag);

node.append("rect").attr("class", "nodeRect")
    .attr("rx", 3)
    .attr("ry", 3)
    .transition(1000)
    .duration(1000)
    .attr("transform", "translate(" + 0 + "," + 0 + ")")
    .attr('width','200')
    .attr('height','100')
    .attr('fill', "#BCD8CD")
    .attr('stroke','white')
    .attr('stroke-width','2')
    .style("filter", "url(#drop-shadow)");


node.append("text").style("text-anchor", "middle")
    .style("pointer-events", "none")
    .style("font-weight", 900)
    .attr("fill", "black")
    .style("stroke-width", "0.2px")
    .style("font-size", 16 + "px")
    .attr("y", function (d){return h/2+6;})
    .attr("x", function (d){return w/2;})
    .text(function (d) {return d.name;});

force.start();

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
let filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
let feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

d3.json("https://api.myjson.com/bins/135j8g", function(error, data) {


    let components = data.components;


});


var line = svg.append("line")
    .style("stroke", "black")
    .attr("x1", 150)
    .attr("y1", 100)
    .attr("x2", 250)
    .attr("y2", 300);