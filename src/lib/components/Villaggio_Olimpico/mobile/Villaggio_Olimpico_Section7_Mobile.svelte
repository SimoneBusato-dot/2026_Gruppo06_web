<script>
    import Comments from "$lib/components/Comments.svelte";
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import { path } from "d3";

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let videoScroll;
    let cards;
    let line7;
    let path7;

    onMount(() => {

        let length = path7.getTotalLength();
        gsap.set(path7, { strokeDasharray: length, strokeDashoffset: length, y: 0});


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=300%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
    
                onEnter: () => {
                    gsap.set(videoScroll, { y: "400%" });
                    gsap.set(section, { autoAlpha: 1 });
                },
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    gsap.set(videoScroll, { y: "400%" });
                },
            }
        });

        tl.fromTo(videoScroll,
            { y: "400%" },
            { y: "-400%", ease: "none", duration: 5 }
        );

        tl.to(path7, { strokeDashoffset: 0, ease: "none", duration: 5, y: "-100%"}, 0);
        tl.to(path7, {strokeDashoffset: -length, ease: "none", duration: 2}, 4.5);

        return () => {
           
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
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti1.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="burrrp_">I'm confused? Why condoms? can someone explain</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti2.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="boh_vabbe">NON LI USANO VERAMENTE SONO TIPO SOUVENIR</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti3.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="yawn.01">I’m too asexual for this 😭</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti4.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="gay.qaz">Journalism at its peak</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti5.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="bingoOow">But can we get an actual Olympic village reality tv show</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti6.mp4" autoplay muted loop></video>
                        <div class="card-bg"></div>
                    </div>
                    <div class="comments">
                        <Comments variant="red" user="fnurf">but how are THE BEDS</Comments>
                    </div>
                </div>
                <div class="v">
                    <div class="video-wrapper">
                        <video src="/Villaggio_Olimpico/Video_Commenti/Villaggio_Commenti7.mp4" autoplay muted loop></video>
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
        <svg width="200vw" height="300vh" viewBox="0 0 402 3019" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path bind:this={path7} d="M473 2320.18C458.5 2268.18 12.4997 2193.68 -28.5003 2016.18C-91.6749 1742.68 333.612 1632.86 327 1474.18C320.5 1318.18 78.4728 1431.55 53.0002 1262.68C26 1083.68 390.51 1159.71 427.5 1022.68C500.114 753.681 -232.5 771.18 9.0001 481.68C67.8956 411.078 362.466 434.518 368.5 321.679C373.238 233.068 269.297 77.9917 -43.9998 17.1797M-51 2798.18C-132 2631.18 382.5 2744.18 434 2332.18M458 3478.18C342.5 2967.68 109.5 3440.18 -30 2864.18" stroke="#DC3E41" stroke-width="35" stroke-linecap="round"/>
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
    /* overflow-y: scroll;
    scroll-snap-type: y mandatory;
     -webkit-overflow-scrolling: touch; */
}

#perspective, #Content {
    width: 100%;
    height: 100%;
}


#svgContainer7 {
    position: absolute;
    top: -40%;
    left: -40%;
    width: 100%;
    height: 100%;
    z-index: -1;

}

    #perspective {
        perspective: 1000px;
    }

    #videoContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
    height: 100%;
}

.v {
    position: relative;
    height: 23.8125rem;
    width: calc(23.8125rem * 9 / 16);
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
.v:nth-child(2) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) }
.v:nth-child(3) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
.v:nth-child(4) .video-wrapper { transform: translateZ(0px) rotateY(-30deg) }
.v:nth-child(5) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
.v:nth-child(6) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) }
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
        left: 35%;
        width: 90%;
        z-index: 3;
        /* Spinge anche i commenti ben visibili e separati davanti al video */
        transform: translateZ(40px);
    }

    .v:nth-child(2) .comments { transform: translateZ(40px) translateY(-140%); left: -35%; }
    .v:nth-child(4) .comments { transform: translateZ(40px) translateY(-140%); left: -35%; }
    .v:nth-child(6) .comments { transform: translateZ(40px) translateY(-140%); left: -35%; }
</style>