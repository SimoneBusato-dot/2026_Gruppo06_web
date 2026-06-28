<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";

    gsap.registerPlugin(ScrollTrigger);

    // --- Sezione 4 ---
    let section;
    let path;
    let hScroll;
    let textLeft;
    let subtitle;
    let titleMain;
    let textRight;
    let lineContainer;

    let transitionEllipse;

    // --- Sezione 2 ---
    let s2Section;
    let s2Path;
    let s2P1;
    let s2P2;
    let s2Line;
    

    onMount(() => {
        gsap.set(section, { autoAlpha: 1 });
        gsap.set(s2Section, { autoAlpha: 1 });

        // === SEZIONE 2 ===

        // Parallax sezione 2
        const moveElementsS2 = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(s2Line, {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                scale: 1,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        // Linea sezione 2
        const s2Length = s2Path.getTotalLength();
        gsap.set(s2Path, { strokeDasharray: s2Length, strokeDashoffset: s2Length });

        // SplitType sezione 2
        const s2P1Lines = new SplitType(s2P1, { types: "lines", tagName: "span" }).lines;
        const s2P2Lines = new SplitType(s2P2, { types: "lines", tagName: "span" }).lines;

        // Animazioni sezione 2
        const s2P1Enter = gsap.fromTo(s2P1Lines,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, overwrite: "auto", duration: 0.8, paused: true, ease: "power2.out" }
        );
        const s2P2Enter = gsap.fromTo(s2P2Lines,
            { x: 300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.05, overwrite: "auto", duration: 0.5, paused: true, ease: "power2.out" }
        );

        // === SEZIONE 4 ===

        // Parallax sezione 4
        const moveElementsS4 = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(lineContainer, {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        // Linea sezione 4
        const s4Length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: s4Length, strokeDashoffset: s4Length });

        // Scritte sezione 4
        const textSmallEnter = gsap.fromTo(textLeft,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.5, paused: true, ease: "power2.out", overwrite: "auto" }
        );
        const textSmallExit = gsap.to(textLeft,
            { x: -50, opacity: 0, duration: 0.5, paused: true, ease: "power2.in", overwrite: "auto" }
        );
        const titleEnter = gsap.fromTo([titleMain],
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.5, paused: true, ease: "power2.out", overwrite: "auto" }
        );
        const titleExit = gsap.to([titleMain],
            { x: -80, opacity: 0, stagger: 0.05, duration: 0.5, paused: true, ease: "power2.in", overwrite: "auto" }
        );
        const textDescEnter = gsap.fromTo(textRight,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.6, paused: true, ease: "power2.out", overwrite: "auto" }
        );

        // === SCROLL TRIGGER UNICO ===
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hScroll,
                scroller: window,
                start: "top top",
                end: "+=600%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => {
                    gsap.set(section, { autoAlpha: 1 });
                    gsap.set(s2Section, { autoAlpha: 1 });
                    gsap.set("#section3Panel", { autoAlpha: 1 });
                },
                onLeave: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set(s2Section, { autoAlpha: 0 });
                    gsap.set("#section3Panel", { autoAlpha: 0 });
                },
                onEnterBack: () => {
                    gsap.set(section, { autoAlpha: 1 });
                    gsap.set(s2Section, { autoAlpha: 1 });
                    gsap.set("#section3Panel", { autoAlpha: 1 });
                },
                onLeaveBack: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set(s2Section, { autoAlpha: 0 });
                    gsap.set("#section3Panel", { autoAlpha: 0 });
                },
                onUpdate(self) {
                    // --- Sezione 2: 0–43% dello scroll ---
                    if (self.progress >= 0.04) {
                        s2P1Enter.play();
                    } else {
                        s2P1Enter.reverse();
                    }
                    if (self.progress >= 0.18) {
                        s2P2Enter.play();
                    } else {
                        s2P2Enter.reverse();
                    }

                    // --- Sezione 4 ---
                    if (self.progress >= 0.77) {
                        textSmallEnter.play();
                    } else {
                        textSmallEnter.reverse();
                    }
                    if (self.progress >= 0.83) {
                        textSmallExit.play();
                    } else {
                        textSmallExit.reverse();
                    }
                    if (self.progress >= 0.83) {
                        titleEnter.play();
                    } else {
                        titleEnter.reverse();
                    }
                    if (self.progress >= 0.89) {
                        titleExit.play();
                        textDescEnter.play();
                    } else {
                        titleExit.reverse();
                        textDescEnter.reverse();
                    }
                    
                },
            },
        });

        // Linea sezione 2 si disegna nel primo terzo
        tl.to(s2Path, { strokeDashoffset: 0, ease: "none", duration: 0.22 }, 0.03);
        // Linea sezione 4 si disegna nell'ultimo terzo
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.20 }, 0.75);
        // Scroll orizzontale
        tl.fromTo(hScroll, { x: "0vw" }, { x: "-200vw", ease: "none", duration: 0.7 }, 0.3);

        tl.to(transitionEllipse, { attr: { rx: 3000, ry: 3000 }, ease: "power2.inOut", duration: 0.05 }, 0.95);
        tl.to("#transitionOverlay", { autoAlpha: 0, duration: 0.01 }, 1.0);

        // Parallax su entrambi
        const moveElements = (e) => {
            moveElementsS2(e);
            moveElementsS4(e);
        };
        window.addEventListener("mousemove", moveElements);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<div id="hScroll" bind:this={hScroll}>

    <!-- PANNELLO 1: Sezione 2 -->
    <main id="s2Panel" bind:this={s2Section}>
        <div id="svgContainer" bind:this={s2Line}>
            <svg width=100% height=100% viewBox="0 0 1986 688" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={s2Path}
                    d="M85.4009 -405.708C-19.0926 -18.9122 35.0396 277.01 162.383 278.739C289.726 280.468 354.941 -25.4755 470.868 -64.9128C586.794 -104.35 690.647 178.046 857.728 140.98C1029.17 102.947 1119.94 -224.333 1119.94 -224.333" 
                    stroke="#DC3ECC" 
                    stroke-width="51" 
                    stroke-linecap="round"
                    />
            </svg>
        </div>

        <div id="s2Content">
            <div id="text">
                <p bind:this={s2P1}>o potremmo anche dire...</p>
            </div>
            <div id="titlePanel">
                <p bind:this={s2P2}><mark>INASPETTATAMENTE VIP</mark></p>
            </div>
        </div>
    </main>

    <!-- PANNELLO 2: Sezione 3 rosa -->
    <div id="section3Panel">
        <div id="s3Content">
            <p id="s3Eyebrow">VIP INASPETTATI</p>
            <h2 id="s3Title">SNOOP<br>DOGG</h2>
        </div>
    </div>

    <!-- PANNELLO 3: Sezione 4 -->
    <main id="s4Panel" bind:this={section}>
        <div id="lineContainer" bind:this={lineContainer}>
            <svg width="100%" height="100%" viewBox="0 0 1986 688" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    bind:this={path}
                    d="M0 828.186C359 828.186 374.5 517.186 560 517.186C745.5 517.186 1104.5 891.186 1432 875.684C1709.9 862.529 1980 609.192 1773.5 240.689C1567 -127.814 1974 88.6868 1974 88.6868"
                    stroke-width="51"
                    stroke-linecap="round"
                />
            </svg>
        </div>
        <div id="content">
            <p id="textSmall" bind:this={textLeft}>
                <span class="highlight">Oggi il mito non vive più nella distanza.</span> I VIP diventano iconici quando si mostrano umani, imperfetti, riconoscibili. È questa la nuova forma di idolatria:
            </p>
            <div id="titleBlock">
                <h2 id="titleMain" bind:this={titleMain}>SENTIRSI PARTE DELLA STESSA STORIA</h2>
            </div>
            <p id="textDesc" bind:this={textRight}>
                Il successo di questi personaggi nasce da un meccanismo semplice: <span class="highlight">chi guarda si riconosce.</span> Non ammira soltanto, partecipa. E in quella partecipazione si crea un legame che supera lo schermo.
            </p>
        </div>
    </main>

