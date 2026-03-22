import { Mouse } from "./mouse";
import { Particle } from "./particle";

const DIAMETER_FACTOR = 2;
const PARTICLE_SIZE_RANGE = 5;
const MIN_PARTICLE_SIZE = 0.5;
const PARTICLE_AREA_DIVISOR = 8000;
const MAX_ABS_DIRECTION_SPEED = 0.75;
const CONNECTION_DISTANCE_DIVISOR = 7;
const OPACITY_DISTANCE_FACTOR = 20000;
const MOUSE_RADIUS_INIT_DIVISOR = 20;
const MOUSE_RADIUS_RESIZE_DIVISOR = 20;
const DIRECTION_RANGE = MAX_ABS_DIRECTION_SPEED * 2;

export interface ParticleAnimationOptions {
	canvasId: string;
	particleColor?: string;
	connectionColor?: string;
}

export class ParticleAnimation {
	#mouse: Mouse;
	#canvas: HTMLCanvasElement;
	#context: CanvasRenderingContext2D;
	#particleColor: string;
	#connectionColor: string;

	#particles: Particle[] = [];

	#getMouseRadius(divisor: number): number {
		return Math.min(this.#canvas.width, this.#canvas.height) / divisor;
	}

	constructor(options: ParticleAnimationOptions) {
		this.#canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;

		const context = this.#canvas.getContext("2d");
		if (!context) {
			throw new Error("No context was found");
		}

		this.#context = context;
		this.#particleColor = options.particleColor ?? "#FFFFFF";
		this.#connectionColor = options.connectionColor ?? "255,255,255";
		this.#canvas.width = window.innerWidth;
		this.#canvas.height = window.innerHeight;

		this.#mouse = new Mouse({
			x: 0,
			y: 0,
			radius: this.#getMouseRadius(MOUSE_RADIUS_INIT_DIVISOR),
		});

		this.#registerEventListeners();
	}

	#init(): void {
		this.#particles = [];
		const count = (this.#canvas.width * this.#canvas.height) / PARTICLE_AREA_DIVISOR;

		for (let i = 0; i < count; ++i) {
			const size = Math.random() * PARTICLE_SIZE_RANGE + MIN_PARTICLE_SIZE;
			const x = Math.random() * (this.#canvas.width - size * DIAMETER_FACTOR);
			const y = Math.random() * (this.#canvas.height - size * DIAMETER_FACTOR);
			const directionX = Math.random() * DIRECTION_RANGE - MAX_ABS_DIRECTION_SPEED;
			const directionY = Math.random() * DIRECTION_RANGE - MAX_ABS_DIRECTION_SPEED;

			this.#particles.push(
				new Particle({
					x,
					y,
					size,
					directionX,
					directionY,
					mouse: this.#mouse,
					canvas: this.#canvas,
					color: this.#particleColor,
				}),
			);
		}
	}

	#animate(): void {
		requestAnimationFrame(() => this.#animate());
		this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		for (const p of this.#particles) {
			p.update();
			p.draw(this.#context);
		}

		this.#connect();
	}

	#connect(): void {
		for (let i = 0; i < this.#particles.length; ++i) {
			for (let j = i + 1; j < this.#particles.length; ++j) {
				const deltaX = this.#particles[i].x - this.#particles[j].x;
				const deltaY = this.#particles[i].y - this.#particles[j].y;
				const distance = deltaX * deltaX + deltaY * deltaY;

				const maxConnectionDistance =
					(this.#canvas.width / CONNECTION_DISTANCE_DIVISOR) *
					(this.#canvas.height / CONNECTION_DISTANCE_DIVISOR);

				if (distance < maxConnectionDistance) {
					const opacity = 1 - distance / OPACITY_DISTANCE_FACTOR;

					this.#context.strokeStyle = `rgba(${this.#connectionColor},${opacity})`;
					this.#context.lineWidth = 1;
					this.#context.beginPath();
					this.#context.moveTo(this.#particles[i].x, this.#particles[i].y);
					this.#context.lineTo(this.#particles[j].x, this.#particles[j].y);
					this.#context.stroke();
				}
			}
		}
	}

	#registerEventListeners(): void {
		window.addEventListener("mousemove", (e) => this.#mouse.update(e.x, e.y));

		window.addEventListener("mouseout", () =>
			this.#mouse.update(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
		);

		window.addEventListener("resize", () => {
			this.#canvas.width = window.innerWidth;
			this.#canvas.height = window.innerHeight;
			this.#mouse.radius = this.#getMouseRadius(MOUSE_RADIUS_RESIZE_DIVISOR);
			this.#init();
		});
	}

	setThemeColors(particleColor: string, connectionColor: string): void {
		this.#particleColor = particleColor;
		this.#connectionColor = connectionColor;

		for (const particle of this.#particles) {
			particle.setColor(particleColor);
		}
	}

	start(): void {
		this.#init();
		this.#animate();
	}
}