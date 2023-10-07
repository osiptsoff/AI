import {State} from "./State.js";


/**
 * <p>Usage:<br>
 * 1. assign {@link State} to {@code startState} property - it will be the root of tree;<br>
 * 2. invoke {@link stateFinder#clear} to clear progress of previous search or if you run search at first time;<br>
 * 3. assign proper function to {@code algorithm} property (right now {@link dfsTraverseStep}
 * and {@link bfsTraverseStep} are only available).<br>
 * 4. traverse tree by using iterator.<p>
 * @type {{searchingBuffer: State[], watchedStates: Map<Number, State>, [Symbol.iterator]: (function(): {next: stateFinder.algorithm}), clear: stateFinder.clear, statesEqual: (function(*, *): boolean)}}
 */
const stateFinder = {
    watchedStates : new Map(),
    searchingBuffer : [],
    /**
     * <p>Compares two {@link State} by their {@link State#hash}.<p>
     * @param fir
     * @param sec
     * @returns {boolean}
     */
    statesEqual : function(fir, sec) {
        return fir.hash() === sec.hash();
    },

    /**
     * <p>Clears all searching progress. Invoke this function before starting first search.<p>
     * <p>{@code algorithm} is not cleared.<p>
     */
    clear : function() {
        this.watchedStates.clear();
        this.searchingBuffer = [this.startState];
    },

    [Symbol.iterator] : function () {
        return {
            next : this.algorithm,
        }
    }
};

/**
 * <p>Returns next game state according to Depth First Search algorithm.<p>
 * <p>Intended to be used as {@link Iterator#next} so DO NOT invoke it explicitly.<p>
 * <p>Assign this function to {@link stateFinder}'s {@code algorithm} field.<p>
 * @returns {{done: boolean}|{done: boolean, value: State}}
 */
const dfsTraverseStep = function() {
    if(stateFinder.searchingBuffer.length === 0)
        return {
            done : true
        }

    let currentState = stateFinder.searchingBuffer.pop();
    stateFinder.watchedStates.set(currentState.hash(), currentState);

    let children = [];

    for(let child of currentState)
        if( !stateFinder.watchedStates.has(child.hash()) ) {
            children.push(child);
            child.depth = currentState.depth + 1;
        }
    children = children.reverse();

    stateFinder.searchingBuffer.push(...children);

    return {
        done : false,
        value : currentState,
    }
};

/**
 * <p>Returns next game state according to Breadth First Search algorithm.<p>
 * <p>Intended to be used as {@link Iterator#next} so DO NOT invoke it explicitly.<p>
 * <p>Assign this function to {@link stateFinder}'s {@code algorithm} field.<p>
 * @returns {{done: boolean}|{done: boolean, value: *}}
 */
const bfsTraverseStep = function() {
    if(stateFinder.searchingBuffer.length === 0)
        return {
            done : true
        }

    let currentState = stateFinder.searchingBuffer.shift();

    for(let child of currentState) {
        child.depth = currentState.depth + 1;
        if ( !stateFinder.watchedStates.has(child.hash()) ) {
            stateFinder.searchingBuffer.push(child);
            stateFinder.watchedStates.set(child.hash(), child);
        }
    }

    return {
        done : false,
        value : currentState,
    }
};

export { stateFinder, dfsTraverseStep, bfsTraverseStep};