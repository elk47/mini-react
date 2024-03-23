const createTextNode = (val) => {
    return {
        type: "TEXT_NODE",
        props: {
            nodeValue: val,
            children: []
        }
    }
}

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => typeof child === "string" ? createTextNode(child) : child)
        }
    }
}

const render = (element, container) => {
    const dom = element.type === "TEXT_NODE"
        ? document.createTextNode(element.props.nodeVal)
        : document.createElement(element.type)
    Object.keys(element.props).forEach((key) => {
        if (key !== "children") {
            dom[key] = element.props[key]
        }
    })
    element.props.children.forEach(child => {
        render(child, dom)
    })
    container.append(dom)
}

const React = {
    createElement,
    render,
}
export default React