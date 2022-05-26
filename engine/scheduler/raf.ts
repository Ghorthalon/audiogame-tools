import { SchedulerNode } from './node';

export class RAFTimer {
	public isStarted: boolean;
	public node: SchedulerNode;
	public constructor(node: SchedulerNode) {
		this.isStarted = false;
		this.node = node;
	}

	public start() {
		this.isStarted = true;
		this.schedule();
	}

	public stop() {
		this.isStarted = false;
	}

	public schedule() {
		window.requestAnimationFrame(this.handleResolve.bind(this));
	}

	public handleResolve() {
		if (this.node) {
			this.node.func(1);
			if (this.isStarted) {
				this.schedule();
			}
		}
	}
}
