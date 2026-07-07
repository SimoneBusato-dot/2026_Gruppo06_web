<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
    import { goto } from '$app/navigation';

    gsap.registerPlugin(ScrollTrigger);
    let section8;
    let line8;
    let path8;

    onMount(() => {

        const length = path8.getTotalLength();
        gsap.set(path8, { strokeDasharray: length, strokeDashoffset: length });

        
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section8,
                scroller: window,
                start: "top top",
                end: "+=101%",
                scrub: 1,
                pin: true,
                pinSpacing: true,
                markers: false,
                onEnter: () => gsap.set(section8, { autoAlpha: 1 }),
                onLeave: () =>  {window.scrollTo(0, 0);
                        goto('/Categorie');},
                onEnterBack: () => gsap.set(section8, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section8, { autoAlpha: 0 }),
                


            }});

            tl.to(path8, { strokeDashoffset: 0, ease: "none", duration: 5}, 0);

            return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    })
</script>

<main id="section8" bind:this={section8}>
    <div id="svgContainer8" bind:this={line8}>
        <svg width="100%" height="100%" viewBox="0 0 1369 742" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path bind:this={path8} d="M25.4998 0.00048214 C25.4988 153.5 152.504 360.454 287.502 423.999C473.059 511.343 629.672 316.474 777.258 360.455C988.963 423.544 945.713 675.14 1163.62 711.413C1302.76 734.575 1515.42 675.904 1607.65 567.74" stroke="var(--brand-villaggio-500)" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>

</main>

<style>
    #section8{
        position: relative;
        width: 100dvw;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        margin: 0;
    }

    #svgContainer8 {
        position: absolute;
        top: -30%;
        right: -10%;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    #svgContainer8 svg {
        stroke: round;
    }

    
</style>