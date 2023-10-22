import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {logger} from "../../Logger.mjs";
import {getMatrix, setInitialValues, setPositionItems, swap, getAlgorithm} from "../../InterfaceFunctions.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9, emptyNum = '*';
let algorithm, iteration = 1;

let valuesBegin = [5, 8, 3, 4, emptyNum, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, emptyNum];

let finish = new State(valuesEnd, emptyNum, 3);
let iterator;
initializeAlgorithm();

// let target;
// let rightWay = [];

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix, valuesBegin);
setPositionItems(matrix, itemNodes, emptyNum);

document.getElementById('buttonAuto').onclick = () => {
    autoAlgorithm();
}

document.getElementById('buttonStep').onclick = () => {
    singleStep();
}

document.getElementById('buttonReset').addEventListener('click', () => {
    setInitialValues(matrix, valuesBegin);
    setPositionItems(matrix, itemNodes, emptyNum);
    outWindow.value = "";
    iteration = 1;
})

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
    // const currentState = result;
    let st = new State(valuesBegin, emptyNum, 3);
    stateFinder.algorithm = result;

    stateFinder.startState = st;
    stateFinder.clear();

    iterator = stateFinder[Symbol.iterator]();
    // for(state of stateFinder) {
    //     console.log(state.depth);
    //     console.log("Parent\n" + state[stateFinder.parentSymbol]);
    //     console.log(state + '');
    //     counter++; //удали потом пж меня
    //     if (stateFinder.statesEqual(state, finish)){
    //         target = state;
    //         break;
    //     }
    //     // if(counter===20) //удали потом пж меня
    //     //     break;
    // }
    // //Правильный путь
    // rightWay.push(target);
    // for(let i=target[stateFinder.parentSymbol]; i !== undefined; i=i[stateFinder.parentSymbol]){
    //     rightWay.push(i);
    // }
    // rightWay.reverse();
    // //Правильный путь


    // rightWay.forEach(e => console.log(e + ''));
    // // setPositionItems(currentState); 
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
    res += 'Непосещённые потомки (посещённые ранее состояния):\n' + visitedSerialized + '\n';

    return res;
}

let finished = false;
function autoAlgorithm(){
    let fileName = defineAndUseAlgorithmLogger();
    // initializeAlgorithm();
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
                    outWindow.value += "Конечное состояние найдено на глубине " + e.depth + ".\nТекущее состояние:\n" + e + "\n\nАлгоритм достиг конечного состояния!"
                                      + "\nИнформацию об итерациях и найденный путь можно посмотреть в log-файлах.";
                    //Добавить вывод информации о времени работы алгоритма
                }
            })
            .then(autoAlgorithm);
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
                setPositionItems(matrix, itemNodes, emptyNum);
            }
        });
}