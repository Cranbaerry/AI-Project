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

		const res: any = deserialize(await response.text());
		console.log(res);
		if (res.type === 'success') {
			imageLink = String(res.data);
			lightboxProgrammaticController.open();
		} else {
			alert(res.error.message || 'Something went wrong');
		}

		loading = false;
	}

	var listWho = [
		'An astronaut is',
		'An alien is',
		'A doctor is',
		'A scientist is',
		'An actor is',
		'A writer is',
		'A photographer is',
		'A pilot is',
		'You are',
		'A kid is',
		'An animal is',
		'A teacher is',
		'A police officer is',
		'A fire fighter is',
		'A nurse is',
		'A ninja is',
		'A dinosaur is',
		'A robot is'
	];

	var listWhat = [
		'sleeping',
		'walking',
		'running',
		'standing',
		'looking',
		'exploring',
		'creating',
		'writing',
		'painting',
		'observing',
		'jumping',
		'eating food',
		'floating',
		'flying'
	];

	var listWhere = [
		'at home',
		'in an/the office',
		'in a laboratory',
		'at a factory',
		'underwater',
		'in space',
		'on an Alien Planet/Moon',
		'on a Solar System Planet/Moon',
		'at school',
		'at the the park',
		'at the the pool'
	];

	var listWhen = ['in the past', '', 'in the future', 'during the day', 'at night', 'after school'];

	var listHow = [
		'in a car',
		'in a spaceship',
		'in a rocket',
		'on a rover',
		'by a satellite',
		'in a space station',
		'by a space station',
		'on a horse',
		'in an airplane',
		'in a firetruck',
		'in a police car',
		'on a bicycle',
		'on a motorcycle',
		'on a unicycle',
		'on a dinosaur',
		'in a boat',
		'in a seaplane'
	];

	function getIdeas() {
		var Who1 = Math.floor(Math.random() * listWho.length);
		var What1 = Math.floor(Math.random() * listWhat.length);
		var Where1 = Math.floor(Math.random() * listWhere.length);
		var When1 = Math.floor(Math.random() * listWhen.length);
		var How1 = Math.floor(Math.random() * listHow.length);

		return [listWho[Who1], listWhat[What1], listWhere[Where1], listWhen[When1], listHow[How1]]
			.filter((s) => s)
			.join(' ')
			.trim();
	}

	function handleClickIdea(e: Event) {
		prompt = getIdeas();
	}

	let placeholder = '';
	let text = '';
	let index = 0;
	let isDoneTyping = false;

	function typeWriter() {
		if (index < text.length) {
			isDoneTyping = false;
			placeholder += text.charAt(index);
			index++;
			setTimeout(typeWriter, 50);
		} else {
			isDoneTyping = true;
		}
	}

	$: if (isDoneTyping) {
		setTimeout(startTyping, 3000);
	}

	function startTyping() {
		console.log('Start typing again..');
		placeholder = '';
		text = getIdeas();
		index = 0;
		typeWriter();
	}

	startTyping();
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta name="description" content={PUBLIC_APP_DESCRIPTION} />
	<meta name="author" content={PUBLIC_APP_AUTHOR} />
</svelte:head>

<Particles id="tsparticles" options={particlesOptions} {particlesInit} />

<div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
	<header class="mb-auto">
		<div />
	</header>

	<main class="px-3">
		<h2 class="tracking-wide text-2xl font-bold mb-3 display-4">
			{PUBLIC_APP_NAME}
		</h2>
		<div class="lead form-text mb-3 text-white">
			{PUBLIC_APP_DESCRIPTION}
		</div>
		<form on:submit|preventDefault>
			<div class="input-group mb-3">
				<Input
					bind:value={prompt}
					type="text"
					name="text"
					{placeholder}
					autocomplete="off"
					id="prompt"
					autofocus
				/>

				<Button color="secondary" type="button" on:click={() => prompt = getIdeas() }>💭</Button>
			</div>

			<Button
				color="secondary"
				size="lg"
				on:click={handleClick}
				disabled={loading}
				class="mt-4 fw-bold {loading_class}"
			>
				{#if loading}
					<Spinner size="sm" type="grow" />
					Brainstorming...
				{:else}
					Think about it!
				{/if}
			</Button>
		</form>

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
				href="https://github.com/Cranbaerry/AI-Project"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">Source Code</a
			>
			&bull;
			<a
				href="https://openai.com/dall-e-2/"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">About</a
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
			model from
			<a
				href="https://openai.com"
				class="link-light text-decoration-none"
				target="_blank"
				rel="noreferrer">OpenAI</a
			>.
		</p>
	</footer>
</div>
