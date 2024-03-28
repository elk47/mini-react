let nextWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = [];
const createTextNode = text => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode =
          typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
};

const render = (element, container) => {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
  };
  nextWork = wipRoot;
};

const update = () => {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  nextWork = wipRoot;
};

function workLoop(deadline) {
  let shouldYield = false;

  while (!shouldYield && nextWork) {
    nextWork = performUnitOfWork(nextWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWork && wipRoot) {
    commitRoot();
    currentRoot = wipRoot;
    wipRoot = null;
  }
  requestIdleCallback(workLoop);
}

const commitRoot = () => {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  deletions = [];
};

const commitWork = fiber => {
  if (!fiber) {
    return;
  }
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === 'PLACEMENT') {
    if (fiber.dom) {
      fiberParent.dom.appendChild(fiber.dom);
    }
  } else if (fiber.effectTag === 'UPDATE') {
    if (fiber.dom) {
      updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
};

const commitDeletion = fiber => {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
};

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  // Object.keys(props).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventType = key.substring(2).toLowerCase();
  //       dom.addEventListener(eventType, props[key]);
  //     }
  //     dom[key] = props[key];
  //   }
  // });
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.toLowerCase().substring(2);
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcilChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'UPDATE',
        alternate: oldFiber,
      };
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: 'PLACEMENT',
      };
      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcilChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }
  const children = fiber.props.children;
  reconcilChildren(fiber, children);
}

const performUnitOfWork = fiber => {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
};

requestIdleCallback(workLoop);

const React = {
  createElement,
  update,
  render,
};

export default React;
