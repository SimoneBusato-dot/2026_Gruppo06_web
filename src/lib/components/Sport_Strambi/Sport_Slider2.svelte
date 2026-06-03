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

    let videoElements = $state([]);
    let currentIndex = $state(0);
    let videoSlides = $state([]);
    let buttons;

    let { el = $bindable(), elActive = $bindable(), elButtons = $bindable() } = $props();

    // Dimensioni base proporzionali al viewport
    const getSlideWidth = () => Math.min(window.innerWidth * 0.165, 250);
    const baseGap = 20;

    let slideWidth = $state(250);

    function updateVideos(newIndex) {
        if (videoElements[currentIndex]) {
            videoElements[currentIndex].pause();
            videoElements[currentIndex].currentTime = 0;
        }
        currentIndex = newIndex;
        setTimeout(() => { videoElements[currentIndex]?.play().catch(() => {}); }, 50);
    }

    $effect(() => {
        if (videoSlides.length === 0) return;
        elActive = videoSlides[currentIndex] ?? null;
    });

    const nextSlide = () => updateVideos((currentIndex + 1) % videos.length);
    const prevSlide = () => updateVideos((currentIndex - 1 + videos.length) % videos.length);

    onMount(() => {
        slideWidth = getSlideWidth();
        window.addEventListener('resize', () => { slideWidth = getSlideWidth(); });
        elButtons = buttons;
        el = videoSlides;
        videoElements[0]?.play().catch(() => {});
    });
</script>

<div class="slider-outer">
    <div class="slider-wrapper" style="transform: translateX(-{currentIndex * (slideWidth + baseGap)}px);">
        {#each videos as src, index}
            <div class="slider-slide" class:active={index === currentIndex} bind:this={videoSlides[index]}>
                <div class="video-container">
                    <video bind:this={videoElements[index]} {src} muted loop playsinline></video>
                </div>
            </div>
        {/each}
    </div>

    <div class="navigation-container" bind:this={buttons}>
        <button class="nav-btn" onclick={prevSlide} aria-label="Previous slide">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M0.106547 6.06082L8.55519 0.146764C9.08542 -0.224391 9.81396 0.154931 9.81396 0.802149V11.7291C9.81396 12.3763 9.08542 12.7556 8.55519 12.3845L0.106548 6.47043C-0.0356315 6.37091 -0.0356319 6.16034 0.106547 6.06082Z" fill="#F3F3F3"/></svg>
        </button>
        <button class="nav-btn" onclick={nextSlide} aria-label="Next slide">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M9.70742 6.06082L1.25877 0.146764C0.728548 -0.224391 0 0.154931 0 0.802149V11.7291C0 12.3763 0.728549 12.7556 1.25877 12.3845L9.70742 6.47043C9.8496 6.37091 9.8496 6.16034 9.70742 6.06082Z" fill="#F3F3F3"/></svg>
        </button>
    </div>
</div>

<style>
    .slider-outer {
        position: relative;
        width: 100dvw;
        padding: clamp(20px, 3vh, 40px) 0;
    }

    .slider-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 20px;
        padding-left: 5%;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
        /* altezza fluida invece di 750px fissi */
        height: clamp(600px, 65vh, 750px);
    }

    .slider-slide {
        flex-shrink: 0;
        /* larghezza e altezza proporzionali al viewport */
        width: clamp(100px, 16.5vw, 200px);
        height: clamp(177px, 29vw, 355px);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: margin 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .slider-slide.active {
        margin-left: 40px;
        margin-right: 20%;
    }

    .video-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 20px;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .slider-slide.active .video-container {
        transform: scale(2);
        transform-origin: bottom center;
        z-index: 2;
    }

    video { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; }

    .navigation-container {
        position: absolute;
        bottom: -5%;
        right: 15%;
        display: flex;
        gap: 15px;
        z-index: 10;
    }

    .nav-btn {
        width: clamp(36px, 3.3vw, 50px);
        height: clamp(36px, 3.3vw, 50px);
        background: var(--brand-sport-insoliti-500);
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s, transform 0.1s;
        border: none;
    }

    .nav-btn:active { transform: scale(0.95); }
</style>