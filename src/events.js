// callbacks.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from "d3";
import {trainModel} from './modeling';
import * as tf from '@tensorflow/tfjs';

// Event State
var isTraining = false;
export function isTrainingM(v){
    if(v==null){
        return v;
    }else{
        isTraining = v;
    }
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


export function startTraining(data){
    if(!isTraining){
        console.log("Training Begin");
        isTrainingM(true);
        trainModel(data);
    }else{
        console.log("Already Training");
        
    }
}