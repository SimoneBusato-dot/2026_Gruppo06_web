<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SportSlider2 from './Sport_Slider2.svelte';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);
    let section;
    let line;
    let text;
    let video;
    let sliderVideoEL = $state([]);
    let activeSliderEl = $state(null)


    const inactiveSlides = $derived(sliderVideoEL.filter(el => el !== activeSliderEl))
     $effect(() => {
            if(sliderVideoEL.length === 0) return; 
                //gsap.set(inactiveSlides, { x: 100, opacity: 0});
            
        })

        $effect(() => {
            if(!activeSliderEl) return;
                //gsap.set(activeSliderEl, {x:100, opacity:0})

        })


    onMount(() => {

        const length = line.getTotalLength()

        gsap.set(line, {
            strokeDasharray:length,
            strokeDashoffset: length
        })

        

       
        const textSplit = new SplitType(text, {types: "lines", tagName: "span"})
        const textLines = textSplit.lines;

        gsap.set(textLines, {opacity: 0, x: 200})

        const cardAnimation = gsap.to('#Section5 .card-bg', {
        top: '0%',
        left: '0%',
        width: "100%",
        height: "100%",
        duration: 0.5,
        paused: true, // Fondamentale!
        overwrite: "auto",
        translateZ: 0,
        rotateZ: 0,
        zIndex: 1,
        borderRadius: 0
    });

        const tl = gsap.timeline({
            scrollTrigger:{
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {
                // self.progress va da 0 (inizio pin) a 1 (fine pin)
                // Se superiamo 0.5 (la metà esatta dello scroll del pin)...
                if (self.progress >= 0.5) {
                    cardAnimation.play(); // Parte e va da sola fino alla fine!
                } else {
                    cardAnimation.reverse(); // Se torni indietro sopra la metà, fa il reverse!
                }
            }


            }
        })

        tl.to(line, {strokeDashoffset: 0, ease: "none"})
            //.to(activeSliderEl, {x: 0, opacity: 1, duration: 0.1}, 0)
        




        })
    
</script>

<main id="Section5" bind:this={section}>
    <div id="svgContainer">
        <svg id="section5Path" width="100vw" height="100vh">
            <path bind:this={line} d="M16.9741 982C208.307 811.333 679.374 733.6 880.974 966C1016.12 1121.79 1082.97 504.5 1346.97 663C1610.97 821.5 1574.93 -5.81252 1551.97 -13"/>
        </svg>
    </div>
    
    <div class="content">

            <div id="videoContainer">
                <SportSlider2 bind:el={sliderVideoEL} bind:elActive={activeSliderEl}/>
            </div>
            
    </div>
    <div class="card-bg"></div>
</main>

<style>
    #Section5 {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        visibility: hidden;

    }

    #svgContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1; /* Sotto al contenuto */
    }

    #section5Path {
        fill: none;
        stroke: var(--brand-sport-insoliti-500);
        stroke-width: var(--line-thickness);
    }

   .content {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 15rem;
        /* SOLUZIONE 1: Forziamo il posizionamento sopra l'SVG */
        position: relative;
        z-index: 2; 
   }

   #videoContainer {
    position: relative;
    width: 500px;
    max-width: 600px;
    height: 100%;
    transform-style: preserve-3d;
    margin-left: 40%;
    z-index: 2;
}

.card-bg {
    position: absolute;
    width: 425px;
    height: 680px;
    transform: translateZ(-70px) rotateZ(15deg); 
    top: 15%; 
    left: 15%;
    background-color: var(--brand-sport-insoliti-400);
    border-radius: 12px;
    z-index: -1;
    transform-style: preserve-3d;
}

   /* Opzionale: diamo una dimensione fissa al video se necessario */
   


   

</style>