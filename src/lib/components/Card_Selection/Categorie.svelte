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
    let   GAP            = 32; // non più fissa: viene ricalcolata in base allo schermo in computeCardW()
    const EASE           = 0.07;
    const BEND           = 200;
    const MAX_ROT        = 28;
    const DRAG_THRESHOLD = 8;

    /* ─── persistenza ultima card attiva ─── */
    const STORAGE_KEY = 'categorie.lastActiveIndex';

    function getSavedIndex() {
        if (typeof sessionStorage === 'undefined') return null;
        const raw = Number(sessionStorage.getItem(STORAGE_KEY));
        return Number.isInteger(raw) && raw >= 0 && raw < TOTAL ? raw : null;
    }

    function saveIndex(i) {
        if (typeof sessionStorage === 'undefined') return;
        sessionStorage.setItem(STORAGE_KEY, String(i));
    }

    /* ─── durata totale animazione di ingresso ─── */
    const ENTER_ANIM_DURATION = 2.5; // delay 1.5 + duration 1 (cardEnter, la più lunga)
    /* quanta "distanza di scroll" (px) vogliamo che il pin consumi mentre gira l'animazione */
    const PIN_SCROLL_DISTANCE = 600;

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

    /* ─── breakpoint mobile (deve coincidere con il media query CSS) ─── */
    const MOBILE_BREAKPOINT = 450;

    /* ─── drag ─── */
    let isPointerDown   = false;
    let dragStartX      = 0;
    let dragStartScroll = 0;
    let isDrag          = false;

    /* ─── snap ─── */
    let snapTween = null;

    let catMain;
    let ClipPath;
    let svgClip;
    let title;
    let subtitle;

    let hasRestored = false; // guardia: NON è $state, serve solo come flag interno

    /* larghezza corrente del clip-path, ricalcolata ad ogni resize */
    let clipTargetWidth = 0;

    $effect(() => {
        const idx = activeIndex; // ⚠️ lettura SEMPRE eseguita → dipendenza sempre tracciata
        if (!hasRestored) return;
        saveIndex(idx);
    });


    /* ─────────────────────────────────────────────────
       Utility
    ───────────────────────────────────────────────── */
    const lerp = (a, b, t) => a + (b - a) * t;

    function getSlides() {
        return Array.from(trackEl?.querySelectorAll('.slide') ?? []);
    }

    function computeCardW() {
        const cw = containerEl?.offsetWidth ?? window.innerWidth;

        // FIX: il floor fisso di 260px andava bene su desktop ma su mobile
        // (container ≤ 450px) era più della metà del contenitore, rompendo
        // le proporzioni. Ora il floor dipende dalla larghezza dello schermo.
        const isMobile = cw <= MOBILE_BREAKPOINT;

        if (isMobile) {
            /* su mobile vogliamo una card centrale "piena" ma con un piccolo
               margine ai lati per intravedere le adiacenti */
            CARD_W = Math.max(140, cw * 0.55);
            GAP    = Math.max(12, cw * 0.05);
        } else {
            /* card e gap scalano entrambi in proporzione alla larghezza dello schermo,
               senza un tetto massimo: su schermi grandi le card diventano più grandi
               E più distanti tra loro, su schermi piccoli più piccole e più vicine.
               Il rapporto CARD_W/GAP resta simile su ogni dimensione, mentre il numero
               di card "visibili" (3) è già garantito da VISIBLE_RANGE in positionCards,
               che ragiona in step relativi e non in pixel assoluti. */
            CARD_W = Math.max(260, cw * 0.28);
            GAP    = Math.max(20, cw * 0.035);
        }

        STEP = CARD_W + GAP;
    }

    /* ricalcola la larghezza target del clip-path in base al container attuale */
    function computeClipWidth() {
        if (!svgClip) return;
        clipTargetWidth = svgClip.getBoundingClientRect().width;
        // se il clip è già "aperto" (oltre lo stato iniziale) aggiorna live la larghezza
        if (ClipPath && Number(ClipPath.getAttribute('width')) > 0) {
            gsap.set(ClipPath, { width: clipTargetWidth });
        }
    }

    /* ─────────────────────────────────────────────────
       Posizionamento card (arco parabolico)
    ───────────────────────────────────────────────── */
    /* quante "posizioni" (step) restano nitide ai lati della card attiva.
       Con TOTAL=4 card: 1 step = card adiacente, 2 step = card opposta nel loop.
       Impostato a 1.6 la card opposta (distanza 2) risulta sempre completamente
       nascosta, mentre le due adiacenti (distanza 1) restano visibili: il numero
       di card mostrate è quindi sempre 3, indipendentemente dalla larghezza dello
       schermo, perché il calcolo è basato su "quante card di distanza" e non su
       quanti pixel di distanza (che invece varierebbero da schermo a schermo). */
    const VISIBLE_RANGE = 1.6;

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
            const dist      = Math.abs(cardCenter - cx);

            /* distanza espressa in "numero di card" invece che in pixel:
               è un rapporto (dist / STEP), quindi resta identico su qualunque
               risoluzione, a differenza del vecchio dist / (cx + CARD_W) che
               cambiava in base alla larghezza reale del contenitore. */
            const stepsAway = dist / STEP;
            const depth     = Math.max(0, 1 - stepsAway / VISIBLE_RANGE);

            const norm     = (cardCenter - cx) / cx; // usato solo per l'arco/rotazione visiva
            const yArc     = norm * norm * BEND;
            const rotRaw   = 2 * norm * BEND / cx * (180 / Math.PI) * 0.6;
            const rotation = Math.max(-MAX_ROT, Math.min(MAX_ROT, rotRaw));

            gsap.set(slide, {
                x, y: yArc, rotation,
                scale:   0.5 + depth * 0.5,
                zIndex:  Math.round(depth * 100),
                // sotto una certa depth la card è la "quarta", va nascosta del tutto
                opacity: depth < 0.05 ? 0 : 0.25 + depth * 0.75,
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

        const cx = (containerEl?.offsetWidth ?? window.innerWidth) / 2;
        const range = TOTAL * STEP;

        const getVisualX = (index) => {
            const rawX = index * STEP - scrollCurrent;
            const x = ((rawX % range) + range) % range - range / 2;
            return x + cx - CARD_W / 2 + CARD_W / 2;
        };

        const targetX = getVisualX(i);
        const activeX = getVisualX(activeIndex);

        if (targetX > activeX) {
            let delta = (i - activeIndex) * STEP;
            if (delta < 0) delta += range;
            scrollTarget += delta;
        } else {
            let delta = (i - activeIndex) * STEP;
            if (delta > 0) delta -= range;
            scrollTarget += delta;
        }

        snapToNearest();
    }

    /* ─────────────────────────────────────────────────
       Pointer events
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
        requestAnimationFrame(() => { isDrag = false; });
    }

    /* ─────────────────────────────────────────────────
       Click su slide
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
    }

    /* ─────────────────────────────────────────────────
       Tastiera (navigazione tra card)
    ───────────────────────────────────────────────── */
    function onKeyDown(e) {
        if (e.key === 'ArrowRight') { scrollTarget += STEP; snapToNearest(); }
        if (e.key === 'ArrowLeft')  { scrollTarget -= STEP; snapToNearest(); }
    }

    /* ─────────────────────────────────────────────────
       Lifecycle
    ───────────────────────────────────────────────── */
    onMount(() => {

        computeCardW();
        computeClipWidth();

        const CENTER_OFFSET = Math.floor(TOTAL / 2);
        const initialIndex  = getSavedIndex() ?? 0;
        const startOffset   = (initialIndex - CENTER_OFFSET) * STEP;
        scrollCurrent = startOffset;
        scrollTarget  = startOffset;
        positionCards();
        hasRestored = true; // da qui in poi ok salvare
        rafId = requestAnimationFrame(tick);


        const onResize = () => {
            computeCardW();
            computeClipWidth();
            positionCards();
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointermove', onWindowPointerMove);
        window.addEventListener('pointerup',   onWindowPointerUp);
        window.addEventListener('pointercancel', onWindowPointerUp);


        const titleSplit = new SplitText(title, { type: 'words', mask: 'words'});
        const subtitleSplit = new SplitText(subtitle, { type: 'lines', mask: 'lines'});

        const titleEnter = gsap.fromTo(titleSplit.words, {y: "100%"}, {y: "0%", stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1});
        const subtitleEnter = gsap.fromTo(subtitleSplit.lines, {y: "100%"}, {y: "0%", duration: 0.6, ease:"power2.out", paused: true, delay: 0.5});
        const cardEnter = gsap.fromTo(trackEl, {y: "150%"}, {y: "0%", duration: 1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 0.5});

        const clipMove = gsap.fromTo(ClipPath, {width: 0 } , {width: () => clipTargetWidth, duration: 1, ease: "power2.out", paused: true, delay: 0.3});


        const dots = Array.from(document.querySelectorAll('.dot'));

        const dotsEnter = gsap.fromTo(dots, {opacity: 0}, {opacity: 1, duration: 0.5, stagger: 0.1, ease:"power2.out", paused: true, delay: 1});
        /* ── ScrollTrigger con pin: la sezione resta fissa a schermo
           finché l'animazione di ingresso non è terminata ── */
        let st = ScrollTrigger.create({
            trigger: catMain,
            start: "top top",              // scatta SOLO quando la sezione riempie tutto il viewport
            end: `+=${PIN_SCROLL_DISTANCE}`, // quanta "distanza di scroll" viene consumata dal pin
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onEnter: () => {
                clipMove.play();
                titleEnter.play();
                subtitleEnter.play();
                cardEnter.play();
                dotsEnter.play();
            },
            onLeave: () => {
                clipMove.reverse();
                titleEnter.reverse();
                subtitleEnter.reverse();
                cardEnter.reverse();
                dotsEnter.reverse();
            },
            onEnterBack: () => {
                clipMove.play();
                titleEnter.play();
                subtitleEnter.play();
                cardEnter.play();
                dotsEnter.play();
            },
            onLeaveBack: () => {
                clipMove.reverse();
                titleEnter.reverse();
                subtitleEnter.reverse();
                cardEnter.reverse();
                dotsEnter.reverse();
            },
        });

        return () => {
            cancelAnimationFrame(rafId);
            snapTween?.kill();
            st?.kill();
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
        background-color: var(--neutral-50);
    }

    /* ── contenitori: 1512px resta il "design ideale" (max-width),
       ma ora si adattano a qualunque risoluzione desktop ── */
    #text {
        width: 100%;
        max-width: 1512px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding-top: clamp(1.5rem, 3vh, 4rem);
        padding-bottom: 0.75rem;
        padding-inline: clamp(1rem, 4vw, 3rem);
        gap: clamp(8px, 1.2vh, 20px);
        flex-shrink: 0;
        position: relative;
        z-index: 10;
    }

    #title {
        font-family: var(--font-family);
        text-transform: uppercase;
        font-size: clamp(2rem, 5.5vw, 7.5rem);
        font-weight: 800;
        margin: 0;
        color: var(--neutral-800);
    }

    #description {
        font-family: var(--font-family-text);
        font-size: clamp(0.9rem, 1.4vw, 2.1875rem);
        font-weight: 300;
        line-height: 110%;
        max-width: clamp(280px, 55vw, 55.875rem);
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
        width: 100%;
        max-width: 1512px;
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
        width: 100%;
        max-width: 1512px;
        height: auto;
        pointer-events: none;
        z-index: 0;
        stroke: #dbdbdb;
        clip-path: url(#clipPath);
    }

    #clip {
        position: absolute;
        width: 100%;
        height: 100%;
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

    .slide:not(.is-active) :global(a) {
        pointer-events: none;
    }

    .slide :global(a),
    .slide :global(img) {
        -webkit-user-drag: none;
        pointer-events: none;
    }

    .slide.is-active :global(a) {
        pointer-events: all;
    }

    /* ── laptop più piccoli (13"-14", 1280-1440px) ── */
    @media (max-width: 1440px) {
        #title { font-size: clamp(2rem, 5vw, 4.5rem); }
        #description { font-size: clamp(0.9rem, 1.3vw, 1.25rem); }
    }

    /* ── desktop molto stretti / finestre ridotte ── */
    @media (max-width: 1024px) {
        #text { padding-top: 1rem; }
        #title { font-size: clamp(1.75rem, 6vw, 3rem); }
    }

    /* ── monitor ultra-wide / 4K ── */
    @media (min-width: 1920px) {
        #text, #carousel-outer, #arc-bg { max-width: 1800px; }
    }

    @media(max-width: 450px){

        /* FIX: position: relative aggiunto — mancava, e #carousel-outer
           essendo "position: absolute" si posizionava rispetto al viewport
           invece che rispetto a questa sezione. */
        #Selezione-Categorie {
            position: relative;
            width: 100vw;
            max-width: 450px;
            height: 100vh;
            max-height: 874px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: var(--neutral-50);
        }


        #text {
            width: 100%;
            max-width: 450px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: clamp(8px, 1.2vh, 20px);
            flex-shrink: 0;
            position: relative;
            z-index: 10;
            height: fit-content;
            margin-bottom: auto;
            margin-top: 3rem;
        }

        #title {
            font-family: var(--font-family);
            text-transform: uppercase;
            font-size: 4.25rem;
            font-style: normal;
            font-weight: 900;
            /* FIX: line-height era 1.9375rem (troppo basso rispetto ai 4.25rem
               di font-size) e tagliava le lettere con ascendenti/discendenti,
               specialmente dentro le mask create da SplitText. Ora è un valore
               unitless proporzionale al font-size. */
            line-height: 0.9;
            text-transform: uppercase;
            color: var(--neutral-800);
        }

        #carousel-outer {
            height: 500px;
            width: 100%;
            max-width: 450px;
            cursor: grab;
            touch-action: none;
            user-select: none;
            overflow: visible;
            position: absolute;
            left: -10%;
        }


      
    }


</style>