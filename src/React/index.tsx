import FiberLike from "../fiberLike";
import { createVirtualDOM } from "./createVirtualDOM";
import InternalState from './internalState';
import { Queue } from './queue';
import { PriorityType, QueuePriority, Task } from "./queuePriority";
function setupQueue(queue: Queue) {
    let promise;

    function loopTaskHandler() {

        if (!queue.isEmpty()) {
            const task = queue.pop();
            task.job();
            useStateObject.resetIndex();
            const root = InternalState.getRootComponent()
            promise = FiberLike.render(root(), InternalState.getContainer());
            promise.then(loopTaskHandler)
        } else {
            promise = null;
        }
    }

    return {
        pushEvent: (job) => {
            queue.push(new Task(PriorityType.EVENT, job));
            if (!promise) {
                loopTaskHandler()
            }
        },
        push: (job) => {
            queue.push(new Task(PriorityType.RENDER, job));
            if (!promise) {
                loopTaskHandler()
            }
        },
    }
}

const queueTasks = setupQueue(new QueuePriority());

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
                        queueTasks.pushEvent(() => {
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
    createElement: createVirtualDOM,
    useState: useStateObject.useState(),
    render: (FC, container) => {
        InternalState.setContainer(container);
        InternalState.setRootComponent(FC);

        FiberLike.render(FC(), container)
    }
};