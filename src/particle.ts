import type { Mouse } from "./mouse";

export interface ParticleOptions {
	x: number;
	y: number;
	size: number;
	mouse: Mouse;
	directionX: number;
	directionY: number;
	canvas: HTMLCanvasElement;
	color?: string;
}

export class Particle {
	x: number;
	y: number;
	size: number;
	#directionX: number;
	#directionY: number;
	#mouse: Mouse;
	#canvas: HTMLCanvasElement;
	#color: string;

	constructor(options: ParticleOptions) {
		this.x = options.x;
		this.y = options.y;
		this.size = options.size;
		this.#directionX = options.directionX;
		this.#directionY = options.directionY;
		this.#mouse = options.mouse;
		this.#canvas = options.canvas;
		this.#color = options.color ?? "#FFFFFF";
	}

	draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
		ctx.fillStyle = this.#color;
		ctx.fill();
	}

	update(): void {
		if (this.x > this.#canvas.width || this.x < 0) {
			this.#directionX = -this.#directionX;
		}

		if (this.y > this.#canvas.height || this.y < 0) {
			this.#directionY = -this.#directionY;
		}

		const deltaX = this.#mouse.x - this.x;
		const deltaY = this.#mouse.y - this.y;
		const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
		const maxAllowedDistance = this.#mouse.radius + this.size;

		if (distance < maxAllowedDistance) {
			if (this.#mouse.x < this.x && this.x < this.#canvas.width - this.size * 10) {
				this.x += 10;
			}
			if (this.#mouse.x > this.x && this.x > this.size * 10) {
				this.x -= 10;
			}
			if (this.#mouse.y < this.y && this.y < this.#canvas.height - this.size * 10) {
				this.y += 10;
			}
			if (this.#mouse.y > this.y && this.y > this.size * 10) {
				this.y -= 10;
			}
		}

		this.x += this.#directionX;
		this.y += this.#directionY;
	}
}