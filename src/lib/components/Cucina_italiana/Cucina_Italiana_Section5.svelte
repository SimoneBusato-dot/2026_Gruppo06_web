<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import CucinaItalianaSlider2 from './Cucina_Italiana_Slider2.svelte';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);
    let section;
    let line;
    let text;
    let video;
    let sliderVideoEL = $state([]);
    let activeSliderEl = $state(null);
    let buttonsEl = $state(null)
    let line2;
    let title;
    let transition;


    const inactiveSlides = $derived(sliderVideoEL.filter(el => el !== activeSliderEl))
     $effect(() => {
            if(sliderVideoEL.length === 0) return; 
            
        })

        $effect(() => {
            if(!activeSliderEl) return;

        })


    onMount(() => {

        const length = line.getTotalLength()

        gsap.set(line, {
            strokeDasharray:length,
            strokeDashoffset: length
        })

        

       
        const textSplit = new SplitType(text, {types: "lines", tagName: "span"})
        const textLines = textSplit.lines;

        const titleSplit = new SplitType(title, {types: "chars", tagName: "span"})
        const titleChars = titleSplit.chars


        
       

        const cardActiveAnimation = gsap.fromTo(activeSliderEl, {
            x: 100,
            opacity:0

        }, {
            x:0,
            opacity:1,
            duration: 0.5,
            paused: true,
            overwrite: "auto",
            ease: "power2.out"
        })

        const cardInacativeAnimation = gsap.fromTo(inactiveSlides, {
            x: 100,
            opacity: 0
        }, {
            x:0,
            opacity: 1,
            stagger: 0.1,
            paused: true,
            duration: 0.5,
            overwrite: "auto",
            ease: "power2.out"

        })
        const cardBgEnter = gsap.fromTo('#Section5 .card-bg',{
            top: '15%',
            left: '15%',
            width: "425px",
            height: "680px",
            x: 100,
            opacity: 0,
            translateZ: 0,
            rotateZ: "0deg",
            zIndex: "-1",
            borderRadius: 12,

        }, {
            top: '15%',
            left: '15%',
            width: "425px",
            height: "680px",
            x: 0,
            opacity: 1,
            translateZ: 0,
            rotateZ: "20deg",
            paused: true,
            zIndex: "-1",
            borderRadius: 12,
            ease: "circ.out",
            duration: 0.6
    });

        const cardBgAnimation = gsap.fromTo('#Section5 .card-bg',{
            top: '15%',
            left: '15%',
            width: "425px",
            height: "680px",
            translateZ: 0,
            rotateZ: "20deg",
            zIndex: "-1",
            borderRadius: 12,

        }, {
            top: '0%',
            left: '0%',
            width: "100%",
            height: "100%",
            duration: 0.7,
            paused: true, 
            overwrite: "auto",
            translateZ: 0,
            rotateZ: "0",
            zIndex: 1,
            borderRadius: 0
    });

    if(!buttonsEl) return;

     const textAnimation = gsap.fromTo(textLines, {
                        x: 200,
                        opacity: 0
                    }, {
                        x: 0,
                        opacity: 1,
                        stagger: 0.05,
                        paused: true,
                        duration: 0.6,
                        overwrite: "auto",
                        
                    })
     const textExit = gsap.to(textLines, {
                        x: -200,
                        opacity: 0,
                        stagger: 0.05,
                        paused: true,
                        duration: 0.6,
                        overwrite: "auto",
                        
                    })
    

    const titleEnter = gsap.fromTo(titleChars, {
        x: 200,
        opacity: 0,
    }, {
        x: 0, 
        opacity: 1,
        stagger: 0.1,
        paused: true,
        overwrite: "auto",
        duration: 0.6,

    })

    const buttonsEnter = gsap.fromTo(buttonsEl, {
        x: 100,
        opacity: 0
    }, {
        x:0,
        opacity: 1,
        paused: true,
        duration: 0.6,
        overwrite: "auto",


    })
        

    const length2 = line2.getTotalLength()

    const lineAnimation = gsap.fromTo(line2, {
        strokeDasharray: length2,
        strokeDashoffset: length2
    }, {
        strokeDashoffset:0,
        ease: "power2.out",
        duration: 0.7,
        paused: true,
        overwrite: "auto",

    })

    const transitionEnter = gsap.fromTo(transition, {
        scaleX:0
    }, {
        scaleX: 1,
        duration: 0.5,
        paused: true,
        overwrite: "auto",
    })

        const tl = gsap.timeline({
            scrollTrigger:{
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {

                if(self.progress >= 0.1){
                    cardActiveAnimation.play()
                    textAnimation.play()
                    cardBgEnter.play()
                   
                } else{
                    cardActiveAnimation.reverse()
                    textAnimation.reverse()
                    cardBgEnter.reverse()
                }
                
                if (self.progress >= 0.4) {
                    textExit.play(); 
                    
                } else {
                    textExit.reverse(); 
        
            }

            if (self.progress >= 0.5) {
                    cardBgAnimation.play(); // Parte e va da sola fino alla fine!
                    titleEnter.play()
                    buttonsEnter.play()
                    
                    
                } else {
                    cardBgAnimation.reverse(); // Se torni indietro sopra la metà, fa il reverse!
                    titleEnter.reverse()
                     buttonsEnter.reverse()
                    
                }
                if (self.progress >= 0.55) {
                    cardInacativeAnimation.play(); 
                    lineAnimation.play()
                    
                } else {
                    cardInacativeAnimation.reverse(); 
                    lineAnimation.reverse()
                    
                }

                if(self.progress >= 0.9){
                    transitionEnter.play()
                } else {
                    transitionEnter.reverse()
                }


            }
        }})

        tl.to(line, {strokeDashoffset: 0, ease: "none", duration: 0.01})
            
        




        })
    
