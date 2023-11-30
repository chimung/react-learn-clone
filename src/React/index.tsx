import FiberLike from "../fiberLike";
import InternalState from './internalState';

function createQueue() {
    const queue: any[] = [];
    return {
        push: (item) => queue.push(item),
        pop: () => queue.shift(),
    }
}

const queueTasks = createQueue();

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
                        queueTasks.push(() => {
                            if (typeof value === "function") {
                                states[savedIndex] = value(states[savedIndex]);
                            } else {
                                states[savedIndex] = value;
                            }
                            reRender()
                        })
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
    const root = InternalState.getRootComponent()
    FiberLike.render(root(), InternalState.getContainer())
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