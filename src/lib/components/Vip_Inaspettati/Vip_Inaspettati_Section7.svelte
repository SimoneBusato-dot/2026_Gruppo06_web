<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let titleTop;
    let videoContainer;

    let titles = [];

    const rotations = [-2, 0.5, -1.5, 3, 0.5, -2, 0.5, -1.5, -2, 0.5, -1.5, 3]; // Rotazioni casuali per i video


    onMount(() => {

        
        // Impostiamo gli stati iniziali (nascosti) prima dello scroll
        gsap.set(titleTop, { x: 30, opacity: 0 });
        gsap.set(titles, { x: 40, opacity: 0 });


        // Timeline dedicata alla seconda sezione
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',      // Si blocca quando la sezione tocca la cima dello schermo
                end: '+=300%',         // Durata dello scroll (intensità del blocco)
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
        tl.to(titleTop, { x: 0, opacity: 1, duration: 0.6 })

        // 2. Animazione a catena dei 4 titoli (Entra -> Resta -> Esce)
        titles.forEach((title, index) => {
            if (!title) return;

            // Entrata del titolo corrente
            tl.to(title, { x: 0, opacity: 1, duration: 0.6 });

            // Se non è l'ultimo titolo, lo facciamo uscire prima di mostrare il prossimo
            if (index < titles.length - 1) {
                tl.to(title, { x: -200, opacity: 0, duration: 0.6 }, '+=0.6'); // il +=0.6 fa da "pausa" visiva
            } else {
                // Sull'ultimo titolo diamo solo una leggera pausa temporale prima di chiudere
                tl.to({}, { duration: 0.6 });
            }
        });

        // 3. Effetto Slider Video (Spostamento orizzontale continuo durante la lettura dei titoli)
        const wrapperWidth = videoContainer.parentElement.offsetWidth; // Larghezza del contenitore della sezione
        const GridWidth = videoContainer.scrollWidth; // Larghezza totale della griglia
        const distanceToScroll = GridWidth - wrapperWidth; // Distanza totale da scorrere

        if (distanceToScroll > 0) {
            tl.to(videoContainer, { x: -distanceToScroll, ease: 'none', duration: 4 }, 0); // Inizia subito con la timeline
        }


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
                INCURSIONI NEGLI IMPIANTI RASAGHIACCIO
            </h3>
            <h3 class="title-animation" bind:this={titles[2]}>
                SCI IMPROVVISATI
            </h3>
            <h3 class="title-animation" bind:this={titles[3]}>
                LOOK DA STAMPA FREESTYLE
            </h3>
        </div>
    </div>

        <div class="video-slider-wrapper">
            <div class="video-grid" bind:this={videoContainer}>
                {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as n, i}
                    <div class="video-wrapper" style="transform: rotate({rotations[i]}deg);">
                        <video 
                            src="/Vip_Inaspettati/Video_SezioneFinaleRosa/Vip_Snoop{n}.mp4" 
                            muted 
                            loop 
                            playsinline
                            autoplay
                        ></video>
                    </div>
                {/each}
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
        padding: 2vw 6vw;
        box-sizing: border-box;
        visibility: hidden; /* Nascondi la sezione fino a quando non viene attivata dallo scroll */
        margin-block-start: 100vh;
    }

    .header-titles {
        display: flex;
        flex-direction: column;
        padding-top: 8vh;
        gap: 1.5vh;
    }

    .sub-title {
        font-family: var(--font-family-text, sans-serif);
        font-size: clamp(1.5rem, 1.3vw, 1.5rem);
        color: var(--neutral-50);
        font-weight: 400;
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
        font-size: clamp(3rem, 6vw, 8.3rem);
        font-weight: 900;
        color: var(--neutral-50);
        line-height: 0.9;
        margin: 0;
        text-transform: uppercase;
        width: 100%;
    }

    /* Contenitore slider per i video */
    .video-slider-wrapper {
        width: 100%;
        overflow: visible; 
        flex-grow: 1;
        display: flex;
        align-items: flex-end; /* Allinea i video in basso */
    }

    .video-grid {
        display: flex;
        gap: 3vw;
        will-change: transform;
        align-items: flex-end; /* Allinea i video in basso */
    }

    .video-wrapper {
        flex-shrink: 0; /* Impedisce ai video di rimpicciolirsi o deformarsi */
        width: auto;
        height: 60vh;
        background: #000000;
        border-radius: 20px;
        overflow: hidden;
    }

    video {
        width: auto;
        height: 100%;
        display: block;
        border-radius: 20px; /* Segue il raggio del video-wrapper */
    }
</style>