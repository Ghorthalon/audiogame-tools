import { SchedulerNode } from './node';

export class RAFTimer {
	public isStarted: boolean;
	private lastTime: number = 0;
	private currTime: number = 0;
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

	public handleResolve(dt: number) {
		if (this.node) {
			if (!this.lastTime) {
				this.lastTime = dt;
				this.node.func(1);
			} else {
				const delta = dt - this.lastTime;
				this.lastTime = dt;
				this.node.func(delta / 1000);
			}
			if (this.isStarted) {
				this.schedule();
			}
		}
	}
}
