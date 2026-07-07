<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import VipSlider from "./Vip_Slider.svelte";
    import SplitType from "split-type";

    gsap.registerPlugin(ScrollTrigger);

    // --- Sezione 4 ---
    let section;
    let path;
    let hScroll;
    let textLeft;
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

    let sliderElement = $state(null);
    

    onMount(() => {

        gsap.set([section, s2Section, "#section3Panel"], { autoAlpha: 1 });

        
        
        // === PREPARAZIONE ELEMENTI ===
        const s2Length = s2Path.getTotalLength();
        gsap.set(s2Path, { strokeDasharray: s2Length, strokeDashoffset: s2Length });
        
        const s4Length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: s4Length, strokeDashoffset: s4Length });


        
        // SplitType sezione 2
        const s2P1Lines = new SplitType(s2P1, { types: "words", tagName: "span" }).words;
        const s2P2Lines = new SplitType(s2P2, { types: "words", tagName: "span" }).words;


        const text1s4 = new SplitType(textLeft, { types: 'lines', tagName: 'span' }).lines;
        const text2s4 = new SplitType(titleMain, { types: 'lines', tagName: 'span' }).lines;
        const text3s4 = new SplitType(textRight, { types: 'lines', tagName: 'span' }).lines;

        
        

// === TIMELINE UNICA (TUTTO SOTTO SCRUB) ===
        // Uniamo le animazioni dei testi direttamente qui dentro. 
        // I tempi (0.03, 0.3, ecc.) determinano l'inizio assoluto lungo lo scroll (da 0 a 1)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hScroll,
                scroller: window,
                start: "top top",
                end: "+=600%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: false,
                onEnter: () => {gsap.set(hScroll, { autoAlpha: 1 })},
                onLeave: () => gsap.set(hScroll, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(hScroll, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(hScroll, { autoAlpha: 0 }),
            },
        });

        // --- TIMELINE SEZIONE 2 ---
        // Disegno linea s2
        tl.to(s2Path, { strokeDashoffset: 0, ease: "none", duration: 0.30 }, 0.03);
        // Comparsa testi s2 (Spostati qui dentro! Niente più onUpdate)
        tl.fromTo(s2P1Lines, { x: 150, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, duration: 0.08, ease: "power2.out" }, 0.04);
        tl.fromTo(s2P2Lines, { x: 150, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.03, duration: 0.08, ease: "power2.out" }, 0.15);

        // --- SCROLL ORIZZONTALE ---
        tl.fromTo(hScroll, { x: "0vw" }, { x: () => -(hScroll.scrollWidth - window.innerWidth), ease: "none", duration: 0.5 }, 0.3);

        // --- TIMELINE SEZIONE 4 ---
        // Disegno linea s4 (dura da 0.70 a 0.88)
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.37 }, 0.57);
        
        // TESTO 1: Entra a 0.68, esce a 0.75
        tl.fromTo(text1s4, { x: 100, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.015, duration: 0.025, ease: "power2.out" }, 0.65)
          .to(text1s4, { x: -100, opacity: 0, stagger: 0.015, duration: 0.025, ease: "power2.in" }, 0.70);

        // TESTO 2: Entra a 0.75 (appena esce il primo), esce a 0.82
        tl.fromTo(text2s4, { x: 100, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.025, duration: 0.025, ease: "power2.out" }, 0.78)
          .to(text2s4, { x: -100, opacity: 0, stagger: 0.025, duration: 0.025, ease: "power2.in" }, 0.83);

        // TESTO 3: Entra a 0.82 e resta visibile fino alla fine dello scroll
        tl.fromTo(text3s4, { x: 100, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.015, duration: 0.025, ease: "power2.out" }, 0.88)
            .to(text3s4, { x: -100, opacity: 0, stagger: 0.015, duration: 0.025, ease: "power2.in" }, 0.93);

        // --- TRANSIZIONE FINALE (Anticipata a 0.88 per coincidere con la fine della linea) ---
        tl.to(transitionEllipse, { attr: { rx: 3000, ry: 3000 }, ease: "power2.inOut", duration: 0.04 }, 0.96);
        tl.to("#transitionOverlay", { autoAlpha: 0, duration: 0 }, 1);


        // === PARALLAX MOUSE OTTIMIZZATO ===
        // Un solo calcolo, un solo evento, performance nettamente migliori.
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to([s2Line, lineContainer], {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                ease: "power2.out",
                overwrite: "auto",
            });

            gsap.to(sliderElement, {
                duration: 1.2,
                rotateY: xPercent * 15,
                rotateX: -yPercent * 7,
                ease: "power2.out",
                overwrite: "auto",
            });
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
                <p bind:this={s2P2}>INASPETTATAMENTE VIP</p>
            </div>
        </div>
    </main>

    <!-- PANNELLO 2: Sezione 3 rosa -->
    <div id="section3Panel">
        <div id="s3Content">
            <VipSlider bind:el={sliderElement} />
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
                <span class="highlight">Oggi il mito non vive più nella distanza.</span><br>
                I VIP diventano iconici quando si mostrano umani, imperfetti, riconoscibili.<br>
                È questa la nuova forma di idolatria:
            </p>
            <div id="titleBlock">
                <h2 id="titleMain" bind:this={titleMain}>SENTIRSI PARTE DELLA STESSA STORIA</h2>
            </div>
            <p id="textDesc" bind:this={textRight}>
                Il successo di questi personaggi nasce da un meccanismo semplice: <span class="highlight">chi guarda si riconosce.</span> <br>
                Non ammira soltanto, partecipa.<br>
                E in quella partecipazione si crea un legame che supera lo schermo.
            </p>
        </div>
    </main>

