<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SportSlider2 from './Sport_Slider2.svelte';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);
    let section, text, title, transition;
    let line, line2;
    let sliderVideoEL = $state([]);
    let activeSliderEl = $state(null);
    let buttonsEl = $state(null);

    const inactiveSlides = $derived(sliderVideoEL.filter(el => el !== activeSliderEl));

    onMount(() => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

        const textLines = new SplitType(text, { types: "lines", tagName: "span" }).lines;
        const titleChars = new SplitType(title, { types: "chars", tagName: "span" }).chars;

        const cardActiveAnimation = gsap.fromTo(activeSliderEl,
            { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, paused: true, overwrite: "auto", ease: "power2.out" }
        );
        const cardInactiveAnimation = gsap.fromTo(inactiveSlides,
            { x: 100, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, paused: true, duration: 0.5, overwrite: "auto", ease: "power2.out" }
        );

        // Card bg proporzionato dinamicamente al viewport
        const cardW = Math.min(window.innerWidth * 0.28, 425);
        const cardH = cardW * (680 / 425);

        // Usiamo vh e vw coerenti per evitare sbalzi quando l'altezza del browser si riduce
        const cardBgEnter = gsap.fromTo('#Section5 .card-bg',
            { top: '15vh', left: '12vw', width: cardW, height: cardH, x: 100, opacity: 0, rotateZ: "0deg", zIndex: -1, borderRadius: 12 },
            { top: '15vh', left: '12vw', width: cardW, height: cardH, x: 0, opacity: 1, rotateZ: "20deg", paused: true, zIndex: -1, borderRadius: 12, ease: "circ.out", duration: 0.6 }
        );
        const cardBgAnimation = gsap.fromTo('#Section5 .card-bg',
            { top: '15vh', left: '12vw', width: cardW, height: cardH, rotateZ: "20deg", zIndex: -1, borderRadius: 12 },
            { top: '0%', left: '0%', width: "100%", height: "100%", duration: 0.7, paused: true, overwrite: "auto", rotateZ: "0", zIndex: 1, borderRadius: 0 }
        );

        if (!buttonsEl) return;

        const textAnimation = gsap.fromTo(textLines,
            { x: 200, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, paused: true, duration: 0.6, overwrite: "auto" }
        );
        const textExit = gsap.to(textLines,
            { x: -200, opacity: 0, stagger: 0.05, paused: true, duration: 0.6, overwrite: "auto" }
        );
        const titleEnter = gsap.fromTo(titleChars,
            { x: 200, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, paused: true, overwrite: "auto", duration: 0.6 }
        );
        const buttonsEnter = gsap.fromTo(buttonsEl,
            { x: 100, opacity: 0 }, { x: 0, opacity: 1, paused: true, duration: 0.6, overwrite: "auto" }
        );

        const length2 = line2.getTotalLength();
        const lineAnimation = gsap.fromTo(line2,
            { strokeDasharray: length2, strokeDashoffset: length2 },
            { strokeDashoffset: 0, ease: "power2.out", duration: 0.7, paused: true, overwrite: "auto" }
        );
        const transitionEnter = gsap.fromTo(transition,
            { scaleX: 0 }, { scaleX: 1, duration: 0.5, paused: true, overwrite: "auto" }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {
                    if (self.progress >= 0.1) { cardActiveAnimation.play(); textAnimation.play(); cardBgEnter.play(); }
                    else { cardActiveAnimation.reverse(); textAnimation.reverse(); cardBgEnter.reverse(); }
                    if (self.progress >= 0.4) { textExit.play(); } else { textExit.reverse(); }
                    if (self.progress >= 0.5) { cardBgAnimation.play(); titleEnter.play(); buttonsEnter.play(); }
                    else { cardBgAnimation.reverse(); titleEnter.reverse(); buttonsEnter.reverse(); }
                    if (self.progress >= 0.55) { cardInactiveAnimation.play(); lineAnimation.play(); }
                    else { cardInactiveAnimation.reverse(); lineAnimation.reverse(); }
                    if (self.progress >= 0.9) { transitionEnter.play(); } else { transitionEnter.reverse(); }
                }
            }
        });

        tl.to(line, { strokeDashoffset: 0, ease: "none", duration: 0.01 });
    });
</script>

<main id="Section5" bind:this={section} class="page_content">
    <div id="svgContainer">
        <svg id="section5Path" width="100%" height="100%" viewBox="0 0 1560 1000" preserveAspectRatio="xMidYMin meet">
            <path bind:this={line} d="M16.9741 982C208.307 811.333 679.374 733.6 880.974 966C1016.12 1121.79 1082.97 504.5 1346.97 663C1610.97 821.5 1574.93 -5.81252 1551.97 -13"/>
        </svg>
    </div>

    <div id="svgContainer2">
        <svg width="100%" height="100%" viewBox="0 0 1015 648" preserveAspectRatio="xMidYMid meet" fill="none">
            <path bind:this={line2} d="M-41 212.105L501 59.1046C501 59.1046 584.5 30.0156 709 78.8066C820 122.307 844 229.105 844 229.105L965.5 708.105" stroke="#533EDC" stroke-width="101"/>
        </svg>
    </div>

    <div class="content">
        <div id="videoContainer">
            <SportSlider2 bind:el={sliderVideoEL} bind:elActive={activeSliderEl} bind:elButtons={buttonsEl}/>
        </div>
        <div id="text">
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
        position: absolute;
        top: 10%;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }

    #svgContainer2 {
        position: absolute;
        bottom: 0%;
        left: -5%;
        width: 67%;
        height: 66%;
        z-index: 2;
        pointer-events: none;
    }

    #section5Path {
        fill: none;
        stroke: var(--brand-sport-insoliti-500);
        stroke-width: var(--line-thickness);
    }

    .content {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        gap: clamp(4rem, 10vw, 15rem);
        z-index: 3;
    }

    #text {
        width: clamp(18rem, 30vw, 37.75rem);
        font-family: var(--font-family-text);
        font-size: clamp(1rem, 1.6vw, 2rem);
        font-weight: 400;
        line-height: 110%;
        letter-spacing: -0.08rem;
        color: var(--neutral-900);
        position: absolute;
        right: 5%;
        pointer-events: none;
    }

    mark {
        font-family: var(--font-family);
        font-size: clamp(3rem, 6vw, 8.3125rem);
        font-weight: 900;
        background-color: transparent;
        color: var(--brand-sport-insoliti-500);
        line-height: 110%;
    }

    #title {
        font-family: var(--font-family);
        font-size: clamp(4rem, 8vw, 10rem);
        font-weight: 900;
        position: absolute;
        right: 5%;
        top: 1%;
        color: var(--brand-sport-insoliti-500);
    }

    #videoContainer {
        position: relative;
        width: clamp(280px, 33vw, 500px);
        height: 100%;
        transform-style: preserve-3d;
        margin-left: clamp(4%, 10vw, 15%);
        z-index: 2;
    }

    #Section5 .card-bg {
        position: absolute;
        background-color: var(--brand-sport-insoliti-300);
        /* Usiamo vh e vw fissi per bloccarlo rigidamente dietro al video */
        top: 15vh;
        left: 12vw;
    }

    #transition {
        position: absolute;
        top: -35%;
        right: -20%;
        transform-origin: right center;
        z-index: 4;
        width: clamp(80vw, 135vw, 160vw);
        height: clamp(100vh, 178vh, 220vh);
        pointer-events: none;
    }

    #Circle { fill: var(--neutral-50); }
</style>