// 使用compose来引入多个中间件
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

const compose = (...funcs) => {
    return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

const logger = ({
    getState,
}) => next => action => {
    console.log(getState());
    next(action)
    console.log(getState());
}

const applyMiddleWares = (...middlewares) => {
    return (createStore) => (reducer) => {
        const store = createStore(reducer)

        let dispatch
        let middlewareAPI = {
            getState: store.getState,
            // dispatch: () => dispatch(),
        }

        const chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = compose(...chain)(store.dispatch)

        return {
            ...store,
            dispatch
        }
    }
}

const reducer = (state = 10, action) => {
    switch (action.type) {
        case "ADD":
            return state + 1
        case "DELETE":
            return state - 1
        default: 
            return state
    }
}

store = createStore(reducer, applyMiddleWares(logger, logger))