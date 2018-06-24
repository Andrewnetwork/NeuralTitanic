// modeling.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as tf from '@tensorflow/tfjs';
import {titanicPreprocess} from './preprocessing';
import {updatePredictions,plotLoss,initPlot,createTrainBttn} from './ui';
import * as d3 from "d3";
import * as _ from "lodash";

export function createModel(actFn,nNeurons){
    const initStrat = "leCunNormal";
    const model = tf.sequential();
    model.add(tf.layers.dense({units:nNeurons,activation:actFn,kernelInitializer:initStrat,inputShape:[12]}));
    model.add(tf.layers.dense({units:1,activation:"sigmoid",kernelInitializer:initStrat}));
    model.compile({optimizer: "adam", loss: tf.losses.logLoss});
    return model;
}

export async function trainModel(data,trainState){
    // Disable Form Inputs 
    d3.select("#modelParameters").selectAll(".form-control").attr('disabled', 'disabled');
    d3.select("#tableControls").selectAll(".form-control").attr('disabled', 'disabled');

    // Create Model
    const model = createModel(d3.select("#activationFunction").property("value"),
                              parseInt(d3.select("#nNeurons").property("value")));

    // Preprocess Data
    const cleanedData = titanicPreprocess(data);
    const X = cleanedData[0];
    const y = cleanedData[1];

    // Train Model
    const lossValues = [];
    var lastBatchLoss = null;

    // Get Hyperparameter Settings
    const epochs    = d3.select("#epochs").property("value");
    const batchSize = d3.select("#batchSize").property("value")
    
    // Init training curve plotting. 
    initPlot();

    for(let epoch = 0; epoch < epochs && trainState.s; epoch++ ){
        try{
            var i = 0;
            while(trainState.s){
                // Select Batch
                const [xs,ys] = tf.tidy(() => {
                    const xs = tf.tensor(X.slice(i*batchSize,(i+1)*batchSize))
                    const ys = tf.tensor(y.slice(i*batchSize,(i+1)*batchSize))
                    return [xs,ys];
                });

                const history = await model.fit(xs, ys, {batchSize: batchSize, epochs: 1});
                lastBatchLoss = history.history.loss[0];

                tf.dispose([xs, ys]);
                await tf.nextFrame();
                i++;
            }
        }catch(err){
            // End of epoch. 
            console.log("Epoch "+epoch+"/"+epochs+" ended.");
            const xs = tf.tensor(X);
            const pred = model.predict(xs).dataSync();
            updatePredictions(pred);

            const accuracy = _.sum(_.map(_.zip(pred,y),(x)=> (Math.round(x[0]) == x[1]) ? 1 : 0))/pred.length;

            lossValues.push(lastBatchLoss);
            plotLoss(lossValues,accuracy);

        }
    }
    trainState.s = true;
    createTrainBttn("train",data);
    console.log("End Training");

    // Enable Form Controls
    d3.select("#modelParameters").selectAll(".form-control").attr('disabled', null);
    d3.select("#tableControls").selectAll(".form-control").attr('disabled', null);

}
