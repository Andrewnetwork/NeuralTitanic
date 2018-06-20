// preprocessing.js 
// Andrew Riberio - Andrew@kexp.io
// June 2018

import * as _ from "lodash";

function prepTitanicRow(row){
    var sex = [0,0];
    var embarked = [0,0,0];
    var pclass = [0,0,0];
    var age = row["age"];
    var sibsp = row["sibsp"];
    var parch = row["parch"];
    var fare = row["fare"];

    // Process Categorical Variables 
    if(row["sex"] == "male"){
        sex = [0,1];
    }else if(row["sex"] == "female"){
        sex = [1,0];
    }

    if(row["embarked"] == "S"){
        embarked = [0,0,1];
    }
    else if(row["embarked"] == "C"){
        embarked = [0,1,0];
    }
    else if(row["embarked"] == "Q"){
        embarked = [1,0,0];
    }

    if(row["Pclass"] == 1){
        pclass   = [0,0,1];
    }
    else if(row["Pclass"] == 2){
        pclass   = [0,1,0];
    }
    else if(row["Pclass"] == 3){
        pclass   = [1,0,0];
    }

    // Process Quantitative Variables
    if(parseFloat(age) == NaN){
        age = 0;
    }
    if(parseFloat(sibsp) == NaN){
        sibsp = 0;
    }
    if(parseFloat(parch) == NaN){
        parch = 0;
    }
    if(parseFloat(fare) == NaN){
        fare = 0;
    }
    
    return pclass.concat(sex).concat([age,sibsp,parch,fare]).concat(embarked);
}

export function titanicPreprocess(data){
    const X = _.map(_.map(data,(x)=>x.d),prepTitanicRow);
    const y = _.map(data,(x)=>x.d["survived"]);
    return [X,y];
}