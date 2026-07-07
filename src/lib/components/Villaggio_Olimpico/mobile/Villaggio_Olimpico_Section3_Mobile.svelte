<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
    import VillaggioSlider from "../Villaggio_Slider.svelte";

    gsap.registerPlugin(ScrollTrigger); 
    let villSection3;
    let sliderElement = $state(null)
    let line, path;
    let villText3;
    let sliderContainer;
    let sliderState = null, sliderExitState = null, containerFaded = false;

    onMount(()=>{

        // const length = path.getTotalLength()
        // gsap.set(path, {strokeDasharray: length, strokeDashoffset: length})

        const villText3NewSlitType = new SplitType(villText3, {types: 'lines', tagName: 'span'})
        const villText3Lines = villText3NewSlitType.lines


       const sliderEnter = gsap.fromTo(sliderElement, {x: "230%", rotateZ: 30}, {x: 0, rotateZ: 0,duration: 2, ease: "elastic.out(0.5,0.4)", paused: true})
       const sliderExit = gsap.fromTo(sliderElement, {x: 0, rotateZ: 0}, {x: "230%", rotateZ: 30,duration: 2, ease: "elastic.in(0.5,0.4)", paused: true})
       const villText3Enter = gsap.fromTo(villText3Lines, {x: "30%", opacity:0}, {x: 0, opacity:1, duration: 0.6, stagger: 0.1,ease: "elastic.out(0.1,0.5)", paused: true})
       const villText3Exit = gsap.fromTo(villText3Lines, {x: 0, opacity: 1}, {x: "40%", opacity:0, duration: 0.6, stagger: 0.1,ease: "elastic.in(0.1,0.5)", paused: true})
       gsap.set(sliderContainer, {opacity: 0})


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection3,
                scroller: window,
                start: "top top",
                end: "+=101%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => {gsap.set(villSection3, { autoAlpha: 1 }); gsap.set(villText3Lines, {x: "30%", opacity:0})},
                onLeave: () => gsap.set(villSection3, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection3, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection3, { autoAlpha: 0 }),
                onUpdate(self) {
                    if(self.progress >= 0.1){sliderEnter.play(); villText3Enter.play()} else {sliderEnter.reverse(); villText3Enter.reverse()}
                    if(self.progress>=0.1){gsap.to(sliderContainer, {opacity: 1, duration: 0.5, ease: "power2.out"})}
                    if(self.progress>= 0.6){sliderExit.play(); villText3Exit.play()} else {sliderExit.reverse(); villText3Exit.reverse()}
                }
    }})

        //  tl.to(path, { strokeDashoffset: -length, ease: "none", duration: 2}, 0);
        
   
        
        return () => {

            ScrollTrigger.getAll().forEach(t => t.kill());
        };

})
</script>

<main id="villSection3" bind:this={villSection3}>
    <!-- <div id="svgContainer">
        
    </div> -->
    <div id="content">
        <div id="sliderContainer" bind:this={sliderContainer}>
            <VillaggioSlider bind:el={sliderElement}/>
        </div>
        <div id="textContainer">
            <p id="paragraph" bind:this={villText3}>Si è trasformato nel dietro le quinte più visto sui social. <mark class="highlight">Room tour e retroscena</mark> come in un reality show.</p>
        </div>
    </div>

</main>

<style>
    #villSection3{
        position: relative;
        width: 100vw;
        height: 100vh;
        max-width: 450px;
        max-height: 874px;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
    }

   

    /* #svgContainer svg{
        position: absolute;
        bottom: 0;
        
    } */

    #content{
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 39px;
       
    }

    #textContainer{
        width: 22.0625rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.25rem;
        font-family: var(--font-family-text);
        padding: 4vh 4vh;
        

    }

    #sliderContainer{
        width: 100%;
        max-width: 100%;
        height: fit-content;
        overflow: hidden;
        margin: 0 auto;
        touch-action: pan-y;
    }

    .highlight{
        background-color: transparent;
        color: var(--brand-villaggio-500);
    }

    :global(.swiper) { perspective: 1000px; transform-style: preserve-3d; pointer-events: auto !important; }
    :global(.swiper-pagination-bullet) { pointer-events: auto !important; }

</style>