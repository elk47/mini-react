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
            children
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
    console.log(dom)
    container.append(dom)
}

const props = {
    id: "app"
}
const textnode = createTextNode('app')
const vdom = createElement("div", props, textnode)

const dom = document.createElement(vdom.type)
dom.id = vdom.props.id
const root = document.querySelector("#root")
render(vdom, root)
