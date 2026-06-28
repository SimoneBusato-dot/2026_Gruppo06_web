<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
    import VillaggioSlider from "./Villaggio_Slider.svelte";

    gsap.registerPlugin(ScrollTrigger); 
    let villSection3;
    let sliderElement = $state(null)
    let line, path;
    let villText3;
    let sliderContainer;
    

    onMount(()=>{

        const length = path.getTotalLength()
        gsap.set(path, {strokeDasharray: length, strokeDashoffset: length})

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(line, { duration: 1.2, rotateY: xPercent * 5, rotateX: -yPercent * 3, scale: 1, ease: "power2.out", overwrite: "auto" });
            gsap.to(sliderElement, { duration: 1.2, rotateY: xPercent * 15, rotateX: -yPercent * 7, ease: "power2.out", overwrite: "auto" });
        };

        const villText3NewSlitType = new SplitType(villText3, {types: 'lines', tagName: 'span'})
        const villText3Lines = villText3NewSlitType.lines


       const sliderEnter = gsap.fromTo(sliderElement, {x: "230%", rotateZ: 30}, {x: 0, rotateZ: 0,duration: 2, ease: "elastic.out(0.5,0.4)", paused: true})
       const sliderExit = gsap.fromTo(sliderElement, {x: 0, rotateZ: 0}, {x: "230%", rotateZ: 30,duration: 2, ease: "elastic.in(0.5,0.4)", paused: true})
       const villText3Enter = gsap.fromTo(villText3Lines, {x: "30%", opacity:0}, {x: 0, opacity:1, duration: 0.6, stagger: 0.1,ease: "elastic.out(0.1,0.5)", paused: true})
       const villText3Exit = gsap.fromTo(villText3Lines, {x: 0, opacity: 1}, {x: "40%", opacity:0, duration: 0.6, stagger: 0.1,ease: "elastic.in(0.1,0.5)", paused: true})
       gsap.set(sliderContainer, {opacity: 0})
       gsap.set("#textContainer", {opacity: 0})

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection3,
                scroller: window,
                start: "top top",
                end: "+=201%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => gsap.set(villSection3, { autoAlpha: 1 }),
                onLeave: () => gsap.set(villSection3, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection3, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection3, { autoAlpha: 0 }),
                onUpdate(self) {
                    if(self.progress >= 0.1){sliderEnter.play(); villText3Enter.play()} else {sliderEnter.reverse(); villText3Enter.reverse()}
                    if(self.progress>=0.1){gsap.to(sliderContainer, {opacity: 1, duration: 0.5, ease: "power2.out"})}
                    if(self.progress>=0.12){gsap.set("#textContainer", {opacity: 1, duration: 0.6})}
                    if(self.progress>= 0.6){sliderExit.play(); villText3Exit.play()} else {sliderExit.reverse(); villText3Exit.reverse()}
                }
    }})

         tl.to(path, { strokeDashoffset: -length, ease: "none", duration: 2}, 0);
        
    window.addEventListener("mousemove", moveElements);
        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

})
</script>

<main id="villSection3" bind:this={villSection3}>
    <div id="svgContainer">
        <svg width="150vw" height="100vh" viewBox="0 0 2101 673" fill="none" xmlns="http://www.w3.org/2000/svg" bind:this={line}>
        <path bind:this={path} d="M22.9023 816.5C389.402 67.9999 600.902 25.5 1137.9 25.5C1600.9 25.5 1217.4 333.5 1731.9 333.5C2349.9 333.5 1995.4 716.5 1731.9 824.5" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>
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
        display: flex;
        justify-content: center;
        align-items: flex-end;
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        margin-block-start: 100dvh;
    }

    #svgContainer{
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
        left: -45%;
        z-index: -1;
        transform-style: preserve-3d
    }

    #svgContainer svg{
        position: absolute;
        bottom: 0;
        
    }

    #content{
        display: flex;
        align-items: flex-end;
        flex-direction: row;
        padding-bottom: 10vh;
       
    }

    #textContainer{
        width: 41.0625rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.625rem;
        font-family: var(--font-family-text);
        padding-bottom: 2vh;
        

    }

    #sliderContainer{
        width: 700px;
        height: fit-content;
        
        overflow: hidden;
    }

    .highlight{
        background-color: transparent;
        color: var(--brand-villaggio-500);
    }

    :global(.swiper) { perspective: 1000px; transform-style: preserve-3d; pointer-events: auto !important; }
    :global(.swiper-pagination-bullet) { pointer-events: auto !important; }

</style>

