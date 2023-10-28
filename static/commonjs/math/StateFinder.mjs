import {State} from "./State.mjs";

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
    startState : undefined,
    watchedStates : new Map(),
    searchingBuffer : [],
    parentSymbol : Symbol('parent'),
    changeCauseSymbol : Symbol('changeCause'),
    childrenSymbol : Symbol('children'),
    visitedSymbol : Symbol('visited'),
    heuristicsValueSymbol : Symbol('heuristicsValue'),
    /**
     * <p>Compares two {@link State} by their {@link State#hash}.<p>
     * @param fir
     * @param sec
     * @returns {boolean}
     */
    statesEqual : function(fir, sec) {
        return fir.hash() === sec.hash();
    },

    setAlgorithm : function(algorithm) {
        this.algorithm = algorithm.bind(this);
        //this.clear();
    },

    setHeuristics : function(heuristics) {
        this.heuristics = heuristics.bind(this);
        this.clear();
    },

    /**
     * <p>Clears all searching progress. Invoke this function before starting first search.<p>
     * <p>{@code algorithm} is not cleared.<p>
     */
    clear : function() {
        this.watchedStates.clear();
        this.searchingBuffer = [this.startState];
        this.watchedStates.set(this.startState.hash(), this.startState);
    },

    [Symbol.iterator] : function () {
        return {
            next : this.algorithm,
        }
    }
};

export { stateFinder};