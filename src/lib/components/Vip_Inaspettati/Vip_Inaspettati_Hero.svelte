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
    let vip;
    let inaspettati;

    onMount(() => {
       const moveBackground = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;


            gsap.to(line, {
                duration: 1.2,
                rotateY: xPercent * 5,
                rotateX: -yPercent * 3,
                scale: 1.15,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(background, {
                duration: 1.2,
                rotateY: xPercent * 9,
                rotateX: -yPercent * 2,
                scale: 1.15,
                ease: "power2.out",
                overwrite: "auto"
            });
            gsap.to(vip, {
                duration: 1.2,
                rotateY: xPercent * 20,
                rotateX: -yPercent * 10,
                scale: 1,
                ease: "power2.out",
                overwrite: "auto"
            });

            gsap.to(inaspettati, {
                duration: 1.2,
                rotateY: -xPercent * 20,
                rotateX: yPercent * 10,
                scale: 1,
                ease: "power2.out",
                overwrite: "auto"
            });
        };


        // Timeline per lo scroll orizzontale (riquadro bianco) //
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                scroller: window,
                start: "top top",       
                end: "+=50%",
                scrub: 1,
                pin: true,  
                refreshPriority: 1,
                pinSpacing: true,
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

        // Importante: rimuoviamo l'evento quando il componente viene distrutto
        return () => {
            window.removeEventListener('mousemove', moveBackground);
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (tl) tl.kill();
    }
});

    
</script>

<main id="hero_spi" bind:this={hero} class="page_content">

    <div id="perspective-wrapper">


        <div id="svg_container" bind:this={svgContainer}>


            <div bind:this={background} style="width: 100%; height: 100%;">
                <svg id="background" width="100vw" height="100vh" viewBox="0 0 1263 982" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-249 0H1263L934.347 546.331C920.496 569.356 920.021 598.032 933.102 621.503L1134.01 982H-249V0Z" fill="#DC3ECC"/>
                </svg>


            </div>

            <div bind:this={line} id="line-wrapper">
                <svg id="lineasfondo" width="1103" height="580" viewBox="0 0 1103 580" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-89.533 563.584C-89.533 563.584 36.7279 -126.78 218.195 182.406C399.663 491.592 641.432 411.603 1039.91 34.1406" stroke="#EE84E3" stroke-width="181"/>
                </svg>




            </div>


        </div>
        <div id="title">
            <h1 id="vip" bind:this={vip}>VIP</h1>
            <h1 id="inaspettati" bind:this={inaspettati}> INASPETTATI</h1>
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
        top: -7%;
        left: 7%;
        width: 100%;
        height: 100%;
        /* Spostiamo la linea un po' più avanti o indietro */
        transform: translateZ(50px) ;
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

    #inaspettati{
        transform: translateZ(50px);
    }

    #next
    {
        width: 100vw;
        min-height: 200vh;
        background-color: var(--neutral-50);
    }
</style>