const containerNode = document.getElementById('fifteen');
const itemNodes = Array.from(containerNode.querySelectorAll('.item'));
let menuAlgorithm = document.querySelectorAll('input[type="radio"]');
const countItems = 9, emptyNum = '*';

let valuesBegin = [5, 8, 3, 4, emptyNum, 2, 7, 6, 1];
let valuesEnd = [1, 2, 3, 4, 5, 6, 7, 8, emptyNum];

itemNodes[countItems - 1].style.display = 'none'; //невидимая фишка

let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setMatrixValues(valuesBegin);

let buttonAuto = document.getElementById('buttonAuto');
let buttonStep = document.getElementById('buttonStep');
let buttonReset = document.getElementById('buttonReset');

/**
 * <p> Формирование матрицы 3x3 для связи с интерфейсом <p>
 * @param arr массив из 9 значений
 */
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

/**
 * <p> Заполнение матрицы 3x3 <p>
 * @param values массив из 9 значений
 */
function setMatrixValues(values) {
    let i = 0;
    for(let y = 0; y < matrix.length; y++)
        for(let x = 0; x < matrix[y].length; x++) {
            matrix[y][x] = values[i];
            i++;
        }
    setPositionItems();
}

/** * <p> Определение позиции для каждой фишки <p> */
function setPositionItems() {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const value = (matrix[y][x] === emptyNum) ? 9 : matrix[y][x];
            const node = itemNodes[value - 1];
            setNodeStyles(node, x, y);
        }
    }
}

/**
 * <p> Расположение определенной фишки на необходимой позиции <p>
 * @param node фишка для перемещения
 * @param x первая координата в двумерном массиве (по горизонтали) 
 * @param y вторая координата в двумерном массиве (по вертикали) 
 */
function setNodeStyles(node, x, y) {
    const shiftPs = 100;
    node.style.transform = `translate3D(${x*shiftPs}%, ${y*shiftPs}%, 0)`
}

/**
 * <p> Сдвиг определенной фишки на место пустой <p>
 * @param coords1 координаты по горизонтали и вертикали первой фишки
 * @param coords2  координаты по горизонтали и вертикали второй фишки
 * @param matrix матрица значений
 */
function swap(coords1, coords2, matrix) {
    const temp = matrix[coords1[0]][coords1[1]];
    matrix[coords1[0]][coords1[1]] = matrix[coords2[0]][coords2[1]];
    matrix[coords2[0]][coords2[1]] = temp;
    setPositionItems();
}

/** <p> Получение значения алгоритма из окна выбора <p> */
function getAlgorithm() {
    const algorithms = document.querySelectorAll('input[name="algorithms"]')
    for (const alg of algorithms)
        if (alg.checked)
            return alg.value;
}

function getHeuristics() {
    const heuristics = document.querySelectorAll('input[name="heuristics"]')

    for (const hr of heuristics)
        if (hr.checked)
            return hr.value;
}

export {setMatrixValues, swap, getAlgorithm, getHeuristics};
export {valuesEnd, valuesBegin, matrix, emptyNum, menuAlgorithm};
export {buttonAuto, buttonStep, buttonReset};