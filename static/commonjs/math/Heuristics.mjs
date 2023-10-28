const misplacedNumCounter = function(state) {
    return state.matrix.reduce( (acc, val, idx) => acc - +(val !== this.finishState.matrix[idx]), 0 );
}

const manhattanDistance = function(state) {
    let result = 0;

    let size = state.size;
    let stateCoords = new Map();
    let targetCoords = new Map();

    // NOTE bitwise operation will work correctly ONLY for array of 32-bit integers
    state.matrix.forEach(
        (val, idx) => stateCoords.set(val, [~~(idx / size), idx % size])
    );
    this.finishState.matrix.forEach(
        (val, idx) => targetCoords.set(val, [~~(idx / size), idx % size])
    );

    let stateCoordsPair, targetCoordsPair;
    for(let key of stateCoords.keys()) {
        stateCoordsPair = stateCoords.get(key);
        targetCoordsPair = targetCoords.get(key);

        result -= Math.abs(stateCoordsPair[0] - targetCoordsPair[0]) + Math.abs(stateCoordsPair[1] - targetCoordsPair[1]);
    }

    return result;
}

export {misplacedNumCounter, manhattanDistance}