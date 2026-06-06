<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/variables.css';
	import Navbar from '$lib/components/Navbar.svelte';
import { onNavigate } from '$app/navigation';

	let { children } = $props();

    onNavigate((navigation) => {
        if(document.startViewTransition){
            return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            })
        })
        }
        
    
})
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
    animation: 1.7s stacked-slide-out forwards;
    transform-origin: center center;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    z-index: 2; /* Forza la vecchia pagina a stare SOPRA la nuova mentre si rimpicciolisce */
    /* 🌟 FIX PER IL BORDER RADIUS 🌟 */
    overflow: hidden;
    /* In alcuni browser storici potrebbe servire anche questo per forzare il clip dell'hardware grafico */
    isolation: isolate;
    transition: all 0.1s ease;
}

/* 3. Assicurati che la nuova pagina sia già visibile sotto senza fare nulla */
:root::view-transition-new(root) {
    z-index: 1;
    animation: 1.7s stacked-slide-in forwards;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    transition: all 0.1s ease;
    
    overflow: hidden;
    /* In alcuni browser storici potrebbe servire anche questo per forzare il clip dell'hardware grafico */
    isolation: isolate;
    
}


</style>
