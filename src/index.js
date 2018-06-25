// index.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from 'd3';
import 'bootstrap';
import './scss/app.scss';
import {createTrainBttn,makeTable,createSortByMenu,attachChangeParameterHandler} from './ui';
import {startTraining} from './events';

// Main Definition 
function main(){

  d3.dsv(",", "data/titanicData.csv", function(d) { 
    return {d}
  }).then(function(data) { 
    createTrainBttn("train",data);
    createSortByMenu(data);
    startTraining(data);
    makeTable(data); 
    attachChangeParameterHandler();
  });
}

// Init Application
main();



