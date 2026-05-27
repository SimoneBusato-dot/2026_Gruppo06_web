<script>
    import Comments from "../Comments.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let videoScroll;
    let cards;

    onMount(() => {

        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            // Rotazione del box principale (prospettiva globale)
            gsap.to(cards, {
                duration: 1.2,
                rotateY: xPercent * 20,
                rotateX: -yPercent * 20,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.05,
            });

            // Rotazione dei commenti
            gsap.to('.comments', {
                duration: 1.2,
                rotateY: -xPercent * 40,
                rotateX: yPercent * 40,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.05,
            });

            // Rotazione degli sfondi
            gsap.to('#section7 .card-bg', {
                duration: 1.2,
                rotateY: xPercent * 15,
                rotateX: -yPercent * 15,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.05,
            });
        };

        window.addEventListener("mousemove", moveElements);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => {
                    gsap.set(videoScroll, { x: "100vw" });
                    gsap.set(section, { autoAlpha: 1 });
                },
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set(videoScroll, { x: "100vw" });
                },
            }
        });

        tl.fromTo(videoScroll,
            { x: "200%" },
            { x: "-200%", ease: "none", duration: 5 }
        );

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="section7" bind:this={section}>
    <div id="perspective" bind:this={cards}>
        <div id="Content">
            <div id="videoContainer" bind:this={videoScroll}>
                <div class="v" >
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti1.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">Lo sport più ridicolo del mondo...🤔</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti2.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">sbaglio o tutti ci siamo appassionati al curling?</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti3.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">amo il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti4.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">CHE SPORT SIGNORI</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti5.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">Si lascia il calcio per il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti6.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">Fanculo il calcio ora si vede solo il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti7.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="blue">Posso farlo anche io!!</Comments>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
   #section7 {
    width: 100vw;
    height: 100vh;
    visibility: hidden;
    margin-block-start: 2dvh ;
}

#perspective, #Content {
    width: 100%;
    height: 100%;
}

    #perspective {
        perspective: 1000px;
    }

    #videoContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 15rem;
    height: 100%;
}

.v {
    position: relative;
    height: 50vh;
    width: calc(50vh * 9 / 16);
    flex-shrink: 0;
    perspective: 800px; 
}

.video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
}

/* Modificato: uniamo la rotazione Y nativa ad un leggero allineamento in avanti dello stage */
.v:nth-child(1) .video-wrapper { transform: translateZ(0px) rotateY(30deg); }
.v:nth-child(2) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) translateY(-30%);}
.v:nth-child(3) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
.v:nth-child(4) .video-wrapper { transform: translateZ(0px) rotateY(-30deg) translateY(-30%);}
.v:nth-child(5) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
.v:nth-child(6) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) translateY(-30%);}
.v:nth-child(7) .video-wrapper { transform: translateZ(0px) rotateY(30deg); }

/* Stile base dello sfondo (sostituto di ::after) */
.card-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--brand-sport-insoliti-400);
    border-radius: 12px;
    z-index: -1;
    transform-style: preserve-3d;
}

/* RISOLTO: Ora ogni transform dichiara esplicitamente un arretramento reale in pixel (translateZ(-60px)) */
.v:nth-child(1) .card-bg { transform: translateZ(-70px) rotateZ(-2deg); top: 10%; left: -15%; }
.v:nth-child(2) .card-bg { transform: translateZ(-70px) rotateZ(2deg); top: 10%; left: 10%; }
.v:nth-child(3) .card-bg { transform: translateZ(-70px) rotateZ(-4deg); top: 5%; left: -15%;}
.v:nth-child(4) .card-bg { transform: translateZ(-70px) rotateZ(3deg); top: 10%; left: 10%; }
.v:nth-child(5) .card-bg { transform: translateZ(-70px) rotateZ(-2deg); top: 5%; left: -15%;}
.v:nth-child(6) .card-bg { transform: translateZ(-70px) rotateZ(5deg); top: 5%; left: 13%; }
.v:nth-child(7) .card-bg { transform: translateZ(-70px) rotateZ(-3deg); top: 10%; left: -15%;}

    video {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        /* RISOLTO: Spinto in pixel (px) e non in % per farlo stare sempre davanti allo sfondo */
        transform: translateZ(20px); 
    }

    .comments {
        position: absolute;
        top: 40%;
        left: 55%;
        width: 90%;
        z-index: 3;
        /* Spinge anche i commenti ben visibili e separati davanti al video */
        transform: translateZ(40px);
    }

    .v:nth-child(2) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }
    .v:nth-child(4) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }
    .v:nth-child(6) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }
</style>