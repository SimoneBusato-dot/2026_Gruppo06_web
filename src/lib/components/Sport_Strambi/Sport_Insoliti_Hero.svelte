<script>



    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { tick } from 'svelte';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';



    gsap.registerPlugin(ScrollTrigger);

    let hero;
    let svgContainer;
    let background;
    let line;
    let sport;
    let insoliti;

    onMount(() => {

        gsap.set(line, {scale: 1.15 });
        gsap.set(background, {scale: 1.15 });

       const moveBackground = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;


            gsap.to(line, {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(background, {
                duration: 1.2,
                rotateY: xPercent * 9,
                rotateX: -yPercent * 2,
                
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(sport, {
                duration: 1.2,
                rotateY: xPercent * 20,
                rotateX: -yPercent * 10,
                ease: "power2.out",
                overwrite: "auto"
            });

            gsap.to(insoliti, {
                duration: 1.2,
                rotateY: -xPercent * 20,
                rotateX: yPercent * 10,
                ease: "power2.out",
                overwrite: "auto"
            });
        };



        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                scroller: window,
                start: "top top",       
                end: "+=200%",
                scrub: 1,
                pin: true,  
                refreshPriority: 1,
                pinSpacing: false,
                onLeave: () => gsap.set(hero, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(hero, { autoAlpha: 1 }),
            }
        });
        tl.to(svgContainer, {
            scale: 5, // Aumentato a 12 per essere sicuri di "entrare" nel bianco
            xPercent: -150,
            yPercent: -50, // Aggiunto per centrare meglio il varco bianco
            rotate: -60,
            ease: "power2.inOut"
        });


        // Aggiungiamo l'ascoltatore alla finestra
        window.addEventListener('mousemove', moveBackground);

         // Pulizia dell'evento quando il componente viene distrutto
         return () => {
            window.removeEventListener('mousemove', moveBackground);
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (tl) tl.kill();
        }

        
});

    
</script>

<main id="hero_spi" bind:this={hero}>

    <div id="perspective-wrapper">


        <div id="svg_container" bind:this={svgContainer}>


            <div bind:this={background} style="width: 100%; height: 100%;">
                <svg id="background" width="100vw" height="100vh" viewBox="0 0 1512 977"  preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1512 70.167L948.909 221.047C931.839 225.621 921.708 243.168 926.282 260.239L1119.68 982H0V0H1512V70.167Z" style="fill: var(--brand-sport-insoliti-500)"/>
                </svg>
            </div>

            <div bind:this={line} id="line-wrapper">
                <svg id="lineasfondo" width="602" height="100vh" viewBox="0 0 602 890" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M511.984 1036.51C511.984 1036.51 409.686 444.499 156.666 832.464C-96.3545 1220.43 62.5 11.7666 62.5 11.7666" style="stroke: var(--brand-sport-insoliti-400)" stroke-width="181"/>
                </svg>
            </div>


        </div>
        <div id="title">
            <h1 id="sport" bind:this={sport}>SPORT</h1>
            <h1 id="insoliti" bind:this={insoliti}> INSOLITI</h1>
        </div>
    </div>
</main>





<style>
    :global(body){
        margin: 0;
        padding: 0;
        overflow-y: scroll; 
        overflow-x: hidden;
        background-color: var(--neutral-50);
    }

    #hero_spi {
        position: relative;
        width: 100vw;
        height: 100vh;
       
        /* Attiva la profondità 3D per tutto il contenitore */
        
        
    }

    #perspective-wrapper {
        width: 100%;
        height: 100%;
         /* Aumentato per un effetto più drammatico */
    }

    #svg_container {
        position: absolute;
        top: 0;
        left: 0%;
        width: 100%;
        height: 100%;
        /* Permette ai figli di ruotare nel proprio spazio 3D */
        transform-style: preserve-3d;
        z-index: 1;
        transform-origin: 90% 90%;
        perspective: 1000px;
    }

    #line-wrapper {
        position: absolute;
        top: 0;
        left: 7%;
        width: 100%;
        height: 100%;
        /* Spostiamo la linea un po' più avanti o indietro */
        transform: translateZ(50px);
    }
    #title {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: start;
        
        width: 100%;
        bottom: 2%;
        left: 2%;
        /* Questo centra perfettamente il titolo sia vert. che orizz. */
       
        
        z-index: 10; /* Sopra tutto */
        
        font-family: var(--font-family, sans-serif);
        font-size: clamp(10rem, 10vw, 8rem);  
        line-height: 0.8;
        color: var(--neutral-50);
        pointer-events: none; /* Il mouse "passa attraverso" il testo per l'effetto orbit */
        text-align: center;
    }

    h1 {
        margin: 0;
        padding: 0;
        font-weight: 800;
        display: inline-block; /* Importante per far funzionare bene le rotazioni */
        /* Diamo un po' più di "presenza" 3D */
        transform-style: preserve-3d;

    }

    #insoliti{
        transform: translateZ(50px);
    }

</style>