<script>
   
import { onMount } from "svelte";
    let videos = $state([
        "/Sport_Insoliti/Video_Meme/Curling_Meme1.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme2.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme3.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme4.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme5.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme6.mp4",
        "/Sport_Insoliti/Video_Meme/Curling_Meme7.mp4"
    ]);

    let buttons;

    let videoElements = $state([])
    let currentIndex = $state(0);
    let videoSlides = $state([]);

    let {el = $bindable(), elActive = $bindable(), elButtons = $bindable()} = $props()

    // COSTANTI MATEMATICHE PER LO SPOSTAMENTO PERFETTO ANCORATO A SINISTRA
    const slideWidth = 250; // Larghezza base della slide
    const baseGap = 20;     // Gap del flexbox
    const activeRightSpace = 180; // Lo spazio extra a destra della slide attiva per distanziare le successive

    function updateVideos(newIndex) {
        if (videoElements[currentIndex]) {
            videoElements[currentIndex].pause();
            videoElements[currentIndex].currentTime = 0;
        }

        currentIndex = newIndex;

        setTimeout(() => {
            if (videoElements[currentIndex]) {
                videoElements[currentIndex].play().catch(err => console.log(err));
            }
        }, 50);
    }

    $effect(()=> {
        if (videoSlides.length === 0) return;
        elActive = videoSlides[currentIndex] ?? null;
    })

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % videos.length;
        updateVideos(nextIndex);
    }

    function prevSlide() {
        const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
        updateVideos(prevIndex);
    }

    
    onMount(() => {
        elButtons = buttons
        el = videoSlides
        if (videoElements[0]) videoElements[0].play().catch(() => {});
    });
</script>

<div class="slider-outer">
    <div 
        class="slider-wrapper" 
        style="transform: translateX(-{currentIndex * (slideWidth + baseGap)}px);"
    >
        {#each videos as src, index}
            <div class="slider-slide" class:active={index === currentIndex} bind:this={videoSlides[index]}>
                <div class="video-container">
                    <video 
                        bind:this={videoElements[index]}
                        {src} 
                        muted 
                        loop 
                        playsinline
                    ></video>
                </div>
            </div>
        {/each}
    </div>

    <div class="navigation-container" bind:this={buttons}>
        <button class="nav-btn" onclick={prevSlide} aria-label="Previous slide">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.106547 6.06082L8.55519 0.146764C9.08542 -0.224391 9.81396 0.154931 9.81396 0.802149V11.7291C9.81396 12.3763 9.08542 12.7556 8.55519 12.3845L0.106548 6.47043C-0.0356315 6.37091 -0.0356319 6.16034 0.106547 6.06082Z" fill="#F3F3F3"/>
            </svg>
            </button>
            <button class="nav-btn" onclick={nextSlide} aria-label="Next slide">
                    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.70742 6.06082L1.25877 0.146764C0.728548 -0.224391 0 0.154931 0 0.802149V11.7291C0 12.3763 0.728549 12.7556 1.25877 12.3845L9.70742 6.47043C9.8496 6.37091 9.8496 6.16034 9.70742 6.06082Z" fill="#F3F3F3"/>
            </svg>

        </button>
    </div>
</div>

<style>
    :global(body) {
        overflow-x: hidden;
    }

    .slider-outer {
        position: relative;
        width: 100dvw;
        padding: 40px 0;
    }

    .slider-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 20px; /* baseGap dello script */
        padding-left: 5%; /* Ancoraggio iniziale a sinistra di tutta la linea */
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
        height: 750px;
    }

    .slider-slide {
        flex-shrink: 0;
        width: 250px; /* slideWidth dello script */
        height: 444px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: margin 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* LA NUOVA SPAZIATURA ASIMMETRICA */
    .slider-slide.active {
        margin-left: 40px;   /* Margine sinistro leggero per dare respiro allo scale(1.5) */
        margin-right: 20%; /* Spazio fisso generoso (activeRightSpace) per spingere le slide successive a destra */
    }

    /* Se la slide attiva è la prima, azzeriamo il margine sinistro per incollarla al padding-left: 5% */
    .slider-slide.active:first-child {
        margin-left: 40px; /* Mantiene lo spazio per l'effetto zoom iniziale */
    }

    .video-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 20px;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        transform: scale(1);
    }

    /* La slide attiva scala a 1.5, diventando enorme a sinistra */
    .slider-slide.active .video-container {
        transform: scale(1.7);
        transform-origin: bottom center;
        z-index: 2;
        
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
    }

    /* Pulsanti */
    .navigation-container {
        position: absolute;
        bottom: -5%;
        right: 21%;
        display: flex;
        gap: 15px;
        z-index: 10;
    }

    .nav-btn {
        width: 50px;
        height: 50px;
        background: var(--brand-sport-insoliti-500);
        border-radius: 8px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s, transform 0.1s;
        border: none;
    }


    .nav-btn:active {
        transform: scale(0.95);
    }
</style>