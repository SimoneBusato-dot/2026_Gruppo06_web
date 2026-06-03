<script>
    import Cards from "$lib/components/Card_Selection/Cards.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { MotionPathPlugin, Draggable, InertiaPlugin } from "gsap/all";

    gsap.registerPlugin(MotionPathPlugin, Draggable, InertiaPlugin);

    let container = $state(null);
    let path      = $state(null);

    let currentIndex = $state(0);
    const TOTAL = 4;

    // Offset globale sul path (0..1), analogo alla "rotazione" di Osmo
    // Ogni card i ha baseOffset = i / TOTAL, e si muove di `globalOffset` in più
    let globalOffset = 0;

    // Tween paused per ogni slide
    let tweens = [];

    // ── Helpers ──────────────────────────────────────────────────────────────

    // Progresso sul path della card i, dato l'offset globale corrente
    function cardProgress(i) {
        return ((globalOffset + i / TOTAL) % 1 + 1) % 1;
    }

    // Quanto è "frontale" la card (0 = bordo, 1 = cima del semicerchio, cioè progress ≈ 0.5)
    function frontness(i) {
        const pos  = cardProgress(i);
        const dist = Math.abs(pos - 0.5);
        return 1 - Math.min(dist, 1 - dist) / 0.5;
    }

    // Indice della card più vicina al centro (progress 0.5)
    function nearestIndex() {
        let best = 0, bestF = -Infinity;
        for (let i = 0; i < TOTAL; i++) {
            const f = frontness(i);
            if (f > bestF) { bestF = f; best = i; }
        }
        return best;
    }

    // Aggiorna position + scala + zIndex di tutte le card
    function updateCards() {
        tweens.forEach((tw, i) => {
            const pos = cardProgress(i);
            tw.progress(pos);

            // Profondità: cima del path (pos≈0.5) = grande e davanti
            const depth  = 1 - Math.abs(pos - 0.5) * 2;   // 0..1
            const scale  = 0.6 + depth * 0.55;              // 0.6..1.15
            const zIndex = Math.round(depth * 100);

            gsap.set(tw.targets()[0], { scale, zIndex, transformOrigin: '50% 50%' });
        });
        currentIndex = nearestIndex();
    }

    // Snap alla card più vicina al centro
    function snapToNearest() {
        const idx     = nearestIndex();
        const pos     = cardProgress(idx);
        // Quanto devo spostare globalOffset per portare la card idx a progress 0.5?
        let delta = 0.5 - pos;
        if (delta > 0.5)  delta -= 1;
        if (delta < -0.5) delta += 1;

        const startOffset = globalOffset;
        const target      = globalOffset + delta;

        gsap.to({ v: 0 }, {
            v: 1,
            duration: 0.55,
            ease: 'power3.out',
            onUpdate() {
                const t = this.targets()[0].v;
                globalOffset = startOffset + delta * t;
                updateCards();
            },
            onComplete() {
                globalOffset = target;
                updateCards();
            }
        });
    }

    // ── Init ─────────────────────────────────────────────────────────────────
    onMount(() => {
        const slides = gsap.utils.toArray('.slider__slide');
        const customCursor = document.querySelector('.cursor');
        const cursorElements = [ '#left', '#center', '#right' ];

        if (!path || slides.length === 0) return;

        // ── Gestione Cursore Personalizzato ───────────────────────────────
        gsap.set(customCursor, { xPercent: -50, yPercent: -50 });
        let xTo = gsap.quickTo(customCursor, "x", { duration: 0.4, ease: "power3" });
        let yTo = gsap.quickTo(customCursor, "y", { duration: 0.4, ease: "power3" });

        const moveCursor = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };
        window.addEventListener("mousemove", moveCursor);

        // Timeline per l'animazione degli elementi del cursore (Stagger + Rimbalzo)
        const cursorTl = gsap.timeline({ paused: true });
        cursorTl.to(customCursor, {
            opacity: 1,
            duration: 0.2
        }).to(cursorElements, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
            stagger: 0.08
        }, "-=0.1");

        // Eventi sul container per mostrare/nascondere il cursore
        if (container) {
            container.addEventListener("mouseenter", () => cursorTl.play());
            container.addEventListener("mouseleave", () => cursorTl.reverse());
        }

        // ── Creazione MotionPath per le Card ──────────────────────────────
        tweens = slides.map((slide, i) => {
            return gsap.to(slide, {
                motionPath: {
                    path,
                    align:       path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate:  false,   // ← card sempre dritte
                    start:       0,
                    end:         1,
                },
                ease:     'none',
                duration: 1,
                paused:   true,
            });
        });

        // Posizione iniziale: card 0 al centro del path (progress 0.5)
        globalOffset = 0.5 - 0 / TOTAL;   // porta card 0 a progress 0.5
        updateCards();

        // ── Draggable con InertiaPlugin ───────────────────────────────────
        const proxy = document.createElement('div');

        Draggable.create(proxy, {
            type:    'x',
            trigger: container,
            inertia: true,

            onDragStart() {
                // Ferma eventuali snap in corso
                gsap.killTweensOf({ v: 0 });
            },

            onDrag() {
                const w     = container.offsetWidth || window.innerWidth;
                const delta = this.deltaX / w * 0.6;  // 0.6 = sensibilità
                globalOffset = (globalOffset - delta % 1 + 1) % 1;
                updateCards();
            },

            onThrowUpdate() {
                const w     = container.offsetWidth || window.innerWidth;
                const delta = this.deltaX / w * 0.6;
                globalOffset = (globalOffset - delta % 1 + 1) % 1;
                updateCards();
            },

            onThrowComplete() {
                snapToNearest();
            },

            onDragEnd() {
                if (!this.isThrowing) snapToNearest();
            }
        });

        return () => {
            tweens.forEach(tw => tw.kill());
            cursorTl.kill();
            window.removeEventListener("mousemove", moveCursor);
        };
    });

    function goToCard(i) {
        const pos  = cardProgress(i);
        let delta  = 0.5 - pos;
        if (delta > 0.5)  delta -= 1;
        if (delta < -0.5) delta += 1;
        const start = globalOffset;
        gsap.to({ v: 0 }, {
            v: 1,
            duration: 0.55,
            ease: 'power3.out',
            onUpdate() {
                globalOffset = start + delta * this.targets()[0].v;
                updateCards();
            }
        });
    }

    const variants = ['blue', 'yellow', 'red', 'purple'];
    
