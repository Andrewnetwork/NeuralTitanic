# Neural Titanic
This visualization uses [TensorFlow.js](https://js.tensorflow.org/) to train a neural network on the titanic dataset and visualize how the predictions of the neural network evolve after every training epoch. The colors of each row indicate the predicted survival probability for each passenger. Red indicates a prediction that a passenger died. Green indicates a prediction that a passenger survived. The intensity of the color indicates the magnitude of the prediction probability. As an example, a bright green passenger represents a strong predicted probability for survival. We also plot the loss of our objective function on the left of the table with [D3.js](https://d3js.org/). 

View live: https://andrewnetwork.github.io/NeuralTitanic/dist/

## Setup 
1. Install [Node.js](https://nodejs.org/en/). 
2. Clone or download this repo. 
3. Open a terminal and cd into this repo. 
4. In your terminal type: ```npm install```
5. Launch the dev server by typing: ```npm run dev```
6. Click on the url shown in the terminal or enter ```http://localhost:8080/``` in your web browser. 

If you wish to bundle the code for production run: 
```npm run build```. This will produce the flat files you can serve on the web in the ```/dist/``` directory. I have not optimized this code for real production use and the dependencies are quite extraneously large. 