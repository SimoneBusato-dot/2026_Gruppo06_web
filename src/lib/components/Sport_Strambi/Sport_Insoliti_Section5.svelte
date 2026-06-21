<script>
    import { onDestroy } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SportSlider2 from './Sport_Slider2.svelte';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let section, text, title, transition;
    let line, line2;

    let sliderVideoEL  = $state([]);
    let activeSliderEl = $state(null);
    let buttonsEl      = $state(null);

    let gsapReady       = false;
    let isSlideChanging = false;
    let ctx;

    // Tween paused pilotate da onUpdate. Lette dinamicamente ad ogni scroll.
    // Vengono ricostruite al cambio slide ma senza toccare lo stato visivo corrente.
    let cardActiveTween   = null;
    let cardInactiveTween = null;

    // Progresso scroll corrente, aggiornato da onUpdate
    let scrollProgress = 0;

    // ── INIT ────────────────────────────────────────────────────────────────
    $effect(() => {
        const slidesReady = sliderVideoEL.length > 0 && sliderVideoEL.every(Boolean);
        if (!slidesReady || !activeSliderEl || !buttonsEl || gsapReady) return;
        gsapReady = true;
        initGSAP();
    });

    // ── SLIDE CHANGE ─────────────────────────────────────────────────────────
    $effect(() => {
        const current = activeSliderEl;
        if (!gsapReady || !current || isSlideChanging) return;

        const inactives = sliderVideoEL.filter(el => el !== current);

        // 1. ANIMAZIONE VISIVA AL CLICK — fluida, invariata rispetto alla versione perfetta
        gsap.fromTo(
            current,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.45, ease: 'power2.out', overwrite: 'auto' }
        );
        gsap.to(inactives, {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        // 2. AGGIORNAMENTO TWEEN SCROLLTRIGGER
        // Prima del kill catturiamo lo stato visivo corrente degli elementi
        // con gsap.set, così il kill non provoca alcun reset visibile.
        // La nuova tween parte dallo stato "già a destinazione" (progress = 1 se p >= soglia,
        // progress = 0 se p < soglia) così onUpdate può play()/reverse() senza scatti.
        const atRest = scrollProgress >= 0.1; // la slide è già visibile?

        if (cardActiveTween) {
            // Congela lo stato corrente prima di killare
            gsap.set(current, { x: gsap.getProperty(current, 'x'), opacity: gsap.getProperty(current, 'opacity') });
            cardActiveTween.kill();
        }
        cardActiveTween = gsap.fromTo(
            current,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, paused: true, ease: 'power2.out' }
        );
        // Porta la tween allo stato corrispondente al progresso scroll attuale
        // così il prossimo play()/reverse() di onUpdate parte dal punto giusto
        if (atRest) cardActiveTween.progress(1);

        if (cardInactiveTween) {
            cardInactiveTween.kill();
        }
        cardInactiveTween = gsap.fromTo(
            inactives,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, paused: true, duration: 0.5, ease: 'power2.out' }
        );
        // progress(1) = visibili. Va settato solo se p >= 0.55,
        // cioè quando le inattive sono già apparse. Sotto quella soglia
        // partono da progress(0) e onUpdate le terrà nascoste con .reverse().
        const inactivesVisible = scrollProgress >= 0.55;
        if (inactivesVisible) cardInactiveTween.progress(1);
    });

    function initGSAP() {
        isSlideChanging = true;

        const inactives = sliderVideoEL.filter(el => el !== activeSliderEl);

        ctx = gsap.context(() => {
            const length = line.getTotalLength();
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

            const textLines  = new SplitType(text,  { types: 'lines', tagName: 'span' }).lines;
            const titleChars = new SplitType(title, { types: 'chars', tagName: 'span' }).chars;

            cardActiveTween = gsap.fromTo(
                activeSliderEl,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, paused: true, ease: 'power2.out' }
            );
            cardInactiveTween = gsap.fromTo(
                inactives,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, paused: true, duration: 0.5, ease: 'power2.out' }
            );

            const cardW = Math.min(window.innerWidth * 0.28, 425);
            const cardH = cardW * (680 / 425);

            const cardBgEnter = gsap.fromTo('#Section5 .card-bg',
                { top: '15vh', left: '12vw', width: cardW, height: cardH, x: 100, opacity: 0, rotateZ: '0deg', zIndex: -1, borderRadius: 12 },
                { top: '15vh', left: '12vw', width: cardW, height: cardH, x: 0, opacity: 1, rotateZ: '20deg', paused: true, zIndex: -1, borderRadius: 12, ease: 'circ.out', duration: 0.6 }
            );
            const cardBgAnimation = gsap.fromTo('#Section5 .card-bg',
                { top: '15vh', left: '12vw', width: cardW, height: cardH, rotateZ: '20deg', zIndex: -1, borderRadius: 12 },
                { top: '0%', left: '0%', width: '100%', height: '100%', duration: 0.7, paused: true, rotateZ: '0', zIndex: 1, borderRadius: 0 }
            );

            const textAnimation = gsap.fromTo(textLines,
                { x: 200, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.05, paused: true, duration: 0.6 }
            );
            const textExit = gsap.to(textLines,
                { x: -200, opacity: 0, stagger: 0.05, paused: true, duration: 0.6 }
            );
            const titleEnter = gsap.fromTo(titleChars,
                { x: 200, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, paused: true, duration: 0.6 }
            );
            const buttonsEnter = gsap.fromTo(buttonsEl,
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, paused: true, duration: 0.6 }
            );

            const length2 = line2.getTotalLength();
            const lineAnimation = gsap.fromTo(line2,
                { strokeDasharray: length2, strokeDashoffset: length2 },
                { strokeDashoffset: 0, ease: 'power2.out', duration: 0.7, paused: true }
            );
            const transitionEnter = gsap.fromTo(transition,
                { scaleX: 0 },
                { scaleX: 1, duration: 0.5, paused: true }
            );

            gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 1,
                    pin: true,
                    pinSpacing: false,
                    onEnter:     () => gsap.set(section, { autoAlpha: 1 }),
                    onLeave:     () => gsap.set(section, { autoAlpha: 0 }),
                    onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                    onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                    onUpdate: (self) => {
                        scrollProgress = self.progress;
                        const p = self.progress;

                        if (p >= 0.1) { textAnimation.play(); cardBgEnter.play(); }
                        else          { textAnimation.reverse(); cardBgEnter.reverse(); }

                        if (p >= 0.4) { textExit.play(); }
                        else          { textExit.reverse(); }

                        if (p >= 0.5) { cardBgAnimation.play(); titleEnter.play(); buttonsEnter.play(); }
                        else          { cardBgAnimation.reverse(); titleEnter.reverse(); buttonsEnter.reverse(); }

                        if (p >= 0.55) { lineAnimation.play(); }
                        else           { lineAnimation.reverse(); }

                        if (p >= 0.9) { transitionEnter.play(); }
                        else          { transitionEnter.reverse(); }

                        // Usa i riferimenti aggiornati dal $effect: puntano sempre
                        // alla slide attiva corrente. Nessuna tween volante creata qui.
                        if (p >= 0.1) { cardActiveTween?.play(); }
                        else          { cardActiveTween?.reverse(); }

                        if (p >= 0.55) { cardInactiveTween?.play(); }
                        else           { cardInactiveTween?.reverse(); }
                    }
                }
            })
        
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",       // parte insieme alla prima
                end: "+=54%",           // finisce all'80% della prima (81% di 101%)
                scrub: 1,
                // NO pin — il pin lo gestisce già tl
            }
        });
        
            tl2.to(line, { strokeDashoffset: 0, ease: 'none', duration: 5 });

        }, section);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                isSlideChanging = false;
            });
        });
    }

    onDestroy(() => {
        cardActiveTween?.kill();
        cardInactiveTween?.kill();
        ctx?.revert();
    });
