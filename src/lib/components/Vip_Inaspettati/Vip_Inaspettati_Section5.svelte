<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
    import { easeLinear } from 'd3';

    gsap.registerPlugin(ScrollTrigger);

    let snoopSection;
    let scrollContainer; 
    let snoopTitle;
    let transition;

    let videoWrapper;
    let cardBg1;
    let cardBg2;
    let textWrapper;

    onMount(() => {
        gsap.set(snoopSection, { autoAlpha: 0 });

        // 1. Animazione del titolo      
        const titleChars = new SplitType(snoopTitle, { types: 'chars', tagName: 'span' }).chars;
        gsap.set(titleChars, { y: 150, opacity: 0, rotateZ: 30 });  


        // 2. Video + card-bg — stato iniziale nascosto
        gsap.set(videoWrapper, { opacity: 0, y: 150, scale: 0.95 });
        gsap.set(cardBg1, { opacity: 0, y: 150 });
        gsap.set(cardBg2, { opacity: 0, y: 150 });

        const textWrapperWords = new SplitType(textWrapper, { types: 'words', tagName: 'span' }).words;
        gsap.set(textWrapperWords, { opacity: 0, x: 60 });


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#snoopSection',
                scroller: window,
                start: 'top top',
                end: '+=300%', 
                scrub: 1,
                pin: true,
                pinSpacing: false, 
                markers: false, // Toglili quando hai finito il debug
                onEnter: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeave: () => gsap.set(snoopSection, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(snoopSection, { autoAlpha: 0 }),
            }   
        });


        // 2. Scroll Orizzontale
        tl.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth),
            ease: 'none', 
            duration: 1.5 
        });

        // 1. Titolo — entra in parallelo allo scroll orizzontale (posizione 0 della timeline)
        tl.to(titleChars, { y: 0, opacity: 1, rotateZ: 0, stagger: 0.03, ease: 'power1.out', duration: 0.3 }, 0.1);

        tl.to(cardBg2, { opacity: 0.6, y: 20, duration: 0.3, ease: 'power1.out' }, 0.55);
        tl.to(cardBg1, { opacity: 1, y: 80, duration: 0.3, ease: 'power1.out' }, 0.55);
        tl.to(videoWrapper, { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power1.out' }, 0.5);
        tl.to(textWrapperWords, { opacity: 1, x: 0, stagger: 0.03, duration: 0.2, ease: 'power1.out' }, 0.7);

        // 3. Transizione finale
        gsap.set(transition, { scaleX: 0 }); 
        tl.to(transition, {
            scaleX: 1,
            ease: 'power2.inOut',
            duration: 0.8 
        });


        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to([videoWrapper], {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                ease: "power2.out",
                overwrite: "auto",
            });
        };

        window.addEventListener("mousemove", moveElements);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="snoopSection" bind:this={snoopSection}>
    <div class="scroll-container" bind:this={scrollContainer}>
        
        <section class="panel title-panel">
            <h2 id="snoopTitle" bind:this={snoopTitle}>
                SNOOP<br>DOGG
            </h2>
        </section>

        <section class="panel content-panel">
            
            <div class="v">
                <div class="video-wrapper" bind:this={videoWrapper}>
                    <video src="/Vip_Inaspettati/Video_SezioneSnoop/Vip_IntroSnoop.mp4" autoplay muted loop></video>
                    <div class="card-bg1" bind:this={cardBg1}></div>
                    <div class="card-bg2" bind:this={cardBg2}></div>
                </div>
            </div>

            <div class="text-wrapper" bind:this={textWrapper}>
                <p class="highlight-text">
                    La presenza di Snoop Dogg si è rivelata un vero e proprio catalizzatore di attenzione. 
                    Con il suo carisma trasversale, ha avvicinato chi solitamente ignora gli sport invernali.
                </p>
                <p class="sub-text">
                    L'engagement è esploso attorno a scene già cult: la fiaccola portata a spasso per Gallarate, 
                    i giri d'onore sul rasaghiaccio, le sciate improvvisate e i meme hanno dettato legge su tutti i social.
                </p>
            </div>
        </section>

    </div>

    <svg id="transition" bind:this={transition} viewBox="0 0 1512 982" preserveAspectRatio="none" fill="none">
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
    </svg>
</main>

<style>
    #snoopSection {
        width: 100vw;
        height: 100vh;
        background-color: var(--brand-vip-500, #c5149c); 
        overflow: hidden;
        margin-block-start: 500vh; 
        position: relative;
    }

    .scroll-container {
        display: flex;
        width: 180vw; 
        height: 100vh;
    }

    .panel {
        width: 100vw;
        height: 100vh;
        flex-shrink: 0;
        display: flex;
        box-sizing: border-box;
    }

    /* PANNELLO 1: Titolo */
    .title-panel {
        width: 80vw;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: clamp(3rem, 7vw, 8rem);
    }

    #snoopTitle {
        color: var(--brand-vip-100);
        font-size: clamp(29rem, 22vw, 31.25rem); 
        font-family: var(--font-family);
        font-weight: 900;
        line-height: 76%;
        margin: 0;
        text-align: left;
        transform: translateX(20vw);
    }

    :global(#snoopTitle .char) {
        display: inline-block;
        overflow: hidden;
    }

    /* PANNELLO 2: Contenuti */
    .content-panel {
        align-items: center;
        justify-content: flex-end;
        padding: 0 6vw 0 4vw; /* Allineamento ideale per distanziare dal titolo precedente */
        gap: 15vw; /* Spazio arioso tra blocco visivo e blocco di testo */
    }

    .v {
        position: relative;
        height: 90vh; /* Ridotto leggermente da 80vh a 70vh per dare respiro allo sfasamento delle card */
        width: calc(90vh * 9 / 16); 
        flex-shrink: 0;
        perspective: 1200px; /* Incrementato per rendere le inclinazioni più morbide */

        /* AGGIUNGI QUESTA LINEA: Sposta l'intero blocco in basso del 10% della sua altezza */
        transform: translateY(10%);
    }

    .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
        /* Leggerissima torsione organica complessiva */
        transform: rotateY(-4deg) rotateX(2deg); 
    }

    video {
        width: 100%;
        height: 100%;
        border-radius: 32px; /* Angoli decisamente arrotondati come da screen figma */
        object-fit: cover;
        position: relative;
        z-index: 3;
        transform: translateZ(40px); 
    }

    /* RIQUADRO 1 (Quello che sborda a Sinistra) */
    .card-bg1 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%; 
        height: 100%; 
        background-color: var(--brand-vip-400); /* Fucsia più chiaro/acceso */
        border-radius: 32px;
        z-index: 2;
        transform-style: preserve-3d;
        /* Ruota verso sinistra, scende leggermente (top/translateX) ed è intermedio nel 3D */
        transform: translateZ(10px) rotateZ(6deg) translateX(25%) translateY(20%) scale(1.02);
    }

    /* RIQUADRO 2 (Quello che sborda a Destra) */
    .card-bg2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%; 
        height: 100%; 
        /* Tonalità più morbida o con opacità per fondersi con il background primario di sezione */
        background-color: var(--brand-vip-400); 
        opacity: 0.6; 
        border-radius: 32px;
        z-index: 1;
        transform-style: preserve-3d;
        /* Si sposta a destra, sale di pochissimo e si posiziona sul fondo del livello 3D */
        transform: translateZ(-20px) rotateZ(-4deg) translateX(-40%) translateY(10%) scale(0.98);
    }

    /* Contenitore Testi sulla destra */
    .text-wrapper {
        width: 28vw; /* Ottimizzato per non spingere i testi fuori schermo */
        color: white;
        font-family: var(--font-family-text); 
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .highlight-text, .sub-text {
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        line-height: 1.45;
        font-weight: 400;
    }

    /* ===== OVERLAY DI TRANSIZIONE FINALE ===== */
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

    #Circle { 
        fill: var(--neutral-50); 
    }
</style>