import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {logger} from "../../commonjs/Logger.mjs";
import {setMatrixValues, swap, getAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";
import {finish, valuesBegin, matrix, emptyNum, menuAlgorithm} from "../../commonjs/InterfaceFunctions.mjs";
import {buttonAuto, buttonStep, buttonReset} from "../../commonjs/InterfaceFunctions.mjs";

let algorithm;
let iteration;
let fileNameAlgorithm, fileNamePath;
let iterator;

buttonAuto.onclick = startAuto;
buttonStep.onclick = startManual;
buttonReset.onclick = reset;

let manualStarted = false;

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
    buttonStep.onclick = singleStep;

    singleStep();
}

function finishManual() {
    buttonStep.onclick = startManual;
    manualStarted = false;
    menuAlgorithm.forEach(b => b.disabled = false);
}

function startAuto() {
    defineAndUseAlgorithmLogger();
    if(!manualStarted) {
        initializeAlgorithm();
        // block alg initialize
        reset();
        menuAlgorithm.forEach(b => b.disabled = true);
    } else {
        logger.addToBuffer(outWindow.value);
        finishManual();
    }

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

function defineAndUseAlgorithm() {
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

function defineAndUseAlgorithmLogger() {
    algorithm = getAlgorithm();
    if (algorithm === "0") {
        fileNameAlgorithm = logger.logfileName.dfsAutoLog;
        fileNamePath = logger.logfileName.dfsRightPath;
    } else {
        fileNameAlgorithm = logger.logfileName.bfsAutoLog;
        fileNamePath = logger.logfileName.bfsRightPath;
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
    res += '\nРодитель:\n' + parentSerialized + '\n';
    res += 'Текущее состояние:\n' + state + '\n';
    res += 'Запланированные к дальнейшему посещению потомки:\n' + childrenSerialized + '\n';
    res += 'Потомки, которые не будут посещены, и посещённые ранее состояния:\n' + visitedSerialized + '\n';

    return res;
}

function vizualiseRightWay(state, startTime) {
    logger.flushBuffer(fileNameAlgorithm);
    setMatrixValues(valuesBegin);
    outWindow.value += "Алгоритм достиг конечного состояния!!!\nКонечное состояние найдено на глубине " + state.depth + ".\nТекущее состояние:\n" + state
                      + "\nИнформацию об итерациях и найденный путь можно посмотреть в log-файлах.\n";
    //Правильный путь
    let rightWay = [];
    rightWay.push(state);

    for(let i=state[stateFinder.parentSymbol]; i !== undefined; i=i[stateFinder.parentSymbol]){
        rightWay.push(i);
    }
    rightWay.reverse();
    
    logger.addToBuffer("Найденный путь\n");
    rightWay.forEach((state) => {
        logger.addToBuffer(state + '\n');
    });
    logger.flushBuffer(fileNamePath); //алгоритм записывается сюда, хотя не должен (в этом файле только путь нужен)
    
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    outWindow.value += "\nКоличество пройденных вершин: " + (iteration - 1)
                        + "\nВремя выполнения алгоритма: " + executionTime + " миллисекунд";

    rightWay.forEach((state, index) => {    
        let changeCause = state[stateFinder.changeCauseSymbol];
        if (changeCause) {
            setTimeout(() => {
                swap(changeCause[1], changeCause[0], matrix);
                if(index === rightWay.length - 1)
                    finishAuto();
            }, index * 300); // 300 миллисекунд (0.3 секунды) задержки между каждым вызовом
        }
    });
}

let finished = false;

function autoAlgorithm() {
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
                setMatrixValues(e[stateFinder.parentSymbol].matrix);
                swap(changeCause[1], changeCause[0], matrix);
            }
            return e;
        }).then(e => {
            if(stateFinder.statesEqual(e, finish)) {
                outWindow.value += "Конечное состояние достигнуто.\n";
                finishManual();
            }
        });
}