</div>

    <div id="transitionOverlay">
        <svg id="transitionSvg" viewBox="0 0 1974 688" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <ellipse bind:this={transitionEllipse} cx="1974" cy="148" rx="0" ry="0" fill="var(--brand-vip-500)"/>
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
        width: max-content; /* 120 + 60 + 120 ++100 */
        height: 100vh;
        position: relative;
        visibility: hidden;
    }

    /* ===== PANNELLO 1 — Sezione 2 ===== */
    #s2Panel {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        background-color: var(--neutral-50);
        overflow: hidden;
        flex-shrink: 0;
    }

    #svgContainer {
        position: absolute;
        top: -10%;
        right: -25%;
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
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: clamp(1rem, s3vw, 3rem);
        min-height: 100%;
        box-sizing: border-box;
        gap: 1.5rem;
    }

    #text {
        position: relative;
        color: var(--neutral-900);
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        font-family: var(--font-family-text);
        gap: 2.5rem;
        pointer-events: none;
        font-weight: 400;
        justify-content: flex-start;
        white-space: nowrap;
    }

    #text p, #titlePanel p {
        margin: 0; /* Rimuove margini di default che sfasano l'allineamento */
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

    /* ===== PANNELLO 2 — Sezione 3 rosa ===== */
    #section3Panel {
        width: 60vw;
        height: 100vh;
        background-color: var(--brand-vip-500);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    #s3Content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 4rem;
    }

    /* ===== PANNELLO 3 — Sezione 4 ===== */
    #s4Panel {
        position: relative;
        width: 100vw; /* Riportato a 120vw perché ora i testi non occupano spazio in larghezza */
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-50);
        overflow: hidden;
        perspective: 1000px;
        flex-shrink: 0;
    }

    #lineContainer {
        position: absolute;
        top: 20%;
        right: -5%;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    }

    #lineContainer svg {
        position: absolute;
        top: -10%;
        left: 5%;
        width: 100%;
        height: 100%;
        stroke: var(--brand-vip-500);
    }

    #content {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: grid; 
        /* Cambiato da place-items: center a questo per allineare a sinistra e al centro verticale */
        justify-items: start; 
        align-items: center; 
        /* Aumenta o diminuisci questo padding-left per decidere ESATTAMENTE dove deve iniziare il testo a sinistra */
        padding-left: clamp(5rem, 10vw, 12rem); 
        padding-right: clamp(3rem, 6vw, 5rem);
        box-sizing: border-box;
    }

    /* ==========================================================================
       CONFIGURAZIONE SPECIFICA DEI TRE TESTI (SEZIONE 4)
       ========================================================================== */

    /* TESTO 1: Diviso su 3 righe (Larghezza massima stretta) */
    #textSmall {
        grid-area: 1 / 1 / 2 / 2;
        text-align: left;
        margin: 0;
        line-height: 1.5;
        font-family: var(--font-family-text);
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        color: var(--neutral-900);
        font-weight: 400;
        white-space: normal; /* Permette al testo di andare a capo */
    }

    /* TESTO 2: Spostato più a destra */
    #titleBlock {
        grid-area: 1 / 1 / 2 / 2;
        padding: 0;
        margin-left: 5vw; /* Spinge il titolo più a destra rispetto al punto di origine comune */
    }

    #titleMain {
        font-family: var(--font-family);
        font-size: clamp(3rem, 6vw, 8.3rem);
        font-weight: 900;
        color: var(--brand-vip-500);
        line-height: 0.9;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: -0.02em;
        white-space: nowrap; /* Il titolo rimane compatto su una riga */
    }

    /* TESTO 3: Diviso su 2 righe (Larghezza massima media) */
    #textDesc {
        grid-area: 1 / 1 / 2 / 2;
        text-align: left;
        margin: 0;
        line-height: 1.6;
        font-family: var(--font-family-text);
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        color: var(--neutral-900);
        font-weight: 400;
        white-space: normal; /* Permette al testo di andare a capo */
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