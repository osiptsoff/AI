import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {logger} from "../../commonjs/Logger.mjs";
import {getMatrix, setInitialValues, setPositionItems, swap, getAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
let menuAlgorithm = document.querySelectorAll('input[type="radio"]');
console.log(menuAlgorithm);
const countItems = 9, emptyNum = '*';
let algorithm;
let iteration;

let valuesBegin = [5, 8, 3, 4, emptyNum, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, emptyNum];

let finish = new State(valuesEnd, emptyNum, 3);
let fileName;
let iterator;

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix, valuesBegin);
setPositionItems(matrix, itemNodes, emptyNum);

let buttonAuto = document.getElementById('buttonAuto');
buttonAuto.onclick = startAuto;

let buttonStep = document.getElementById('buttonStep');
buttonStep.onclick = startManual;

let buttonReset = document.getElementById('buttonReset');
buttonReset.onclick = reset;

let manualStarted = false;

function reset() {
    setInitialValues(matrix, valuesBegin);
    setPositionItems(matrix, itemNodes, emptyNum);
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
    let st = new State(valuesBegin, emptyNum, 3);
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
    let parentSerialized = parent === undefined ? 'нет\n' : parent + '',
        childrenSerialized = !children.length ? 'нет\n'  : children.join('\n'),
        visitedSerialized = !visited.length ? 'нет\n' : visited.join('\n');

    res += 'Глубина: ' + state.depth + '\n';
    res += '\nРодитель:\n' + parentSerialized;
    res += '\nТекущее состояние:\n' + state + '\n';
    res += 'Запланированные к дальнейшему посещению потомки:\n' + childrenSerialized + '\n';
    res += 'Потомки, которые не будут посещены, и посещённые ранее состояния:\n' + visitedSerialized + '\n';

    return res;
}

function vizualiseRightWay(state, startTime){

    setInitialValues(matrix, valuesBegin);
    setPositionItems(matrix, itemNodes, emptyNum);

    logger.flushBuffer(fileName);
    outWindow.value += "Конечное состояние найдено на глубине " + state.depth + ".\nТекущее состояние:\n" + state + "\n\nАлгоритм достиг конечного состояния!"
                      + "\nИнформацию об итерациях и найденный путь можно посмотреть в log-файлах.";
    //Правильный путь
    let rightWay = [];
    rightWay.push(state);

    for(let i=state[stateFinder.parentSymbol]; i !== undefined; i=i[stateFinder.parentSymbol]){
        rightWay.push(i);
    }
    rightWay.reverse();
    
    logger.addToBuffer("Правильный путь\n");
    rightWay.forEach((state) => {
        logger.addToBuffer(state + '');
    });
    logger.flushBuffer(fileName);
    
    //Добавить вывод информации о времени работы алгоритма
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    outWindow.value += "\nВремя выполнения алгоритма: " + executionTime + " миллисекунд.";

    rightWay.forEach((state, index) => {    
        let changeCause = state[stateFinder.changeCauseSymbol];
        if (changeCause) {
            setTimeout(() => {
                // перенести сюда
                swap(changeCause[1], changeCause[0], matrix);
                setPositionItems(matrix, itemNodes, emptyNum);
                if(index === rightWay.length - 1)
                    finishAuto();
            }, index * 300);    // 300 миллисекунд (0.3 секунды) задержки между каждым вызовом
        }
    });
}

let finished = false;

function autoAlgorithm() {
    fileName = defineAndUseAlgorithmLogger();
    const startTime = performance.now(); // performance.now() имеет высокую точность
    if(!finished)
        stepAlg()
            .then(e => {
                logger.addToBuffer("Итерация №" + (iteration++) + '\n' + serializeState(e.value));
                return e.value
            })
            .then(e => {
                if(stateFinder.statesEqual(e, finish)) {
                    finished = true;
                    vizualiseRightWay(e, startTime);               
                }
            })
            .then(autoAlgorithm)
            // delete
            // .then(() => {
            //     if (finished)
            //     //это перенести
            //         finishAuto();
            //     //это перенести
            // });
            // delete
}

async function stepAlg() {
    return iterator.next();
}

let variableForParentBackground = [[0,0,0],[0,0,0],[0,0,0]]; // Настя посмотри, что можно с этим сделать

function singleStep() {
    stepAlg()
        .then(e => {
            outWindow.value += "Итерация №" + (iteration++) + '\n' + serializeState(e.value)
            return e.value;
        })
        .then(e => {
            let changeCause = e[stateFinder.changeCauseSymbol];
            if(changeCause) {
                setInitialValues(variableForParentBackground, e[stateFinder.parentSymbol].matrix); 
                matrix = variableForParentBackground;
                //matrix = e[stateFinder.parentSymbol].matrix;
                swap(changeCause[1], changeCause[0], matrix);
                setPositionItems(matrix, itemNodes, emptyNum);
            }
            return e;
        }).then(e => {
            if(stateFinder.statesEqual(e, finish)) {
                outWindow.value += "Конечное состояние достигнуто.\n";
                finishManual();
            }
        });
}