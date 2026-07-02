<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let titleTop;
    let videoContainer;

    let titles = [];

    onMount(() => {

        
        // Impostiamo gli stati iniziali (nascosti) prima dello scroll
        gsap.set(titleTop, { y: 30, opacity: 0 });
        gsap.set(titles, { y: 40, opacity: 0 });

        // Timeline dedicata alla seconda sezione
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',      // Si blocca quando la sezione tocca la cima dello schermo
                end: '+=200%',         // Durata dello scroll (intensità del blocco)
                scrub: 1,              // L'animazione segue la dita/rotella dello scroll
                pin: true,             // Blocca la sezione sullo schermo
                pinSpacing: false,     // Crea lo spazio necessario per le sezioni successive
                markers: true,         // Cambia in true se vuoi vedere i marker di debug
                onEnter: () => {gsap.set(section, { autoAlpha: 1 })},
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
            }
        });

        // 1. Entrata del sotto-titolo e della griglia video
        tl.to(titleTop, { y: 0, opacity: 1, duration: 0.4 })

        // 2. Animazione a catena dei 4 titoli (Entra -> Resta -> Esce)
        titles.forEach((title, index) => {
            if (!title) return;

            // Entrata del titolo corrente
            tl.to(title, { x: 0, opacity: 1, duration: 0.5 });

            // Se non è l'ultimo titolo, lo facciamo uscire prima di mostrare il prossimo
            if (index < titles.length - 1) {
                tl.to(title, { x: -100, opacity: 0, duration: 0.4 }, '+=0.6'); // il +=0.6 fa da "pausa" visiva
            } else {
                // Sull'ultimo titolo diamo solo una leggera pausa temporale prima di chiudere
                tl.to({}, { duration: 0.6 });
            }
        });

        // 3. Effetto Slider Video (Spostamento orizzontale continuo durante la lettura dei titoli)
        // Agganciato all'inizio delle transizioni per farlo scorrere fluido mentre i titoli cambiano
        tl.to(videoContainer, { xPercent: -35, ease: 'none', duration: 4 }, 0.5);

        // 4. TRANSIZIONE FINALE: Svuotamento e Slittamento a sinistra verso lo sfondo bianco
        // Sfumiamo i testi rimasti e spingiamo via lo slider dei video
        tl.to([titleTop, titles[titles.length - 1]], { opacity: 0, y: -30, duration: 0.4 })

        // Slittamento netto a sinistra di tutta la sezione rosa per rivelare la pagina bianca sottostante
        tl.to(section, {
            xPercent: -100,
            ease: 'power2.inOut',
            duration: 0.8
        });

        return () => {
            // Pulizia dei trigger associati a questo componente quando viene smontato
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === section) t.kill();
            });
        };
    });
</script>

<section class="pink-section" bind:this={section}>
    <div class="header-titles">
        <span class="sub-title" bind:this={titleTop}>
            L’engagement è decollato attorno a momenti iconici
        </span>
        <div class="main-title-container">
            <h3 class="title-animation" bind:this={titles[0]}>
                CAMMINATA CON LA FIACCOLA A GALLARATE
            </h3>
            <h3 class="title-animation" bind:this={titles[1]}>
                SECONDO MOMENTO SPECIALE SUL PALCO
            </h3>
            <h3 class="title-animation" bind:this={titles[2]}>
                TERZO TITOLO DI GRANDE IMPATTO
            </h3>
            <h3 class="title-animation" bind:this={titles[3]}>
                QUARTO CONTENUTO FINALE
            </h3>
        </div>
    </div>

    <div class="video-slider-wrapper">
        <div class="video-grid" bind:this={videoContainer}>
            <div class="video-wrapper"><div class="placeholder-video">Video 1</div></div>
            <div class="video-wrapper"><div class="placeholder-video">Video 2</div></div>
            <div class="video-wrapper"><div class="placeholder-video">Video 3</div></div>
            <div class="video-wrapper"><div class="placeholder-video">Video 4</div></div>
            <div class="video-wrapper"><div class="placeholder-video">Video 5</div></div>
        </div>
    </div>
</section>

<style>
    .pink-section {
        position: relative;
        z-index: 1;
        width: 100vw;
        height: 100vh;
        background-color: var(--brand-vip-500); /* Cambialo con il tuo codice rosa esatto */
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 6vw 8vw;
        box-sizing: border-box;
        visibility: hidden; /* Nascondi la sezione fino a quando non viene attivata dallo scroll */
        margin-block-start: 100vh;
    }

    .header-titles {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .sub-title {
        font-family: var(--font-family-text, sans-serif);
        font-size: clamp(1rem, 1.3vw, 1.4rem);
        color: var(--neutral-50);
        font-weight: 500;
    }

    .main-title-container {
        position: relative;
        width: 100%;
        height: 100%;
    }

    /* Posizionamento assoluto: i titoli si sovrappongono nello stesso identico punto */
    .title-animation {
        position: absolute;
        top: 0;
        left: 0;
        font-family: var(--font-family, sans-serif);
        font-size: clamp(1.8rem, 3.5vw, 4.2rem);
        font-weight: 900;
        color: var(--neutral-50);
        line-height: 1.1;
        margin: 0;
        text-transform: uppercase;
        width: 100%;
    }

    /* Contenitore slider per i video */
    .video-slider-wrapper {
        width: 100%;
        overflow: visible; /* Lascia vedere i video che arrivano da destra */
        margin-top: 2vh;
        flex-grow: 1;
        display: flex;
        align-items: center;
    }

    .video-grid {
        display: flex;
        gap: 3vw;
        will-change: transform;
    }

    .video-wrapper {
        flex-shrink: 0; /* Impedisce ai video di rimpicciolirsi o deformarsi */
        width: 24vw;
        height: 44vh;
        background: #000000;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    }

    .placeholder-video {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-family: var(--font-family-text, sans-serif);
        font-size: 0.9rem;
    }
</style>