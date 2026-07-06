<script>
    import { onMount, onDestroy } from 'svelte';
    import gsap from 'gsap';

    // Props / Callbacks if any
    let { onComplete } = $props();

    let progress = $state(0);
    let activePhase = $state(0); // 0: Blue, 1: Pink, 2: Orange, 3: Red
    let isVisible = $state(false);
    let isLoaded = $state(false);

    let barEl = $state(null);
    let tl;

    const colors = [
        'var(--brand-sport-insoliti-500)', // Blue
        'var(--brand-vip-500)',           // Pink
        'var(--brand-cibo-500)',          // Orange
        'var(--brand-villaggio-500)'      // Red
    ];



    onMount(() => {
        if (onComplete) onComplete();
        return;

        // Cache DOM elements
        const navbar = document.querySelector('.navbar-header');
        const counterZero = document.getElementById('counter-display-back');
        const scrollIndicator = document.getElementById('scroll-indicator');

        if (navbar) gsap.set(navbar, { y: -60, opacity: 0 });
        if (counterZero) gsap.set(counterZero, { scale: 0.5, opacity: 0 });
        if (scrollIndicator) gsap.set(scrollIndicator, { y: 60, opacity: 0 });

        // Blocco lo scroll della pagina durante il caricamento
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }

        // Verifica se la pagina è già caricata
        if (typeof window !== 'undefined') {
            if (document.readyState === 'complete') {
                isLoaded = true;
            } else {
                window.addEventListener('load', () => {
                    isLoaded = true;
                    // Se la timeline è in pausa al 95%, riprendi
                    if (tl && tl.paused()) {
                        tl.resume();
                    }
                });
            }
        }

        // Configurazione Timeline GSAP
        const progressObj = { value: 0 };
        const padding = 4;
        const capsuleWidth = 30; // Dimensione della capsula iniziale/finale di ogni fase

        tl = gsap.timeline({
            onComplete: () => {
                // Riapri lo scroll
                if (typeof document !== 'undefined') {
                    document.body.style.overflow = '';
                }
                isVisible = false;
                if (onComplete) onComplete();
            }
        });

        // Funzione helper per aggiornare la percentuale a video
        const updateProgressText = () => {
            progress = progressObj.value;
        };

        // --- FASE 1: Blu (Da Sinistra a Destra) ---
        // 1. Riempimento
        tl.to(progressObj, {
            value: 25,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: updateProgressText
        })
        .fromTo(barEl,
            { left: `${padding}px`, right: `calc(100% - ${padding + capsuleWidth}px)` },
            { right: `${padding}px`, duration: 0.8, ease: 'power1.inOut' },
            '<'
        )
        // 2. Contrazione (Drain) verso destra con rimbalzo
        .to(barEl, {
            left: `calc(100% - ${padding + capsuleWidth}px)`,
            duration: 0.45,
            ease: 'power2.inOut'
        })
        .call(() => { activePhase = 1; }) // Diventa Rosa
        .fromTo(barEl,
            { scaleX: 0.6, transformOrigin: 'right center' },
            { scaleX: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' }
        )

        // --- FASE 2: Rosa (Da Destra a Sinistra) ---
        // 1. Riempimento
        .to(progressObj, {
            value: 50,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: updateProgressText
        })
        .to(barEl, { left: `${padding}px`, duration: 0.8, ease: 'power1.inOut' }, '<')
        // 2. Contrazione verso sinistra con rimbalzo
        .to(barEl, {
            right: `calc(100% - ${padding + capsuleWidth}px)`,
            duration: 0.45,
            ease: 'power2.inOut'
        })
        .call(() => { activePhase = 2; }) // Diventa Arancione
        .fromTo(barEl,
            { scaleX: 0.6, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' }
        )

        // --- FASE 3: Arancione (Da Sinistra a Destra) ---
        // 1. Riempimento
        .to(progressObj, {
            value: 75,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: updateProgressText
        })
        .to(barEl, { right: `${padding}px`, duration: 0.8, ease: 'power1.inOut' }, '<')
        // 2. Contrazione verso destra con rimbalzo
        .to(barEl, {
            left: `calc(100% - ${padding + capsuleWidth}px)`,
            duration: 0.45,
            ease: 'power2.inOut'
        })
        .call(() => { activePhase = 3; }) // Diventa Rosso
        .fromTo(barEl,
            { scaleX: 0.6, transformOrigin: 'right center' },
            { scaleX: 1, duration: 0.45, ease: 'elastic.out(1.2, 0.4)' }
        )

        // --- FASE 4: Rosso (Da Destra a Sinistra) ---
        // 1. Riempimento parziale fino al 95%
        .to(progressObj, {
            value: 95,
            duration: 0.6,
            ease: 'power1.out',
            onUpdate: updateProgressText
        })
        .to(barEl, { left: '15%', duration: 0.6, ease: 'power1.out' }, '<')
        
        // 2. Checkpoint di caricamento effettivo
        .call(() => {
            if (!isLoaded) {
                tl.pause();
            }
        })
        
        // 3. Completamento (95% -> 100%)
        .to(progressObj, {
            value: 100,
            duration: 0.3,
            ease: 'power1.in',
            onUpdate: updateProgressText
        })
        .to(barEl, { left: `${padding}px`, duration: 0.3, ease: 'power1.in' }, '<')
        
        // --- TRANSIZIONE DI MORPHING FINALE ---
        // 1. Gli elementi grafici del loader spariscono istantaneamente
        .to([barEl, '.loader-percentage', '.loader-track'], {
            opacity: 0,
            duration: 0.05,
            ease: 'none'
        })
        // 2. La maschera (il foro con box-shadow) si allarga a tutto schermo rivelando la pagina sotto
        .to('.loader-curtain-hole', {
            width: '3000px',
            height: '3000px',
            borderRadius: '1500px',
            duration: 1.15,
            ease: 'power3.inOut'
        }, '<')
        // 4. Escono lo 0, lo scroll e i menu superiori della pagina sotto
        .to(navbar, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out'
        }, '>-0.8')
        .to(counterZero, {
            scale: 1,
            opacity: 1,
            duration: 0.95,
            ease: 'back.out(1.5)'
        }, '<')
        .to(scrollIndicator, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'power2.out'
        }, '<');
    });

    onDestroy(() => {
        if (tl) tl.kill();
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    });
</script>

