// applyMiddlewares 基本架构
const createStore = (reducer, enhancer) => {

    if (enhancer) {
        return enhancer(createStore)(reducer)
    }
    let state

    const getState = () => state

    const dispatch = (action) => {
        state = reducer(state, action)
        return action
    }

    dispatch({})

    return {
        getState,
        dispatch,
    }
}

const applyMiddleWares = (...middleware) => {
    return (createStore) => (reducer) => {
        const store = createStore(reducer)
        
        return {
            ...store,
        }
    }
}

const reducer = (state = 0, action) => {
    switch (action.type) {
        case "ADD":
            return state + 1
        case "DELETE":
            return state - 1
        default: 
            return state
    }
}

store = createStore(reducer, applyMiddleWares())