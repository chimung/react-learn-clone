import FiberLike from "../fiberLike";
import InternalState from './internalState';

function createQueue() {
    const queue: any[] = [];
    let timer;
    let promise;

    return {
        push: (item) => {
            queue.push(item);

            if (!promise) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    const loopHandler = () => {
                        const task = queue.shift();
                        if (task) {
                            task();
                            useStateObject.resetIndex();
                            const root = InternalState.getRootComponent()
                            promise = FiberLike.render(root(), InternalState.getContainer());
                            promise.then(loopHandler)
                        } else {
                            promise = null;
                        }
                    }

                    loopHandler()
                })
            }


        },
        numRemainingItems: () => queue.length
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

export default {
    createElement: FiberLike.createElement,
    useState: useStateObject.useState(),
    render: (FC, container) => {
        InternalState.setContainer(container);
        InternalState.setRootComponent(FC);

        FiberLike.render(FC(), container)
    }
};