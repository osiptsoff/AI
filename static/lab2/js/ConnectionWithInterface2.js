//import {State} from "./State.mjs";
//import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";

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
setInitialValues(matrix);
setPositionItems(matrix);

document.getElementById('buttonAuto').onclick = () => {
    autoAlgorithm();
}

document.getElementById('buttonStep').onclick = () => {
    singleStep();
}

document.getElementById('buttonReset').addEventListener('click', () => {
    setInitialValues(matrix);
    setPositionItems(matrix);
    outWindowAlgorithm.value = "";
    outWindowWay.value = "";
    iteration = 1;
})

function getMatrix(arr) {
    const matrix = [[], [], []];
    let x = 0, y = 0;

    for(let i = 0; i < arr.length; i++) {
        if (x >= 3) {
            y++;
            x = 0;
        }

        matrix[y][x] = arr[i];
        x++;
    }
    return matrix;
}

// Задание начального состояния
function setInitialValues(matrix) {
    let i = 0;
    for(let y = 0; y < matrix.length; y++)
        for(let x = 0; x < matrix[y].length; x++) {
            matrix[y][x] = valuesBegin[i];
            i++;
        }
}

function setPositionItems(matrix) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const value = matrix[y][x];
            const node = itemNodes[value - 1];
            setNodeStyles(node, x, y);
        }
    }
}

function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x*shiftPs}%, ${y*shiftPs}%, 0)`
}

function swap(coords1, coords2, matrix) {
    const temp = matrix[coords1[1]][coords1[0]];
    matrix[coords1[1]][coords1[0]] = matrix[coords2[1]][coords2[0]];
    matrix[coords2[1]][coords2[0]] = temp;
}

function getAlgorithm() {
    const algorithms = document.querySelectorAll('input[name="algorithms"]')
    for (const alg of algorithms)
        if (alg.checked)
            return alg.value;
}

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
