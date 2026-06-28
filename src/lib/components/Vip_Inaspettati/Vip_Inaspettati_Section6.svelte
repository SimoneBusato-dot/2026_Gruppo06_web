<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let path1;
    let path2;
    let textLeft;
    let titleRight;

    onMount(() => {
        // --- Linee SVG ---
        const len1 = path1.getTotalLength();
        gsap.set(path1, { strokeDasharray: len1, strokeDashoffset: len1 });

        const len2 = path2.getTotalLength();
        gsap.set(path2, { strokeDasharray: len2, strokeDashoffset: len2 });

        // --- SplitType ---
        const titleLines = new SplitType(titleRight, { types: 'lines', tagName: 'span' }).lines;
        const textLines = new SplitType(textLeft, { types: 'lines', tagName: 'span' }).lines;

        const textEnter = gsap.fromTo(textLines,
            { x: -200, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.08, duration: 0.7, paused: true, ease: 'power2.out', overwrite: 'auto' }
        );
        const textExit = gsap.fromTo(textLines,
            { x: 0, opacity: 1 },
            { x: -200, opacity: 0, duration: 0.5, paused: true, ease: 'power2.in', overwrite: 'auto' }
        );
        const titleEnter = gsap.fromTo(titleLines,
            { x: 200, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, paused: true, ease: 'power2.out', overwrite: 'auto' }
        );

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: 'top top',
                end: '+=200%',
                scrub: 1,
                pin: true,
                pinSpacing: true,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate(self) {
                    if (self.progress >= 0.1 && self.progress < 0.45) {
                        textEnter.play();
                        textExit.reverse();
                    } else if (self.progress >= 0.45) {
                        textExit.play();
                    } else {
                        textEnter.reverse();
                    }

                    if (self.progress >= 0.55) {
                        titleEnter.play();
                    } else {
                        titleEnter.reverse();
                    }
                }
            }
        });

        // Linea 1 in alto si disegna subito
        tl.to(path1, { strokeDashoffset: 0, ease: 'none', duration: 0.4 }, 0.1);
        // Linea 2 in basso si disegna dopo
        tl.to(path2, { strokeDashoffset: 0, ease: 'none', duration: 0.5 }, 0.25);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main bind:this={section}>

    <!-- Contenuto centrale -->
    <div id="content">
        <div id="left">
            <p bind:this={textLeft}>
                Un flusso continuo di <span class="highlight">momenti spontanei</span> che hanno trasformato ogni apparizione in...
            </p>
        </div>
        <div id="right">
            <h2 bind:this={titleRight}>PURO INTRATTENIMENTO</h2>
        </div>
    </div>

    <!-- Linea SVG in alto -->
    <div id="lineTop">
        <svg width=100% height=100% viewBox="0 0 2023 705" perspectiveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">ù
            <path 
                bind:this={path1}
                d="M13.4939 319.5C103.08 375.37 90.4945 75.5 321.495 204C632.494 377.002 866.494 -5.5 866.494 -5.5" 
                stroke="#DC3ECC" 
                stroke-width="51"
                stroke-linecap="round"
                />
        </svg>
    </div>

    <!-- Linea SVG in basso -->
    <div id="lineBottom">
        <svg width="100%" height="100%" viewBox="0 0 2023 705" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                bind:this={path2}
                d="M16.6028 887.273C16.6028 887.273 450.983 514.265 688.103 514.27C826.103 514.272 822.103 719.773 999.103 719.773C1109.01 719.773 1129.2 597.771 1239.1 597.771C1367.1 597.771 1381.5 787.773 1521.6 787.773C2021.6 787.773 1997.1 0.771484 1997.1 0.771484"
                stroke="#DC3ECC"
                stroke-width="51"
                stroke-linecap="round"
            />
        </svg>
    </div>

</main>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background-color: var(--neutral-50);
        overflow: hidden;
        visibility: hidden;
    }

    /* Linea in alto */
    #lineTop {
        position: absolute;
        top: -20%;
        left: -5%;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }

    #lineTop svg {
        width: 100%;
        height: 100%;
    }

    /* Linea in basso */
    #lineBottom {
    position: absolute;
    bottom: -20%;       /* era -10%, scendi di più */
    right: -5%;        /* era -5%, sposta più a destra */
    width: 100%;        /* era 110% */
    height: 100%;        /* era 60%, dai più altezza */
    pointer-events: none;
    }

    #lineBottom svg {
        width: 100%;
        height: 100%;
    }

    /* Contenuto */
    #left p,
    #right h2 {
    position: absolute;
    }

    #content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: clamp(3rem, 6vw, 5rem);
    box-sizing: border-box;
    }

    #left p {
        font-family: var(--font-family-text);
        font-size: clamp(1rem, 1.3vw, 1.5rem);
        color: var(--neutral-900);
        font-weight: 400;
        margin: 0;
        line-height: 1.5;
    }

    #right {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    #right h2 {
        font-family: var(--font-family);
        font-size: clamp(3rem, 6vw, 7rem);
        font-weight: 900;
        color: var(--brand-vip-500);
        line-height: 0.9;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: -0.02em;
        right: 30%;
    }

    .highlight {
        color: var(--brand-vip-500);
        font-weight: 400;
    }
</style>