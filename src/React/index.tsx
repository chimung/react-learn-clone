import FiberLike, { FikeNodeStruct } from "../fiberLike";
import InternalState from './internalState'
function useStateFactory() {
    const states: unknown[] = [];
    let index = 0;

    return {
        resetIndex: () => {
            index = 0;
        },
        useState: () => {
            return (initialState) => {
                let state;
                if (states[index] !== undefined) {
                    state = states[index];
                } else {
                    state = initialState;
                    states[index] = initialState;
                }

                const setStateFactory = () => {
                    const savedIndex = index
                    return (value) => {
                        if (typeof value === "function") {
                            states[savedIndex] = value(states[savedIndex]);
                        } else {
                            states[savedIndex] = value;
                        }
                        reRender();
                    }
                };
                const useState = setStateFactory()
                index += 1;
                return [state, useState];
            }
        }
    }
}

const useStateObject = useStateFactory();

let timer;
function reRender() {
    useStateObject.resetIndex();
    clearTimeout(timer);
    const root = InternalState.getRootComponent()
    timer = setTimeout(() => FiberLike.render(root(), InternalState.getContainer()))
}
export default {
    createElement: FiberLike.createElement,
    useState: useStateObject.useState(),
    render: (FC, container) => {
        InternalState.setContainer(container);
        InternalState.setRootComponent(FC);

        FiberLike.render(FC(), container)
    },
    reRender
};