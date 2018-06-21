// modeling.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as tf from '@tensorflow/tfjs';
import {titanicPreprocess} from './preprocessing';
import {updatePredictions,plotLoss} from './ui';
import {isTrainingM} from './events';
import * as d3 from "d3";

export function createModel(){
    const model = tf.sequential();
    model.add(tf.layers.dense({units:20,inputShape:[12]}));
    model.add(tf.layers.dense({units:20,activation:"sigmoid"}));
    model.add(tf.layers.dense({units:20,activation:"sigmoid"}));
    model.add(tf.layers.dense({units:1,activation:"sigmoid"}));
    model.compile({optimizer: "adam", loss: tf.losses.logLoss});

    return model;
}

export async function trainModel(data){
    // Create Model
    const model = createModel();

    // Preprocess Data
    const cleanedData = titanicPreprocess(data);
    const X = cleanedData[0];
    const y = cleanedData[1];
    // Train Model
    const lossValues = [];
    const accuracyValues = [];

    // Get Hyperparameter Settings
    const epochs    = d3.select("#epochs").property("value");
    const batchSize = d3.select("#batchSize").property("value");

    for(let epoch = 0; epoch < epochs; epoch++ ){
        try{
            var i = 0;
            while(true){
                // Select Batch
                const [xs,ys] = tf.tidy(() => {
                    const xs = tf.tensor(X.slice(i*batchSize,(i+1)*batchSize))
                    const ys = tf.tensor(y.slice(i*batchSize,(i+1)*batchSize))
                    return [xs,ys];
                });

                const history = await model.fit(xs, ys, {batchSize: batchSize, epochs: 1});

                lossValues.push(history.history.loss[0]);

                await plotLoss(lossValues);

                //const accuracy = history.history.acc[0];

                // Plot loss / accuracy.
                //lossValues.push({'batch': i, 'loss': loss, 'set': 'train'});
                //ui.plotLosses(lossValues);
                /*
                if (validationData != null) {
                    accuracyValues.push({'batch': i, 'accuracy': accuracy, 'set': 'train'});
                    ui.plotAccuracies(accuracyValues);
                }*/

                tf.dispose([xs, ys]);
                await tf.nextFrame();
                i++;
            }
        }catch(err){
            // End of epoch. 
            console.log("Epoch "+epoch+"/"+epochs+" ended.");
            const xs = tf.tensor(X);
            updatePredictions(model.predict(xs).dataSync());
        }
    }
    isTrainingM(false);
    console.log("End Training");
}
