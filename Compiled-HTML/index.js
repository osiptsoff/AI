const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
const countItems = 9;
let algorithm, iteration = 1;

let valuesBegin = [5, 8, 3, 4, 9, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, 9];

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка
let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setInitialValues(matrix);
setPositionItems(matrix);

document.getElementById('buttonAuto').addEventListener('click', () => {
    //algorithm = getAlgorithm(); //определение алгоритма
    let buttonCoords, buttonCoords2;
    
    buttonCoords = findCoordinatesByNumber(9, matrix);
    buttonCoords2 = findCoordinatesByNumber(8, matrix); //для теста сдвигов
    swap(buttonCoords, buttonCoords2, matrix);
    setPositionItems(matrix);

    buttonCoords = findCoordinatesByNumber(9, matrix);
    buttonCoords2 = findCoordinatesByNumber(3, matrix);
    swap(buttonCoords, buttonCoords2, matrix);
    setPositionItems(matrix);
})

document.getElementById('buttonStep').addEventListener('click', () => {
    let strMatrixParent = getMatrixOutView(matrix);
    let buttonCoords = findCoordinatesByNumber(9, matrix);
    let buttonCoords2 = findCoordinatesByNumber(8, matrix);
    swap(buttonCoords, buttonCoords2, matrix);
    setPositionItems(matrix);
    outNewInformation(matrix, strMatrixParent);
})

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
    const coordsNumber1 = matrix[coords1.y][coords1.x];
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
    matrix[coords2.y][coords2.x] = coordsNumber1;
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