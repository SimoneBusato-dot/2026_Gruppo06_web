<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitType from "split-type";
    
    
    gsap.registerPlugin(ScrollTrigger)

    let villSection2Mobile;
    let villText2Mobile
    let graphContainerMobile;
    let villLine1Mobile;
    let villLine2Mobile;
    let content2Mobile
    

    onMount(()=> {
       
        const villText2NewSplitType = new SplitType(villText2Mobile, {types: 'lines', tagName: 'span' })
        const villText2Lines= villText2NewSplitType.lines ??[]
        
        const length = villLine1Mobile.getTotalLength();
        gsap.set(villLine1Mobile, {strokeDasharray: length, strokeDashoffset: length})
        
        const length2 = villLine2Mobile.getTotalLength();
        gsap.set(villLine2Mobile, {strokeDasharray: length2, strokeDashoffset: length2,})
        

        const villText2Enter = gsap.fromTo(villText2Lines, {x: "100%", opacity: 0}, {x: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: "elastic.out(0.5,0.4)", paused: true})
        const dataText = graphContainerMobile.querySelectorAll(".dataText")

        // Crea un'animazione per ogni dataText separatamente
        const dataTextAnimations = Array.from(dataText).map(el => {
            const split = new SplitType(el, { types: 'words', tagName: 'span' })
            return gsap.fromTo(
                split.words,
                { x: -200, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, paused: true, ease: "power2.out" }
            )
        })
        const lines = graphContainerMobile.querySelectorAll(".line");
        const dataLineEnter = gsap.fromTo(lines, 
            { scaleX: 0 }, 
            { scaleX: 1, duration: 0.6, ease: "power2.out", paused: true }
        )

        const contentExit = gsap.fromTo(content2Mobile, {x: 0, opacity: 1}, {x:"-30%", opacity:0, duration: 1, ease: "power2.out", paused: true})
        

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: villSection2Mobile,
                scroller: window,
                start: "top top",
                end: "+=101%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => {gsap.set(villSection2Mobile, { autoAlpha: 1 }); gsap.set([...villText2Lines], {x: "100%", opacity: 0})},
                onLeave: () => gsap.set(villSection2Mobile, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(villSection2Mobile, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(villSection2Mobile, { autoAlpha: 0 }),
                onUpdate(self){
                    if(self.progress >= 0.2){ villText2Enter.play()} else{villText2Enter.reverse()}
                    if (self.progress >=0.6){dataLineEnter.play(); dataTextAnimations.forEach(anim => anim.play())} else{dataLineEnter.reverse(); dataTextAnimations.forEach(anim => anim.reverse())}
                    if (self.progress >=0.8){contentExit.play()} else {contentExit.reverse()}
                    console.log('progress:', self.progress, 'x:', gsap.getProperty(content2Mobile, "x"))
}

                }
                
            }

        );

        tl.to(villLine1Mobile, {strokeDashoffset: -length, duration: 2, ease: "none"}, 0)
        tl.to(villLine2Mobile, {strokeDashoffset: -length2, duration: 2, ease: "none"}, 1.5)
        
    });   
</script>

<main id="section2" bind:this={villSection2Mobile}>

    <div id="svgContainerSection2Mobile">
        <div id="villLine1Mobile">
            <svg width="100vw" height="161" viewBox="0 0 402 161" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={villLine1Mobile} d="M-42 17.3916C123.5 35.8916 92.1838 108.367 119.5 132.392C166.901 174.081 204.854 75.1632 267.5 67.3916C306 62.6154 417.438 74.9948 485 132.392" stroke="#DC3E41" stroke-width="35" stroke-linecap="round"/>
            </svg>
        </div>
        <div id="villLine2Mobile">
            <svg width="100vw" height="180" viewBox="0 0 402 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={villLine2Mobile} d="M-42 144.928C154 238.425 261.5 -86.0757 442.5 52.4241" stroke="#DC3E41" stroke-width="35" stroke-linecap="round"/>
            </svg>
        </div>
    </div>


    <div id="content"  bind:this={content2Mobile}>
        <div id="villText2" >
            <p id="paragraph" bind:this={villText2Mobile}>è stata <mark class="highlight">la struttura più visualizzata e interagita</mark> sui social, superando altamente tutti gli impianti sportivi.</p>
        </div>
        <div id="graphContainer" bind:this={graphContainerMobile}>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-600);">Milano Olympic Village</p>
                <div class="line">
                    <svg width="354" height="35" viewBox="0 0 354 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 3.58172 3.58172 0 8 0H346C350.418 0 354 3.58172 354 8V27C354 31.4183 350.418 35 346 35H8C3.58172 35 0 31.4183 0 27V8Z" fill="#B61F22"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-700);">Tofane Alpine Skiing Centre</p>
                <div class="line">
                    <svg width="150" height="35" viewBox="0 0 150 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 3.58173 3.58172 0 8 0H141.824C146.242 0 149.824 3.58172 149.824 8V26.6589C149.824 31.0771 146.242 34.6589 141.824 34.6589H8.00001C3.58173 34.6589 0 31.0771 0 26.6589V8Z" fill="#961E20"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-800);">Milano Ice Skating Arena</p>
                <div class="line">
                    <svg width="108" height="35" viewBox="0 0 108 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 3.58173 3.58172 0 8 0H99.1441C103.562 0 107.144 3.58172 107.144 8V26.6589C107.144 31.0771 103.562 34.6589 99.1441 34.6589H8C3.58173 34.6589 0 31.0771 0 26.6589V8Z" fill="#7D1F21"/>
                    </svg>
                </div>
            </div>
            <div class="data">
                <p class="dataText" style="color: var(--brand-villaggio-900);">Stelvio Ski Centre</p>
                <div class="line">
                    <svg width="56" height="35" viewBox="0 0 56 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8C0 3.58173 3.58172 0 8 0H47.5727C51.9909 0 55.5727 3.58172 55.5727 8V26.6589C55.5727 31.0771 51.9909 34.6589 47.5727 34.6589H8C3.58173 34.6589 0 31.0771 0 26.6589V8Z" fill="#440B0C"/>
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
        max-width: 450px;
        max-height: 874px;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        visibility: hidden;
        background-color: var(--neutral-50);
        overflow: hidden;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
    }


    #content{
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 47px;
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
        max-height: 100vh;
        padding-top: clamp(1rem, 4vh, 3rem);
        padding-bottom: clamp(2rem, 6vh, 4rem); /* spazio per non tagliare */
        align-items: center;
        box-sizing: border-box;
    }

    #villText2{
        width: 21.0625rem;
        font-style: normal;
        font-size: 1.25rem;
        font-weight: 400;
        line-height: normal;
        color: var(--neutral-900);
        font-family: var(--font-family-text);


    }

    #paragraph{
        width: 21.0625rem;
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
        gap: 21px;
        transform: translateY(10%);
    }

    .data{
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .dataText{
        font-family: var(--font-family-text);
        font-size: 1rem;
        margin: 0;
    }

    .line{
        transform-origin: left center;
    }

    #svgContainerSection2Mobile{
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #villLine1Mobile{
        position: absolute;
        top: 0;
        right: 0;
    }
    #villLine2Mobile{
        position: absolute;
        bottom: 0%;
        right: 0;
    }
    
</style>