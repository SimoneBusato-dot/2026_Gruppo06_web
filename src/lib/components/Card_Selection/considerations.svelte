<script>
    import { onMount } from "svelte";
        import gsap from "gsap";
        import { ScrollTrigger } from "gsap/ScrollTrigger";
        import SplitText from 'gsap/SplitText';

        gsap.registerPlugin(ScrollTrigger, SplitText);

        let upperEnding;
        let lineEnding1;
        let upperEnding2;
        let lineEnding2;
        let subtitle1;
        let subtitle2;

        onMount(()=>{
            let lengthEd = lineEnding1.getTotalLength();
            let lengthEd2 = lineEnding2.getTotalLength();
            gsap.set(lineEnding1, {strokeDasharray: lengthEd, strokeDashoffset: lengthEd,});
            gsap.set(lineEnding2, {strokeDasharray: lengthEd2, strokeDashoffset: lengthEd2, y: "-60%"});

            const splitUpper = new SplitText(upperEnding, { type: "lines", mask: "lines", linesClass: "split-line" });
            const upperEnter = gsap.fromTo(splitUpper.lines, { y: "120%"}, { y: "0%", duration: 0.6, stagger:0.1, ease:"elastic.out(0.5,0.4)", paused: true});
            const splitUpper2 = new SplitText(upperEnding2, { type: "lines", mask: "lines" });
            const upperEnter2 = gsap.fromTo(splitUpper2.lines, { y: "120%"}, { y: "0%", duration: 0.6, stagger:0.1, ease:"elastic.out(0.5,0.4)", paused: true});
            const splitSubtitle = new SplitText(subtitle1, { type: "lines", mask: "lines" });
            const subtitleEnter = gsap.fromTo(splitSubtitle.lines, { y: "120%"}, { y: "0%", duration: 0.6,ease:"power2.out", paused: true, delay: 0.5});
            const splitSubtitle2 = new SplitText(subtitle2, { type: "lines", mask: "lines" });
            const subtitleEnter2 = gsap.fromTo(splitSubtitle2.lines, { y: "120%"}, { y: "0%", duration: 0.6,ease:"power2.out", paused: true, delay: 0.5});
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#firstEnding",
                    start: "top top",
                    end: "+=100%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    onEnter() {upperEnter.play(); subtitleEnter.play();},
                    onLeave() {upperEnter.reverse(); subtitleEnter.reverse();},
                    onEnterBack() {upperEnter.play(); subtitleEnter.play();},
                    onLeaveBack() {upperEnter.reverse(); subtitleEnter.reverse();}

                    }

                });

                let tl12 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#firstEnding",
                    start: "top top",
                    end: "+=400%",
                    scrub: 1,
                    onEnter() {upperEnter.play(); subtitleEnter.play();},
                    onLeave() {upperEnter.reverse(); subtitleEnter.reverse();},
                    onEnterBack() {upperEnter.play(); subtitleEnter.play();},
                    onLeaveBack() {upperEnter.reverse(); subtitleEnter.reverse();}

                    }

                });


            tl12.to(lineEnding1, {strokeDashoffset: -lengthEd, duration: 2, ease: "power2.out",}, 0);


            let tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#secondEnding",
                    start: "top top",
                    end: "+=100%",
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    onEnter() {upperEnter2.play(); subtitleEnter2.play();},
                    onLeave() {upperEnter2.reverse(); subtitleEnter2.reverse();},
                    onEnterBack() {upperEnter2.play(); subtitleEnter2.play();},
                    onLeaveBack() {upperEnter2.reverse(); subtitleEnter2.reverse();}

                }
        })

        let tl22 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#secondEnding",
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                    onEnter() {upperEnter.play(); subtitleEnter.play();},
                    onLeave() {upperEnter.reverse(); subtitleEnter.reverse();},
                    onEnterBack() {upperEnter.play(); subtitleEnter.play();},
                    onLeaveBack() {upperEnter.reverse(); subtitleEnter.reverse();}

                    }

                });

        tl22.to(lineEnding2, {strokeDashoffset: -lengthEd2, duration: 2, ease: "power2.out"}, 0);
        })
</script>

<main id="ending">
    <section id="firstEnding">
        <div id="svgContainer1">
            <svg width="169" height="820" viewBox="0 0 169 820" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={lineEnding1} d="M398.298 812.015C343.02 619.523 62.6996 671.217 27.749 444.902C-0.46257 262.225 246.217 169.202 284.486 5.81536" stroke="#533EDC" stroke-width="51" stroke-linecap="round"/>
            </svg>
        </div>
        <div id="textContainer1">
            <p id="Upper" bind:this={upperEnding}>Questa socialità è uno sviluppo naturale dei massmedia?</p>
            <p id="paragraph" bind:this={subtitle1}>Le prossime olimpiadi avranno la stessa viralità, o questa è stata solo una eccezione?</p>
        </div>
    </section>
    <section id="secondEnding">
        <div id="svgContainer2">
            <svg width="100vw" height="100vh" viewBox="0 0 169 820" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={lineEnding2} d="M-382 1334.68C178.273 1404.65 213 1092 183.5 952.5C154 813 -35.5139 714.114 -105.814 602.163C-176.115 490.212 159.931 323.618 86.5836 160.525C11.3213 -6.82501 -220.183 28.6433 -220.183 28.6433" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
            </svg>

        </div>
        <div id="textContainer2">
            <p id="Upper2" bind:this={upperEnding2}>SI SONO AVVICINATE LE PERSONE ALLO SPORT?</p>
            <p id="paragraph2" bind:this={subtitle2}>La gente ha iniziato a seguire gli sport di queste olimpiadi invernali o è stato un fenomeno temporaneo? </p>
        </div>
    </section>
</main>


<style>

    :global(.split-line) {
        padding-block: 0.18em; /* spazio extra per gli accenti */
        margin-block: -0.18em; /* annulla lo spostamento nel layout */
        overflow: clip; /* invece di hidden, evita alcuni glitch di rendering su Safari */
    }
 
    #firstEnding {
        display: flex;
        width: 100vw;
        height: 100vh;
        position: relative;
        
    }

    #svgContainer1 {
        width: 10%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0;
    }

    #textContainer1 {
        width: 62.4375rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 1.625rem;
        text-align: left;
        margin-left: 5%;
        font-family:var(--font-family-text)
        
    }

    #Upper {
        font-weight: 900;
        font-size: 8rem;
        margin-bottom: 1rem;
        font-family:var(--font-family);
        text-transform: uppercase;
        line-height: 80%;
        color: var(--brand-sport-insoliti-500);
    }
    #secondEnding {
        display: flex;
        width: 100vw;
        height: 100vh;
        position: relative;
        align-items: flex-end;
        margin-block-end: 100dvh;
    }

    #svgContainer2 {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: -40%;
    }

    #textContainer2 {
        width: 62.4375rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        font-size: 1.625rem;
        text-align: right;
        font-family:var(--font-family-text);
        margin-left: auto;
        margin-right: 5%;
        
    }

    #Upper2 {
        font-weight: 900;
        font-size: 8rem;
        margin-bottom: 1rem;
        font-family:var(--font-family);
        text-transform: uppercase;
        line-height: 80%;
        color: var(--brand-villaggio-500);
    }
</style>