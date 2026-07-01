<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let snoopSection;
    let scrollContainer; 
    let snoopTitle;
    let transition;

    onMount(() => {
        gsap.set(snoopSection, { autoAlpha: 0 });

        const titleChars = new SplitType(snoopTitle, { types: 'chars', tagName: 'span' }).chars;
        gsap.set(titleChars, { opacity: 0, y: 120, rotate: 8 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#snoopSection',
                scroller: window,
                start: 'top top',
                end: '+=300%', 
                scrub: 1,
                pin: true,
                pinSpacing: false, 
                markers: true, // Toglili quando hai finito il debug
                onEnter: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeave: () => gsap.set(snoopSection, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(snoopSection, { autoAlpha: 0 }),
            }
        });

        // 1. Animazione del titolo (Entrata)
        tl.to(titleChars, {
            opacity: 1,
            y: 0,
            rotate: 0,
            stagger: 0.04,
            ease: 'power3.out',
            duration: 0.8,
        }, 0.1);

        // 2. Scroll Orizzontale
        tl.to(scrollContainer, {
            x: () => -(scrollContainer.scrollWidth - window.innerWidth),
            ease: 'none', 
            duration: 1.5 
        });

        // 3. Transizione finale
        gsap.set(transition, { scaleX: 0 }); 
        tl.to(transition, {
            scaleX: 1,
            ease: 'power2.inOut',
            duration: 0.8 
        });

        return () => {
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
                <div class="video-wrapper">
                    <video src="/Vip_Inaspettati/Video_SezioneSnoop/Vip_IntroSnoop.mp4" autoplay muted loop></video>
                    <div class="card-bg1"></div>
                    <div class="card-bg2"></div>
                </div>
            </div>

            <div class="text-wrapper">
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
    }

    :global(#snoopTitle .char) {
        display: inline-block;
        overflow: hidden;
    }

    /* PANNELLO 2: Contenuti */
    .content-panel {
        align-items: center;
        justify-content: flex-start;
        padding: 0 10vw 0 10vw; /* Allineamento ideale per distanziare dal titolo precedente */
        gap: 20vw; /* Spazio arioso tra blocco visivo e blocco di testo */
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
        font-size: clamp(1.15rem, 1.25vw, 1.45rem);
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