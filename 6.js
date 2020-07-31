// redux-thunk
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

const thunk = ({
    dispatch,
    getState,
}) => next => action => {
    if (typeof action === 'function') {
        return action(dispatch, getState)
    } else {
        return next(action)
    }
}

const applyMiddleWares = (...middlewares) => {
    return (createStore) => (reducer) => {
        const store = createStore(reducer)

        let dispatch
        let middlewareAPI = {
            getState: store.getState,
            dispatch: (action, ...args) => dispatch(action, ...args),
        }

        // const chain = middlewares.map(middleware => middleware(middlewareAPI))
        dispatch = middlewares[0](middlewareAPI)(store.dispatch)
        return {
            ...store,
            dispatch
        }
    }
}

const reducer = (state = 10, action) => {
    switch (action.type) {
        case "ADD":
            return state + action.payload
        case "DELETE":
            return state - action.payload
        default: 
            return state
    }
}

store = createStore(reducer, applyMiddleWares(thunk))

function fetchData(dispatch, getState) {
    dispatch({
        type: 'ADD',
        payload: 10,
    })

    setTimeout(() => {
        dispatch({
            type: 'ADD',
            payload: 30,
        })
    }, 2000)
}

store.dispatch(fetchData)
console.log(store.getState());
