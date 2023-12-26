import { Queue } from '@datastructures-js/queue';
import { Queue as QueueFiber, Task as TaskFiber } from './queue';
export enum PriorityType {
    RENDER = '0',
    EVENT = '1',
}

export class Task implements TaskFiber {
    priority: number;
    priorityType: PriorityType;
    job: () => void;

    constructor(priorityType: PriorityType, job) {
        this.priorityType = priorityType;
        this.job = job;
        this.priority = 0;
    }
}

export class QueuePriority extends QueueFiber {
    tasks: (Task|null)[] = [];
    trackPriority: Record<PriorityType, Queue<number>> = {
        [PriorityType.RENDER]: new Queue(),
        [PriorityType.EVENT]: new Queue(),
    };


    constructor() {
        super();
        this.push(new Task(PriorityType.RENDER, () => {}));
    }

    private swapTask(i1: number, i2: number) {
        let swapValue = this.tasks[i1];
        this.tasks[i1] = this.tasks[i2];
        this.tasks[i2] = swapValue;
    }

    private assignPriority(task: Task) {
        let base = 0;
        if (this.trackPriority[task.priorityType].isEmpty()) { 
            base = parseInt(task.priorityType) * 1000;
        } else {
            base = this.trackPriority[task.priorityType].back()
        }
        task.priority = ++base;
        this.trackPriority[task.priorityType].push(task.priority);
    }

    push(task: Task) {
        this.assignPriority(task);
        this.tasks.push(task);

        let index = this.tasks.length - 1;
        while(index > 0) {
            const pIndex = Math.floor(index / 2);
            if (this.tasks[pIndex]!.priority > this.tasks[index]!.priority) {
                this.swapTask(pIndex, index);
                index = pIndex;
            } else {
                break;
            }
        }
    }

    isEmpty() {
        return this.tasks.length <= 1;
    }

    getPriority(i: number) {
        return this.tasks[i]!.priority;
    }

    pop(): Task {
        if (this.isEmpty()) throw Error("Dont have remaining task");
        const result = this.tasks[1]!;

        // Move last task to the top of tree
        this.tasks[1] = this.tasks[this.tasks.length - 1];
        this.tasks.splice(this.tasks.length - 1, 1);

        // Correct position
        let index = 1;
        const len = this.tasks.length
        while(index < len) {
            const lIndex = index * 2;
            const rIndex = lIndex + 1;
            let isGreaterThanLeft = false;
            let isGreaterThanRight = false;

            if (lIndex < len && this.getPriority(lIndex) < this.getPriority(index)) {
                isGreaterThanLeft = true;
            }

            if (rIndex < len && this.getPriority(rIndex) < this.getPriority(index)) {
                isGreaterThanRight = true;
            }

            if (isGreaterThanLeft && isGreaterThanRight) {
                const targetIndex = this.getPriority(lIndex) < this.getPriority(rIndex) ? lIndex : rIndex;
                this.swapTask(targetIndex, index);
                index = targetIndex;
            } else if (isGreaterThanLeft) {
                this.swapTask(lIndex, index);
                index = lIndex;
            } else if (isGreaterThanRight) {
                this.swapTask(rIndex, index);
                index = rIndex;
            }
        }

        return result;
    }
}
