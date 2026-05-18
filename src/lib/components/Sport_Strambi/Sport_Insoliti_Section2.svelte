<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SportSlider from "./Sport_Slider.svelte";
  

    gsap.registerPlugin(ScrollTrigger);
    let section;
    let path;
    let p1;
    let p2;
    let sliderElement = $state(null);
    
    

    onMount(() => {
        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Nascondi i paragrafi all'inizio
        gsap.set([p1, p2], { opacity: 0, x: 300 });

        if(sliderElement){
            gsap.set(sliderElement, {opacity: 0, x:300})
        }
    

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=130%",
                scrub: 1,
                pin: true,
        
            }
    });



        tl.to(path, { strokeDashoffset: 0, ease: "none" })
          .to(p1, { opacity: 1, x: 100, ease: "power2.out", duration: 0.3 }, 0)        // appare subito
          .to(p2, { opacity: 1, x: 200, ease: "power2.out", duration: 0.2}, 0.27)      // appare a metà

        if(sliderElement){
            tl.to(sliderElement, {opacity: 1, x: 0, ease: "power2.out", duration: 0.3}, 0) // appare a metà
        }
        

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="svgContainer">
        <svg width="95vw" height="555" viewBox="0 0 1399 555" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={path} d="M25.4766 1.0918C32.8099 172.092 211.677 421.892 868.477 53.0918C831.977 256.758 885.577 631.892 1391.98 503.092"  stroke-width="51"/>
        </svg>
    </div>

    <div id="content">
        <div id="text">
            <p id="1" bind:this={p1}>
                Quali sono quegli sport di milano cortina che si potrebbero categorizzare come insoliti? come strambi? 
            </p>
            <p id="2" bind:this={p2}>
                Magari quegli sport di paese, che di solito son nascosti nel proprio paese e quando esplodono ne son tutti entusiasti perché diversi da quelli normali.   
            </p>
        </div>

        <SportSlider bind:el = {sliderElement}/>
    </div>
</main>



<style>
    :global(body){
        margin: 0;
        padding: 0;
       
    }

    main{
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
       
    }

    #svgContainer{
        position: absolute;
        top: -10%;
        right: -10%;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    svg{
        position: absolute;
        top: -30;
        stroke: var(--brand-sport-insoliti-500);

    }

    #content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15vw;
    width: 100%;
   
    box-sizing: border-box;
}

    #text{
        position: relative;
        z-index: 1;
        color: var(--neutral-900);
        font-size: 2rem;
        max-width: 600px;
        font-family: var(--font-family-text);
    }


   

    </style>