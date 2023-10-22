import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {logger} from "../../commonjs/Logger.mjs";
import {getMatrix, setInitialValues, setPositionItems, swap, getAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9;
let algorithm;
let iteration;

let valuesBegin = [5, 8, 3, 4, 9, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let finish = new State(valuesEnd, 9, 3);
let fileName;
let iterator;

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix, valuesBegin);
setPositionItems(matrix, itemNodes);

let buttonAuto = document.getElementById('buttonAuto');
buttonAuto.onclick = startAuto;

let buttonStep = document.getElementById('buttonStep');
buttonStep.onclick = startManual;

let buttonReset = document.getElementById('buttonReset');
buttonReset.onclick = reset;

let manualStarted = false;

function reset() {
    setInitialValues(matrix, valuesBegin);
    setPositionItems(matrix, itemNodes);
    outWindow.value = "";

    iteration = 1;

    manualStarted = false;
    buttonStep.onclick = startManual;
}

function startManual() {
    reset();

    manualStarted = true;

    initializeAlgorithm();
    fileName = defineAndUseAlgorithmLogger();
    buttonStep.onclick = singleStep;

    singleStep();
}

function finishManual() {
    buttonStep.onclick = startManual;
    manualStarted = false;
}

function startAuto() {
    if(!manualStarted) {
        initializeAlgorithm();
        fileName = defineAndUseAlgorithmLogger();
        reset();
    } else finishManual();

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
}

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

function defineAndUseAlgorithmLogger(){
    algorithm = getAlgorithm();
    if (algorithm === "0") {
        return logger.logfileName.dfsAutoLog;
    } else {
        return logger.logfileName.bfsAutoLog;
    }
}
function serializeState(state) {
    let res = '',
        parent = state[stateFinder.parentSymbol],
        children = state[stateFinder.childrenSymbol],
        visited = state[stateFinder.visitedSymbol];
    let parentSerialized = parent === undefined ? 'нет' : parent + '',
        childrenSerialized = !children.length ? 'нет'  : children.join('\n'),
        visitedSerialized = !visited.length ? 'нет' : visited.join('\n');

    res += 'Глубина:\n' + state.depth + '\n';
    res += '\nРодитель:\n' + parentSerialized + '\n';
    res += '\nТекущее состояние:\n' + state + '\n';
    res += 'Запланированные к дальнейшему посещению потомки:\n' + childrenSerialized + '\n';
    res += 'Непосещённые потомки (посещённые ранее состояния):\n' + visitedSerialized + '\n';

    return res;
}

let finished = false;
function autoAlgorithm(){
    if(!finished)
        stepAlg()
            .then(e => {
                logger.addToBuffer( "Итерация №" + (iteration++) + '\n' + serializeState(e.value));
                return e.value
            })
            .then(e => {
                if(stateFinder.statesEqual(e, finish)) {//что то потом написать
                    finished = true;
                    logger.flushBuffer(fileName)
                    outWindow.value += "Конечное состояние найдено.\n" + serializeState(e);
                    //Информация о времени работы алгоритма
                }
            })
            .then(autoAlgorithm)
            .then(() => {
                if (finished)
                    finishAuto();
            });
    // stateFinder.algorithm = result;
}

async function stepAlg() {
    return iterator.next();
}

function singleStep() {
    stepAlg()
        .then(e => {
            outWindow.value += "Итерация №" + (iteration++) + '\n' + serializeState(e.value)
            return e.value;
        })
        .then(e => {
            let changeCause = e[stateFinder.changeCauseSymbol];
            if(changeCause) {
                swap(changeCause[1], changeCause[0], matrix);
                setPositionItems(matrix, itemNodes);
                // остальная инфа из списка в окно
            }
            return e;
        }).then(e => {
            if(stateFinder.statesEqual(e, finish)) {
                outWindow.value += "Конечное состояние достигнуто.\n";
                finishManual();
            }
        });
}