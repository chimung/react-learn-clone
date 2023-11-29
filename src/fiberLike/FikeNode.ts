export type FikeNodeStruct = {
    relations: {
        parent: FikeNodeStruct,
        sibling: FikeNodeStruct | null,
        firstChild: FikeNodeStruct | null
    },
    data: {
        tagName: string,
        attrs: Record<string, any>,
        content: any
    },
    isDirty: boolean;
    element?: HTMLElement
}

export function cloneDumpFikeNode(tagName, attrs = {}): FikeNodeStruct {
    return {
        relations: {
            parent: null as any,
            sibling: null,
            firstChild: null
        },
        data: {
            tagName,
            attrs,
            content: null
        },
        isDirty: false
    }
}

export default function FikeNode(...options) {
    const [tagName, attrs, ...children] = options;

    // Create current node
    let currentFike: FikeNodeStruct
    if (typeof tagName == 'function') {
        currentFike = cloneDumpFikeNode('FUNCTIONAL_COMPONENT')
        currentFike.data.content = tagName;
    } else {
        currentFike = cloneDumpFikeNode(tagName, attrs)
    }

    // Create children node
    currentFike.data.content = currentFike.data.content == null ? '' : currentFike.data.content
    const flattenChildren = children.reduce((result: FikeNodeStruct[], current) => {
        if (Array.isArray(current)) {
            result.push(...current)
        } else {
            result.push(current)
        }
        return result;
    }, [])

    flattenChildren.reduce((siblingFike: FikeNodeStruct | null, childFike: FikeNodeStruct | string | number | Function) => {
        let node;

        // assign children for current
        const assignRelationship = (node: FikeNodeStruct, parent: FikeNodeStruct, sibling: FikeNodeStruct | null) => {
            if (sibling) {
                sibling.relations.sibling = node;
            } else {
                parent.relations.firstChild = node;
            }
        }
        if (['string', 'number'].includes(typeof childFike)) {
            node = cloneDumpFikeNode('TEXTNODE');
            node.relations.parent = currentFike;
            assignRelationship(node, currentFike, siblingFike)
            node.data.content = childFike
        } else {
            node = childFike as FikeNodeStruct
            node.relations.parent = currentFike;
            assignRelationship(node, currentFike, siblingFike)
        }

        return node;
    }, null)

    return currentFike;
}

export function renderFikeNode(node: FikeNodeStruct) {
    const tagName = node.data.tagName;
    let element;

    switch (tagName) {
        case 'TEXTNODE':
            element = document.createTextNode(node.data.content);
            node.element = element;
            node.relations.parent.element?.appendChild(element)
            break;
        case 'FUNCTIONAL_COMPONENT':
            const fikeTree: FikeNodeStruct = (node.data.content as unknown as Function)();

            // Connect to sub tree
            fikeTree.relations.parent = node;
            node.relations.firstChild = fikeTree;
            node.element = node.relations.parent.element;

            // renderFikeTree(fikeTree)
            break;
        default:
            element = document.createElement(node.data.tagName)
            node.element = element;
            node.relations.parent.element?.appendChild(element);
            const attrs = node.data.attrs;
            Object.keys(attrs)
                .filter((prop) => !prop.startsWith("__"))
                .forEach((prop) => {
                    if (typeof attrs[prop] == "function") {
                        element[prop] = attrs[prop];
                    } else {
                        element.setAttribute(prop, attrs[prop]);
                    }
                });
    }

}

export function renderFikeTree(node: FikeNodeStruct) {
    renderFikeNode(node);

    requestIdleCallback((timeoutObject) => {
        if (timeoutObject.timeRemaining() > 0 || timeoutObject.didTimeout) {
            node.relations.firstChild && renderFikeTree(node.relations.firstChild)
            node.relations.sibling && renderFikeTree(node.relations.sibling)
        }
    }, { timeout: 100 })
}