</div>

    <div id="transitionOverlay">
        <svg id="transitionSvg" viewBox="0 0 1986 688" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <ellipse bind:this={transitionEllipse} cx="1974" cy=88 rx="0" ry="0" fill="var(--brand-vip-500)"/>
        </svg>
    </div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-y: scroll;
        overflow-x: hidden;
        background-color: var(--neutral-50);
    }

    #hScroll {
        display: flex;
        flex-direction: row;
        width: 250vw; /* 120 + 60 + 120 ++100 */
        height: 100vh;
        position: relative;
    }

    /* ===== PANNELLO 1 — Sezione 2 ===== */
    #s2Panel {
        position: relative;
        width: 120vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        background-color: var(--neutral-50);
        overflow: hidden;
        flex-shrink: 0;
        visibility: hidden;
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

    #s2Content {
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
        font-size: clamp(0.95rem, 1.1vw, 1.3rem);
        font-family: var(--font-family-text);
        gap: 1.5rem;
        pointer-events: none;
        font-weight: 400;
        justify-content: flex-start;
    }

    #titlePanel {
        font-family: var(--font-family);
        font-size: clamp(3rem, 6vw, 8.3rem);
        font-weight: 900;
        color: var(--brand-vip-500);
        line-height: 0.9;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: -0.02em;
        white-space: nowrap;
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

    /* ===== PANNELLO 2 — Sezione 3 rosa ===== */
    #section3Panel {
        width: 60vw;
        height: 100vh;
        background-color: var(--brand-vip-500);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        visibility: hidden;
    }

    #s3Content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 4rem;
    }

    #s3Eyebrow {
        font-family: var(--font-family-text);
        font-size: clamp(1rem, 1.2vw, 1.4rem);
        color: rgba(255,255,255,0.7);
        text-transform: uppercase;
        letter-spacing: 0.3em;
        margin: 0;
    }

    #s3Title {
        font-family: var(--font-family);
        font-size: clamp(6rem, 14vw, 16rem);
        font-weight: 900;
        color: rgba(255,255,255,0.35);
        line-height: 0.85;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: -0.04em;
    }

    /* ===== PANNELLO 3 — Sezione 4 ===== */
    #s4Panel {
        position: relative;
        width: 120vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-50);
        overflow: hidden;
        perspective: 1000px;
        flex-shrink: 0;
        visibility: hidden;
    }

    #lineContainer {
        position: absolute;
        top: 20%;
        right: auto;
        left: -5%;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }

    #lineContainer svg {
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
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    padding: clamp(3rem, 6vw, 5rem);
    box-sizing: border-box;
    gap: 1rem;
    }

    #textSmall {
    font-family: var(--font-family-text);
    font-size: clamp(0.95rem, 1.1vw, 1.3rem);
    color: var(--neutral-900);
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
    }

    #titleBlock {
    display: flex;
    flex-direction: column;
    gap: 0;
    }

    #titleMain {
    font-family: var(--font-family);
    font-size: clamp(3rem, 5.5vw, 7rem);
    font-weight: 900;
    color: var(--brand-vip-500);
    line-height: 0.9;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    }

    #textDesc {
    font-family: var(--font-family-text);
    font-size: clamp(0.95rem, 1.1vw, 1.3rem);
    color: var(--neutral-900);
    font-weight: 400;
    margin: 0;
    line-height: 1.6;
    }

    #textSmall,
    #titleBlock,
    #textDesc {
    position: absolute;
    text-align: left;
    max-width: 850px;
    padding: clamp(3rem, 6vw, 5rem);
    left: 10%;                  /* sposta a sinistra */
    top: 40%;                   /* sposta in basso */
    transform: translateY(-50%);
    }

    .highlight {
    color: var(--brand-vip-500);
    font-weight: 400;
    }

    #transitionOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 100;
    }

    #transitionSvg {
        width: 100%;
        height: 100%;
    }
</style>