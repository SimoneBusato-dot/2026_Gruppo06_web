<script>
    import gsap from "gsap";
    import VipInaspettatiSection2 from "./Vip_Inaspettati_Section2.svelte";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
 
    gsap.registerPlugin(ScrollTrigger);
 
    let section;
    let path;
    let hScroll;
    let textLeft;
    let subtitle;
    let titleMain;
    let textRight;
    let lineContainer;
 
    onMount(() => {
        gsap.set(section, { autoAlpha: 1 });
 
        // --- SplitType ---
        const titleSplit = new SplitType(titleMain, { types: "lines", tagName: "span" });
        const titleLines = titleSplit.lines;
 
        const subtitleSplit = new SplitType(subtitle, { types: "lines", tagName: "span" });
        const subtitleLines = subtitleSplit.lines;
 
        // --- Linea SVG ---
        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });
 
        // --- Mouse parallax ---
        const moveElements = (e) => {
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
 
        // --- Animazioni pausate ---
        const textLeftEnter = gsap.fromTo(
            textLeft,
            { x: -200, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, paused: true, ease: "power2.out", overwrite: "auto" }
        );
 
        const subtitleEnter = gsap.fromTo(
            subtitleLines,
            { x: -200, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.08, duration: 0.7, paused: true, ease: "power2.out", overwrite: "auto" }
        );
 
        const titleEnter = gsap.fromTo(
            titleLines,
            { x: -300, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.1, duration: 0.8, paused: true, ease: "power2.out", overwrite: "auto" }
        );
 
        const textRightEnter = gsap.fromTo(
            textRight,
            { x: 200, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, paused: true, ease: "power2.out", overwrite: "auto" }
        );
        
        

        // --- Timeline ScrollTrigger ---
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hScroll,
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => {
                    gsap.set(section, { autoAlpha: 1 });
                    gsap.set("#section3Panel", { autoAlpha: 1 });
                },
                onLeave: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set("#section3Panel", { autoAlpha: 0 });
                },
                onEnterBack: () => {
                    gsap.set(section, { autoAlpha: 1 });
                    gsap.set("#section3Panel", { autoAlpha: 1 });
                },
                onLeaveBack: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set("#section3Panel", { autoAlpha: 0 });
                },

                onUpdate(self) {

                    // Testi sinistri entrano subito
                    if (self.progress >= 0.1) {
                        textLeftEnter.play();
                    } else {
                        textLeftEnter.reverse();
                    }
 
                    // Sottotitolo
                    if (self.progress >= 0.2) {
                        subtitleEnter.play();
                    } else {
                        subtitleEnter.reverse();
                    }
 
                    // Titolo grande
                    if (self.progress >= 0.3) {
                        titleEnter.play();
                    } else {
                        titleEnter.reverse();
                    }
 
                    // Testo destra
                    if (self.progress >= 0.4) {
                        textRightEnter.play();
                    } else {
                        textRightEnter.reverse();
                    }
                },
            },
        });
 
        // Linea si disegna durante tutto lo scroll
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.65 }, 0);
        tl.fromTo(hScroll, { x: "0vw" }, { x: "-300vw", ease: "none", duration: 1 }, 0);
 
        window.addEventListener("mousemove", moveElements);
 
        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<div id="hScroll" bind:this={hScroll}>

<VipInaspettatiSection2 

/>

<div id="section3Panel">
    <div id="s3Content">
        <p id="s3Eyebrow">VIP INASPETTATI</p>
        <h2 id="s3Title">SNOOP<br>DOGG</h2>
    </div>
</div>

<main bind:this={section}>
 
    <!-- Linea SVG decorativa — sostituisci il d="..." con il tuo path da Figma -->
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
        <div id="topRow">
            <p id="textLeft" bind:this={textLeft}>
                <span class="highlight">Oggi il mito non vive più nella distanza.</span> I VIP diventano iconici quando si mostrano umani, imperfetti, riconoscibili. È questa la nuova forma di idolatria:
            </p>
            <p id="subtitle" bind:this={subtitle}>SENTIRSI PARTE</p>
        </div>
        <div id="bottomRow">
            <h2 id="titleMain" bind:this={titleMain}>DELLA STESSA STORIA</h2>
            <p bind:this={textRight}>
                Il successo di questi personaggi nasce da un meccanismo semplice: <span class="highlight">chi guarda si riconosce.</span> Non ammira soltanto, partecipa. E in quella partecipazione si crea un legame che supera lo schermo.
            </p>
        </div>
    </div>
 
</main>

</div>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-50);
        overflow: hidden;
        perspective: 1000px;
        visibility: hidden; /* Inizialmente nascosto, diventa visibile quando entra nello scroll */

    }
 
    /* Linea SVG */
    #lineContainer {
        position: absolute;
        top: 20%;
        right: -5%;
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
    flex-direction: column;
    justify-content: center;
    padding: clamp(2rem, 5vw, 4rem);
    box-sizing: border-box;
    gap: 0.5rem;
    }

    #topRow {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: clamp(2rem, 4vw, 5rem);
    }

    #bottomRow {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: clamp(2rem, 4vw, 5rem);
    }

    #textLeft {
    font-family: var(--font-family-text);
    font-size: clamp(0.95rem, 1.1vw, 1.3rem);
    color: var(--neutral-900);
    font-weight: 400;
    margin: 0;
    line-height: 1.5;
    max-width: 40%;
    }

    #subtitle {
    font-family: var(--font-family);
    font-size: clamp(3rem, 5.5vw, 7rem);
    font-weight: 900;
    color: var(--brand-vip-500);
    line-height: 0.9;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    white-space: nowrap;
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

    #bottomRow p {
    font-family: var(--font-family-text);
    font-size: clamp(0.95rem, 1.1vw, 1.3rem);
    color: var(--neutral-900);
    font-weight: 400;
    margin: 0;
    line-height: 1.6;
    max-width: 40%;
    }

    .highlight {
    color: var(--brand-vip-500);
    font-weight: 400;
    }


    #hScroll {
    display: flex;
    flex-direction: row;
    width: 400vw;
    height: 100vh;
    position: relative;
    
    }


    #section3Panel {
    width: 100vw;
    height: 100vh;
    background-color: var(--brand-vip-500);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    visibility: hidden; /* Inizialmente nascosto, diventa visibile quando entra nello scroll */
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


</style>
 