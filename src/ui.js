// ui.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018
import * as d3 from "d3";
import * as _ from "lodash";

function gridSelection(sel,cols,data){
    var selectedValue = sel[0].value;
    var columnIndex = cols.indexOf(selectedValue);
    var dataLS = _.map(data,(x)=>Object.values(x.d)[columnIndex]);
    dataLS.sort((a,b)=>a-b);

    d3.select("#dat").select("div").selectAll("div")
    .data(dataLS).text(function (d){return d;});
}

export function gridMenu(data){
    d3.select("#dataVisMenu").selectAll("*").remove();
    var cols = data.columns;

    d3.select("#dataVisMenu").append("select").on("change",(_a,_b,sel)=>gridSelection(sel,cols,data))
    .attr("class","from-control").selectAll("option").data(cols).enter().append("option")
    .text(function (d){return d});
}

export function tableMenu(){
    d3.select("#dataVisMenu").selectAll("*").remove();
}
