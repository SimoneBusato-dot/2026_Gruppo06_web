<script>
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitText from 'gsap/SplitText';

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let warning;
    let fillBar;
    let idleTimeout;
    let st; // riferimento allo scrollTrigger per pulizia
    let triangle;
    let EM;
    let Wtitle;
    let Wsubtitle;
    let svgBar;


    onMount(() => {
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(triangle, { duration: 1.2, rotateY: xPercent * 30, rotateX: -yPercent * 15, scale: 1, ease: "power2.out", overwrite: "auto" });
            
        };

        const splitTitle = new SplitText(Wtitle, { type: "lines", mask: "lines" });
        const splitSubtitle = new SplitText(Wsubtitle, { type: "lines", mask: "lines" });
        gsap.set(fillBar, { scaleX: 0, transformOrigin: "left center" });
       const triangleEnter=gsap.fromTo(triangle, { y: "110%"}, { y: "0%", duration: 1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1});
       const EmEnter=gsap.fromTo(EM, { y: "110%"}, { y: "0%", duration: 1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1});
       const enterTitle =gsap.fromTo(splitTitle.lines, { y: "110%"}, { y: "0%", duration: 0.6, ease:"power2.out", paused: true, delay: 1.2});
       const enterSubtitle =gsap.fromTo(splitSubtitle.lines, { y: "110%"}, { y: "0%", duration: 0.5, ease:"power2.out", paused: true, delay: 1.5});
       const enterSvg =gsap.fromTo(svgBar, { y: "100%"}, { y: "0%", duration: 0.5, ease:"power2.out", paused: true, delay: 1.5});

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: warning,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                pinSpacing: true,
                onEnter: () => {triangleEnter.play(); EmEnter.play(); enterTitle.play(); enterSubtitle.play(); enterSvg.play();},
                onLeave: () => {triangleEnter.reverse(); EmEnter.reverse(); enterTitle.reverse(); enterSubtitle.reverse(); enterSvg.reverse();},
                onEnterBack: () => {triangleEnter.play(); EmEnter.play(); enterTitle.play(); enterSubtitle.play(); enterSvg.play();},
                onLeaveBack: () => {triangleEnter.reverse(); EmEnter.reverse(); enterTitle.reverse(); enterSubtitle.reverse(); enterSvg.reverse();},

                onUpdate: (self) => {
    const p = self.progress;
    const totalD = 20.0;
    const startP = 10.0 / totalD;

    const f = p >= startP
        ? Math.max(0, Math.min(1, (p - startP) / (1 - startP)))
        : 0;

    if (fillBar) {
        gsap.killTweensOf(fillBar); // <-- uccide il tween di "ritorno a 0" se ancora attivo
        gsap.set(fillBar, { scaleX: f });
    }

    clearTimeout(idleTimeout);

    if (f > 0 && f < 1) {
        idleTimeout = setTimeout(() => {
            gsap.to(fillBar, {
                scaleX: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }, 300);
    }
}
            }
        });

        st = tl.scrollTrigger;

        window.addEventListener("mousemove", moveElements);
        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };

    })

    

    onDestroy(() => {
        clearTimeout(idleTimeout);
        if (st) st.kill();
    });

</script>


<main id="warning" bind:this={warning}>
    <div id="warningContent">
        <div id="triangle">
            <svg bind:this={triangle} id="warningTriangle" width="377" height="333" viewBox="0 0 377 333" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M164.738 13.5C175.131 -4.50002 201.111 -4.5 211.504 13.5L372.585 292.5C382.977 310.5 369.986 333 349.202 333H27.0403C6.25574 333 -6.73463 310.5 3.65768 292.5L164.738 13.5Z" fill="#DC3E41"/>
            </svg>

            <h1 id="EM" bind:this={EM}>!</h1>
        </div>
        <div id="warningText">
            <h3 id="warningTitle" bind:this={Wtitle}>Sei sicuro di voler continuare? </h3>
            <p id="warningSubtitle" bind:this={Wsubtitle}>La prossima parte è legata alle 4 card, guarda prima quelle per avere un esperienza completa, altrimenti continua a scrollare.</p>
        </div>
        <div id="warningProgress" >
            <svg bind:this={svgBar} width="17.375rem" height="2.3125rem">
                <rect y="50%" width="100%" height="30%" id="warningBar" rx="5"/>
                <rect bind:this={fillBar} y="50%" width="100%" height="30%" id="warningFill" rx="5"/>

            </svg>
        </div>
    </div>
</main>


<style>
    #warning{
        position: relative;
        width: 100dvw;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-50);
        perspective: 1000px;
    }

    #warningContent{
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;

    }

    #triangle{
        position: relative;
        overflow: hidden;
    }

    #warningTriangle{
        position: relative;
       
    }

    #EM{
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18rem;
        color: var(--brand-villaggio-200);
        font-family: var(--font-family);
    }

    #warningText{
        position: relative;
        text-align: center;
        color: var(--brand-villaggio-500);
        width: 55.875rem;
        font-size: 1.625rem;
    }

    #warningProgress{
        overflow: hidden;
    }


    #warningBar{
        fill: var(--neutral-200);
        position: relative;
    }

    #warningFill{
        fill: var(--brand-villaggio-500);
        position: absolute;
        top: 0;
    }
</style>