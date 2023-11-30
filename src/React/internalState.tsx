let container;
let rootComponent;
export default {
    setContainer: (value: HTMLElement) => container = value,
    getContainer: () => container,
    setRootComponent: (value) => rootComponent = value,
    getRootComponent: () => rootComponent
}