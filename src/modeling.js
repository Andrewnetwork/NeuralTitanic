// modeling.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as tf from '@tensorflow/tfjs';
import {titanicPreprocess} from './preprocessing';
import {updatePredictions} from './ui';

const BATCH_SIZE = 64;
const EPOCHS = 100;

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

    for(let epoch = 0; epoch < EPOCHS; epoch++ ){
        try{
            var i = 0;
            while(true){
                // Select Batch
                const [xs,ys] = tf.tidy(() => {
                    const xs = tf.tensor(X.slice(i*BATCH_SIZE,(i+1)*BATCH_SIZE))
                    const ys = tf.tensor(y.slice(i*BATCH_SIZE,(i+1)*BATCH_SIZE))
                    return [xs,ys];
                });

                const history = await model.fit(xs, ys, {batchSize: BATCH_SIZE, epochs: 1});

                const loss = history.history.loss[0];
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
            const xs = tf.tensor(X);
            updatePredictions(model.predict(xs).dataSync());
        }
    }
}
