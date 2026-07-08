<script>
     import gsap from "gsap";
    import { onMount, tick } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";

    let villSection6;
    let path6;
    let text61, text62, upper1, upper2
    gsap.registerPlugin(ScrollTrigger);
    onMount(async()=> {
        await tick()
        await new Promise(r => requestAnimationFrame(r))
        const length6 = path6.getTotalLength()
        gsap.set(path6, {strokeDasharray: length6, strokeDashoffset: length6})

        const text61Split = new SplitType(text61, {types: 'lines', tagName: 'span'})
        const text61Lines = text61Split.lines ??[]
        const text62Split = new SplitType(text62, {types: 'lines', tagName: 'span'})
        const text62Lines = text62Split.lines ??[]
        const upper1Split = new SplitType(upper1, {types: 'lines', tagName: 'span'})
        const upper1Lines = upper1Split.lines ??[]
        const upper2Split = new SplitType(upper2, {types: 'chars', tagName: 'span'})
        const upper2Chars = upper2Split.chars ??[]

        
        const text61Enter = gsap.fromTo(text61Lines, {x: "30%", opacity: 0}, {x:0, opacity:1, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const text61Exit = gsap.fromTo(text61Lines, {x: 0, opacity: 1}, {x:"30%", opacity:0, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const text62Enter = gsap.fromTo(text62Lines, {x: "30%", opacity: 0}, {x:0, opacity:1, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const text62Exit = gsap.fromTo(text62Lines, {x: 0, opacity: 1}, {x:"30%", opacity:0, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const upper1Enter = gsap.fromTo(upper1Lines, {x: "30%", opacity: 0}, {x:0, opacity:1, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const upper1Exit = gsap.fromTo(upper1Lines, {x: 0, opacity: 1}, {x:"30%", opacity:0, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const upper2Enter = gsap.fromTo(upper2Chars, {x: "30%", opacity: 0}, {x:0, opacity:1, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        const upper2Exit = gsap.fromTo(upper2Chars, {x: 0, opacity: 1}, {x:"30%", opacity:0, stagger: 0.1, duration: 0.6, ease:"elastic.out(0.5,0.4)", paused: true})
        // gsap.set("#textContainer61", {opacity: 0})
        // gsap.set("#textContainer62", {opacity: 0})
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: villSection6,
            scroller: window,
            start: "top top",
            end: "+=201%",
            scrub: 1,
            pin: true,
            pinSpacing: false,
            markers:false,
            onEnter: () => {gsap.set(villSection6, { autoAlpha: 1 }); // Forza subito lo stato "from" su tutti gli elementi
        gsap.set([...text61Lines, ...text62Lines, ...upper1Lines, ...upper2Chars], {
            x: "30%",
            opacity: 0
        })},
            onLeave: () => gsap.set(villSection6, { autoAlpha: 0 }),
            onEnterBack: () => gsap.set(villSection6, { autoAlpha: 1 }),
            onLeaveBack: () => gsap.set(villSection6, { autoAlpha: 0 }),
            onUpdate(self) {
                if(self.progress>=0.1){text61Enter.play(); upper1Enter.play();} else {text61Enter.reverse(); upper1Enter.reverse()}
                // if(self.progress>=0.1){gsap.set("#textContainer61", {opacity: 1, duration: 0.1, ease:"power2.out"});}
                if(self.progress>=0.55){text62Enter.play(); upper2Enter.play()} else {text62Enter.reverse(); upper2Enter.reverse()}
                // if(self.progress>=0.55){gsap.set("#textContainer62", {opacity: 1, duration: 0.1, ease:"power2.out"})}
                if(self.progress>=0.8){text61Exit.play(); text62Exit.play(); upper1Exit.play(); upper2Exit.play()} else {text61Exit.reverse(); text62Exit.reverse(); upper1Exit.reverse(); upper2Exit.reverse()}
            }
        }
    })

    tl.to(path6, {strokeDashoffset: -length6, duration: 2, ease: "none"})


    })

</script>

<main id="villSection6" bind:this={villSection6}>
    <div id="svgContainer6">
        <svg width="100vw" height="100vh" viewBox="0 0 1383 982" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path bind:this={path6} d="M24.8228 1161.5C69.733 970.534 145.998 821.014 275.323 673.5C461.639 460.979 752.636 741.185 994.823 595.5C1259.84 436.08 818.323 160 1372.32 -74" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>
    <div id="content6">
            <div id="textContainer61">
            <p id="paragraph1" bind:this={text61}>
                Abbiamo sempre immaginato gli atleti come icone perfette, senza bisogni e con una vita distante.
            </p>
            <p class="upper" bind:this={upper1}>
                questi video hanno cambiato le regole
            </p>

            </div>
            <div id="textContainer62">
                <p id="paragraph2" bind:this={text62}>
                    Il preservativo smette di essere un tabù per trasformarsi nel simbolo definitivo di... 
                </p>
                <p class="upper" bind:this={upper2}>
                    autenticità
                </p>

            </div>

        </div>
</main>

<style>
    #villSection6{
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
        margin-block-start: 500dvh;
    }

    #svgContainer6{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }

    #content6{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    #textContainer61{
        display: flex;
        flex-direction: column;
        font-family: var(--font-family-text);
        width: 50.625rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.625rem;
        align-self: flex-start;
        padding:5rem 0 0 3rem ;

    }

    #paragraph1{
        width: 39.1875rem;
        margin: 0;
    }

    .upper{
        font-size: 8rem;
        font-style: normal;
        font-weight: 900;
        line-height: 86%; /* 6.88rem */
        text-transform: uppercase;
        font-family: var(--font-family);
        margin: 0%;
        color: var(--brand-villaggio-500);
    }

    #textContainer62{
        display: flex;
        flex-direction: row;
        font-family: var(--font-family-text);
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.625rem;
        align-self: flex-start;
        padding:5rem 0 0 3rem ;
        text-align: right;
        gap: 22px;
        align-self: flex-end;
        margin-top: auto;
        padding: 0 3rem 5rem 0;

    }

    #paragraph2{
        width: 24rem;
        margin: 0;
    }


</style>