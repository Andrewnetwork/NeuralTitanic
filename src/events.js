// callbacks.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from "d3";
import {trainModel} from './modeling';
import {gridMenu,tableMenu} from './ui';
import * as tf from '@tensorflow/tfjs';

export function makeGrid(data){
    gridMenu(data);

    d3.select("#dat").selectAll("*").remove();
    var container = d3.select("#dat").append("div");
    
    container.selectAll("div").data(data).enter()
    .append("div").attr("class","gridCell")
    .text(function (d){return Object.values(d.d)[0];});
}

export function makeTable(data){
    tableMenu();

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
    trainModel(data);
}