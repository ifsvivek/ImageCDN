<script>
	import { onMount } from 'svelte';

	let canvas;
	let ctx;
	let particles = [];
	const particleCount = 50;
	const connectionDistance = 100;
	const baseColor = '#34d399'; // emerald-400

	class Particle {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.size = Math.random() * 2 + 1;
			this.speedX = Math.random() * 1 - 0.5;
			this.speedY = Math.random() * 1 - 0.5;
		}

		update() {
			this.x += this.speedX;
			this.y += this.speedY;

			if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
			if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
		}

		draw() {
			ctx.fillStyle = baseColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function init() {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		particles = [];

		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
		}
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach((particle) => {
			particle.update();
			particle.draw();

			particles.forEach((other) => {
				const dx = particle.x - other.x;
				const dy = particle.y - other.y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < connectionDistance) {
					ctx.beginPath();
					ctx.strokeStyle = `rgba(52, 211, 153, ${1 - distance / connectionDistance})`;
					ctx.lineWidth = 0.5;
					ctx.moveTo(particle.x, particle.y);
					ctx.lineTo(other.x, other.y);
					ctx.stroke();
				}
			});
		});

		requestAnimationFrame(animate);
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		init();
		animate();

		const resizeHandler = () => {
			init();
		};

		window.addEventListener('resize', resizeHandler);
		return () => window.removeEventListener('resize', resizeHandler);
	});
</script>

<canvas class="background-canvas" bind:this={canvas}></canvas>

<style>
	.background-canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0.3;
		background: transparent;
	}
</style>
