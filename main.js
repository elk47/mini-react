const dom = document.createElement('div')
dom.id = 'app'
const root = document.querySelector("#root")
root.appendChild(dom)

const textNode = document.createTextNode('app')
dom.appendChild(textNode)