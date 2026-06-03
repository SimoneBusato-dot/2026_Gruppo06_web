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

            // Perspective rotation of the cards deck
            gsap.to(cards, {
                duration: 1.2,
                rotateY: xPercent * 25,
                rotateX: -yPercent * 25,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.04,
            });

            // Perspective rotation of the comments bubbles
            gsap.to('.comments', {
                duration: 1.2,
                rotateY: -xPercent * 35,
                rotateX: yPercent * 35,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.04,
            });

            // Perspective rotation of the card backings
            gsap.to('#section7 .card-bg', {
                duration: 1.2,
                rotateY: xPercent * 18,
                rotateX: -yPercent * 18,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.04,
            });
        };

        window.addEventListener("mousemove", moveElements);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=220%", // Tuned scroll height to stop exactly at the last card
                scrub: 1,
                pin: true,
                pinSpacing: true, // Enables full scroll spacing for gliding horizontal comments
                snap: {
                    snapTo: [0, 1],
                    duration: { min: 0.2, max: 0.5 },
                    delay: 0.1,
                    ease: "power1.inOut"
                },
                onEnter: () => {
                    gsap.set(videoScroll, { x: "100vw" });
                },
                onLeaveBack: () => {
                    gsap.set(videoScroll, { x: "100vw" });
                },
            }
        });

        // Animate the cards deck translating horizontally on scroll
        tl.fromTo(videoScroll,
            { x: "180%" }, // Start slightly tighter
            { x: "-135%", ease: "none", duration: 5 } // End at -135% to perfectly align the last comment and block scroll
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
                <!-- Card 1 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">Te la sogni 'sta roba in Usa</Comments>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">sono stati creativi in cucina 🇮🇹👏🏻</Comments>
                    </div>
                </div>

                <!-- Card 3 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">Dude send me some tiramisu that looks so good 🤤😭</Comments>
                    </div>
                </div>

                <!-- Card 4 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">nessuno ha notato che la pasta è a 5 cerchi</Comments>
                    </div>
                </div>

                <!-- Card 5 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">olympic muffins, olympic tiramisu, and now olympic pasta??</Comments>
                    </div>
                </div>

                <!-- Card 6 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">as an italian i want that</Comments>
                    </div>
                </div>

                <!-- Card 7 -->
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" autoplay muted loop playsinline></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="yellow">qui non facciamo fare i menu ai nutrizionisti, ma alle nonne</Comments>
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
        position: relative;
        background-color: var(--neutral-50);
        overflow: hidden;
    }

    #perspective, #Content {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
    }

    #perspective {
        perspective: 1000px;
    }

    #videoContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 16rem;
        height: 100%;
    }

    .v {
        position: relative;
        height: 52vh;
        width: calc(52vh * 9 / 16);
        flex-shrink: 0;
        perspective: 800px; 
    }

    .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
    }

    /* Staggered layouts and angles for cards deck - Customized to be wave-like and unique */
    .v:nth-child(1) .video-wrapper { transform: translateZ(0px) rotateY(-25deg) translateY(8%); }
    .v:nth-child(2) .video-wrapper { transform: translateZ(0px) rotateY(20deg) translateY(-18%); }
    .v:nth-child(3) .video-wrapper { transform: translateZ(0px) rotateY(-15deg) translateY(22%); }
    .v:nth-child(4) .video-wrapper { transform: translateZ(0px) rotateY(25deg) translateY(-22%); }
    .v:nth-child(5) .video-wrapper { transform: translateZ(0px) rotateY(-10deg) translateY(18%); }
    .v:nth-child(6) .video-wrapper { transform: translateZ(0px) rotateY(22deg) translateY(-12%); }
    .v:nth-child(7) .video-wrapper { transform: translateZ(0px) rotateY(-25deg) translateY(4%); }

    .card-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--brand-cibo-400); /* Zafferano Yellow */
        border-radius: 12px;
        z-index: -1;
        transform-style: preserve-3d;
    }

    .v:nth-child(1) .card-bg { transform: translateZ(-70px) rotateZ(3deg); top: 8%; left: 8%; }
    .v:nth-child(2) .card-bg { transform: translateZ(-70px) rotateZ(-4deg); top: 6%; left: -10%; }
    .v:nth-child(3) .card-bg { transform: translateZ(-70px) rotateZ(2deg); top: 8%; left: 6%; }
    .v:nth-child(4) .card-bg { transform: translateZ(-70px) rotateZ(-3deg); top: 8%; left: -8%; }
    .v:nth-child(5) .card-bg { transform: translateZ(-70px) rotateZ(4deg); top: 5%; left: 10%; }
    .v:nth-child(6) .card-bg { transform: translateZ(-70px) rotateZ(-2deg); top: 8%; left: -12%; }
    .v:nth-child(7) .card-bg { transform: translateZ(-70px) rotateZ(3deg); top: 6%; left: 8%; }

    video {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        transform: translateZ(20px); 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    .comments {
        position: absolute;
        width: 90%;
        z-index: 10;
        transform: translateZ(40px);
    }

    /* Alternating comments positioning: odd right/top, even left/bottom */
    .v:nth-child(1) .comments { top: 35%; left: 55%; }
    .v:nth-child(2) .comments { transform: translateZ(40px) translateY(-145%); left: -60%; }
    .v:nth-child(3) .comments { top: 22%; left: 55%; }
    .v:nth-child(4) .comments { transform: translateZ(40px) translateY(-135%); left: -60%; }
    .v:nth-child(5) .comments { top: 42%; left: 55%; }
    .v:nth-child(6) .comments { transform: translateZ(40px) translateY(-150%); left: -60%; }
    .v:nth-child(7) .comments { top: 50%; left: 55%; }
</style>