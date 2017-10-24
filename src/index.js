// CS235 User Interface Design Assignment 4 -D3 Force directed Bubble Chart
//This bubble chart shows the value of emissions in different countries
//The size of the bubbles represents the value of emissions
//The colors represent different countries
//It has a mouseover and click functionalties
//The information about the bubble appears on mouseover, and the country's flag upon clicking
//Author : Rashmeet Kaur Khanuja

var style = require('./style.css');
var d3   = require('d3');
var data = require('./emissions.csv');
//console.log(data);

//Hardcoded width and height of the canvas
var width = 800;
var height = 570;

//Set up the canvas
var canvas = d3.select("body").append("svg")
                              .attr("width", width)
                              .attr("height", height)
                              .append("g")
                                    .attr("transform", "translate(50,50)");


//Create a packing for the bubbles
var pack = d3.pack()
            .size(width, height-50)
            .padding(10)

//Select a root node
var root = d3.hierarchy(data)
              .sum(function(d) { return d.responseCount; });


//Add the circles as the descendants of the root
var node = canvas.selectAll(".node")
                  .data(pack(root).descendants())
                  .enter()
                  .append("g")
                      .attr("class", "node")

node.append("circles");

//Link the <defs> tage in the html file to d3
//in order to attach images to the bubbles
var defs = canvas.append("defs");


//Simulation is a collection of forces
//about where we want our circles(bubbles) to go
//and how we want our circles to interact
var simulation = d3.forceSimulation()
                    .force("x",d3.forceX(width/4).strength(0.05))
                    .force("y", d3.forceY(height/3).strength(0.05))
                    .force("collide", d3.forceCollide(function(d) {return d.Emission*2 + 20;}))


//Create the circles linking the data such that
//the radius os each circle is a function of
//the emission values for different countries
var circles = canvas.selectAll(".emission")
                      .data(data)
                      .enter()
                      .append("circle")
                          .attr("class", "emission")
                          .attr("r", function(d){return d.Emission*3 + 10;})
                          .attr("opacity", "0.7")
                          .attr("stroke", "maroon")
                          .attr("stroke-width","2")
                          .style("fill", function(d){
                            if (d.Country == "Afghanistan"){return "green";}
                            if (d.Country == "Australia"){return "gold";}
                            if (d.Country == "Switzerland"){return "orangeRed";}
                            if (d.Country == "Algeria"){return "pink";}
                            if (d.Country == "India"){return "blue";}
                            if (d.Country == "Iraq"){return "purple";}
                            if (d.Country == "Syria"){return "aqua";}
                            if (d.Country == "Thailand"){return "lime";}
                            if (d.Country == "United States"){return "red";}
                            if (d.Country == "Vietnam"){return "brown";}
                          })
                          .on("click", function(d){
                            d3.select(this)
                            .style("fill", function(d){
                              return "url(#" + d.id + ")"
                            })
                            .attr("opacity", "100%")})


 //Link the html button tag to sort on the basis of year
 var button = document.getElementById("sortButton");
  button.onclick = function (d){
   var dataset= data.sort(function(a,b){
      return d3.ascending(a.Year, b.Year)})
      console.log("Hello")
      console.log(dataset)
      circles.data(dataset)
              .attr("cx", dataset.x);
            }

//Link the html button tag to sort on the basis of emission values
var button1 = document.getElementById("sortButton1");
      button1.onclick = function (d){
       var dataset= data.sort(function(a,b){
          return a.Emission - b.Emission})
        console.log("Sorting by emission")
        console.log(dataset)
        circles.data(dataset);
       }


//Display information on mouse over
circles.append("title")
                .text(function(d){
                  return ("Emissions in " + d.Country + ": " + d.Emission + "\n Year: " + d.Year);
                })

//Link the country-maps' images using unique ids that
//are used in the fill property of the circles
defs.selectAll("pattern")
      .data(data)
      .enter().append("pattern")
              .attr("id", function(d){
                return d.id;
              })
              .attr("height", "1")
              .attr("width", "1")
              .attr("patternContentUnits", "objectBoundingBox")
              .append("image")
                    .attr("height", 1)
                    .attr("width", 1)
                    .attr("preserveAspectRatio", "none")
                    .attr("xlink:href", function(d){
                          return d.imgsrc;
                    })


simulation.nodes(data)
          .on("tick", ticked)

//Assign the bubbles centre coords on each tick
function ticked(){
  circles
      .attr("cx", function(d){return d.x + 50;})
      .attr("cy", function(d){return d.y;})

}
