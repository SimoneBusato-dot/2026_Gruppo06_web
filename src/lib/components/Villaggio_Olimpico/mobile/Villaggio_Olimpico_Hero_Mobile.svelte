<script>

    import { browser } from '$app/environment';
    import { onMount, onDestroy } from 'svelte';
    import {gsap} from 'gsap';
    import { tick } from 'svelte';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    

    let hero;
    let svgContainer;
    let background;
    let line;
    let sport;
    let insoliti;

    if (browser && !window.__stNormalized) {
    ScrollTrigger.normalizeScroll({ type: "touch", momentum: 2.5 });
    window.__stNormalized = true;
}

    

    gsap.registerPlugin(ScrollTrigger); 
    
    
    onMount(()=> {


         gsap.set(background, {scale: 1.15 });
         gsap.set(line, {scale: 1.15 });


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: hero,
                scroller: window,
                start: "top top",       
                end: "+=100%",
                scrub: 1,  
                pin: true,  
                refreshPriority: 1,
                pinSpacing: false,
                markers: true,
                invalidateOnRefresh: true
                // onLeave: () => gsap.set(hero, { autoAlpha: 0 }),
                // onEnterBack: () => gsap.set(hero, { autoAlpha: 1 }),
            }
        });
        tl.to(svgContainer, {
            scale: 12, // Aumentato a 12 per essere sicuri di "entrare" nel bianco
            xPercent: -150,
            yPercent: -50, // Aggiunto per centrare meglio il varco bianco
            rotate: -60,
            ease: "power2.inOut",
            duration :10
        },0);
        
         onDestroy(() => {
            if (tl) {
                tl.scrollTrigger?.kill();
                tl.kill();
            }
        });

    })

   

</script>

<main id="hero_vlg_mobile" bind:this={hero}>
    <div id="perspective-wrapper-mobile">

        <div id="svgContainerMobile" bind:this={svgContainer}>
            <div id="backgroundMobile" bind:this={background}>
                <svg width="402" height="877" viewBox="0 0 402 877" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M429 332H348C330.327 332 316 346.327 316 364V877H-33V0H429V332Z" fill="#DC3E41"/>
                </svg>
            </div>

            <div id="line-wrapper-mobile"  bind:this={line}>
                <svg width="275" height="877" viewBox="0 0 275 877" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M118.501 876.5C118.501 793 -111.676 418.146 82.0008 409C275.677 399.854 320.104 101.636 -6.91752 -98.3344" stroke="#F57476" stroke-width="83"/>
                </svg>
            </div>

         
        </div>

           <div id="title-mobile">
                <h1 id="villaggio" bind:this={sport}>VILLAGGIO</h1>
                <h1 id="olimpico" bind:this={insoliti}>OLIMPICO</h1>
            </div>
    </div>
</main>

<style>
    :global(body){
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        background-color: var(--neutral-50);
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;

    }

    #hero_vlg_mobile{
        position: relative;
        width: 100vw;
        height: 100dvh;
        max-width: 450px;
        max-height: 874px;
        
    }

    #backgroundMobile{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    #backgroundMobile svg{
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #perspective-wrapper-mobile{
        width: 100%;
        height: 100%;
         /* Aumentato per un effetto più drammatico */
    }

    #title-mobile{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    width: 100%;
    bottom: 2%;
    left: 5%;
    z-index: 10;
    pointer-events: none;
}

#title-mobile h1{
    margin: 0; /* azzera il margin di default degli h1 */
    font-family: var(--font-family);
    font-size: 5.375rem;
    line-height: 4.8125rem;
    color: var(--neutral-50);
    font-weight: 900;
}

#line-wrapper-mobile{
    position: absolute;
        top: -7%;
        left: 0%;
        width: 100%;
        height: 100%;
}

#svgContainerMobile{
        position: absolute;
        top: 5%;
        left: 0%;
        width: 100%;
        height: 100%;
        z-index: 1;
        transform-origin: 90% 90%;
       
    }
</style>