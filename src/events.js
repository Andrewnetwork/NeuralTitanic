// callbacks.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as d3 from "d3";
import {trainModel} from './modeling';
import {createTrainBttn,makeTable,blankTrainingPlot} from './ui';
import * as tf from '@tensorflow/tfjs';

// Event State
var trainState = {s:true};

export function startTraining(data){
    trainModel(data,trainState);
    createTrainBttn("stop",data);
}

export function stopTraining(data){
    trainState.s = false;
    createTrainBttn("train",data);
}

export function changeSort(selection,data){
    blankTrainingPlot()
    var valueList = _.map(data,(x)=>x.d[selection]);
    var dataLS = _.zip(_.range(data.length),valueList);

    // TODO: more intelligent sorting. 
    if(selection == "sex"){
        dataLS.sort((a,b)=>a[1]<b[1]);
    }else{
        dataLS.sort((a,b)=>parseFloat(a[1])-parseFloat(b[1]));
    }
    
    var newDat = [];
    _.map(_.range(data.length),(x)=>newDat.push(data[dataLS[x][0]].d));
    _.map(_.range(data.length),(x)=>data[x].d = newDat[x]);
    makeTable(data);
    createTrainBttn("train",data);
}