import {stateFinder} from "../StateFinder.mjs";
import {PriorityQueue} from "./PriorityQueue.mjs";

const heuristicStateFinder = {
    heuristicsValueSymbol : Symbol('heuristicsValue'),

    finishState : undefined,
    heuristics : undefined,
    searchingBuffer : new PriorityQueue (
        (state1, state2) => {
            return heuristicStateFinder.heuristics(state1) > heuristicStateFinder.heuristics(state2)
        }
    ),

    setHeuristics : function(heuristics) {
        this.heuristics = heuristics;

        // this.searchingBuffer = new PriorityQueue(
        //     (state1, state2) => { return heuristics(state1) > heuristics(state2) }
        // );
        this.clear();
    },

    clear : function() {
        this.watchedStates.clear();
        this.searchingBuffer.clear();

        this.searchingBuffer.push(this.startState);
        this.watchedStates.set(this.startState.hash(), this.startState);
    },

    __proto__ : stateFinder,
}

heuristicStateFinder.algorithm = () => {
    if(heuristicStateFinder.searchingBuffer.isEmpty())
        return {
            done : true
        }

    let currentState = heuristicStateFinder.searchingBuffer.pop();

    let children = [];
    let visited = [];

    for(let child of currentState) {
        child.depth = currentState.depth + 1;
        if ( !heuristicStateFinder.watchedStates.has(child.hash()) ) {
            child[heuristicStateFinder.parentSymbol] = currentState;
            child[heuristicStateFinder.changeCauseSymbol] = [[currentState.emptyX, currentState.emptyY], [child.emptyX, child.emptyY]];

            children.push(child);
            heuristicStateFinder.watchedStates.set(child.hash(), child);
        } else
            visited.push(child);
    }
    heuristicStateFinder.searchingBuffer.push(...children);

    currentState[heuristicStateFinder.childrenSymbol] = children;
    currentState[heuristicStateFinder.visitedSymbol] = visited;
    currentState[heuristicStateFinder.heuristicsValueSymbol] = heuristicStateFinder.heuristics(currentState);

    return {
        done : false,
        value : currentState,
    }
};

let misplacedNumCounter = (state) => {
    return state.matrix.reduce( (acc, val, idx) => acc - +(val !== heuristicStateFinder.finishState.matrix[idx]), 0 );
}

let manhattanDistance = (state) => {
    let result = 0;

    let size = state.size;
    let stateCoords = new Map();
    let targetCoords = new Map();

    // NOTE bitwise operation will work correctly ONLY for array 32-bit integer content
    state.matrix.forEach(
        (val, idx) => stateCoords.set(val, [~~(idx / size), idx % size])
    );
    heuristicStateFinder.finishState.matrix.forEach(
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

export {heuristicStateFinder, misplacedNumCounter, manhattanDistance}