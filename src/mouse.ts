export interface MouseOptions {
	x: number;
	y: number;
	radius: number;
}

export class Mouse {
	x: number;
	y: number;
	radius: number;

	constructor(options: MouseOptions) {
		this.x = options.x;
		this.y = options.y;
		this.radius = options.radius;
	}

	update(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

	getPosition(): { x: number; y: number } {
		return { x: this.x, y: this.y };
	}
}