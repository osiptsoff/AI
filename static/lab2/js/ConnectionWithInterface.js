//import {State} from "./State.mjs";
//import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {setMatrixValues, swap, getAlgorithm, valuesEnd} from "../../commonjs/InterfaceFunctions.mjs";
import {valuesBegin, matrix, emptyNum, menuAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";
import {buttonAuto, buttonStep, buttonReset} from "../../commonjs/InterfaceFunctions.mjs";

let start = new State(valuesBegin, emptyNum, 3);
let finish = new State(valuesEnd, emptyNum, 3);

import {
    heuristicStateFinder,
    manhattanDistance,
    misplacedNumCounter
} from "../../commonjs/math/heuristicSearch/HeuristicStateFinder.mjs";
import {State} from "../../commonjs/math/State.mjs";

heuristicStateFinder.startState = start;
heuristicStateFinder.finishState = finish;
heuristicStateFinder.setHeuristics(manhattanDistance);

let ctr = 0;
for(let state of heuristicStateFinder) {
    ctr++;
    //console.log(state);
    if (heuristicStateFinder.statesEqual(state, finish)) {
        console.log(state);
        console.log(ctr);
        break;
    }
}

heuristicStateFinder.setHeuristics(misplacedNumCounter);

ctr = 0;
for(let state of heuristicStateFinder) {
    ctr++;
    //console.log(state);
    if (heuristicStateFinder.statesEqual(state, finish)) {
        console.log(state);
        console.log(ctr);
        break;
    }
}


let algorithm;
let iteration;
let iterator;

buttonAuto.onclick = startAuto;
buttonStep.onclick = startManual;
buttonReset.onclick = reset;

let manualStarted = false;
/*
function reset() {
    setMatrixValues(valuesBegin);
    outWindow.value = "";

    iteration = 1;
    // unblock alg initialize
    menuAlgorithm.forEach(b => b.disabled = false);

    manualStarted = false;
    buttonStep.onclick = startManual;
}

function startManual() {
    reset();

    manualStarted = true;

    initializeAlgorithm();
    // block alg initialize
    menuAlgorithm.forEach(b => b.disabled = true);
    fileName = defineAndUseAlgorithmLogger();
    buttonStep.onclick = singleStep;

    singleStep();
}

function finishManual() {
    buttonStep.onclick = startManual;
    manualStarted = false;
    menuAlgorithm.forEach(b => b.disabled = false);
}

function startAuto() {
    if(!manualStarted) {
        initializeAlgorithm();
        // block alg initialize
        fileName = defineAndUseAlgorithmLogger();
        reset();
        menuAlgorithm.forEach(b => b.disabled = true);
    } else finishManual();

    menuAlgorithm.forEach(b => b.disabled = true);

    buttonAuto.disabled = true;
    buttonStep.disabled = true;
    buttonReset.disabled = true;

    autoAlgorithm();
}

function finishAuto() {
    buttonAuto.disabled = false;
    buttonStep.disabled = false;
    buttonReset.disabled = false;

    finished = false;
    // unblock alg initialize
    menuAlgorithm.forEach(b => b.disabled = false);
}

//Изменить на актуальные алгоритмы в return
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

function defineAndUseAlgorithmLogger(){
    algorithm = getAlgorithm();
    if (algorithm === "0") {
        return logger.logfileName.h1AutoLog;
    } else {
        return logger.logfileName.h2AutoLog;
    }
}

/*
let finished = false;
function autoAlgorithm(){

}


async function stepAlg() {
    return iterator.next();
}

function singleStep() {

}*/
