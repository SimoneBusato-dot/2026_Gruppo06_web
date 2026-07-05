<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
    
    
    gsap.registerPlugin(ScrollTrigger)

    let villSection2;
    let villText2
    let graphContainer;
    let villLine1;
    let villLine2;
    let villHighLight;
    let content2
    onMount(()=> {
       
        const villText2NewSplitType = new SplitType(villText2, {types: 'lines', tagName: 'span' })
        const villText2Lines= villText2NewSplitType.lines ??[]
        
        const length = villLine1.getTotalLength();
        gsap.set(villLine1, {strokeDasharray: length, strokeDashoffset: length})
        
        const length2 = villLine2.getTotalLength();
        gsap.set(villLine2, {strokeDasharray: length2, strokeDashoffset: length2, x:"60%"})


        gsap.set(graphContainer, {x: "-60%"})
        const villText2Enter = gsap.fromTo(villText2Lines, {x: "100%", opacity: 0}, {x: "50%", opacity: 1, stagger: 0.08, duration: 0.6, ease: "elastic.out(0.5,0.4)", paused: true})
        const dataText = graphContainer.querySelectorAll(".dataText")

        // Crea un'animazione per ogni dataText separatamente
        const dataTextAnimations = Array.from(dataText).map(el => {
            const split = new SplitType(el, { types: 'words', tagName: 'span' })
            return gsap.fromTo(
                split.words,
                { x: -200, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, paused: true, ease: "power2.out" }
            )
        })
        const lines = graphContainer.querySelectorAll(".line");
        const dataLineEnter = gsap.fromTo(lines, 
            { scaleX: 0 }, 
            { scaleX: 1, duration: 0.6, ease: "power2.out", paused: true }
        )

        const contentExit = gsap.fromTo(content2, {x: 0, opacity: 1}, {x:"-30%", opacity:0, duration: 1, ease: "power2.out", paused: true})
        

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection2,
                scroller: window,
                start: "top top",
                end: "+=301%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers:true,
                onEnter: () => {gsap.set(villSection2, { autoAlpha: 1 }); gsap.set([...villText2Lines], {x: "100%", opacity: 0})},
                onLeave: () => gsap.set(villSection2, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection2, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection2, { autoAlpha: 0 }),
                onUpdate(self){
                    if(self.progress >= 0.1){ villText2Enter.play()} else{ villText2Enter.reverse()}
                    if (self.progress >=0.6){dataLineEnter.play(); dataTextAnimations.forEach(anim => anim.play())} else{dataLineEnter.reverse(); dataTextAnimations.forEach(anim => anim.reverse())}
                    if (self.progress >=0.8){contentExit.play()} else {contentExit.reverse()}

                }
                
            }
        });

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: villSection2,
                scroller: window,
                start: "top top",       // parte insieme alla prima
                end: "+=240%",           // finisce all'80% della prima (81% di 101%)
                scrub: 1,
                // NO pin — il pin lo gestisce già tl
            }
        });

        tl2.to(villLine1, {strokeDashoffset: 0, duration: 2, ease: "none", x: "-30%"}, 0)
            .to(villText2, {x: "-190%", duration: 2, ease:"power2.out"}, 2.2)
            .to(villHighLight, {x: "270%", duration: 2}, 2.2)
            .to(villLine1, {x: "-150%", duration: 2, ease:"power2.out"}, 2)
            .to(villLine2, {strokeDashoffset: 0, duration: 2.5, x: 0,}, 2)
            .to(villLine2, {strokeDashoffset: -length2, duration: 1.5, x: 0,}, 4.5)
            

            
            
    });        


</script>

