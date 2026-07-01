<script>
    import Cards from "$lib/components/Card_Selection/Cards.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitText from 'gsap/SplitText';

    gsap.registerPlugin(ScrollTrigger,SplitText);

    /* ─── costanti ─── */
    const VARIANTS       = ['blue', 'purple', 'red', 'yellow'];
    const TOTAL          = VARIANTS.length;
    const GAP            = 32;
    const EASE           = 0.07;
    const BEND           = 200;
    const MAX_ROT        = 28;
    const DRAG_THRESHOLD = 8;

    /* ─── refs DOM ─── */
    let containerEl = $state(null);
    let trackEl     = $state(null);

    /* ─── stato ─── */
    let activeIndex = $state(0);

    /* ─── scroll ─── */
    let scrollCurrent = 0;
    let scrollTarget  = 0;
    let rafId;

    /* ─── dimensioni card ─── */
    let CARD_W = 434;
    let STEP   = CARD_W + GAP;

    /* ─── drag ─── */
    let isPointerDown   = false;
    let dragStartX      = 0;
    let dragStartScroll = 0;
    let isDrag          = false;   // diventa true solo dopo DRAG_THRESHOLD px

    /* ─── snap ─── */
    let snapTween = null;

    let catMain;
    let ClipPath;
    let svgClip;
    let title;
    let subtitle;


   

    /* ─────────────────────────────────────────────────
       Utility
    ───────────────────────────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    function getSlides() {
        return Array.from(trackEl?.querySelectorAll('.slide') ?? []);
    }

    function computeCardW() {
        const cw = containerEl?.offsetWidth ?? window.innerWidth;
        CARD_W = Math.min(Math.max(320, cw * 0.287), 500);
        STEP   = CARD_W + GAP;
    }

    /* ─────────────────────────────────────────────────
       Posizionamento card (arco parabolico)
    ───────────────────────────────────────────────── */
    function positionCards() {
        const slides = getSlides();
        if (!slides.length) return;

        const cx    = (containerEl?.offsetWidth ?? window.innerWidth) / 2;
        const range = TOTAL * STEP;
        let bestDist = Infinity, bestIdx = 0;

        slides.forEach((slide, i) => {
            const rawX = i * STEP - scrollCurrent;
            let x = ((rawX % range) + range) % range - range / 2;
            x += cx - CARD_W / 2;

            const cardCenter = x + CARD_W / 2;
            const dist   = Math.abs(cardCenter - cx);
            const maxOff = cx + CARD_W;
            const depth  = Math.max(0, 1 - dist / maxOff);
            const norm   = (cardCenter - cx) / cx;

            const yArc     = norm * norm * BEND;
            const rotRaw   = 2 * norm * BEND / cx * (180 / Math.PI) * 0.6;
            const rotation = Math.max(-MAX_ROT, Math.min(MAX_ROT, rotRaw));

            gsap.set(slide, {
                x, y: yArc, rotation,
                scale:   0.52 + depth * 0.48,
                zIndex:  Math.round(depth * 100),
                opacity: 0.30 + depth * 0.70,
                transformOrigin: '50% 100%',
            });

            if (dist < bestDist) { bestDist = dist; bestIdx = i; }
        });

        activeIndex = bestIdx;
    }

    /* ─────────────────────────────────────────────────
       Snap
    ───────────────────────────────────────────────── */
    function snapToNearest() {
        snapTween?.kill();
        const obj    = { val: scrollTarget };
        const target = Math.round(scrollTarget / STEP) * STEP;
        snapTween = gsap.to(obj, {
            val: target, duration: 0.55, ease: 'power3.out',
            onUpdate() { scrollTarget = obj.val; },
        });
    }

    /* ─────────────────────────────────────────────────
       RAF loop
    ───────────────────────────────────────────────── */
    function tick() {
        scrollCurrent = lerp(scrollCurrent, scrollTarget, EASE);
        positionCards();
        rafId = requestAnimationFrame(tick);
    }

    /* ─────────────────────────────────────────────────
       Navigazione
    ───────────────────────────────────────────────── */
    function goToCard(i) {
    const slides = getSlides();
    if (!slides.length) return;

    // Calcola la posizione X visiva di ogni slide
    const cx = (containerEl?.offsetWidth ?? window.innerWidth) / 2;
    const range = TOTAL * STEP;

    const getVisualX = (index) => {
        const rawX = index * STEP - scrollCurrent;
        const x = ((rawX % range) + range) % range - range / 2;
        return x + cx - CARD_W / 2 + CARD_W / 2; // centro della card
    };

    const targetX = getVisualX(i);
    const activeX = getVisualX(activeIndex);

    // Se il target è visivamente a destra, scorri a destra (+), altrimenti a sinistra (-)
    if (targetX > activeX) {
        // target è a destra: vogliamo aumentare scrollTarget
        let delta = (i - activeIndex) * STEP;
        if (delta < 0) delta += range; // forza direzione destra
        scrollTarget += delta;
    } else {
        // target è a sinistra: vogliamo diminuire scrollTarget
        let delta = (i - activeIndex) * STEP;
        if (delta > 0) delta -= range; // forza direzione sinistra
        scrollTarget += delta;
    }

    snapToNearest();
}
    /* ─────────────────────────────────────────────────
       Pointer events — NO setPointerCapture
       Il tracciamento del movimento avviene su window
       così non rubiamo gli eventi ai figli.
    ───────────────────────────────────────────────── */
    function onPointerDown(e) {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        isPointerDown   = true;
        isDrag          = false;
        dragStartX      = e.clientX;
        dragStartScroll = scrollTarget;
        snapTween?.kill();
    }

    function onWindowPointerMove(e) {
        if (!isPointerDown) return;
        const dx = dragStartX - e.clientX;
        if (Math.abs(dx) > DRAG_THRESHOLD) isDrag = true;
        if (isDrag) scrollTarget = dragStartScroll + dx * 1.4;
    }

    function onWindowPointerUp() {
        if (!isPointerDown) return;
        isPointerDown = false;
        if (isDrag) snapToNearest();
        // isDrag viene letto dal click handler PRIMA di questo rAF reset
        requestAnimationFrame(() => { isDrag = false; });
    }

    /* ─────────────────────────────────────────────────
       Click su slide
       • card non attiva  → scorri a quella card
       • card attiva      → lascia passare il click all'<a> (navigazione)
       • era un drag      → blocca tutto
    ───────────────────────────────────────────────── */
    function onSlideClick(e, index) {
        if (isDrag) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (index !== activeIndex) {
            e.preventDefault();
            e.stopPropagation();
            goToCard(index);
        }
        // card attiva + click reale → l'<a> dentro Cards naviga da solo
    }

    /* ─────────────────────────────────────────────────
       Tastiera
    ───────────────────────────────────────────────── */
    function onKeyDown(e) {
        if (e.key === 'ArrowRight') { scrollTarget += STEP; snapToNearest(); }
        if (e.key === 'ArrowLeft')  { scrollTarget -= STEP; snapToNearest(); }
    }

    /* ─────────────────────────────────────────────────
       Lifecycle
    ───────────────────────────────────────────────── */
    onMount(() => {

        const box = svgClip.getBoundingClientRect();
        const width = box.width;
        computeCardW();
        // Con scroll=0, la card centrata è quella a metà del ring (indice TOTAL/2).
        // Per centrare l'indice 0 (blue), partiamo indietro di TOTAL/2 * STEP.
        const startOffset = -Math.floor(TOTAL / 2) * STEP;
        scrollCurrent = startOffset;
        scrollTarget  = startOffset;
        positionCards();
        rafId = requestAnimationFrame(tick);

        const onResize = () => { computeCardW(); positionCards(); };
        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointermove', onWindowPointerMove);
        window.addEventListener('pointerup',   onWindowPointerUp);
        window.addEventListener('pointercancel', onWindowPointerUp);


    // ... setup esistente ...

    const loopAnim = gsap.to({}, {          // ✅ PRIMA del return
        duration: 2,
        repeat: -1,
        ease: "none",
        onUpdate() {
            const t = this.time() / this.duration() * Math.PI * 2;
            const xPercent = Math.sin(t);
            const yPercent = Math.sin(t * 0.5);

            const activeSlide = getSlides()[activeIndex];  // ✅ letto ogni frame
            if (!activeSlide) return;

            gsap.to(activeSlide, {
                duration: 0.1,
                rotateY: xPercent * 7,
                rotateX: -yPercent * 5,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });

    const titleSplit = new SplitText(title, { type: 'words', mask: 'words'});
    const subtitleSplit = new SplitText(subtitle, { type: 'lines', mask: 'lines'});

    const titleEnter = gsap.fromTo(titleSplit.words, {y: "100%"}, {y: "0%", stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1.5});
    const subtitleEnter = gsap.fromTo(subtitleSplit.lines, {y: "100%"}, {y: "0%", duration: 0.6, ease:"power2.out", paused: true, delay: 2});
    const cardEnter =gsap.fromTo(trackEl, {y: "100%"}, {y: "0%", duration: 1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1.5});

    const clipMove = gsap.fromTo(ClipPath, {width: 0 } , {width: width, duration: 1, ease: "power2.out", paused: true, delay: 1 });
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: catMain,
            onEnter: () => { clipMove.play(); console.log("onEnter"); titleEnter.play(); subtitleEnter.play(); cardEnter.play(); },
            onLeave: () => { clipMove.reverse(); titleEnter.reverse(); subtitleEnter.reverse(); cardEnter.reverse(); },
            onEnterBack: () => { clipMove.play(); titleEnter.play(); subtitleEnter.play(); cardEnter.play(); },
            onLeaveBack: () => { clipMove.reverse(); titleEnter.reverse(); subtitleEnter.reverse(); cardEnter.reverse(); },
            
        }

    });

    return () => {                           // ✅ cleanup alla fine
        cancelAnimationFrame(rafId);
        snapTween?.kill();
        loopAnim.kill();                     // ✅ aggiungi anche questo
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('pointerup', onWindowPointerUp);
        window.removeEventListener('pointercancel', onWindowPointerUp);
    };
});

    


