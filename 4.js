// applyMiddlewares 引入一个中间件
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

const logger = ({
    getState,
}) => next => action => {
    console.log(getState());
    next(action)
    console.log(getState());
}

const applyMiddleWares = (logger) => {
    return (createStore) => (reducer) => {
        const store = createStore(reducer)

        let dispatch 

        let middlewareAPI = {
            getState: store.getState,
        }

        dispatch = logger(middlewareAPI)(store.dispatch)
        

        return {
            ...store,
            dispatch
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

store = createStore(reducer, applyMiddleWares(logger))