const incPairs = [[-1, 0], [0, 1],
                    [1, 0], [0, -1]];

/**
 * <p>Class representing state of game and providing access to states
 * that can be visited from kept one.<p>
 * <p>Children accessing implemented by using iterators, so you can work with them
 * with for...of loop or by implicitly calling symbol for iterator and invoking {@link Iterator#next}.<p>
 */
class State {
    /**
     * <p>Creates new state.<p>
     * @param matrix 1-dimensional array from which matrix of state will be created,
     *  first {@code size} members will be the first string, next {@code size} will be the second and so on;
     * @param emptyCell empty cell, may be a value (in this case, first member with this value will be being treated as empty,
     *  or array representing position of empty cell in matrix;
     * @param size size of size x size matrix;
     * @returns {undefined|State} {@code undefined} if given data is not correct, {@code State} otherwise.
     */
    constructor(matrix, emptyCell, size = 3) {
        if ( !Array.isArray(matrix) )
            return undefined;

        this.matrix = matrix.slice(0, size * size);
        this.size = size;
        this.depth = 0;

        if(Array.isArray(emptyCell)) {
            this.emptyX = emptyCell[0];
            this.emptyY = emptyCell[1];
            return this;
        }

        for(let i = 0; i < size; i++)
            for(let j = 0; j < size; j++)
                if(this.get(i, j) === emptyCell) {
                    this.emptyX = i;
                    this.emptyY = j;
                    return this;
                }
    }

    [Symbol.iterator]() {
        return {
            parent : this,
            incPair : undefined,
            pairNum : -1,

            next() {
                const emptyX = this.parent.emptyX;
                const emptyY = this.parent.emptyY;

                do {
                    this.incPair = incPairs[++this.pairNum];
                    if(this.incPair === undefined)
                        return {
                            done : true
                        }
                } while( this.parent.get(emptyX + this.incPair[0],emptyY + this.incPair[1]) === undefined )

                let childMatrix = this.parent.matrix.slice();
                let swappedEmptyX = emptyX + this.incPair[0],
                    swappedEmptyY = emptyY + this.incPair[1],
                    parentSize = this.parent.size;

                let buffer = childMatrix[emptyX * parentSize + emptyY];
                childMatrix[emptyX * parentSize + emptyY] = childMatrix[swappedEmptyX * parentSize + swappedEmptyY];
                childMatrix[swappedEmptyX * parentSize + swappedEmptyY] = buffer;

                return {
                    done : false,
                    value : new State(childMatrix, [swappedEmptyX, swappedEmptyY], parentSize)
                }
            }
        };
    }

    [Symbol.toPrimitive](hint) {
        if(hint !== "string" && hint !== "default")
            return undefined;

        let res = '';
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++)
                res += this.get(i, j) + " ";
            res += "\n";
        }

        return res;
    }

    /**
     * @param i row number;
     * @param j column number;
     * @returns {undefined|*} undefined if invalid arguments were passed, requested matrix content otherwise.
     */
    get(i, j) {
        if(i < 0 || j < 0)
            return undefined;
        if(i >= this.size || j >= this.size)
            return undefined;

        return this.matrix[i * this.size + j];
    }

    /**
     * @returns {*} hash of this matrix - sum of all members multiplied by 10 to the power of position,
     * non-numeric members are treated as 0.
     */
    hash() {
        return this.matrix.reduce( (acc, currentVal, currentIdx) =>
            acc + (Number.isInteger(currentVal) ? currentVal * (10 ** currentIdx++) : 0), 0)
    }

}

export { State }