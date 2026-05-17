<script>
    import { onMount } from "svelte";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";



    let cardContainer;

    let {el = $bindable()} = $props();

    const colors = [
        null,           // slide attiva — nessun overlay
        "#533ddc",      // 100
        "#7069ec",      // 200
        "#8687f3",      // 300
        "#a8b0f9",      // 400
        "#c9cffc",      // 500
    ];

    onMount(() => {

        el = cardContainer; 

        const applyColors = (swiper) => {
            swiper.slides.forEach((slide, i) => {
                const overlay = slide.querySelector(".overlay");
                const distance = i - swiper.activeIndex;

                if (distance === 0) {
                    overlay.style.opacity = "0";
                } else {
                    const absDistance = Math.abs(distance);
                    const color = colors[Math.min(absDistance, colors.length-1)];
                    overlay.style.backgroundColor = color;
                    overlay.style.opacity = "1";
                }
            });
        };

        const swiperConfig = {
            effect: "cards",
            grabCursor: true,
            cardsEffect: {
                perSlideOffset: 20,
                perSlideRotate: -15,
                rotate: true,
                slideShadows: false,
            },
            on: {
                init(swiper) {
                    applyColors(swiper);
                    const videos = cardContainer.querySelectorAll("video");
                    videos[swiper.activeIndex]?.play();
                },
                slideChange(swiper) {
                    applyColors(swiper);
                    const videos = cardContainer.querySelectorAll("video");
                    videos.forEach(v => { v.pause(); v.currentTime = 0; });
                    videos[swiper.activeIndex]?.play();
                }
            }
        };

        const swiper = new Swiper(cardContainer, swiperConfig);
        return () => swiper.destroy();
    });
</script>

<div class="swiper" bind:this={cardContainer}>
    <div class="swiper-wrapper">
        <div class="swiper-slide">
            <div class="overlay"></div>
            <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro1.mp4" muted loop></video>
        </div>
        <div class="swiper-slide">
            <div class="overlay"></div>
            <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro2.mp4" muted loop></video>
        </div>
        <div class="swiper-slide">
            <div class="overlay"></div>
            <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro3.mp4" muted loop></video>
        </div>
        <div class="swiper-slide">
            <div class="overlay"></div>
            <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro4.mp4" muted loop></video>
        </div>
        <div class="swiper-slide">
            <div class="overlay"></div>
            <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro5.mp4" muted loop></video>
        </div>
    </div>
</div>

<style>
    .swiper {
        width: 400px;
        height: 711px;
    }

    .swiper-slide {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        border-radius: 10px;
        opacity: 0;
        transition: opacity 0.3s ease, background-color 0.3s ease;
        pointer-events: none; /* non blocca il drag */
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
</style>