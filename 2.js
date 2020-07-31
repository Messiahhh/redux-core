// 什么是中间件
const createStore = (reducer) => {
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

store = createStore(reducer)

let dispatch = store.dispatch

store.dispatch = (...args) => {
    console.log(store.getState()) 
    dispatch(...args)
    console.log(store.getState()) 
}




store.dispatch({
    type: 'ADD'
})
