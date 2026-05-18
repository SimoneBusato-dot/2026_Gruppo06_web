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
    let transitionElement;
    let line;
    
    

    onMount( () => {

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY/ window.innerHeight -0.5) *2;

            gsap.to(line, {
                duration: 1.2,
                rotateY: xPercent* 5,
                rotateX: -yPercent * 3,
                scale: 1.02,
                ease: "power2.out",
                overwrite: "auto",
            })
            
            }
        
        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Nascondi i paragrafi all'inizio
        gsap.set([p1, p2], { opacity: 0, x: 300 });
        gsap.set(transitionElement, {scaleX: 0})

        if(sliderElement){
            gsap.set(sliderElement, {opacity: 0, x:50})
        }
    

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=130%",
                scrub: 1,
                pin: true,
                pinSpacing: true,
        
            }
    });



        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1}, 0) // disegna la linea
          .to(p1, { opacity: 1, x: 90, ease: "power2.out", duration: 0.5}, 0)        // appare subito
          .to(p2, { opacity: 1, x: 200, ease: "power2.out", duration: 0.6}, 0.55)      // appare a metà
          .to(transitionElement, {scaleX: 1, ease: "power2.out", duration: 0.3}, 1.3)

        if(sliderElement){
            tl.to(sliderElement, {opacity: 1, x: 0, ease: "power2.out", duration: 0.3}, 0) // appare a metà
        }
        

        window.addEventListener("mousemove", moveElements);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="svgContainer" bind:this={line}>
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
    
    <svg id="transition" bind:this={transitionElement} 
     viewBox="0 0 1512 982"
     preserveAspectRatio="none"
     fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
</svg>

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
        perspective: 1000px;
       
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
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    #transition{
        position: absolute;
        top: -35%;
        right: -20%;
        left: auto;
        transform-origin: right center;
        z-index: 2;
        width: 135vw;
        height: 178vh;
    }

    #Circle{
        width: 130%;
        height: 130%;
        fill: var(--brand-sport-insoliti-500);

    }


   

    </style>