</script>

<main id="Selezione-Categorie" bind:this={catMain}>

    <div id="text">
        <h1 id="title" bind:this={title}>scegli un trend</h1>
        <p id="description" bind:this={subtitle}>
            Dai un'occhiata alle categorie qui sotto e inizia da quella
            che ti incuriosisce di più.
        </p>
    </div>

    <nav id="dots" aria-label="Naviga tra le categorie">
        {#each VARIANTS as _, i}
            <button
                class="dot"
                class:active={i === activeIndex}
                aria-label="Vai alla categoria {i + 1}"
                onclick={() => goToCard(i)}
            ></button>
        {/each}
    </nav>

    <div
        id="carousel-outer"
        bind:this={containerEl}
        onpointerdown={onPointerDown}
        role="group"
        aria-label="Carousel categorie"
    >
        <!-- arco decorativo di sfondo -->
        <svg id="arc-bg" viewBox="0 0 1512 1014" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            
            <path d="M1756 1013.5C1756 460.939 1308.06 13 755.5 13C202.939 13 -245 460.939 -245 1013.5" stroke-width="26" stroke-dasharray="2 18" />
        </svg>

        <svg bind:this={svgClip} id="clip" width="100vw" height="100vh" viewBox="0 0 1512 1014" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
            <defs>
                <clipPath id="clipPath" >
                    <rect width="0" height="100%" bind:this={ClipPath}/>
                </clipPath>
            </defs>
        </svg>

        <div id="track" bind:this={trackEl}>
            {#each VARIANTS as variant, i}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="slide"
                    class:is-active={i === activeIndex}
                    style="width: {CARD_W}px;"
                    onclick={(e) => onSlideClick(e, i)}
                >
                    <Cards {variant} />
                </div>
            {/each}
        </div>
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
        align-items: center;
        background-color: #ffffff;
    }

    #text {
        width: 1512px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-top: clamp(1.5rem, 3vh, 4rem);
        padding-bottom: 0.75rem;
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
        margin: 0;
    }

    #dots {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 0.5rem 0 1rem;
        flex-shrink: 0;
        z-index: 10;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: none;
        background-color: var(--neutral-300, #ccc);
        cursor: pointer;
        padding: 0;
        transition: transform 0.25s, background-color 0.25s;
    }

    .dot.active {
        background-color: var(--neutral-800);
        transform: scale(1.4);
    }

    #carousel-outer {
        flex: 1;
        min-height: 0;
        width: 1512px;
        position: relative;
        cursor: grab;
        touch-action: none;
        user-select: none;
        overflow: visible;
    }

    #carousel-outer:active { cursor: grabbing; }

    #carousel-outer:focus-visible {
        outline: 2px solid var(--neutral-800);
        outline-offset: 4px;
    }

    #arc-bg {
        position: absolute;
        bottom: -90%;
        left: 50%;
        transform: translateX(-50%);
        width: 1512px;
        height: auto;
        pointer-events: none;
        z-index: 0;
        stroke: #dbdbdb;
        clip-path: url(#clipPath);
    }

    #clip {
        position: absolute;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
    }

    #track {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .slide {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        pointer-events: all;
        will-change: transform, opacity;
        cursor: pointer;
    }

    /* card non attiva: blocca l'<a> dentro, ci pensa onSlideClick */
    .slide:not(.is-active) :global(a) {
        pointer-events: none;
    }

    .slide :global(a),
    .slide :global(img) {
    -webkit-user-drag: none;
    pointer-events: none; /* già gestiti dal JS */

}

.slide.is-active :global(a) {
    pointer-events: all;
}
</style>