<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
   
    
    gsap.registerPlugin(ScrollTrigger);

    let text1;
    let text2;
    let videoContainer1;
    let videoContainer2;
    let perspective1;
    let perspective2;

    onMount(() => {
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY/ window.innerHeight -0.5) *2;

            gsap.to(perspective1, {
                duration: 1.2,
                rotateY: xPercent* 10,  
                rotateX: -yPercent * 7,
                scale: 1,
                ease: "power2.out",
                overwrite: true,
            })

            gsap.to(perspective2, {
                duration: 1.2,
                rotateY: -xPercent* 10,  
                rotateX: yPercent *7,
                scale: 1,
                ease: "power2.out",
                overwrite: true,
            })

        }

        const text1SplitType = new SplitType(text1, { types: 'words', tagName: 'span' });
        const text2SplitType = new SplitType(text2, { types: 'words', tagName: 'span' });

        const text1Words = text1SplitType.words;
        const text2Words = text2SplitType.words;

        gsap.set(text1Words, { opacity: 0, y: 200 });
        gsap.set(text2Words, { opacity: 0, x: 200 });
        gsap.set(videoContainer1, {opacity: 1, x: "-100%"})
        gsap.set(videoContainer2, {opacity: 1, x: "100%"})

        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section3",
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set("#section3", { autoAlpha: 1 }),
                onLeave: () => gsap.set("#section3", { autoAlpha: 0 }),
                onEnterBack: () => gsap.set("#section3", { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set("#section3", { autoAlpha: 0 }),
            }
        });

        tl.to(text1Words, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            ease: "power2.out",
            duration: 0.5,
        }, 0)
        .to(text1Words, {          // ← text1 esce a sinistra
            opacity: 0,
            x: -200,
            stagger: 0.05,
            ease: "power2.in",
            duration: 0.5,
        }, 0.5)
        .to(text2Words, {          // ← text2 entra
            opacity: 1,
            x: 0,
            stagger: 0.5,
            ease: "power2.out",
            duration: 0.5,
        }, 0.8)
        .to(text2Words, {          // ← text2 entra
            opacity: 0,
            ease: "power2.out",
            duration: 1,
        }, 2)
        .to(videoContainer1, {     // ← video entra
            opacity: 1,
            x: "100%",
            ease: "power2.out",
            duration: 2,
        }, 2)
        .to(videoContainer2, {     // ← video entra
            opacity: 1,
            x: "-100%",
            ease: "power2.out",
            duration: 2,
        }, 2)

        window.addEventListener("mousemove", moveElements);

        return () => {
        window.removeEventListener("mousemove", moveElements);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
    });

    
   
</script>

<main id="section3">
    <div id="background">
        <section id="first">
            <h2 id="firstText" bind:this={text1}>Primo fra tutti</h2>
        </section>
        <section id="second">
            <h1 id="secondText" bind:this={text2}>CURLING MANIA</h1>
        </section>
        <section id="third">
            <div id="perspective1" bind:this={perspective1}>
                <div id="videoWrapper">
                    <div id="videocontainer1" bind:this={videoContainer1}>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling1.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling2.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling3.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling4.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling5.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling6.mp4" autoplay muted loop></video>
                    </div>
                </div>
            </div>
             <div id="perspective2" bind:this={perspective2}>
                <div id="videoWrapper2">
                    <div id="videocontainer2" bind:this={videoContainer2}>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling7.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling8.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling9.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling10.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling11.mp4" autoplay muted loop></video>
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling12.mp4" autoplay muted loop></video>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>

<style>


#section3{
    visibility: hidden;
    margin-block-start: 100dvh;
}
  

    #background{
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--brand-sport-insoliti-500);

    }

    #first{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;

    }

    #firstText{
        color: var(--brand-sport-insoliti-300);
        font-size: 13.25rem;
        font-family: var(--font-family);
        font-weight: 900;
    }

    #second{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
    }

     #secondText{
        color: var(--brand-sport-insoliti-300);
        font-size: 31.25rem;
        font-family: var(--font-family);
        font-weight: 900;
        line-height: 76%;
    }

    #third{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 26px;
        z-index: 3;
        perspective: 1000px;
    }
    #videocontainer1{
        display: flex;
        flex-direction: row;
        gap: 28px;
    }

    video{
        width: 17.5rem;
        height: 31.2rem;
        object-fit: cover;
        border-radius: 10px;
    }
    
    #videocontainer2{
        display: flex;
        flex-direction: row;
        gap: 28px;
    }
</style>
