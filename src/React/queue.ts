export interface Task {
    priority: number
    job: () => void;
}

export abstract class Queue {
    abstract push(t: Task);
    abstract pop(): Task;
    abstract isEmpty(): boolean;
}