</script>

<main id="Section5" bind:this={section}>
    <div id="svgContainer">
        <svg id="section5Path" width="100%" height="100%" viewBox="0 0 1560 1000" preserveAspectRatio="xMidYMin meet">
            <path bind:this={line} d="M16.9741 982C208.307 811.333 679.374 733.6 880.974 966C1016.12 1121.79 1082.97 504.5 1346.97 663C1610.97 821.5 1574.93 -5.81252 1551.97 -13" stroke-linecap="round"/>
        </svg>
    </div>

    <div id="svgContainer2">
        <svg width="100%" height="110%" viewBox="0 0 1015 648" preserveAspectRatio="xMidYMid meet" fill="none">
            <path bind:this={line2} d="M-41 212.105L501 59.1046C501 59.1046 584.5 30.0156 709 78.8066C820 122.307 844 229.105 844 229.105L965.5 708.105" stroke="#533EDC" stroke-width="101"/>
        </svg>
    </div>

    <div class="content">
        <div id="videoContainer">
            <SportSlider2
                bind:el={sliderVideoEL}
                bind:elActive={activeSliderEl}
                bind:elButtons={buttonsEl}
            />
        </div>
        <div id="text5">
            <p bind:this={text}>Questo suo essere insolito e a prima vista inspiegabile ha spinto le persone a realizzare moltissimi contenuti a riguardo. Specialmente <br><mark>MEME</mark></p>
        </div>
        <div id="title">
            <h1 id="memeTitle" bind:this={title}>MEME</h1>
        </div>
    </div>
    <div class="card-bg"></div>

    <svg id="transition" bind:this={transition} viewBox="0 0 1512 982" preserveAspectRatio="none" fill="none">
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
    </svg>
