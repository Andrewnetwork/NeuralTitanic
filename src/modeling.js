// modeling.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as tf from '@tensorflow/tfjs';

export function createModel(){
    const model = tf.sequential();
    model.add(tf.layers.dense({units:20,inputShape:[12]}));
    model.add(tf.layers.dense({units:20,activation:"sigmoid"}));
    model.add(tf.layers.dense({units:20,activation:"sigmoid"}));
    model.add(tf.layers.dense({units:1,activation:"sigmoid"}));
    model.compile({optimizer: "adam", loss: tf.losses.logLoss});

    return model;
}

