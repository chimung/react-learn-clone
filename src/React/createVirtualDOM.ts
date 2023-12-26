enum NODE_TYPE {
    Text,
    Native
}
interface Node {
    tag: string|null,
    type: NODE_TYPE,
    props: Record<string, any>,
    children: Node[],
    content: string|number|null
}

function cloneNode(type: NODE_TYPE, props: Record<string, any>): Node {
    return {
        tag: null,
        type,
        props,
        children: [],
        content: null
    }
}

export function createVirtualDOM(...options) {
    const [tagName, attrs, ...children] = options;
    if (typeof tagName === 'function') {
        return tagName();
    }

    const node = cloneNode(NODE_TYPE.Native, attrs);
    if (children.length > 0) {
        children.forEach(child => {
            let node: Node;
            if (['string', 'number'].includes(typeof child)) {
                node = cloneNode(NODE_TYPE.Text, {});
                node.content = `${child}`; // Convert to string
            } else {
                node = child;
            }
        })
    }

    return node;
}