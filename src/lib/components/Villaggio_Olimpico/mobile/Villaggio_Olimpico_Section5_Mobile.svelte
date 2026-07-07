<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
    

    gsap.registerPlugin(ScrollTrigger);

    let villSection5;
    let line5
    let content5
    let lineOuter5
    let one, two

    onMount(() => {

       
    const length5 = line5.getTotalLength()
    gsap.set(line5, { strokeDasharray: length5, strokeDashoffset: length5, y: "60%" })
    gsap.set(content5, { y: "150%" })

    const text5Elements = content5.querySelectorAll(".text5")

    const splitGroups = Array.from(text5Elements).map(el => {
        const split = new SplitType(el, { types: 'lines', tagName: 'span' })
        return split.lines
    })

    splitGroups.forEach(lines => {
        gsap.set(lines, { x: "30%", opacity: 0 })
    })

    // Traccia quali testi sono già stati animati
    const animated = new Array(splitGroups.length).fill(false)

     gsap.set(one, {rotateZ: 0}) 
     gsap.set(two, {rotateZ: 0})

    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: villSection5,
            scroller: window,
            start: "top top",
            end: "+=240%",
            scrub: 1,
            onUpdate(self) {
    const progress = self.progress

    text5Elements.forEach((el, i) => {
        const videoText = el.closest('.videoText')
        const rect = videoText.getBoundingClientRect()

        // rect.left è la posizione reale nel viewport aggiornata da GSAP
        if (rect.left < window.innerWidth * 0.8 && !animated[i]) {
            animated[i] = true
            gsap.to(splitGroups[i], {
                x: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out"
            })
        }

        if (rect.left > window.innerWidth * 0.85 && animated[i]) {
            animated[i] = false
            gsap.set(splitGroups[i], { x: "30%", opacity: 0 })
        }
    })
}
        }
    })

    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: villSection5,
            scroller: window,
            start: "top top",
            end: "+=240%",
            scrub: 1,
        }})

    tl2.to(line5, { strokeDashoffset: -length5, y: "-60%", duration: 10, ease: "none" }, 0)
    tl3.to(content5, { y: "-300%", duration: 9.5, ease: "power2.out" }, 0)

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: villSection5,
            scroller: window,
            start: "top top",
            end: "+=301%",
            scrub: 1,
            pin: true,
            pinSpacing: false,
            onEnter: () => gsap.set(villSection5, { autoAlpha: 1 }),
            onLeave: () => gsap.set(villSection5, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(villSection5, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(villSection5, { autoAlpha: 0 }),
            onUpdate(self) {
                if (self.progress >= 0.8) {
                        const p = (self.progress - 0.8) / 0.2
                        gsap.set(one, { rotateZ: 90 * p
                         })
                        gsap.set(two, { rotateZ: -90 *p})
                    } else {
                        gsap.set(one, { rotateZ: 0 })
                        gsap.set(two, { rotateZ: 0})
                    }
                
            }
        }
    })

   
        return () => {
           
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
})
</script>

<main id="villSection5" bind:this={villSection5}>
    <div id="curtain">
        <span id="uno" bind:this={one}></span>
        <span id="due" bind:this={two}></span>
    </div>
    <div id="svgContainer5">
        <svg width="100vw" height="300vh" viewBox="0 0 402 2451" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={line5} d="M-156.5 5.67725C-156.5 5.67725 14.7221 504.968 208.194 442.221C362.5 392.177 461.032 497.223 482 833.677C493 1010.18 463.5 1222.29 463.5 932.677C463.5 785.677 460.397 1045.16 246.5 1028.18C-23.4862 1006.75 494.626 1441.56 432.5 1705.18C377 1940.68 -58 2189.68 -34 2448.68" stroke="var(--brand-villaggio-300)" stroke-width="35" stroke-linecap="round"/>
        </svg>
    </div>

    <div id="content5" bind:this={content5}>
        <div class="videoText">
            <div class="video5"><video src="/Villaggio_Olimpico/Video_Sezione5/vl_video1.mp4" muted loop autoplay></video></div>
            <div class="text5">Sono andati a ruba a velocità record, trasformando l'iniziativa ufficiale in una delle notizie piu raccontate sui social.</div>
        </div>
        <div class="videoText">
            <div class="video5"><video src="/Villaggio_Olimpico/Video_Sezione5/vl_video2.mp4" muted loop autoplay></video></div>
            <div class="text5">Il vero trend tra i campioni è stato l'unboxing delle welcome bag direttamente dalle loro stanze, svelando la dotazione ai follower tra risate e pura goliardia.</div>
        </div>
        <div class="videoText">
            <div class="video5"><video src="/Villaggio_Olimpico/Video_Sezione5/vl_video3.mp4" muted loop autoplay></video></div>
            <div class="text5">I condom sono stati anche souvenir dell'evento che gli atleti hanno accumulato per portarsi a casa un ricordo.</div>
        </div>
    </div>

</main>

<style>
    #villSection5{
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        /* overflow-y: scroll;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch; */
    }

   #curtain{
        position: absolute;
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 200%;
        overflow: hidden;
        z-index: -2;

    }

    #uno, #due{
        display: block;
        width: 70%;      /* non serve 200% se il curtain è già 100vw */
        height: 140%;      /* ognuno occupa metà altezza */
        background-color: var(--brand-villaggio-500);
    }

    #uno{
        transform-origin: top right;
    }

    #due{
        transform-origin: top left;
    }

    #svgContainer5{
        position: absolute;
       z-index: -1;
     
    }


    #content5{
        width: 150%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 10;
        gap: 10rem;
        perspective: 1000px;
    }

    .video5{
        width: 18.8125rem;
        height: 33.5rem;
        aspect-ratio: 41/73;
        border-radius: 1.25rem;
        overflow: hidden;
        flex-shrink: 0;
        flex-grow: 0;
        transform-style: preserve-3d;
    }

    .video5 video{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .videoText{
       display: flex;
       flex-direction: column;
       flex-shrink: 0;
       flex-grow: 0;
       gap: 34px;
       transform-style: preserve-3d
    }

    .text5{
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-family: var(--font-family-text);
        font-size: 1.25rem;
        color: var(--neutral-50);
        width: 22.125rem;

    }

    


</style>