</main>

<style>
    #Section5 {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
    }
    #svgContainer {
        position: absolute; top: 2%; left: 0;
        width: 100%; height: 110%;
        z-index: -1; pointer-events: none;
    }
    #svgContainer2 {
        position: absolute; bottom: 0%; left: -5%;
        width: 67%; height: 66%;
        z-index: 2; pointer-events: none;
    }
    #section5Path {
        fill: none;
        stroke: var(--brand-sport-insoliti-500);
        stroke-width: var(--line-thickness);
    }
    .content {
        position: relative; display: flex;
        width: 100%; align-items: center;
        gap: clamp(4rem, 10vw, 15rem); z-index: 3;
    }
    #text5 {
        width: clamp(18rem, 30vw, 37.75rem);
        font-family: var(--font-family-text);
        font-size: clamp(1rem, 1.6vw, 2rem);
        font-weight: 400; line-height: 110%;
        letter-spacing: -0.08rem;
        color: var(--neutral-900);
        position: absolute; right: 15%; pointer-events: none;
    }
    mark {
        font-family: var(--font-family);
        font-size: clamp(3rem, 6vw, 8.3125rem);
        font-weight: 900; background-color: transparent;
        color: var(--brand-sport-insoliti-500); line-height: 110%;
    }
    #title {
        font-family: var(--font-family);
        font-size: clamp(4rem, 8vw, 10rem);
        font-weight: 900; position: absolute;
        right: 5%; top: 1%;
        color: var(--brand-sport-insoliti-500);
    }
    #videoContainer {
        position: relative;
        width: clamp(280px, 33vw, 500px);
        height: 100%; transform-style: preserve-3d;
        margin-left: clamp(4%, 10vw, 15%); z-index: 2;
    }
    #Section5 .card-bg {
        position: absolute;
        background-color: var(--brand-sport-insoliti-300);
        top: 15vh; left: 12vw;
    }
    #transition {
        position: absolute; top: -35%; right: -20%;
        transform-origin: right center; z-index: 4;
        width: clamp(80vw, 135vw, 160vw);
        height: clamp(100vh, 178vh, 220vh);
        pointer-events: none;
    }
    #Circle { fill: var(--neutral-50); }
</style>