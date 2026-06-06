<script>
    import Cards from "$lib/components/Card_Selection/Cards.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { MotionPathPlugin, Draggable, InertiaPlugin } from "gsap/all";

    gsap.registerPlugin(MotionPathPlugin, Draggable, InertiaPlugin);

    let container  = $state(null);
    let path       = $state(null);
    let textBlock  = $state(null);
    let carouselWrap = $state(null);

    let currentIndex = $state(0);
    const TOTAL = 4;

    let globalOffset = 0;
    let tweens = [];

    function cardProgress(i) {
        return ((globalOffset + i / TOTAL) % 1 + 1) % 1;
    }

    function frontness(i) {
        const pos  = cardProgress(i);
        const dist = Math.abs(pos - 0.5);
        return 1 - Math.min(dist, 1 - dist) / 0.5;
    }

    function nearestIndex() {
        let best = 0, bestF = -Infinity;
        for (let i = 0; i < TOTAL; i++) {
            const f = frontness(i);
            if (f > bestF) { bestF = f; best = i; }
        }
        return best;
    }

    function updateCards() {
        tweens.forEach((tw, i) => {
            const pos   = cardProgress(i);
            tw.progress(pos);
            const depth  = 1 - Math.abs(pos - 0.5) * 2;
            const scale  = 0.6 + depth * 0.55;
            const zIndex = Math.round(depth * 100);
            gsap.set(tw.targets()[0], { scale, zIndex, transformOrigin: '50% 50%' });
        });
        currentIndex = nearestIndex();
    }

    function snapToNearest() {
        const idx   = nearestIndex();
        const pos   = cardProgress(idx);
        let delta   = 0.5 - pos;
        if (delta > 0.5)  delta -= 1;
        if (delta < -0.5) delta += 1;
        const startOffset = globalOffset;
        const target      = globalOffset + delta;
        gsap.to({ v: 0 }, {
            v: 1, duration: 0.55, ease: 'power3.out',
            onUpdate() {
                globalOffset = startOffset + delta * this.targets()[0].v;
                updateCards();
            },
            onComplete() {
                globalOffset = target;
                updateCards();
            }
        });
    }

    // Scala l'intero carousel wrapper per adattarsi allo spazio disponibile
    function scaleCarousel() {
        if (!carouselWrap || !textBlock) return;

        const textH     = textBlock.offsetHeight;
        const totalH    = window.innerHeight;
        const totalW    = window.innerWidth;

        // Spazio verticale disponibile sotto il testo (con buffer)
        const availableH = totalH - textH - 16;

        // Il carousel al 100% è disegnato per 1512×(1512/2) = 1512×756
        // (il path SVG ha aspect ratio 2027:1014 ≈ 2:1, e occupa tutta la larghezza)
        const baseW = 1512;
        const baseH = 756; // altezza del carousel alla larghezza base

        const scaleByW = totalW  / baseW;
        const scaleByH = availableH / baseH;
        const scale    = Math.min(scaleByW, scaleByH, 1); // mai più grande del 100%

        carouselWrap.style.transform       = `scale(${scale})`;
        carouselWrap.style.transformOrigin = 'top center';
        // Compensiamo lo spazio sottratto dallo scale per non lasciare vuoto
        carouselWrap.style.marginBottom    = `${-(baseH * (1 - scale))}px`;
    }

    onMount(() => {
        const slides       = gsap.utils.toArray('.slider__slide');
        const customCursor = document.querySelector('.cursor');
        const cursorElements = ['#left', '#center', '#right'];

        if (!path || slides.length === 0) return;

        scaleCarousel();
        window.addEventListener('resize', scaleCarousel);

        // Cursore
        gsap.set(customCursor, { xPercent: -50, yPercent: -50 });
        const xTo = gsap.quickTo(customCursor, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(customCursor, "y", { duration: 0.4, ease: "power3" });
        const moveCursor = (e) => { xTo(e.clientX); yTo(e.clientY); };
        window.addEventListener("mousemove", moveCursor);

        const cursorTl = gsap.timeline({ paused: true });
        cursorTl
            .to(customCursor, { opacity: 1, duration: 0.2 })
            .to(cursorElements, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", stagger: 0.08 }, "-=0.1");

        if (container) {
            container.addEventListener("mouseenter", () => cursorTl.play());
            container.addEventListener("mouseleave", () => cursorTl.reverse());
        }

        // MotionPath
        tweens = slides.map((slide) => {
            return gsap.to(slide, {
                motionPath: {
                    path,
                    align:       path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate:  false,
                    start: 0,
                    end:   1,
                },
                ease: 'none', duration: 1, paused: true,
            });
        });

        globalOffset = 0.5 - 0 / TOTAL;
        updateCards();

        // Draggable
        const proxy = document.createElement('div');
        Draggable.create(proxy, {
            type: 'x', trigger: container, inertia: true,
            onDragStart() { gsap.killTweensOf({ v: 0 }); },
            onDrag() {
                const w     = container.offsetWidth || window.innerWidth;
                const delta = this.deltaX / w * 0.6;
                globalOffset = (globalOffset - delta % 1 + 1) % 1;
                updateCards();
            },
            onThrowUpdate() {
                const w     = container.offsetWidth || window.innerWidth;
                const delta = this.deltaX / w * 0.6;
                globalOffset = (globalOffset - delta % 1 + 1) % 1;
                updateCards();
            },
            onThrowComplete() { snapToNearest(); },
            onDragEnd() { if (!this.isThrowing) snapToNearest(); }
        });

        return () => {
            tweens.forEach(tw => tw.kill());
            cursorTl.kill();
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener('resize', scaleCarousel);
        };
    });

    function goToCard(i) {
        const pos  = cardProgress(i);
        let delta  = 0.5 - pos;
        if (delta > 0.5)  delta -= 1;
        if (delta < -0.5) delta += 1;
        const start = globalOffset;
        gsap.to({ v: 0 }, {
            v: 1, duration: 0.55, ease: 'power3.out',
            onUpdate() {
                globalOffset = start + delta * this.targets()[0].v;
                updateCards();
            }
        });
    }

    const variants = ['blue', 'yellow', 'red', 'purple'];
</script>

<main id="Selezione-Categorie" class="page_content">

    <div id="text" bind:this={textBlock}>
        <h1 id="title">scegli un trend</h1>
        <p id="description">
            Dai un'occhiata alle categorie qui sotto e inizia da quella
            che ti incuriosisce di più.
        </p>
    </div>

    <!--
        carouselWrap è il layer che viene scalato via JS.
        container è il trigger per Draggable — resta a dimensione piena
        così il drag funziona su tutto lo schermo.
    -->
    <div id="carousel-outer" bind:this={container}>
        <div id="carousel-wrap" bind:this={carouselWrap}>
            <div id="carousel">
                <svg
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

                {#each variants as variant}
                    <div class="slider__slide">
                        <Cards {variant} />
                    </div>
                {/each}
            </div>
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
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--neutral-50);
    }

    /* Testo: non si schiaccia mai, sta sempre sopra */
    #text {
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        padding-top: clamp(1.5rem, 3vh, 4rem);
        padding-bottom: 1rem;
        gap: clamp(8px, 1.2vh, 20px);
        flex-shrink: 0;
        position: relative;
        z-index: 10;
    }

    #title {
        font-family: var(--font-family);
        text-transform: uppercase;
        font-size: clamp(2.5rem, 6vw, 7.5rem);
        font-weight: 800;
        margin: 0;
        color: var(--neutral-800);
    }

    #description {
        font-family: var(--font-family-text);
        font-size: clamp(0.95rem, 1.5vw, 2.1875rem);
        font-weight: 300;
        line-height: 110%;
        max-width: clamp(320px, 55vw, 55.875rem);
        text-align: center;
        margin: 0;
    }

    /* Outer: occupa tutto lo spazio restante, è il trigger del drag */
    #carousel-outer {
        flex: 1;
        min-height: 0;
        position: relative;
        cursor: grab;
        touch-action: none;
        /* NO overflow hidden — le card non vengono tagliate */
    }

    #carousel-outer:active { cursor: grabbing; }

    /* Wrap: questo viene scalato da JS — dimensioni fisse uguali al design originale */
    #carousel-wrap {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        /* altezza fissa: il carousel non scala il contenuto, scala se stesso */
        height: 756px;
        transform-origin: top center;
        /* la transizione rende lo scale fluido al resize */
        transition: transform 0.2s ease;
    }

    #carousel {
        position: absolute;
        inset: 0;
    }

    svg {
        position: absolute;
        left: 50%;
        bottom: -45%;
        transform: translateX(-50%);
        width: 100%;
        height: auto;
        pointer-events: none;
        opacity: 0.5;
    }

    .slider__slide {
        position: absolute;
        top: 0;
        left: 0;
        will-change: transform;
    }

    .cursor {
        position: fixed;
        top: 0; left: 0;
        z-index: 1000;
        pointer-events: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
        opacity: 0;
    }

    #left, #center, #right { opacity: 0; transform: scale(0); }

    #left, #right {
        width: 8px;
        height: 14px;
        border-radius: 2px;
        background-color: var(--neutral-900);
    }

    #center {
        padding: 16px 8px;
        font-family: var(--font-family);
        font-size: clamp(1rem, 1.5vw, 2rem);
        color: var(--neutral-50);
        text-transform: uppercase;
        background-color: var(--neutral-900);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }
</style>