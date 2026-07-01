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
                        <Comments variant="red" user="burrrp_">I'm confused? Why condoms? can someone explain</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti2.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="boh_vabbe">NON LI USANO VERAMENTE SONO TIPO SOUVENIR</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti3.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="yawn.01">I’m too asexual for this 😭</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti4.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="gay.qaz">Journalism at its peak</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti5.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="bingoOow">But can we get an actual Olympic village reality tv show</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti6.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="fnurf">but how are THE BEDS</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Sport_Insoliti/Video_Commenti/Curling_Commenti7.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="tramp_fanclub">Thank you for sharing from an American</Comments>
                    </div>
                </div>
            </div>
        </div>
    </div>

     <div id="svgContainer7" bind:this={line7}>
        <svg width="200%" height="100%" viewBox="0 0 2374 219" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path bind:this={path7} d="M25.1792 354.5C46.2211 223.143 141.241 134.05 273.679 121.5C421.667 107.477 435.565 302.114 574.679 354.5C741.334 417.257 866.173 422.69 1030.68 354.5C1160.99 300.487 1175.99 200.548 1306.68 147.472C1511.35 64.3502 1668.03 309.456 1868.18 215.972C1960.36 172.919 1957.18 25.5014 2070.18 25.5C2158.92 25.4989 2198.18 51.9228 2242.18 354.923C2254.17 437.508 2241.47 314.638 2265.68 394.5" stroke="#DC3E41" stroke-width="51" stroke-linejoin="round" stroke-linecap="round"/>
        </svg>
    </div>

 

</main>

<style>
   #section7 {
    width: 100vw;
    height: 100vh;
    visibility: hidden;
    margin-block-start: 100dvh ;
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
    background-color: var(--brand-villaggio-300);
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