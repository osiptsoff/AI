//import {State} from "./State.mjs";
//import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {getMatrix, setInitialValues, setPositionItems, swap, getAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9;
let algorithm, iteration = 1;

let valuesBegin = [5, 8, 3, 4, 9, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//let finish = new State(valuesEnd, 9, 3);
//let iterator;

//initializeAlgorithm();

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix, valuesBegin);
setPositionItems(matrix, itemNodes);

document.getElementById('buttonAuto').onclick = () => {
    autoAlgorithm();
}

document.getElementById('buttonStep').onclick = () => {
    singleStep();
}

document.getElementById('buttonReset').addEventListener('click', () => {
    setInitialValues(matrix, valuesBegin);
    setPositionItems(matrix, itemNodes);
    outWindow.value = "";
    iteration = 1;
})

/*
//Изменить на новые
function defineAndUseAlgorithm(){
    algorithm = getAlgorithm();
    if (algorithm === "0") {
        return dfsTraverseStep;
    } else {
        return bfsTraverseStep;
    }
}

function initializeAlgorithm() {
    const result = defineAndUseAlgorithm();
    let st = new State(valuesBegin, 9, 3);
    stateFinder.algorithm = result;

    stateFinder.startState = st;
    stateFinder.clear();

    iterator = stateFinder[Symbol.iterator](); 
}
*/

let finished = false;
function autoAlgorithm(){
}

/*
async function stepAlg() {
    return iterator.next();
}*/

function singleStep() {

}
