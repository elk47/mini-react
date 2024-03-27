import React from '../core/React.js';

const Counter = () => {
    return <div>test</div>;
};
const CounterWrapper = () => {
    return (
        <div>
            <Counter></Counter>
        </div>
    );
};
let count = 0;
const handleClick = () => {
    console.log('click')
    count++
    React.update()
}

const App = () => (
    <div>
        <button onClick={handleClick}>click</button>
    </div>
);

export default App;
