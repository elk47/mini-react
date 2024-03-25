import React from "../core/React.js"

const Counter = () => {
    return <div>test</div>
}

const CounterWrapper = () => {
    return <div>
        <Counter></Counter>
        <Counter></Counter>
    </div>
}

const App = <div>app<CounterWrapper></CounterWrapper></div>

export default App