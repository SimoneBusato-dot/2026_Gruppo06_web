<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let text1, text2, videoContainer1, videoContainer2, perspective1, perspective2;

    onMount(() => {
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(perspective1, { duration: 1.2, rotateY: xPercent * 10, rotateX: -yPercent * 10, scale: 1, ease: "power2.out", overwrite: true });
            gsap.to(perspective2, { duration: 1.2, rotateY: -xPercent * 10, rotateX: yPercent * 10, scale: 1, ease: "power2.out", overwrite: true });
        };

        const text1Words = new SplitType(text1, { types: 'words', tagName: 'span' }).words;
        const text2Words = new SplitType(text2, { types: 'words', tagName: 'span' }).words;

        gsap.set(text1Words, { opacity: 0, y: 200 });
        gsap.set(text2Words, { opacity: 0, x: 200 });
        gsap.set(videoContainer1, { opacity: 1, x: "-110%" });
        gsap.set(videoContainer2, { opacity: 1, x: "110%" });

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

        tl.to(text1Words, { opacity: 1, y: 0, stagger: 0.05, ease: "power2.out", duration: 0.5 }, 0)
          .to(text1Words, { opacity: 0, x: -200, stagger: 0.05, ease: "power2.in", duration: 0.5 }, 0.5)
          .to(text2Words, { opacity: 1, x: 0, stagger: 0.5, ease: "power2.out", duration: 0.5 }, 0.8)
          .to(text2Words, { opacity: 0, ease: "power2.out", duration: 1 }, 2)
          .to(videoContainer1, { opacity: 1, x: "110%", ease: "power2.out", duration: 2 }, 2)
          .to(videoContainer2, { opacity: 1, x: "-110%", ease: "power2.out", duration: 2 }, 2)

        window.addEventListener("mousemove", moveElements);
        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="section3" class="page_content">
    <div id="background">
        <section id="first">
            <h2 id="firstText" bind:this={text1}>Primo fra tutti</h2>
        </section>
        <section id="second">
            <h1 id="secondText" bind:this={text2}>CURLING MANIA</h1>
        </section>
        <section id="third">
            <div id="perspective1" bind:this={perspective1}>
                <div id="videocontainer1" bind:this={videoContainer1}>
                    {#each [1,2,3,4,5,6] as n}
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling{n}.mp4" autoplay muted loop></video>
                    {/each}
                </div>
            </div>
            <div id="perspective2" bind:this={perspective2}>
                <div id="videocontainer2" bind:this={videoContainer2}>
                    {#each [7,8,9,10,11,12] as n}
                        <video src="/Sport_Insoliti/Video_Carousel/Carousel-Curling{n}.mp4" autoplay muted loop></video>
                    {/each}
                </div>
            </div>
        </section>
    </div>
</main>

<style>
    #section3 { visibility: hidden; background-color: var(--neutral-50); }

    #background {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: var(--brand-sport-insoliti-500);
    }

    #first, #second {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    #first { z-index: 1; }
    #second { z-index: 2; }

    #firstText {
        color: var(--brand-sport-insoliti-100);
        /* da 13.25rem fisso → scala col viewport */
        font-size: clamp(4rem, 10vw, 13.25rem);
        font-family: var(--font-family);
        font-weight: 900;
        margin: 0;
    }

    #secondText {
        color: var(--brand-sport-insoliti-100);
        /* da 31.25rem fisso → scala col viewport */
        font-size: clamp(29rem, 22vw, 31.25rem);
        font-family: var(--font-family);
        font-weight: 900;
        line-height: 76%;
        margin: 0;
        text-align: left;
    }

    #third {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: clamp(12px, 2vh, 26px);
        z-index: 3;
        perspective: 1000px;
    }

    #videocontainer1, #videocontainer2 {
        display: flex;
        flex-direction: row;
        gap: clamp(10px, 1.5vw, 28px);
    }

    video {
        /* da 17.5rem × 31.2rem fissi → scala col viewport */
        width: clamp(15rem, 13vw, 17.5rem);
        height: clamp(26.6rem, 23vw, 31.2rem);
        object-fit: cover;
        border-radius: 10px;
    }
</style>