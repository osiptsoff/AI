/**
 * <p>Returns next game state according to Depth First Search algorithm.<p>
 * <p>Adds parent state to returned child, use {@link stateFinder#parentSymbol} to get it.<p>
 * <p>Adds change cause to returned child in format of array of two arrays, each consists of two coordinates of empty cell,
 *      first for parent and second for child, use {@link stateFinder#changeCauseSymbol} to get it.<p>
 * <p>Intended to be used as {@link Iterator#next} so DO NOT invoke it explicitly.<p>
 * <p>Assign this function to {@link stateFinder}'s {@code algorithm} field.<p>
 * <p>Compatiblee with stateFinder (and its heirs) only.<p>
 * @returns {{done: boolean}|{done: boolean, value: State}}
 */
const dfsTraverseStep = function() {
    if(this.searchingBuffer.length === 0)
        return {
            done : true
        }

    let currentState = this.searchingBuffer.pop();
    this.watchedStates.set(currentState.hash(), currentState);

    let children = [];
    let visited = [];

    for(let child of currentState)
        if( !this.watchedStates.has(child.hash()) ) {
            child[this.parentSymbol] = currentState;
            child[this.changeCauseSymbol] = [[currentState.emptyX, currentState.emptyY], [child.emptyX, child.emptyY]];

            children.push(child);
            child.depth = currentState.depth + 1;
        } else
            visited.push(child);

    currentState[this.childrenSymbol] = children;

    children = children.reverse();

    if (this.heuristics !== undefined)
        children.sort(
            (state1, state2) => {
                return this.heuristics(state1) - this.heuristics(state2);
            }
        );

    this.searchingBuffer.push(...children);

    currentState[this.visitedSymbol] = visited;

    return {
        done : false,
        value : currentState,
    }
};

/**
 * <p>Returns next game state according to Breadth First Search algorithm.<p>
 * <p>Adds parent state to returned child, use {@link stateFinder#parentSymbol} to get it.<p>
 * <p>Adds change cause to returned child in format of array of two arrays, each consists of two coordinates of empty cell,
 *      first for parent and second for child, use {@link stateFinder#changeCauseSymbol} to get it.<p>
 * <p>Intended to be used as {@link Iterator#next} so DO NOT invoke it explicitly.<p>
 * <p>Assign this function to {@link stateFinder}'s {@code algorithm} field.<p>
 * <p>Compatiblee with stateFinder (and its heirs) only.<p>
 * @returns {{done: boolean}|{done: boolean, value: *}}
 */
const bfsTraverseStep = function()  {
    if(this.searchingBuffer.length === 0)
        return {
            done : true
        }

    let currentState = this.searchingBuffer.shift();

    let children = [];
    let visited = [];

    for(let child of currentState) {
        child.depth = currentState.depth + 1;
        if ( !this.watchedStates.has(child.hash()) ) {
            child[this.parentSymbol] = currentState;
            child[this.changeCauseSymbol] = [[currentState.emptyX, currentState.emptyY], [child.emptyX, child.emptyY]];

            children.push(child);
            this.watchedStates.set(child.hash(), child);
        } else
            visited.push(child);
    }

    if(this.heuristics !== undefined)
        children.sort(
            (state1, state2) => {
                return this.heuristics(state1) - this.heuristics(state2)
            }
        )

    this.searchingBuffer.push(...children);

    currentState[this.childrenSymbol] = children;
    currentState[this.visitedSymbol] = visited;

    return {
        done : false,
        value : currentState,
    }
};

export {dfsTraverseStep, bfsTraverseStep};