<script>
    import favicon from '$lib/assets/favicon.svg';
    import '$lib/styles/variables.css';
    import '$lib/styles/reactions.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import BouncyLoader from '$lib/components/BouncyLoader.svelte';
    import { onNavigate } from '$app/navigation';
    import { onMount, tick } from 'svelte';
    import { createReaction } from '$lib/reaction.js';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/all';

    let { children } = $props();
    let isTransitioningSvg = $state(false);
    let isAnimatingClass = $state(false);

    gsap.registerPlugin(ScrollTrigger)

    // Tiene traccia della view transition "standard" attualmente in corso,
    // per evitare sovrapposizioni che generano InvalidStateError
    let currentViewTransition = null;

    onNavigate((navigation) => {
    // ... resto invariato
        if (typeof document !== 'undefined') {
            const rxContainer = document.getElementById('reactions-container');
            if (rxContainer) {
                rxContainer.style.transform = '';
                rxContainer.style.transition = '';
            }
        }

        const samePath = navigation.from?.url.pathname === navigation.to?.url.pathname;
        const sameSearch = navigation.from?.url.search === navigation.to?.url.search;

        if (samePath && sameSearch) {
            return;
        }

        // 👇 Rileva la coppia di route specifica per l'SVG
        const isCounterToCategorie =
            (navigation.from?.route.id === '/' && navigation.to?.route.id === '/Categorie') ||
            (navigation.from?.route.id === '/Categorie' && navigation.to?.route.id === '/');

        // Se una view transition "standard" era rimasta appesa da una navigazione precedente,
        // la saltiamo prima di iniziarne una nuova (SVG o standard che sia)
        if (currentViewTransition) {
            try {
                currentViewTransition.skipTransition?.();
            } catch (e) {
                // ignorabile: la transizione potrebbe essere già conclusa
            }
            currentViewTransition = null;
        }

        // GESTIONE CAMBIO PAGINA VERSO CATEGORIE (Usa l'animazione SVG)
        if (isCounterToCategorie) {
            isTransitioningSvg = true;
            isAnimatingClass = true;

            return new Promise((resolve) => {
                // L'animazione totale dura 1.4s (1400ms). Il picco massimo (schermo coperto) è al 50% (700ms).
                setTimeout(async () => {
                    // Lo schermo è coperto dall'onda blu: ora cambiamo la pagina sotto!
                    resolve();

                    try {
                        // Aspettiamo che la nuova pagina sia pronta, poi resettiamo gli stati a fine animazione
                        await navigation.complete;
                    } catch (e) {
                        // navigazione interrotta/sostituita: nessun problema, ignoriamo
                    }

                    setTimeout(() => {
                        isTransitioningSvg = false;
                        isAnimatingClass = false;
                    }, 1500); // Il restante 50% del tempo per far uscire la linea
                }, 1500);
            });
        }

        // GESTIONE DI TUTTE LE ALTRE PAGINE (Mantiene le View Transitions standard)
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            const transition = document.startViewTransition(async () => {
                resolve();
                try {
                    await navigation.complete;
                } catch (e) {
                    // navigazione interrotta: nessun problema, ignoriamo
                }
            });

            currentViewTransition = transition;

            // Evita gli "Uncaught (in promise) InvalidStateError" quando la transizione
            // viene interrotta/sovrascritta da una navigazione successiva
            transition.ready.catch(() => {});
            transition.updateCallbackDone.catch(() => {});
            transition.finished
                .catch(() => {})
                .finally(() => {
                    if (currentViewTransition === transition) {
                        currentViewTransition = null;
                    }
                });
        });
    });

    onMount(() => {
        
        
        ScrollTrigger.normalizeScroll(true);
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

<!-- <BouncyLoader /> -->

{#if isTransitioningSvg}
    <div class="transition-curtain {isAnimatingClass ? 'is-animating' : ''}">
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 1316 664"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
        >
            <path
                d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
                stroke="var(--brand-vip-500)"
                stroke-width="24"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </div>
{/if}

<style>
:root{
    background-color: var(--neutral-900);
}


:global(html), :global(body) {
    touch-action: pan-y;
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

:global(h1, h2, h3, p){
    user-select: none;
}

/* --- ANIMAZIONI VIEW TRANSITION STANDARD (PER LE ALTRE PAGINE) --- */
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
        border-radius: 20px;
    }
    50% {
        scale: 0.85;
        border-radius: 20px;
    }
    100% {
        scale: 1;
        border-radius: 0;
    }
}

:root::view-transition-old(root),
:root::view-transition-new(root) {
    mix-blend-mode: normal;
    animation: none;
    opacity: 1;
}

:root::view-transition-old(root) {
    animation: 1.7s stacked-slide-out forwards 0.3s;
    transform-origin: center center;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    z-index: 2;
    overflow: hidden;
    isolation: isolate;
    transition: all 0.1s ease;
    border: solid 5px var(--neutral-800);
}

:root::view-transition-new(root) {
    z-index: 1;
    animation: 1.7s stacked-slide-in forwards 0.3s;
    animation-timing-function: cubic-bezier(0.83, 0, 0.17, 1);
    transition: all 0.1s ease;
    overflow: hidden;
    isolation: isolate;
}

:root::view-transition-group(navbar),
:root::view-transition-group(menu-overlay) {
    z-index: 9999;
}

:root::view-transition-old(navbar),
:root::view-transition-new(navbar),
:root::view-transition-old(menu-overlay),
:root::view-transition-new(menu-overlay) {
    animation: none;
}

/* --- ANIMAZIONE DI TRANSIZIONE AD HOC PER L'SVG (VERSO CATEGORIE) --- */
.transition-curtain {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999; /* Sopra a tutto, anche sopra la navbar */
    pointer-events: none;
}

/* Configurazione base del tracciato (invisibile inizialmente) */
.transition-curtain path {
    stroke-dasharray: 5500;
    stroke-dashoffset: 5500;
}

/* Attiva il disegno dell'onda */
.transition-curtain.is-animating path {
    animation: 3s draw-and-grow cubic-bezier(0.76, 0, 0.24, 1) forwards;
}

@keyframes draw-and-grow {
    0% {
        stroke-dashoffset: 5500;
        stroke-width: 24;
    }
    /* Al 50% lo schermo è completamente coperto di colore blu */
    50% {
        stroke-dashoffset: 0;
        stroke-width: 900;
    }
    /* Dal 50% in poi la linea si svuota e svela la nuova pagina */
    100% {
        stroke-dashoffset: -5500;
        stroke-width: 24;
    }
}


@media(max-width: 450px){
    :root{
        cursor: none;
    }
}
</style>