{#if isVisible}
    <div class="loader-overlay" style="--loader-color: {colors[activePhase]}">
        <!-- Tenda con foro in box-shadow che si allarga per rivelare il sito -->
        <div class="loader-curtain-hole"></div>

        <!-- Contenuto sopra la tenda (barra e percentuale) -->
        <div class="loader-content">
            <div class="loader-track">
                <div class="loader-bar" bind:this={barEl}></div>
            </div>
            
            <div class="loader-percentage">{Math.round(progress)}%</div>
        </div>
    </div>
{/if}

<style>
    .loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999999; /* Massima priorità */
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        background-color: transparent;
        overflow: hidden; /* Nasconde il box-shadow enorme quando si espande */
    }

    .loader-curtain-hole {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 48px;
        border-radius: 24px;
        background-color: transparent; /* Il foro è trasparente per far vedere il sito */
        box-shadow: 0 0 0 9999px var(--neutral-50, #f3f3f3); /* Crea lo sfondo coprente intorno */
        z-index: 1;
        pointer-events: none;
        will-change: width, height, border-radius;
    }

    .loader-content {
        position: relative;
        z-index: 2; /* Sopra la tenda coprente */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md, 16px);
        width: 90%;
        max-width: 450px;
        pointer-events: none;
    }

    .loader-track {
        width: 100%;
        height: 48px;
        border: 6px solid var(--loader-color);
        border-radius: var(--radius-full, 9999px);
        background-color: transparent; /* Trasparente così si vede il sito sotto */
        padding: 4px;
        box-sizing: border-box;
        position: relative;
        transition: border-color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    }

    .loader-bar {
        position: absolute;
        top: 4px;
        bottom: 4px;
        border-radius: var(--radius-full, 9999px);
        background-color: var(--loader-color);
        transition: background-color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .loader-percentage {
        color: var(--loader-color);
        font-family: var(--font-family-text, "gelica", sans-serif);
        font-size: 24px;
        font-weight: 700;
        transition: color 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
        text-align: center;
        margin-top: 8px;
    }
</style>
