<script>
    import { onMount } from "svelte";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";

    let cardContainer;
    let { el = $bindable() } = $props();

    onMount(() => {
        el = cardContainer;

        const swiperConfig = {
            slidesPerView: "auto",
            loop: true,
            speed: 400,
            spaceBetween: 30,
            // Ricalcola gli spazi quando cambiano le classi attive
            observer: true,
            observeParents: true,
            on: {
                init(swiper) {
                    // Avvia il video iniziale
                    const activeSlide = swiper.el.querySelector('.swiper-slide-active');
                    activeSlide?.querySelector('video')?.play().catch(() => {});
                },
                slideChangeTransitionEnd(swiper) {
                    // Gestione video pulita
                    const videos = cardContainer.querySelectorAll("video");
                    videos.forEach(v => { v.pause(); v.currentTime = 0; });
                    
                    const activeSlide = swiper.el.querySelector('.swiper-slide-active');
                    const video = activeSlide?.querySelector('video');
                    video?.play().catch(err => console.log("Riproduzione fallita:", err));
                }
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        };

        const swiper = new Swiper(cardContainer, swiperConfig);
        return () => swiper.destroy();
    });
</script>

<div class="swiper-outer">
    <div class="swiper mySwiper" bind:this={cardContainer}>
        <div class="swiper-wrapper">
            <!-- Avvolgiamo il video in un .slide-inner per gestire l'ingrandimento in modo sicuro -->
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme1.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme2.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme3.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme4.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme5.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme6.mp4" muted loop playsinline></video></div></div>
            <div class="swiper-slide"><div class="slide-inner"><video src="/Sport_Insoliti/Video_Meme/Curling_Meme7.mp4" muted loop playsinline></video></div></div>
        </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
</div>

<style>
    .swiper-outer {
        position: relative;
        width: 90%;
        overflow: hidden;
    }

    .swiper {
        width: 100%; /* Allargato al 100% per vedere le slide laterali mentre si spostano */
        height: 720px;
    }

    .swiper-wrapper {
        align-items: center;
    }

    /* La slide di base ha la dimensione fissa, così Swiper calcola le posizioni matematicamente perfette */
    .swiper-slide {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 250px; /* Larghezza base delle slide non attive */
        height: 440px; /* Altezza base delle slide non attive */
        margin: 10px;
    }

    /* Il contenitore interno gestisce l'animazione fluida senza toccare il box model di Swiper */
    .slide-inner {
        width: 100%;
        height: 100%;
        transition: transform 0.4s ease;
        transform: scale(1);
    }

    /* Quando la slide diventa attiva, scaliamo il contenuto interno per raggiungere le dimensioni desiderate (es. 400x711) */
    :global(.swiper-slide-active .slide-inner) {
        transform: scale(1.6); /* Ingrandisce la slide senza rompere il calcolo del loop di Swiper */
        margin: 30px;
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
    }
</style>