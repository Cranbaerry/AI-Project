<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadFull } from 'tsparticles';
	import type { Engine } from 'tsparticles-engine';
	import { Button, Spinner, Input } from 'sveltestrap';
	import { deserialize } from '$app/forms';
	import { Lightbox } from 'svelte-lightbox';
	import { PUBLIC_APP_AUTHOR, PUBLIC_APP_DESCRIPTION, PUBLIC_APP_NAME } from '$env/static/public';

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

		const res = deserialize(await response.text());
		if (res.type === 'success') {
			imageLink = String(res.data);
			lightboxProgrammaticController.open();
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta name="description" content={PUBLIC_APP_DESCRIPTION} />
	<meta name="author" content={PUBLIC_APP_AUTHOR} />
</svelte:head>

<Particles id="tsparticles" options={particlesOptions} {particlesInit} />

<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
	<header class="mb-auto">
		<div>
			<!-- <nav class="nav nav-masthead justify-content-center float-md-end">
				<a class="nav-link" aria-current="page" href="">Home</a>
				<a class="nav-link" href="https://arxiv.org/abs/2204.06125">Research Paper</a>
				<a class="nav-link" href="https://openai.com/dall-e-2/">About</a>
				<a class="nav-link" href="">Source Code</a>
			</nav> -->
		</div>
	</header>

	<main class="px-3">
		<h2 class="tracking-wide text-2xl font-bold mb-3 display-4">
			{PUBLIC_APP_NAME}
		</h2>
		<div class="lead form-text mb-3 text-white">
			{PUBLIC_APP_DESCRIPTION}
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

	<footer class="mt-auto text-white-50 ">
		<p class="mb-auto d-inline">
			<a
				href="https://arxiv.org/abs/2204.06125"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">Research Paper</a
			>
			&bull;
			<a
				href="https://openai.com/dall-e-2/"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">About</a
			>
			&bull;
			<a
				href="https://github.com/Cranbaerry/AI-Project"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">Source Code</a
			>
		</p>
		<p class="font-weight-light">
			Powered by
			<a
				href="https://openai.com/dall-e-2/"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">DALL·E 2</a
			>
			model from OpenAI.<br />
			<!-- &copy; Made with ❤️ by Naufal, Daniel, and Yosua 2022 -->
		</p>
	</footer>
</div>
