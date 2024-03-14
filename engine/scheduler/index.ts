import { EventBus } from '../event-bus';
import { RAFTimer } from './raf';
import { Timer } from './timer';

export class Scheduler extends EventBus {
	public logicTimer: Timer;
	public drawTimer: RAFTimer;
	public constructor(public logicPerSecond: number) {
		super();
		this.init();
	}

	public init() {
		const interval = 1000 / this.logicPerSecond;
		this.logicTimer = new Timer(interval, {
			id: 0,
			func: (dt: number) => {
				this.emit('preupdate.logic');
				this.emit('update.logic', dt);
				this.emit('postupdate.logic');
			}
		});
		this.drawTimer = new RAFTimer({
			id: 1,
			func: (dt: number) => {
				this.emit('preupdate.draw');
				this.emit('update.draw', dt);
				this.emit('postupdate.draw');
			}
		});
	}

	public start() {
		this.logicTimer.start();
		this.drawTimer.start();
	}

	public stop() {
		this.logicTimer.stop();
		this.drawTimer.stop();
	}
}
