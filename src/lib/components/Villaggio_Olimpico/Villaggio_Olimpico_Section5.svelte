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

        const videoElements = content5.querySelectorAll(".video5")

         const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(lineOuter5, { duration: 1.2, rotateY: xPercent * 2, rotateX: -yPercent * 2, scale: 1, ease: "power2.out", overwrite: "auto", transformPerspective: 1000 });
            gsap.to(videoElements, { duration: 1.2, rotateY: xPercent * 15, rotateX: -yPercent * 7, ease: "power2.out", overwrite: "auto", transformPerspective: 1000 });
        };
    const length5 = line5.getTotalLength()
    gsap.set(line5, { strokeDasharray: length5, strokeDashoffset: length5, x: "60%" })
    gsap.set(content5, { x: "150%" })

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
            end: "+=480%",
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
            end: "+=550%",
            scrub: 1,
        }})

    tl2.to(line5, { strokeDashoffset: -length5, x: "-60%", duration: 10, ease: "none" }, 0)
    tl3.to(content5, { x: "-150%", duration: 9.5, ease: "power2.out" }, 0)

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: villSection5,
            scroller: window,
            start: "top top",
            end: "+=601%",
            scrub: 1,
            pin: true,
            pinSpacing: false,
            markers:true,
            onEnter: () => gsap.set(villSection5, { autoAlpha: 1 }),
            onLeave: () => gsap.set(villSection5, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(villSection5, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(villSection5, { autoAlpha: 0 }),
            onUpdate(self) {
                if (self.progress >= 0.8) {
                        const p = (self.progress - 0.8) / 0.2
                        gsap.set(one, { rotateZ: -90 * p
                         })
                        gsap.set(two, { rotateZ: 90 *p})
                    } else {
                        gsap.set(one, { rotateZ: 0 })
                        gsap.set(two, { rotateZ: 0})
                    }
                
            }
        }
    })

    window.addEventListener("mousemove", moveElements);
        return () => {
            window.removeEventListener("mousemove", moveElements);
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
        <svg width="200vw" height="100vh" viewBox="0 0 3495 924" fill="none" xmlns="http://www.w3.org/2000/svg" bind:this={lineOuter5}>
             <path bind:this={line5} d="M6.60388 1003.16C6.60388 1003.16 583.645 848.473 465.148 683.164C268.749 409.178 674.458 244.664 1002.65 167.653C1330.7 90.6753 1909.33 -124.587 1807.61 196.654C1742.83 401.212 1391.59 278.459 1374.61 492.357C1353.17 762.343 1813.7 491.211 2058.61 606.857C2284.52 713.535 2302.02 986.899 2550.1 1016.36C2789.1 1044.74 2873.66 706.957 3109.1 756.857C3293.25 795.883 3334.31 945.491 3478.6 1066.36" stroke="#F57476" stroke-width="51" stroke-linecap="round"/>
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
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        margin-block-start: 200dvh;
    }

   #curtain{
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -2;

    }

    #uno, #due{
        display: block;
        width: 140%;      /* non serve 200% se il curtain è già 100vw */
        height: 50%;      /* ognuno occupa metà altezza */
        background-color: var(--brand-villaggio-500);
        transform: translatex(-20%)
    }

    #uno{
        transform-origin: bottom left;
    }

    #due{
        transform-origin: top left;
    }

    #svgContainer5{
        position: absolute;
       z-index: -1;
      transform-style: preserve-3d
    }


    #content5{
        width: 150%;
        height: 100%;
        display: flex;
        flex-direction: row;
        z-index: 10;
        gap: 10rem;
        perspective: 1000px;
    }

    .video5{
        width: 20.375rem;
        height: 36.3125rem;
        aspect-ratio: 101/180;
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
       flex-direction: row;
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
        font-size: 1.625rem;
        color: var(--neutral-50);
    
    }

    .text5:nth-child(1){
        width: 38.5rem;
    }
    .text5:nth-child(2){
        width: 45.6875rem;
    }
    .text5:nth-child(3){
        width: 32.1875rem;
    }

    .videoText:nth-child(1){
        padding-top: 5rem;
        
    }
    .videoText:nth-child(2){
        align-items: flex-end;
        padding-bottom: 5rem;
        
    }
    .videoText:nth-child(3){
        align-items: center;
        
    }


</style>