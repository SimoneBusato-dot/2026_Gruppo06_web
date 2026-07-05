<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let titleTop;
    let videoContainer;

    let titles = [];

    const rotations = [-2, 0.5, -1.5, 3, 0.5, -2, 0.5, -1.5, -2, 0.5, -1.5, 3]; // Rotazioni casuali per i video

    let transitionBox;


    onMount(() => {

        const wrapperWidth = videoContainer.parentElement.offsetWidth; // Larghezza del contenitore della sezione

        const titleTopWords = new SplitType(titleTop, { types: 'words', tagName: 'span' }).words;
        const titleWords = titles.map(title => {
            if (!title) return [];
            return new SplitType(title, { types: 'words', tagName: 'span' }).words;
        });

        // Impostiamo gli stati iniziali (nascosti) prima dello scroll
        gsap.set(titleTopWords, { x: wrapperWidth, opacity: 0 });
        titleWords.forEach(words => {
            gsap.set(words, { x: wrapperWidth, opacity: 0 });
        });

        gsap.set(videoContainer, { x: wrapperWidth, opacity: 0 }); // Inizialmente posizioniamo il videoContainer fuori dalla vista a destra

        gsap.set(transitionBox, { rotateZ: 90 });


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',      
                end: '+=300%',         
                scrub: 1,              
                pin: true,             
                pinSpacing: false,     
                markers: true,         
                onEnter: () => {gsap.set(section, { autoAlpha: 1 })},
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate(self){
                    if (self.progress >= 0.9) {
                        const p = (self.progress - 0.9) / 0.1
                        gsap.set(transitionBox, { rotateZ: 90 * (1 - p) })
                    } else {
                        gsap.set(transitionBox, { rotateZ: 90 })
                    }
                
                    

                }
            }
        });

        // 1. Entrata del sotto-titolo e della griglia video
        tl.to(titleTopWords, { x: 0, opacity: 1, stagger: 0.05, duration: 1.5, ease: 'power2.out' }, 0);
        tl.to(videoContainer, { x: 0, opacity: 1, ease: 'power2.out', duration: 1.5 }, 0);

        // Segniamo l'istante in cui inizia la catena di titoli
        const titlesStart = tl.duration(); // = 1.5, fine dell'entrata

        // 2. Animazione a catena dei 4 titoli (invariata)
        titleWords.forEach((words, index) => {
            if (!words || words.length === 0) return;

            tl.to(words, { x: 0, opacity: 1, stagger: 0.03, duration: 0.6, ease: 'power2.out' });

            if (index < titleWords.length - 1) {
                tl.to(words, { x: -200, opacity: 0, stagger: 0.03, duration: 0.6, ease: 'power2.in' }, '+=0.6');
            } else {
                tl.to({}, { duration: 0.6 });
            }
        });

        // Segniamo la fine della catena, per sapere quanto è durata
        const titlesEnd = tl.duration();
        const titlesDuration = titlesEnd - titlesStart;

        // 3. Scroll video — ora in PARALLELO con la catena di titoli (stessa posizione di inizio, stessa durata)
        const GridWidth = videoContainer.scrollWidth; 
        const distanceToScroll = GridWidth - wrapperWidth;

        if (distanceToScroll > 0) {
            tl.to(videoContainer, { x: -distanceToScroll, ease: 'none', duration: titlesDuration }, titlesStart);
        }


        return () => {
            ScrollTrigger.getAll().forEach(t => {
                if (t.trigger === section) t.kill();
            });
        };
    });
</script>

<main class="pink-section" bind:this={section}>
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
                            src="/Vip_Inaspettati/Video_SezioneFinaleRosa/Vip_Snoop{n}.mp4" muted loop playsinline autoplay>
                        </video>
                    </div>
                {/each}
            </div>
        </div>

        <div id="curtain">
            <span id="uno" bind:this={transitionBox}></span>
        </div>

</main>


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
        box-sizing: border-box;
        visibility: hidden; /* Nascondi la sezione fino a quando non viene attivata dallo scroll */
        margin-block-start: 100vh;
    }

    .header-titles {
        display: flex;
        flex-direction: column;
        padding: 6vw 6vw;
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
        padding: 2vw 6vw;
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



    /* Pannello diagonale che scende dall'alto e copre tutta la sezione */
    #curtain{
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 2;

    }

    #uno{
        display: block;
        width: 140%;      /* non serve 200% se il curtain è già 100vw */
        height: 100%;      /* ognuno occupa metà altezza */
        background-color: var(--neutral-50);
        transform: translatex(-20%)
    }

    #uno{
        transform-origin: bottom right;
    }


    :global(.title-animation .sub-title .word) {
        display: inline-block;
    }

</style>