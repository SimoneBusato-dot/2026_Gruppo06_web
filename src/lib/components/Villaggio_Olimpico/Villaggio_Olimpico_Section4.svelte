<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let villSection4
    let title4
    let line4
    let villText41, villText42
    let content4
    let firstCurtain, secondCurtain;

    onMount(()=>{


        gsap.set(firstCurtain, {rotateZ: 90})
        gsap.set(secondCurtain, {rotateZ: -90})

        const length = line4.getTotalLength();
        gsap.set(line4, {strokeDasharray: length, strokeDashoffset: length})


        const text41SplitType = new SplitType(villText41, {types: 'lines', tagName: 'span'})
        const lines41 = text41SplitType.lines ?? []
        const text42SplitType = new SplitType(villText42, {types: 'words', tagName: 'span'})
        const words42 = text42SplitType.words ?? []
        const titleSplitType = new SplitType(title4, {types: 'chars', tagName: 'span'})
        const title4Chars = titleSplitType.chars ?? []

        // Posiziona l'SVG sulla seconda O (indice 4: C=0, O=1, N=2, D=3, O=4)

        

        const lines41Enter = gsap.fromTo(lines41, {x: "30%", opacity: 0}, {x:0, opacity: 1, stagger: 0.1, duration:0.6, ease:"power2.out", paused: true})
        const lines41Exit = gsap.fromTo(lines41, {x: 0, opacity: 1}, {x:"30%", opacity: 0, stagger: 0.1, duration:0.6, ease:"power2.out", paused: true})
        const words42Enter = gsap.fromTo(words42, {x: "30%", opacity: 0}, {x:0, opacity: 1, stagger: 0.1, duration:0.6, ease:"power2.out", paused: true})
        const words42Exit = gsap.fromTo(words42, {x: 0, opacity: 1}, {x:"30%", opacity: 0, stagger: 0.1, duration:0.6, ease:"power2.out", paused: true})
        const Title4Enter = gsap.fromTo(title4Chars, {x: "30%", opacity: 0}, {x:0, opacity: 1, duration: 1, stagger: 0.1, ease: "elastic.out(0.5,0.4)", paused:true})
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection4,
                scroller: window,
                start: "top top",
                end: "+=201%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => {gsap.set(villSection4, { autoAlpha: 1 }); gsap.set([...lines41, ...words42, ...title4Chars], {x: "30%", opacity: 0})},
                onLeave: () => gsap.set(villSection4, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection4, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection4, { autoAlpha: 0 }),
                onUpdate(self){
                    if(self.progress>=0.1){lines41Enter.play(); words42Enter.play()} else {lines41Enter.reverse(); words42Enter.reverse()}
                    if(self.progress>=0.5){lines41Exit.play(); words42Exit.play()} else {lines41Exit.reverse(); words42Exit.reverse()}
                    if(self.progress>=0.6){Title4Enter.play()} else {Title4Enter.reverse()}
                    if (self.progress >= 0.8) {
                        const p = (self.progress - 0.8) / 0.2
                        gsap.set(firstCurtain, { rotateZ: 90 * (1 - p) })
                        gsap.set(secondCurtain, { rotateZ: -90 * (1 - p) })
                    } else {
                        gsap.set(firstCurtain, { rotateZ: 90 })
                        gsap.set(secondCurtain, { rotateZ: -90 })
                    }
                
                    

                }
            }
        });

        const tl2 = gsap.timeline({
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
    <div id="content4" bind:this={content4}>
        <div id="textContainer4">
            <p id="paragraph4" bind:this={villText41}>
                Atleti di nazioni diverse condividono uno spazio e una quotidianità senza filtri: 
            </p>
            <p id="upper" bind:this={villText42}> sono come noi</p>
        </div>
        <h1 id="title4" bind:this={title4}>
            CONDOM GATE
        </h1>
            <div id="curtain">
                <span id="uno" bind:this={firstCurtain}></span>
                <span id="due" bind:this={secondCurtain}></span>
            </div>
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
        line-height: 76%;
        text-transform: uppercase;
        color: var(--brand-villaggio-500);
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
        line-height: 86%;
        text-transform: uppercase;
        text-align: center;
        margin: 0;
        color: var(--brand-villaggio-500);
    }

    #curtain{
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;

    }

    #uno, #due{
        display: block;
        width: 140%;      /* non serve 200% se il curtain è già 100vw */
        height: 50%;      /* ognuno occupa metà altezza */
        background-color: var(--brand-villaggio-500);
        transform: translatex(-20%)
    }

    #uno{
        transform-origin: bottom right;
    }

    #due{
        transform-origin: top right;
    }


    
</style>