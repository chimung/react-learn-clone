import FikeNode, { FikeNodeStruct, cloneDumpFikeNode, renderFikeTree } from "./FikeNode";

function createElement(...agrs) {
    return FikeNode(...agrs);
}

export function render(fikeTree: FikeNodeStruct, container: HTMLElement) {
    fikeTree.relations.parent = cloneDumpFikeNode("ROOT")
    fikeTree.relations.parent.element = container;
    fikeTree.relations.parent.isDirty = false;

    return renderFikeTree(fikeTree);
}

export default {
    createElement,
    render
}

export { FikeNodeStruct } from "./FikeNode";