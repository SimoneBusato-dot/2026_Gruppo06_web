<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    let path;
    let section;
    let text;

    onMount(() => {
        const textSplitType = new SplitType(text, { types: 'lines', tagName: 'span' });
        const textLines = textSplitType.lines;

        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.set(textLines, { opacity: 0, x: 200 });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=100%", // Fast snappy scroll speed to unpin quickly
                scrub: 1,
                pin: true,
                pinSpacing: true,
                snap: {
                    snapTo: (value) => {
                        const threshold = 0.25;
                        if (value < threshold) return 0;
                        if (value > 1 - threshold) return 1;
                        return value;
                    },
                    duration: { min: 0.3, max: 0.7 },
                    delay: 0.2,
                    ease: "power2.out"
                }
            }
        });

        tl.to(path, { strokeDashoffset: 0, duration: 4.0, ease: "power2.out" }, 0)
          .to(textLines, { opacity: 1, x: 0, stagger: 0.1, ease: "power2.out", duration: 1.0 }, 0)
          .to(textLines, { opacity: 0, x: -200, stagger: 0.05, ease: "power2.in", duration: 0.8 }, 3.0)
          .to({}, { duration: 0.05 }, 3.85); // immediate unpin smooth-cut
    });
</script>

<main id="section6" bind:this={section}>
    <!-- Fullscreen SVG containing a single wave curve bleeding off-screen -->
    <div id="svgContainer">
        <svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Curve 1: Single wave curve entering left and exiting top-right -->
            <path bind:this={path} d="M -100 320 C 200 320, 250 120, 450 120 C 650 120, 800 180, 950 180 C 1100 180, 1150 -50, 1250 -100" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>

    <div id="text">
        <p bind:this={text} id="paragraph">Vederli godersi questi piatti con la nostra stessa voglia ha fatto <span class="highlight">crollare l'immagine</span> dell'atleta distante, freddo e rigoroso.</p>
    </div>
</main>

<style>
    #section6 {
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-block-start: 5dvh; /* Tiny gap to make quote appear almost immediately after the chart */
        background-color: var(--neutral-50);
        overflow: hidden;
    }

    /* Pinned Fullscreen SVG Container keeping lines strictly at the left/right margins and bleeding off-screen */
    #svgContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        opacity: 1; /* Vibrant saffron yellow at 100% opacity */
    }

    #svgContainer svg {
        width: 100%;
        height: 100%;
    }

    #text {
        position: relative;
        z-index: 10; /* Solidly above background lines */
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 24pt; /* Maintained exactly at 24pt */
        font-style: normal;
        font-weight: 400;
        line-height: 145%;
        letter-spacing: -0.06rem;
        width: 72.625rem;
        pointer-events: none;
    }

    .highlight {
        color: var(--brand-cibo-500) !important;
        font-weight: bold !important;
     }
</style>