<script>
     import gsap from "gsap";
    import { onMount, tick } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";

    let villSection6;
    let path6, path62;
    let text61, text62, upper1, upper2
    gsap.registerPlugin(ScrollTrigger);
    onMount(async()=> {
        await tick()
        await new Promise(r => requestAnimationFrame(r))
        const length6 = path6.getTotalLength()
        gsap.set(path6, {strokeDasharray: length6, strokeDashoffset: length6})
        const length62 = path62.getTotalLength()
        gsap.set(path62, {strokeDasharray: length62, strokeDashoffset: length62})

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
            markers:true,
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

    tl.to(path6, {strokeDashoffset: -length6, duration: 2, ease: "none"}, 0)
        .to(path62, {strokeDashoffset: -length62, duration: 2, ease: "none"}, 1)


    })

</script>

<main id="villSection6" bind:this={villSection6}>
    <div id="svgContainer6">
        <svg width="100vw" height="100vh" viewBox="0 0 402 287" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={path6} d="M-81 277.513C-31.6764 191.387 -53.9671 55.2684 45.3011 56.9749C106.641 58.0293 114.569 146.083 175.89 144.255C246.811 142.141 236.819 29.6735 306.869 18.4002C421.984 -0.125562 455 277.513 455 277.513" stroke="#DC3E41" stroke-width="35" stroke-linecap="round"/>
        </svg>

        <svg id="path62" width="82" height="415" viewBox="0 0 82 415" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path bind:this={path62} d="M168.223 9.0478C243.723 134.047 -151.777 91.0501 105.796 403.048" stroke="#DC3E41" stroke-width="35" stroke-linecap="round"/>
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
        margin-block-start: 200dvh;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
    }

    #svgContainer6{
        position: absolute;
        top: 5%;
        right: 0;
        width: 100%;
        height: 100%;
    }

    #path62{
        position: absolute;
        bottom: 10%;
        right: 0;
    
    }

    #content6{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 137px;
    }

    #textContainer61{
        display: flex;
        flex-direction: column;
        font-family: var(--font-family-text);
        width: 23.5rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.25rem;
        align-self: flex-start;
        padding:5rem 0 0 1rem ;
        text-align: left;

    }

    #paragraph1{
        width: 21.25rem;
        margin: 0;
    }

    .upper{
        font-size: 4.25rem;
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
        flex-direction: column;
        font-family: var(--font-family-text);
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        font-size: 1.25rem;
        align-self: flex-start;
        align-self: flex-start;
        padding: 0 0rem 0rem 1rem;

    }

    #paragraph2{
        width: 22.125rem;
        margin: 0;
    }


</style>