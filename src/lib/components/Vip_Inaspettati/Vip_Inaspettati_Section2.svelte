<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";

    gsap.registerPlugin(ScrollTrigger);
    let section;
    let path;
    let p1;
    let p2;
    let transitionElement;
    let line;

    onMount(() => {
        const p1SplitText = new SplitType(p1, { types: "lines", tagName: "span" });
        const p1Lines = p1SplitText.lines;
        const p2SplitText = new SplitType(p2, { types: "lines", tagName: "span" });
        const p2Lines = p2SplitText.lines;

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(line, {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                scale: 1,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        const p1Enter = gsap.fromTo(
            p1Lines,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, overwrite: "auto", duration: 0.8, paused: true, ease: "power2.out" }
        );

        const p2Enter = gsap.fromTo(
            p2Lines,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.05, overwrite: "auto", duration: 0.5, paused: true, ease: "power2.out" }
        );

        const p1Exit = gsap.to(p1Lines, {
            x: -500,
            opacity: 0,
            stagger: 0.1,
            paused: true,
            duration: 1,
            overwrite: "auto",
            ease: "power2.inOut",
        });

        const p2Exit = gsap.to(p2Lines, {
            x: -500,
            opacity: 0,
            stagger: 0.1,
            paused: true,
            duration: 1,
            overwrite: "auto",
            ease: "power2.inOut",
        });

        const transitionEnter = gsap.fromTo(
            transitionElement,
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, paused: true, overwrite: "auto", ease: "power2.out" }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=150%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate(self) {
    if (self.progress >= 0.1) {
        p1Enter.play();
    } else {
        p1Enter.reverse();
    }

    if (self.progress >= 0.5) {
        p1Exit.play();
    } else {
        p1Exit.reverse();
    }

    if (self.progress >= 0.55) {
        p2Enter.play();
    } else {
        p2Enter.reverse();
    }

    if (self.progress >= 0.78) {
        p2Exit.play();
    } else {
        p2Exit.reverse();
    }

    if (self.progress >= 0.86) {
        transitionEnter.play();
    } else {
        transitionEnter.reverse();
    }
                },
            },
        });

        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
        

        window.addEventListener("mousemove", moveElements);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="svgContainer" bind:this={line}>
        <svg width="100%" height="100%" viewBox="0 0 1399 555" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                bind:this={path}
                d="M85.4009 -405.708C-19.0926 -18.9122 35.0396 277.01 162.383 278.739C289.726 280.468 354.941 -25.4755 470.868 -64.9128C586.794 -104.35 690.647 178.046 857.728 140.98C1029.17 102.947 1119.94 -224.333 1119.94 -224.333"
                stroke-width="51"
                stroke-linecap="round"
            />
        </svg>
    </div>

    <div id="content">
        <div id="text">
            <p bind:this={p1}>o potremmo anche dire...</p>
        </div>
        <div id="titlePanel">
            <p bind:this={p2}><mark>INASPETTATAMENTE VIP</mark></p>
        </div>
    </div>

    <svg
        id="transition"
        bind:this={transitionElement}
        viewBox="0 0 1512 982"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491" />
    </svg>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-y: scroll; 
        overflow-x: hidden;
        background-color: var(--neutral-50);
    }

    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        background-color: var(--neutral-50);
        visibility: hidden;
        overflow: hidden;
    }

    #svgContainer {
        position: absolute;
        top: -10%;
        right: -10%;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    #svgContainer svg {
        position: absolute;
        top: -10%;
        left: 0;
        width: 100%;
        height: 100%;
        stroke: var(--brand-vip-500);
    }

    #content {
        position: relative;
        z-index: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: clamp(3rem, 6vw, 5rem);
        min-height: 100%;
        box-sizing: border-box;
        gap: clamp(2rem, 6vw, 4rem);
    }

    #text {
        position: relative;
        color: var(--neutral-900);
        font-size: clamp(1.25rem, 1.3vw, 1.5rem);
        width: clamp(220px, 28vw, 380px);
        font-family: var(--font-family-text);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        pointer-events: none;
        font-weight: 400;
    }

    #titlePanel {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: clamp(380px, 45vw, 760px);
    }

    mark {
        color: var(--brand-vip-500);
        font-weight: 900;
        font-size: clamp(4rem, 9vw, 9rem);
        font-family: var(--font-family);
        background-color: transparent;
        display: inline;
        white-space: nowrap;
        line-height: 0.85;
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

    #Circle {
        fill: var(--brand-vip-500);
    }

    :global(.swiper) {
        perspective: 1000px;
        transform-style: preserve-3d;
        pointer-events: auto !important;
    }

    :global(.swiper-pagination-bullet) {
        pointer-events: auto !important;
    }
</style>
