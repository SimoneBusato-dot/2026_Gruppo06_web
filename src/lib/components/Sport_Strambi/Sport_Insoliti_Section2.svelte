<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SportSlider from "./Sport_Slider.svelte";
    import SplitType from "split-type";

    gsap.registerPlugin(ScrollTrigger);
    let section, path, p1, p2, p3, transitionElement, line;
    let sliderElement = $state(null);

    onMount(() => {
        if (!sliderElement) return;

        const p1SplitText = new SplitType(p1, { types: "lines", tagName: "span" });
        const p1Lines = p1SplitText.lines;
        const p2SplitText = new SplitType(p2, { types: "lines", tagName: "span" });
        const p2Lines = p2SplitText.lines;
        const p3SplitText = new SplitType(p3, { types: "lines", tagName: "span" });
        const p3Lines = p3SplitText.lines;

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(line, { duration: 1.2, rotateY: xPercent * 5, rotateX: -yPercent * 3, scale: 1, ease: "power2.out", overwrite: "auto" });
            gsap.to(sliderElement, { duration: 1.2, rotateY: xPercent * 15, rotateX: -yPercent * 7, ease: "power2.out", overwrite: "auto" });
        };

        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const p1Enter = gsap.fromTo(p1Lines,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.2, overwrite: "auto", duration: 0.6, paused: true, ease: "power2.out"}
        );
        const sliderEnter = gsap.fromTo(sliderElement,
            { x: 100, opacity: 0 },
            { x: 0, opacity: 1, paused: true, overwrite: "auto", duration: 0.6, ease: "power2.out" }
        );
        const p2Enter = gsap.fromTo([...p2Lines, ...p3Lines],
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, overwrite: "auto", duration: 0.5, paused: true, ease: "power2.out"}
        );
        const p1Exit = gsap.to(p1Lines,
            { x: -200, opacity: 0, stagger: 0.1, paused: true, duration: 0.6, overwrite: "auto", ease: "power2.out" }
        );
        const transitionEnter = gsap.fromTo(transitionElement,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.5, paused: true, overwrite: "auto", ease: "power2.out" }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=201%",
                scrub: 1,
                pin: true,
               
                pinSpacing: false,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate(self) {
                    if (self.progress >= 0.2) { p1Enter.play(); sliderEnter.play(); }
                    else { p1Enter.reverse(); sliderEnter.reverse(); }
                    if (self.progress >= 0.5) { p2Enter.play(); p1Exit.play(); }
                    else { p2Enter.reverse(); p1Exit.reverse(); if (self.progress >= 0.2) p1Enter.play();}
                    if (self.progress >= 0.82) { transitionEnter.play(); }
                    else { transitionEnter.reverse(); }
                }
            }
        });

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",       // parte insieme alla prima
                end: "+=161%",           // finisce all'80% della prima (81% di 101%)
                scrub: 1,
                // NO pin — il pin lo gestisce già tl
            }
        });

        tl2.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

        window.addEventListener("mousemove", moveElements);
        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="svgContainer" bind:this={line}>
        <svg width="100%" height="100%" viewBox="0 0 1399 555" preserveAspectRatio="xMidYMid meet" fill="none">
            <path bind:this={path} d="M25.4766 1.0918C32.8099 172.092 211.677 421.892 868.477 53.0918C831.977 256.758 885.577 631.892 1391.98 503.092" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>

    <div id="content">
        <div id="text2">
            <p bind:this={p1}>I feed su Milano Cortina si sono riempiti di discipline invernali insolite.</p>
            <p bind:this={p2}>Tra le discese folli dello <mark class="highlight">skeleton</mark> o il mix sci-carabina del <mark class="highlight">biathlon,</mark> le persone hanno scoperto una passione improvvisa per gli sport più</p>
            <p id="UpperStrambi" bind:this={p3}>PECULIARI <br> E STRAMBI</p>
        </div>
        <SportSlider bind:el={sliderElement} />
    </div>

    <svg id="transition" bind:this={transitionElement} viewBox="0 0 1512 982" preserveAspectRatio="none" fill="none">
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
    </svg>
</main>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
    }

    #svgContainer {
        position: absolute;
        top: -20%;
        right: -10%;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    #svgContainer svg {
        position: absolute;
        top: -10%; left: 0;
        width: 100%; height: 100%;
        stroke: var(--brand-sport-insoliti-500);
    }

    #content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: clamp(2rem, 8vw, 12rem);
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0 clamp(1rem, 3vw, 4rem);
        transform: translateX(5%);

        max-height: 100vh;
        padding-top: clamp(1rem, 4vh, 3rem);
        padding-bottom: clamp(2rem, 6vh, 4rem); /* spazio per non tagliare */
        align-items: center;
        box-sizing: border-box;
    }

    #text2 {
        position: relative;
        color: var(--neutral-900);
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        width: clamp(500px, 35vw, 800px);
        font-family: var(--font-family-text);
        display: flex;
        flex-direction: column;
        gap: clamp(1.5rem, 3vh, 3rem);
        pointer-events: none;
        font-weight: 400;
        flex-shrink: 0;
    }

    #text2 p {
        margin: 0;
    }

    .highlight{
        color: var(--brand-sport-insoliti-500);
        background-color: transparent;
    }

    #UpperStrambi{
        color: var(--brand-sport-insoliti-500);
        font-weight: 900;
        font-size: clamp(3rem, 6vw, 8.3rem);
        font-family: var(--font-family);
        background-color: transparent;
        display: block;
        line-height: 0.88 !important;
    }

    #transition {
        position: absolute;
        top: -35%;
        right: -20%;
        transform-origin: right center;
        z-index: 2;
        width: clamp(80vw, 135vw, 160vw);
        height: clamp(100vh, 178vh, 220vh);
        pointer-events: none;
    }

    #Circle { fill: var(--brand-sport-insoliti-500); }

    :global(.swiper) { perspective: 1000px; transform-style: preserve-3d; pointer-events: auto !important; }
    :global(.swiper-pagination-bullet) { pointer-events: auto !important; }
</style>