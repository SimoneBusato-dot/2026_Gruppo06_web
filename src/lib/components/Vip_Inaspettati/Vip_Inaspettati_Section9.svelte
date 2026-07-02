<script>
    import Comments from "../Comments.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let videoScroll;
    let cards;
    let line7;
    let path7;

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

            /*gsap.to(line7, {
                duration: 1.2,
                rotateY: xPercent * (-3),
                rotateX: -yPercent * (-2),
                scale: 1,
                ease: "power2.out",
                overwrite: "auto",
            });*/
        };

        window.addEventListener("mousemove", moveElements);

        let length = path7.getTotalLength();
        gsap.set(path7, { strokeDasharray: length, strokeDashoffset: length, x: 0});


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=300%",
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

        tl.to(path7, { strokeDashoffset: 0, ease: "none", duration: 5, x: "-60%"}, 0);
        tl.to(path7, {strokeDashoffset: -length, ease: "none", duration: 2}, 4.5);

        return () => {
            window.removeEventListener("mousemove", moveElements);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="section7" bind:this={section} >
    <div id="perspective" bind:this={cards}>
        <div id="Content">
            <div id="videoContainer" bind:this={videoScroll}>
                <div class="v" >
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti1.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple" user="ciaozio">Lo sport più ridicolo del mondo...🤔</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti2.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">sbaglio o tutti ci siamo appassionati al curling?</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti3.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">amo il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti4.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">CHE SPORT SIGNORI</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti5.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">Si lascia il calcio per il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti6.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">Fanculo il calcio ora si vede solo il curling</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti7.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="purple">Posso farlo anche io!!</Comments>
                    </div>
                </div>
            </div>
        </div>
    </div>

     <div id="svgContainer7" bind:this={line7}>
        <svg width="100%" height="100%" viewBox="0 0 2374 219" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path bind:this={path7} d="M25.1792 395.969C46.2211 264.612 269.241 39.0184 401.679 26.4684C549.667 12.4449 663.179 154.468 758.679 229.969C935.179 369.506 809.673 322.658 974.179 254.469C1104.49 200.455 1153.99 150.045 1284.68 96.9687C1489.35 13.847 1657.03 392.953 1857.18 299.469C1949.36 256.416 1967.82 159.328 2077.18 140.969C2145.68 129.469 2200.82 151.427 2239.68 224.469C2278.87 298.144 2324.47 370.376 2348.68 450.238" stroke="#dc3dcc" stroke-width="51" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
    </div>
</main>

<style>
   #section7 {
    width: 100vw;
    height: 100vh;
    visibility: hidden;
    margin-block-start: 100vh ;
    background-color: var(--neutral-50);
    position: relative;
}

#perspective, #Content {
    width: 100%;
    height: 100%;
}


#svgContainer7 {
    position: absolute;
    bottom: -40%;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

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
    background-color: var(--brand-vip-400);
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