<main id="section2" bind:this={villSection2}>
    <div id="svgContainer1">
        <svg id="svg1" width="735" height="242" viewBox="0 0 735 242" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={villLine1} d="M22.1304 359.156C85.3953 248.638 56.8041 73.9667 184.13 76.1565C262.807 77.5096 272.977 190.502 351.63 188.156C442.597 185.444 429.781 41.1227 519.63 26.6565C667.283 2.8837 709.63 359.156 709.63 359.156" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
        </svg>

        <svg id="svg2" width="1603" height="346" viewBox="0 0 1603 346" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={villLine2} d="M22.6855 -26C22.6855 -26 160.714 243.081 234.186 254C352.582 271.596 341.007 49.6142 460.686 47.5C595.943 45.1106 562.402 278.85 695.686 302C807.414 321.406 858.912 165.287 967.186 199C1029.47 218.393 1039.2 275.226 1098.69 302C1317.74 400.6 1396.11 73.7513 1586.69 -72.5" stroke="#DC3E41" stroke-width="51" stroke-linecap="round"/>
        </svg>

    </div>

    <div id="content" bind:this={content2}>
        <div id="villText2">
            <p id="paragraph" bind:this={villText2}>è stata <mark class="highlight" bind:this={villHighLight}>la struttura più visualizzata e interagita</mark> sui social, superando altamente tutti gli impianti sportivi.</p>
        </div>
        <div id="graphContainer" bind:this={graphContainer}>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-600);">Milano Olympic Village</p>
                <div class="line">
                    <svg width="812" height="59" viewBox="0 0 812 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 16C0 7.16344 7.16344 0 16 0H796C804.837 0 812 7.16344 812 16V43C812 51.8366 804.837 59 796 59H16C7.16347 59 0 51.8366 0 43V16Z" fill="#B61F22"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-700);">Tofane Alpine Skiing Centre</p>
                <div class="line">
                    <svg width="337" height="59" viewBox="0 0 337 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 16C0 7.16344 7.16344 0 16 0H321C329.837 0 337 7.16344 337 16V43C337 51.8366 329.837 59 321 59H16C7.16344 59 0 51.8366 0 43V16Z" fill="#961E20"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-800);">Milano Ice Skating Arena</p>
                <div class="line">
                    <svg width="241" height="59" viewBox="0 0 241 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 16C0 7.16344 7.16344 0 16 0H225C233.837 0 241 7.16344 241 16V43C241 51.8366 233.837 59 225 59H16C7.16344 59 0 51.8366 0 43V16Z" fill="#7D1F21"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-900);">Stelvio Ski Centre</p>
                <div class="line">
                    <svg width="125" height="59" viewBox="0 0 125 59" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 16C0 7.16344 7.16344 0 16 0H109C117.837 0 125 7.16344 125 16V43C125 51.8366 117.837 59 109 59H16C7.16345 59 0 51.8366 0 43V16Z" fill="#440B0C"/>
                    </svg>
                </div>
            </div>
        
        </div>
    </div>
    


</main>

<style>


    #section2{
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
    }

    #svgContainer1{
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #svg1{
        position: absolute;
        bottom: 0;
    }
    #svg2{
        position: absolute;
        top: -20%;
    }

    #content{
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: clamp(2rem, 8vw, 20rem);
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
        padding: 0 clamp(1rem, 3vw, 4rem);
        transform: translateX(5%);

        max-height: 100vh;
        padding-top: clamp(1rem, 4vh, 3rem);
        padding-bottom: clamp(2rem, 6vh, 4rem); /* spazio per non tagliare */
        align-items: center;
        box-sizing: border-box;
    }

    #villText2{
        width: 30rem;
        font-style: normal;
        font-size: 1.625rem;
        font-weight: 400;
        line-height: normal;
        color: var(--neutral-900);
        font-family: var(--font-family-text);


    }

    #paragraph{
        width: 30rem;
    }

    .highlight{
        background-color: transparent;
        color: var(--brand-villaggio-500);
    }

    #graphContainer{
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 40px;
        transform: translateY(10%);
    }

    .data{
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 17px;
    }

    .dataText{
        font-family: var(--font-family-text);
        font-size: 1.625rem;
        margin: 0;
    }

    .line{
        transform-origin: left center;
    }
</style>