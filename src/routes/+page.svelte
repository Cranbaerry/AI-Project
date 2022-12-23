<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadFull } from 'tsparticles';
	import type { Engine } from 'tsparticles-engine';
	import { Button, Spinner, Input } from 'sveltestrap';
	import { deserialize } from '$app/forms';
	import { Lightbox } from 'svelte-lightbox';
	let particlesOptions = {
		particles: {
			number: {
				value: 80,
				density: {
					enable: true,
					area: 800
				}
			},
			color: {
				value: ['#2EB67D', '#ECB22E', '#E01E5B', '#36C5F0']
			},
			shape: {
				type: 'circle'
			},
			opacity: {
				value: 1
			},
			size: {
				value: { min: 1, max: 8 }
			},
			links: {
				enable: true,
				distance: 150,
				color: '#808080',
				opacity: 1,
				width: 1
			},
			move: {
				enable: true,
				speed: 2,
				random: false,
				straight: false
			}
		},
		interactivity: {
			events: {
				onHover: {
					enable: true,
					mode: 'grab'
				},
				onClick: {
					enable: true,
					mode: 'push'
				}
			},
			modes: {
				grab: {
					distance: 140,
					links: {
						opacity: 1
					}
				},
				push: {
					quantity: 4
				}
			}
		}
	};

	let particlesInit = async (engine: Engine) => {
		await loadFull(engine);
	};

	let loading = false;
	$: loading_class = loading ? 'border-grey' : ' border-white bg-white';
	let prompt = '';
	let imageLink = '';
	let lightboxProgrammaticController: any;

	async function handleClick() {
		loading = true;
		const response = await fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				prompt: prompt
			})
		});

		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());
		if (result.type === 'success') {
			imageLink = String(result.data);
			lightboxProgrammaticController.open();
		}

		loading = false;
	}
</script>

<Particles id="tsparticles" options={particlesOptions} {particlesInit} />

<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
	<header class="mb-auto">
		<div />
	</header>

	<main class="px-3">
		<h1 class="tracking-wide text-2xl font-bold mb-3">
			Dall-E: <span>Create images from text</span>
		</h1>
		<div class="lead form-text mb-3 text-white">
			DALL-E is a language model developed by OpenAI that is capable of generating original images
			from text descriptions, using a combination of machine learning and neural network techniques.
		</div>
		<p class="lead">
			<Input bind:value={prompt} type="text" name="text" placeholder="Imagine something.." />
			<Button
				color="secondary"
				size="lg"
				on:click={handleClick}
				disabled={loading}
				class="mt-4 fw-bold {loading_class}"
			>
				{#if loading}
					<Spinner size="sm" type="grow" />
					Loading...
				{:else}
					Think about it!
				{/if}
			</Button>
		</p>

		<Lightbox
			enableFallbackThumbnail={false}
			bind:programmaticController={lightboxProgrammaticController}
		>
			<img src={imageLink} alt="Simple lightbox" />
		</Lightbox>
	</main>

	<footer class="mt-auto text-white-50">
		<p>&copy; Made with ❤️ by Naufal, Daniel, and Yosua 2022</p>
	</footer>
</div>