</script>

<main id="Section5" bind:this={section}>
    <div id="svgContainer">
        <svg id="section5Path" width="100vw" height="100vh">
            <path bind:this={line} d="M16.9741 982C208.307 811.333 679.374 733.6 880.974 966C1016.12 1121.79 1082.97 504.5 1346.97 663C1610.97 821.5 1574.93 -5.81252 1551.97 -13"/>
        </svg>
    </div>

    <div id="svgContainer2">
        <svg width="67vw" height="66wh" viewBox="0 0 1015 648" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path bind:this={line2} d="M-41 212.105L501 59.1046C501 59.1046 584.5 30.0156 709 78.8066C820 122.307 844 229.105 844 229.105L965.5 708.105" stroke="var(--brand-cibo-500)" stroke-width="101"/>
        </svg>
    </div>
    
    <div class="content">

            <div id="videoContainer">
                <CucinaItalianaSlider2 bind:el={sliderVideoEL} bind:elActive={activeSliderEl} bind:elButtons={buttonsEl}/>
            </div>
            <div id="text">
                <p id="paragraph" bind:this={text}>Questo suo essere virale e a prima vista irresistibile ha spinto le persone a realizzare moltissimi contenuti a riguardo. Specialmente <br><mark>MEME</mark></p>
            </div>
        
            <div id="title">
                <h1 id="memeTitle" bind:this={title}>MEME</h1>
            </div>
    </div>
    <div class="card-bg"></div>

    <svg id="transition" bind:this={transition}
     viewBox="0 0 1512 982"
     preserveAspectRatio="none"
     fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse id="Circle" cx="756" cy="491" rx="756" ry="491"/>
    </svg>
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
    #svgContainer2{
        position: absolute;
        bottom: -15%;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2; /* Sotto al contenuto */
    }

    #section5Path {
        fill: none;
        stroke: var(--brand-cibo-500);
        stroke-width: var(--line-thickness);
    }

   .content {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        gap: 15rem;
        /* SOLUZIONE 1: Forziamo il posizionamento sopra l'SVG */
        position: relative;
        z-index: 3; 
   }

   #text{
    width: 37.75rem;
    font-family: var(--font-family-text);
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: 110%; /* 2.2rem */
    letter-spacing: -0.08rem;
    color: var(--neutral-900);
    height: fit-content;
    position: absolute;
    right: 5%;
    pointer-events: none;
   }

   mark{
    font-family: var(--font-family);
    font-size: 8.3125rem;
    font-style: normal;
    font-weight: 900;
    background-color: transparent;
    color: var(--brand-cibo-500);
    line-height: 110%;
    
   }

   #title{
    font-family: var(--font-family);
    font-size: 10rem;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    position: absolute;
    right: 5%;
    top: 1%;
    color: var(--brand-cibo-500);
   }

   #videoContainer {
    position: relative;
    width: 500px;
    max-width: 600px;
    height: 100%;
    transform-style: preserve-3d;
    margin-left: 15%;
    z-index: 2;
}

#Section5 .card-bg {
    position: absolute;
    background-color: var(--brand-cibo-300);
    transform-style: preserve-3d;
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
        z-index: 4;

 }


    #Circle{
        width: 130%;
        height: 130%;
        fill: var(--neutral-50);
    }

</style>