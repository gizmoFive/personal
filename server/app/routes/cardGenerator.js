'use strict';
let categories = ['color', 'shape', 'shading', 'number']
let color = ['red', 'green', 'purple'];
let shape = ['diamond', 'squiggle', 'oval'];
let shading = ['solid', 'empty', 'striped'];
let number = ['one', 'two', 'three'];

//generate all permutations of categories.
let generateCards = (cats, ...args) => {
    let output = [], 
    max = args.length-1;
    let generate = (arr, i) => {
        for (let j=0; j<args[i].length; j++) {
            let tempArray = arr.slice(0); 
            tempArray.push(args[i][j]);
            if (i==max){
                let tempObj = {};
                for(let k=0; k< cats.length; k++) {
                tempObj[cats[k]] = tempArray[k]
                }
                 output.push(tempObj);
            }
            else {
                generate(tempArray, i+1);
            }
        }
    }
    generate([], 0);
    return output;
}

let cards = generateCards(categories, color, shape, shading, number);

module.exports = cards;