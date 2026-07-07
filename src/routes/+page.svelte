<script>
	import { onMount } from 'svelte';
	import DesktopIntro from '$lib/components/Intro/DesktopIntro.svelte';
	import Intro_Section4 from '$lib/components/Intro/Intro_Section4.svelte';

	let isMobile = $state(false);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 900;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

{#if isMobile}
	<Intro_Section4 />
{:else}
	<DesktopIntro />
{/if}