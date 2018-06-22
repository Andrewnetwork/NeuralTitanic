// ui.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from "d3";
import * as _ from "lodash";

export function updatePredictions(predictions){
    function predToColor(pred){
        var color = "0,0,0";
        var alpha = 0.0;
        
        if(pred < 0.5){
            // More probable to die. 
            color = "255,0,0";
            alpha=(0.5-pred)*2;
        }else{
            // More probable to survive. 
            color = "0,255,0";
            alpha=(pred-0.5)*2;
        }

        return "rgba("+color+","+alpha+")";
    }
    const predColor = _.map(predictions,predToColor);
    d3.select("#dat").select("table").select("tbody")
    .selectAll("tr").data(predColor).style("background-color",(x)=>x);
}

var svg = d3.select("#trainingCurves").select("svg");
const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width  = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

export function initPlot(){
    d3.select("#trainingCurves").select("svg").selectAll("*").remove();

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .append("path");

    svg.append("text")
    .attr("x",(width/2)-110)
    .attr("y",height ).attr("fill","#377ff2")
    .style("font-size","20px");
}
export async function plotLoss(lossData,accuracy){
    // Modified from: https://bl.ocks.org/mbostock/3883245
    var g = svg.select("g");
    var lossText = svg.select("text");
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var x = d3.scaleLinear().rangeRound([0, width/lossData.length]);
    var data = _.zip(_.range(lossData.length),lossData);
    var line = d3.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

    g.select("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width",3)
        .attr("d", line);
    
    lossText.text("Loss: "+lossData[lossData.length-1].toFixed(3)+" | Accuracy: "+(accuracy*100).toFixed(2)+"%");

}