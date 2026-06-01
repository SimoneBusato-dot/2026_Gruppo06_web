<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SportSlider from "./Cucina_Slider.svelte";
    import SplitType from "split-type";
  

    gsap.registerPlugin(ScrollTrigger);
    let section;
    let path;
    let p1;
    let p2;
    let sliderElement = $state(null);
    let transitionElement;
    let line;
    
    

    onMount( () => {

        if(!sliderElement)return;

        const p1SplitText = new SplitType(p1, {types: "lines", tagName: "span"} )
        const p1Lines = p1SplitText.lines
       
        const p2SplitText = new SplitType(p2, {types: "lines", tagName: "span"} )
        const p2Lines = p2SplitText.lines

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY/ window.innerHeight -0.5) *2;

            gsap.to(line, {
                duration: 1.2,
                rotateY: xPercent* 5,
                rotateX: -yPercent * 3,
                scale: 1,
                ease: "power2.out",
                overwrite: "auto",
            })
            
        
                gsap.to(sliderElement, {
                    duration: 1.2,
                    rotateY: xPercent * 15,   // puoi variare l'intensità
                    rotateX: -yPercent * 7,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            
        }

        
        
        const length = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length 
        });

        // Nascondi i paragrafi all'inizio
        const p1Enter = gsap.fromTo(p1Lines, {
            x:300,
            opacity: 0
        }, {
            x: 100,
            opacity: 1,
            stagger: 0.1,
            overwrite: "auto",
            duration: 0.6,
            paused: true,
             ease: "powr2.out"
        })

        const sliderEnter = gsap.fromTo(sliderElement, {
            x: 50,
            opacity: 0
        }, {
            x:0,
            opacity:1,
            paused:true,
            overwrite: "auto",
            duration: 0.6,
            ease: "power2.out"
        })
        
        const p2Enter = gsap.fromTo(p2Lines, {
            x:300,
            opacity: 0
        }, {
            x: 200,
            opacity: 1,
            stagger: 0.05,
            overwrite: "auto",
            duration: 0.5,
            paused: true,
            ease: "power2.out"
        })

        const p1Exit = gsap.to(p1Lines, {
            x:"-200",
            opacity: 0,
            stagger: 0.1,
            paused: true,
            duration: 0.6,
            overwrite: "auto",
            ease: "power2.out"
        })
        
        const transitionEnter = gsap.fromTo(transitionElement, {
        scaleX:0
    }, {
        scaleX: 1,
        duration: 0.5,
        paused: true,
        overwrite: "auto",
        ease:"power2.out"
    })

        
    

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=101%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0}),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1}),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0}),

                onUpdate(self){
                    if(self.progress >= 0.1){
                        p1Enter.play()
                        sliderEnter.play()
                    } else{
                        p1Enter.reverse()
                        sliderEnter.reverse()
                    }
                    if(self.progress >= 0.5){
                        p2Enter.play()
                        p1Exit.play();
                        
                    } else{
                        p2Enter.reverse()
                        p1Exit.reverse()
                    }

                    if(self.progress >= 0.91){
                        transitionEnter.play()
                    } else{
                        transitionEnter.reverse()
                    }

                }
        
            }
    });



        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1}, 0) // disegna la linea
          
        
        

        window.addEventListener("mousemove", moveElements);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="svgContainer" bind:this={line}>
        <svg width="100vw" height="555" viewBox="0 0 1399 555" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path bind:this={path} d="M25.4766 1.0918C32.8099 172.092 211.677 421.892 868.477 53.0918C831.977 256.758 885.577 631.892 1391.98 503.092"  stroke-width="51" stroke-linecap="round"/>
        </svg>
    </div>

    <div id="content">
        <div id="text">
            <p id="1" bind:this={p1}>
                I feed su Milano Cortina si sono riempiti di discipline invernali insolite.</p>
            <p id="2" bind:this={p2}>
                Tra le discese folli dello skeleton o l'assurdo mix sci-carabina del biathlon, le persone hanno scoperto una passione improvvisa per gli sport più di nicchia, divertenti e <mark>STRAMBI</mark></p>
        </div>

        <SportSlider bind:el = {sliderElement}/>
    </div>
    
    <svg id="transition" bind:this={transitionElement} 
     viewBox="0 0 1512 982"
     preserveAspectRatio="none"
     fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
</svg>

</main>



<style>
    :global(body){
        margin: 0;
        padding: 0;
       
    }

    

    main{
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
        visibility: hidden;
       
    }

    #svgContainer{
        position: absolute;
        top: -10%;
        right: -10%;
        width: 100%;
        height: 100%;
        overflow: hidden;
        
    }

    svg{
        position: absolute;
        top: -30;
        stroke: var(--brand-sport-insoliti-500);

    }

    #content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15vw;
    width: 100%;
   
    box-sizing: border-box;
}

    #text{
        position: relative;
        color: var(--neutral-900);
        font-size: 2rem;
        width: 600px;
        font-family: var(--font-family-text);
        display: flex;
        flex-direction: column;
        gap: 3rem;
        pointer-events: none;

    }

    mark{
        color: var(--brand-sport-insoliti-500);
        font-weight: 900;
        font-size: 8.3rem;
        font-family: var(--font-family);
        background-color: transparent;
    }

    #transition{
        position: absolute;
        top: -35%;
        right: -20%;
        left: auto;
        transform-origin: right center;
        z-index: 2;
        width: 135vw;
        height: 178vh;
        pointer-events: none;
    }

    #Circle{
        width: 130%;
        height: 130%;
        fill: var(--brand-sport-insoliti-500);

    }

    :global(.swiper) {
        perspective: 1000px;
        transform-style: preserve-3d;
        pointer-events: auto !important;
    }

    :global(.swiper-pagination-bullet) {
        pointer-events: auto !important;
    }


   

    </style>