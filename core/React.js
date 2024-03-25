let nextWork = null;
let root = null;

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
      children: children.map((child) => {
        const isText = typeof child === "string" || typeof child === "number";
        return isText ? createTextNode(child) : child;
      }),
    },
  };
};

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
  root = nextWork;
  requestIdleCallback(workLoop);
};

function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWork) {
    nextWork = performUnitOfWork(nextWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWork && root) {
    commitRoot();
    root = null;
  }
  requestIdleCallback(workLoop);
}

const commitRoot = () => {
  commitWork(root.child);
};

const commitWork = (work) => {
  if (!work) {
    return;
  }
  let parentWork = work.parent;
  while (!parentWork.dom) {
    parentWork = parentWork.parent;
  }
  if (work.dom) {
    parentWork.dom.append(work.dom);
  }
  commitWork(work.child);
  commitWork(work.sibling);
};

function createDom(type) {
  return type === "TEXT_NODE"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") dom[key] = props[key];
  });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function updateFunctionComponent(work) {
  const children = [work.type(work.props)];
  initChildren(work, children);
}

function updateHoistComponent(work) {
  if (!work.dom) {
    const el = (work.dom = createDom(work.type));
    updateProps(el, work.props);
  }
  initChildren(work, work.props.children);
}

const performUnitOfWork = (work) => {
  const isFuncComponent = typeof work.type === "function";
  if (isFuncComponent) updateFunctionComponent(work);
  else updateHoistComponent(work);

  if (work.child) {
    return work.child;
  }

  if (work.sibling) {
    return work.sibling;
  }

  let nextWork = work.parent;
  while (nextWork) {
    if (nextWork.sibling) {
      return nextWork.sibling;
    }
    nextWork = nextWork.parent;
  }
};

const React = {
  createElement,
  render,
};

export default React;
