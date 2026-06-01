<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';
   
    gsap.registerPlugin(ScrollTrigger);

    let text1;
    let text2;
    let perspective1;

    onMount(() => {
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY/ window.innerHeight -0.5) *2;

            gsap.to(perspective1, {
                duration: 1.2,
                rotateY: xPercent * 10,  
                rotateX: -yPercent * 10,
                scale: 1,
                ease: "power2.out",
                overwrite: true,
            });
        }

        const text1SplitType = new SplitType(text1, { types: 'words', tagName: 'span' });
        const text2SplitType = new SplitType(text2, { types: 'words', tagName: 'span' });

        const text1Words = text1SplitType.words;
        const text2Words = text2SplitType.words;

        gsap.set(text1Words, { opacity: 0, y: 200 });
        gsap.set(text2Words, { opacity: 0, x: 200 });
        
        // Setup initial fanned cards layout
        gsap.set('.fanned-card', { opacity: 0, scale: 0.8, y: 100 });
        gsap.set('.pasta-info-left', { opacity: 0, x: -100 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#section3",
                scroller: window,
                start: "top top",
                end: "+=200.1%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
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
        .to(text1Words, {
            opacity: 0,
            x: -200,
            stagger: 0.05,
            ease: "power2.in",
            duration: 0.5,
        }, 0.5)
        .to(text2Words, {
            opacity: 1,
            x: 0,
            stagger: 0.5,
            ease: "power2.out",
            duration: 0.5,
        }, 0.8)
        .to(text2Words, {
            opacity: 0,
            y: -100,
            ease: "power2.out",
            duration: 0.5,
        }, 1.5)
        
        // Fanned cards and text sliding in
        .to('.pasta-info-left', { opacity: 1, x: 0, ease: "power2.out", duration: 0.8 }, 1.8)
        .to('.fanned-card', { opacity: 1, scale: 1, y: 0, ease: "power2.out", duration: 0.8 }, 1.8)
        // Fan out rotation and translation
        .to('.card-left', { x: -160, rotate: -15, ease: "power2.out", duration: 1 }, 2.2)
        .to('.card-right', { x: 160, rotate: 15, ease: "power2.out", duration: 1 }, 2.2)
        .to('.card-center', { scale: 1.1, ease: "power2.out", duration: 1 }, 2.2);

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
            <h2 id="firstText" bind:this={text1}>Ma la vera mascotte gastronomica di Milano Cortina è stata...</h2>
        </section>
        <section id="second">
            <h1 id="secondText" bind:this={text2}>PASTA OLIMPICA</h1>
        </section>
        <section id="third">
            <div class="pasta-info-left">
                <h3 class="pasta-sub">o "pasta a cinque cerchi"...</h3>
                <p class="pasta-desc">Lo strano formato di pasta, nato per queste Olimpiadi Invernali, ha conquistato atleti e turisti.</p>
            </div>
            <div class="fanned-container" bind:this={perspective1}>
                <div class="fanned-card card-left">
                    <img src="/Cucina_Italiana/pasta_yellow.png" alt="Pasta Saffron" />
                </div>
                <div class="fanned-card card-center">
                    <img src="/Cucina_Italiana/pasta_olimpica.png" alt="Pasta Olimpica" />
                </div>
                <div class="fanned-card card-right">
                    <img src="/Cucina_Italiana/pasta_chef.png" alt="Artisanal Pasta" />
                </div>
            </div>
        </section>
    </div>
</main>

<style>
    #section3 {
        visibility: hidden;
    }
      
    #background {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--brand-cibo-500);
    }

    #first {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        padding: 0 10%;
        box-sizing: border-box;
    }

    #firstText {
        color: var(--brand-cibo-200);
        font-size: 8rem;
        font-family: var(--font-family);
        font-weight: 900;
        text-align: center;
        line-height: 1.1;
    }

    #second {
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

    #secondText {
        color: var(--brand-cibo-200);
        font-size: 28rem;
        font-family: var(--font-family);
        font-weight: 900;
        line-height: 76%;
        text-align: center;
    }

    #third {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 6rem;
        z-index: 3;
        perspective: 1000px;
        padding: 0 8%;
        box-sizing: border-box;
    }

    .pasta-info-left {
        width: 320px;
        color: var(--neutral-50);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        font-family: var(--font-family-text);
        z-index: 10;
    }

    .pasta-sub {
        font-size: 4rem;
        font-family: var(--font-family);
        font-weight: 900;
        color: var(--brand-cibo-200);
        line-height: 1;
    }

    .pasta-desc {
        font-size: 1.5rem;
        font-weight: 300;
        line-height: 140%;
    }

    .fanned-container {
        position: relative;
        width: 480px;
        height: 480px;
        display: flex;
        justify-content: center;
        align-items: center;
        transform-style: preserve-3d;
    }

    .fanned-card {
        position: absolute;
        width: 240px;
        height: 380px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        background: var(--neutral-900);
        border: 4px solid var(--neutral-50);
        transform-origin: bottom center;
    }

    .fanned-card img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .card-left {
        z-index: 2;
    }

    .card-center {
        z-index: 4;
    }

    .card-right {
        z-index: 3;
    }
</style>
