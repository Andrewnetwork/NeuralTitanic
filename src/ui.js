// ui.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from "d3";
import * as _ from "lodash";
import { startTraining,stopTraining, changeSort} from './events';

var svg = d3.select("#trainingCurves").select("svg");
const margin = {top: 20, right: 20, bottom: 20, left: 20};
const width  = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

export function createTrainBttn(state,titanicData){
    d3.select("#trainBttnContainer").selectAll("*").remove();
  
    if(state == "train"){
        d3.select("#trainBttnContainer")
        .append("button")
        .attr("id","startBttn").attr("class","btn btn-success btn-lg")
        .on("click",()=>startTraining(titanicData)).text("Start Training");
    }else{
        d3.select("#trainBttnContainer")
        .append("button")
        .attr("id","startBttn").attr("class","btn btn-danger btn-lg")
        .on("click",()=>stopTraining(titanicData)).text("Stop Training");
    }
}

export function attachChangeParameterHandler(){
    d3.select("#modelParameters").selectAll(".form-control").on("change",()=>blankTrainingPlot());
}
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

export function makeTable(data){
    d3.select("#dat").selectAll("*").remove();

    // Create Table 
    var table = d3.select("#dat").append("table").attr("class","table");
  
    // Create Table Header
    table.append("thead").append("tr")
    .selectAll('th').data(data.columns).enter()
    .append("th").text(function (column) { return column; });
  
    // Populate Table
    table.append("tbody").selectAll("tr").data(data).enter().append("tr")
    .selectAll("td").data(function (d){return Object.values(d.d);}).enter().append("td")
    .text(function(d){return d}).exit();
}

export function createSortByMenu(data){
    var cols = data.columns;

    var divCont = d3.select("#tableControls").append("div").attr("class","form-group row")
    
    divCont.append("label").attr("class","col-sm-1 col-form-label").style("padding-left","0px")
    .attr("for","sortFilter").text("Sort By");

    // TODO: Replace list with cols.
    divCont.append("div").attr("class","col-sm-3").append("select").attr("id","sortFilter")
    .attr("class","form-control").on("change",(_a,_b,sel)=>changeSort(sel[0].value,data))
    .selectAll("option").data(["pclass","survived","sex","age","sibsp","parch","fare"]).enter().append("option")
    .text(function (d){return d});
}

export function blankTrainingPlot(){
    d3.select("#trainingCurves").select("svg").selectAll("*").remove();

    d3.select("#trainingCurves").select("svg").append("text")
    .style("font","bold 30px sans-serif").attr("x","48").attr("y","160")
    .attr("fill","rgba(57, 57, 121, 0.692)").text("Start Training");
}