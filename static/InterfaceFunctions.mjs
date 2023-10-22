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
function setInitialValues(matrix, valuesBegin) {

    let i = 0;
    for(let y = 0; y < matrix.length; y++)
        for(let x = 0; x < matrix[y].length; x++) {
            matrix[y][x] = valuesBegin[i];
            i++;
        }
}

function setPositionItems(matrix, itemNodes, emptyNum) {
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const value = (matrix[y][x] === emptyNum) ? 9 : matrix[y][x];
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

export {getMatrix, setInitialValues, setPositionItems, swap, getAlgorithm};