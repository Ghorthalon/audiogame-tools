import { SchedulerNode } from './node';

export class Timer {
	public time: number;
	public lastTime: number;
	public fluctuation: number;
	public node: SchedulerNode;
	public isStarted: boolean;
	public intervalID: number;

	public constructor(time: number, node: SchedulerNode) {
		this.time = time;
		this.node = node;
		this.isStarted = false;
		this.fluctuation = 0;
	}

	public start() {
		this.isStarted = true;
		this.lastTime = performance.now();
		this.schedule();
	}

	public stop() {
		if (this.isStarted) {
			clearTimeout(this.intervalID);
			this.isStarted = false;
		}
	}

	public schedule() {
		const now = performance.now();
		const elapsed = now - this.lastTime;
		this.fluctuation = elapsed - this.time;
		this.lastTime = now;

		const toWait = Math.max(0, this.time - this.fluctuation);
		this.intervalID = window.setTimeout(() => this.handleResolve(elapsed), toWait);
	}

	public handleResolve(dt: number) {
		if (this.node) {
			this.node.func(dt / 1000); // Assuming time is in milliseconds
		}

		if (this.isStarted) {
			this.schedule();
		}
	}
}
