import React from '../core/React.js';

let countRoot = 0;
let countFoo = 0;
let countBar = 0;
// let showBar = false;

const Foo = () => {
  const handleClick = () => {
    console.log('foo');
    const update = React.update();
    countFoo++;
    update();
  };
  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  );
};

const Bar = () => {
  const handleClick = () => {
    console.log('bar');
    const update = React.update();
    countBar++;
    update();
  };
  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  );
};

const App = () => {
  const handleClick = () => {
    console.log('app');
    const update = React.update();
    countRoot++;
    update();
  };
  return (
    <div>
      count:{countRoot}
      <button onClick={handleClick}>click</button>
      <Foo />
      <Bar />
    </div>
  );
};

export default App;
