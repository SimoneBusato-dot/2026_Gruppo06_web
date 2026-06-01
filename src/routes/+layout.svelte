<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/variables.css';
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



{@render children()}

<style>
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
        transform: translateY(0);
        scale: 0.7;
        border-radius: 10px;
    }
    100% {
        transform: translateY(100%);
        scale: 0.7;
        border-radius: 10px;
    }
}

@keyframes fstacked-slide-in {
    0% {
        scale: 0.7;
        transform: translateY(-10%);

    }
    50% {
        scale: 0.7;
        transform: translateY(-10%);
    }
    100% {
        scale: 1;
        transform: translateY(0);
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
    animation: 1s ease-in-out stacked-slide-out forwards;
    transform-origin: center center;
    z-index: 2; /* Forza la vecchia pagina a stare SOPRA la nuova mentre si rimpicciolisce */
}

/* 3. Assicurati che la nuova pagina sia già visibile sotto senza fare nulla */
:root::view-transition-new(root) {
    z-index: 1;
    animation: 1s ease-in-out fstacked-slide-in forwards;
}
</style>