</script>

<main id="Selezione-Categorie">

    <div id="text">
        <h1 id="title">scegli un trend</h1>
        <p id="description">
            Dai un'occhiata alle categorie qui sotto e inizia da quella
            che ti incuriosisce di più.
        </p>
    </div>

    <div id="carousel-container" bind:this={container}>
        <div id="carousel">

            <svg
                width="2027" height="1014"
                viewBox="0 0 2027 1014"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    bind:this={path}
                    id="circle"
                    d="M2014 1013.5C2014 460.939 1566.06 13 1013.5 13C460.939 13 13 460.939 13 1013.5"
                    stroke="#A8A8A8"
                    stroke-width="26"
                    stroke-dasharray="8 12"
                />
            </svg>

            {#each variants as variant, i}
                <div class="slider__slide">
                    <Cards {variant} />
                </div>
            {/each}

        </div>
    </div>

    <div class="cursor">
        <div id="left"></div>
        <div id="center">Drag</div>
        <div id="right"></div>
    </div>

</main>

<style>
    *, *::before, *::after { box-sizing: border-box; }

    #Selezione-Categorie {
        width: 100vw;
        height: 140vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--neutral-50);
    }

    /* ── Testo ── */
    #text {
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        padding-top: 4rem;
        gap: 20px;
        flex-shrink: 0;
    }

    #title {
        font-family: var(--font-family);
        text-transform: uppercase;
        font-size: clamp(3rem, 7.5vw, 7.5rem);
        font-weight: 800;
        margin: 0;
    }

    #description {
        font-family: var(--font-family-text);
        font-size: clamp(1rem, 2.2vw, 2.1875rem);
        font-weight: 300;
        line-height: 110%;
        max-width: 55.875rem;
        text-align: center;
        margin: 0;
    }

    /* ── Carousel ── */
    #carousel-container {
        position: relative;
        flex: 1;
        cursor: grab;
        touch-action: none;
    }

    #carousel-container:active {
        cursor: grabbing;
    }

    #carousel {
        position: absolute;
        inset: 0;
    }

    svg {
        position: absolute;
        left: 50%;
        bottom: -35%;          /* ← questo è il valore da aggiustare */
        transform: translateX(-50%);
        width: 100%;
        height: auto;
        pointer-events: none;
        opacity: 0.5; /* visibile ma sottile */
    }

    /* Le card vengono posizionate da GSAP — devono essere absolute */
    .slider__slide {
        position: absolute;
        top: 0;
        left: 0;
        will-change: transform;
    }

    /* ── Cursore Personalizzato Aggiornato ── */
    .cursor {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        pointer-events: none; /* Non blocca i click e i drag sul carousel */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0; /* Nasconde l'intero cursore all'inizio */
    }

    /* Stato di base degli elementi interni prima dell'ingresso */
    #left, #center, #right {
        opacity: 0;
        transform: scale(0);
    }

    #left, #right {
        width: 8px;
        height: 14px;
        border-radius: 2px;
        background-color: var(--neutral-900);
    }
   
    #center {
        width: fit-content;
        height: fit-content;
        padding: 16px 8px;
        font-family: var(--font-family);
        font-size: 2rem;
        color: var(--neutral-50);
        text-transform: uppercase;
        background-color: var(--neutral-900);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }
</style>