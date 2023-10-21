import {State} from "./State.mjs";
import {stateFinder, dfsTraverseStep, bfsTraverseStep} from "./StateFinder.mjs";

const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9;
let algorithm, iteration = 1;

let valuesBegin = [5, 8, 3, 4, 9, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let finish = new State(valuesEnd, 9, 3);
let iterator;

initializeAlgorithm();

// 

// let target;
// let rightWay = [];

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix);
setPositionItems(matrix);

document.getElementById('buttonAuto').onclick = () => {
    autoAlgorithm(); // умер помянем
}

document.getElementById('buttonStep').onclick = () => {
    singleStep();
    // startAlgorithm();
    // let strMatrixParent = getMatrixOutView(matrix);
    // let buttonCoords = findCoordinatesByNumber(9, matrix);
    // let buttonCoords2 = findCoordinatesByNumber(8, matrix);
    // swap(buttonCoords, buttonCoords2, matrix);
    // setPositionItems(matrix);
    // outNewInformation(matrix, strMatrixParent);
}

document.getElementById('buttonReset').addEventListener('click', () => {
    setInitialValues(matrix);
    setPositionItems(matrix);
    outWindow.value = "";
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

function findCoordinatesByNumber(number, matrix){
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            if(matrix[y][x] === number) {
                return {x, y};
            }
        }
    }
    return null;
}

function swap(coords1, coords2, matrix) {
    const temp = matrix[coords1[1]][coords1[0]];
    matrix[coords1[1]][coords1[0]] = matrix[coords2[1]][coords2[0]];
    matrix[coords2[1]][coords2[0]] = temp;
}

function getAlgorithm() {
    const algorithms = document.querySelectorAll('input[name="algorithms"]')
    for (const alg of algorithms)
        if (alg.checked) {
            console.log(alg.value) //проверка полученного значения
            return alg.value;
        }
}

function outNewInformation(matrix, strMatrixParent) {
    let strMatrix = getMatrixOutView(matrix);
    let compareResult = (strMatrix === strMatrixParent) ? "Конечное состояние достигнуто!" : "Конечное состояние не достигнуто!";
    document.getElementById('outWindow').value += "Итерация №" + iteration + "\nТекущее состояние:\n" + strMatrix +
        "Родитель:\n" + strMatrixParent + compareResult +"\nЧТО ТАМ ЕЩЕ НАДО\n\n";
    iteration++;
}

function getMatrixOutView(matrix) {
    let str = "";
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] === 9) str += "_ ";
            else str += matrix[y][x] + " ";
        }
        str += "\n";
    }
    str += "\n";
    return str;
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


let finished = false;
function autoAlgorithm(){
    // initializeAlgorithm();
    if(!finished)
        stepAlg()
            .then(e => {
                console.log(e.value.depth);
                console.log("Parent\n" + e.value[stateFinder.parentSymbol]);
                console.log(e.value + '');
                return e.value
            })
            .then(e => {
                if(stateFinder.statesEqual(e, finish)) //что то потом написать
                    finished = true;
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
            console.log(e.value + '')
            return e.value;
        })
        .then(e => {
            let changeCause = e[stateFinder.changeCauseSymbol];
            if(changeCause) {
                swap(changeCause[1], changeCause[0], matrix);
                setPositionItems(matrix);
            }
        });
}