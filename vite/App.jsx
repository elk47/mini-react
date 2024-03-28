import React from '../core/React.js';

let showBar = false;
const Counter = () => {
  const Foo = () => <div>foo</div>;
  const bar = <div>bar</div>;
  return (
    <div>
      Counter
      <div>{showBar ? bar : <Foo />}</div>
      <button onClick={handleShowBar}>showbar</button>
    </div>
  );
};
// const CounterWrapper = () => {
//   return (
//     <div>
//       <Counter></Counter>
//     </div>
//   );
// };
// let count = 0;

const handleShowBar = () => {
  showBar = !showBar;
  React.update();
};

const App = () => (
  <div>
    <Counter></Counter>
  </div>
);

export default App;
