<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { tick } from 'svelte';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { line } from 'd3';

    gsap.registerPlugin(ScrollTrigger);

    let villTransitionElement
    let villSection4
    let title4
    let line4

    onMount(()=>{

        const length = line4.getTotalLength();
        gsap.set(line4, {strokeDasharray: length, strokeDashoffset: length, })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection4,
                scroller: window,
                start: "top top",
                end: "+=201%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => gsap.set(villSection4, { autoAlpha: 1 }),
                onLeave: () => gsap.set(villSection4, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection4, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection4, { autoAlpha: 0 }),
                onUpdate(self){

                }
                
            }
        });

        const tl2 =gsap.timeline({
            scrollTrigger:{
                trigger: villSection4,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,

            }
        })

        tl2.to(line4, {strokeDashoffset: -length, x: "-20%", duration: 1, ease: "none"}, 0)
    })
</script>

<main id="villSection4" bind:this={villSection4}>
    <div id="svgContainer4">
        <svg width="100vw" height="100vh" viewBox="0 0 1603 311" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={line4} d="M22.6853 -61.5C22.6853 -61.5 160.713 207.581 234.185 218.5C352.582 236.096 341.007 14.1142 460.685 12C595.943 9.61056 562.402 243.35 695.685 266.5C807.413 285.906 858.912 129.787 967.185 163.5C1029.47 182.893 1039.2 239.726 1098.69 266.5C1317.74 365.1 1396.11 38.2513 1586.69 -108" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>
    <div id="content4">
        <div id="textContainer4">
            <p id="paragraph4">
                Atleti di nazioni diverse condividono uno spazio e una quotidianità senza filtri: 
            </p>
            <p id="upper"> sono come noi</p>
        </div>
        <h1 id="title4" bind:this={title4}>
            COND<span>O<svg id="transition" bind:this={villTransitionElement} viewBox="0 0 1512 982" preserveAspectRatio="none" fill="none">
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
    </svg></span>M GATE
        </h1>
    </div>
</main>

<style>
    #villSection4{
       position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        margin-block-start: 100dvh;
    }

    #svgContainer4{
        position: absolute;
        top: -45%;
    }

    #content4{
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;

    }

    #title4{
        font-family: var(--font-family);
        position: absolute;
        width: 84.0625rem;
        font-size: 31rem;
        font-style: normal;
        font-weight: 900;
        line-height: 76%; /* 23.56rem */
        text-transform: uppercase;
        color: var(--brand-villaggio-500);
        opacity: 0;
    }

    span{
        position: relative;

    }

    span svg{
        position: absolute;
        width: 0;
        height: 0;
        fill: var(--brand-villaggio-500);
    }

    #textContainer4{
        font-size: 1.625rem;
        width: 40rem;
        font-family: var(--font-family-text);
        
    }

    #paragraph4{
        margin: 0;
    }

    #upper{
        font-family: var(--font-family);
        font-size: 8rem;
        font-style: normal;
        font-weight: 900;
        line-height: 86%; /* 6.88rem */
        text-transform: uppercase;
        text-align: center;
        margin: 0;
        color: var(--brand-villaggio-500);
    }
</style>