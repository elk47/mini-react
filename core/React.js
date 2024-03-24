const createTextNode = (val) => {
  return {
    type: "TEXT_NODE",
    props: {
      nodeValue: val,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextNode(child) : child
      ),
    },
  };
};
let nextWork = null;

const render = (element, container) => {
  nextWork = {
    dom: container,
    props: {
      children: [element],
    },
    parent: null,
    child: null,
    sibling: null,
  };
  requestIdleCallback(workLoop);
};

function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWork) {
    nextWork = performUnitOfWork(nextWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
}

const performUnitOfWork = (work) => {
  if (!work.dom) {
    const dom = (work.dom =
      work.type === "TEXT_NODE"
        ? document.createTextNode("")
        : document.createElement(work.type));
    work.parent.dom.append(dom);
    Object.keys(work.props).forEach((key) => {
      if (key !== "children") {
        dom[key] = work.props[key];
      }
    });
  }
  const children = work.props.children;
  let prevChild = null;
  children.forEach((child) => {
    const newChild = {
      type: child.type,
      props: child.props,
      parent: work,
      child: null,
      sibling: null,
      dom: null,
    };
    if (!prevChild) {
      work.child = newChild;
    } else {
      prevChild.sibling = newChild;
    }
    prevChild = newChild;
  });
  if (work.child) {
    return work.child;
  }
  if (work.sibling) {
    return work.sibling;
  }

  return work.parent.sibling;
};

const React = {
  createElement,
  render,
};
export default React;
