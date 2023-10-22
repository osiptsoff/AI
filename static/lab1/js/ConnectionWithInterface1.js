import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";
import {logger} from "../../Logger.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9;
let algorithm, iteration = 1;

let valuesBegin = [5, 8, 3, 4, 9, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let finish = new State(valuesEnd, 9, 3);
let iterator;
initializeAlgorithm();

// let target;
// let rightWay = [];

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
    let st = new State(valuesBegin, 9, 3);
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
                    outWindow.value += "Конечное состояние найдено.\n" + serializeState(e);
                    //Информация о времени работы алгоритма
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
                setPositionItems(matrix);
                // остальная инфа из списка в окно
            }
        });
}