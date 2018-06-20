// index.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from 'd3';
import 'bootstrap';
import './scss/app.scss';
import { makeGrid, makeTable,startTraining } from './events';

// Main Definition 
function main(){
  var titanicData = null;

  // Setup Event Listeners 
  d3.select("#tableViewBttn").on("click",()=>makeTable(titanicData));
  d3.select("#gridViewBttn").on("click",()=>makeGrid(titanicData));
  d3.select("#startBttn").on("click",()=>startTraining(titanicData));
  

  d3.dsv(",", "data/titanicData.csv", function(d) { 
    return {d}
  }).then(function(data) { 
    titanicData = data;
    makeTable(data); 
  });
}

// Init Application
main();



