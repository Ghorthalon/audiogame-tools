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
	}

	public start() {
		this.isStarted = true;
		this.schedule();
	}

	public stop() {
		if (this.isStarted) {
			if (this.intervalID) {
				clearTimeout(this.intervalID);
				this.intervalID = null;
				this.isStarted = false;
			}
		}
	}

	public schedule() {
		let toWait = this.time;
		if (this.lastTime) {
			const fluc = Date.now() - this.lastTime;
			this.fluctuation = fluc;
			toWait -= fluc;
		}
		this.lastTime = Date.now();
		this.intervalID = <any>setTimeout(this.handleResolve.bind(this), toWait);
	}

	public handleResolve() {
		this.lastTime = Date.now();
		if (this.node) {
			this.node.func(this.time / this.lastTime);
		}
		if (this.isStarted) {
			this.schedule();
		}
	}
}
