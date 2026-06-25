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
                rotateY: xPercent * 3,
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
                markers: true,
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

<main id="hero_vlg" bind:this={hero} >

    <div id="perspective-wrapper">


        <div id="svg_container" bind:this={svgContainer}>


            <div bind:this={background} style="width: 100%; height: 100%;">
                <svg width="100vw" height="100vh" viewBox="0 0 1512 870" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1512 45H974C956.327 45.0001 942 59.327 942 77V868C942 868.672 942.024 869.339 942.064 870H0V0H1512V45Z" fill="#DC3E41"/>
                </svg>


            </div>

            <div bind:this={line} id="line-wrapper">
                <svg width="741" height="547" viewBox="0 0 741 547" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-133.532 532.583C-133.532 532.583 -27.9674 -157.781 153.5 151.405C334.967 460.59 624.805 371.999 649.805 -10.501" stroke="#F57476" stroke-width="181"/>
                </svg>

            </div>


        </div>
        <div id="title">
            <h1 id="villaggio" bind:this={sport}>VILLAGGIO</h1>
            <h1 id="olimpico" bind:this={insoliti}>OLIMPICO</h1>
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

    #hero_vlg {
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
        top: 5%;
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

    #olimpico{
        transform: translateZ(50px);
    }

</style>