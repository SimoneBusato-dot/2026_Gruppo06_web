<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/variables.css';
	import '$lib/styles/reactions.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { createReaction } from '$lib/reaction.js';

	let { children } = $props();

	onNavigate((navigation) => {
		// Ripristina l'allineamento del contenitore delle reazioni dello scroll al cambio pagina
		if (typeof document !== 'undefined') {
			const rxContainer = document.getElementById('reactions-container');
			if (rxContainer) {
				rxContainer.style.transform = '';
				rxContainer.style.transition = '';
			}
		}

		if(document.startViewTransition){
			return new Promise((resolve) => {
				document.startViewTransition(async () => {
					resolve();
					await navigation.complete;
				})
			})
		}
	});

	onMount(() => {
		const handleGlobalClick = (e) => {
			// Evita lo spawn se l'utente clicca su elementi interattivi come bottoni, link, ecc.
			if (
				e.target.tagName === 'BUTTON' || 
				e.target.tagName === 'A' || 
				e.target.closest('button') || 
				e.target.closest('a')
			) {
				return;
			}
			createReaction(100, false, e.clientX, e.clientY);
		};

		window.addEventListener('pointerdown', handleGlobalClick);

		return () => {
			window.removeEventListener('pointerdown', handleGlobalClick);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
</svelte:head>

<Navbar />

{@render children()}

<style>

:root{
    background-color: var(--neutral-900);
}


    :global(body){
        margin: 0;
        padding: 0;
        scrollbar-width: none; /* Firefox */
       

}

:global(body::-webkit-scrollbar) {
    display: none; /* Chrome, Safari */
}


:global(body) {
    overflow-x: hidden;
}

:global(::-webkit-scrollbar) {
    display: none;
}

:global(.pin-spacer) {
    pointer-events: none;
}

:global(.pin-spacer main) {
    pointer-events: auto;
}

@keyframes stacked-slide-out {
    0% {
        transform: translateY(0);
        scale: 1;
        border-radius: 0;
    }
    50% {
        transform: translateY(10%);
        scale: 0.9;
        border-radius: 20px;
    }

    
    100% {
        transform: translateY(130%);
        scale: 0.9;
        border-radius: 20px;
    }
}

@keyframes stacked-slide-in {
    0% {
        scale: 1;
        transform: translateY(0);
        border-radius: 0;

    }
    50% {
        scale: 0.85;
        transform: translateY(0);
        border-radius: 20px;
    }
    100% {
        scale: 1;
        transform: translateY(0);
        border-radius: 0;
    }
}

/* 1. Reset cruciale: toglie l'effetto "bruciato" (plus-lighter) */
:root::view-transition-old(root),
:root::view-transition-new(root) {
    mix-blend-mode: normal;
    animation: none; /* Rimuove la dissolvenza incrociata standard */
    
    /* Mantiene l'opacità piena per evitare che si veda lo sfondo del browser sotto */
    opacity: 1; 
}

/* 2. Applica la tua animazione solo alla vecchia pagina */
:root::view-transition-old(root) {
    animation: 1.7s stacked-slide-out forwards 0.3s;
    transform-origin: center center;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    z-index: 2; /* Forza la vecchia pagina a stare SOPRA la nuova mentre si rimpicciolisce */
    /* 🌟 FIX PER IL BORDER RADIUS 🌟 */
    overflow: hidden;
    /* In alcuni browser storici potrebbe servire anche questo per forzare il clip dell'hardware grafico */
    isolation: isolate;
    transition: all 0.1s ease;
    border: solid 5px var(--neutral-800);
}

/* 3. Assicurati che la nuova pagina sia già visibile sotto senza fare nulla */
:root::view-transition-new(root) {
    z-index: 1;
    animation: 1.7s stacked-slide-in forwards 0.3s;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    transition: all 0.1s ease;
    
    overflow: hidden;
    /* In alcuni browser storici potrebbe servire anche questo per forzare il clip dell'hardware grafico */
    isolation: isolate;
    
}


/* La navbar rimane sempre sopra durante la transizione */
:root::view-transition-group(navbar),
:root::view-transition-group(menu-overlay) {
    z-index: 9999;
}

/* Nessuna animazione per la navbar, rimane ferma */
:root::view-transition-old(navbar),
:root::view-transition-new(navbar),
:root::view-transition-old(menu-overlay),
:root::view-transition-new(menu-overlay) {
    animation: none;
}
</style>
