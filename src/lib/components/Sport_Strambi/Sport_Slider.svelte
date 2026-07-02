<script>
    import { onMount } from "svelte";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";

    let cardContainer;
    let {el = $bindable()} = $props();

    const colors = [null, "#533ddc", "#7069ec", "#8687f3", "#a8b0f9", "#c9cffc"];

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
                    overlay.style.backgroundColor = colors[Math.min(absDistance, colors.length - 1)];
                    overlay.style.opacity = "1";
                }
            });
        };

        const swiper = new Swiper(cardContainer, {
            effect: "cards",
            grabCursor: true,
            pagination: { el: ".swiper-pagination", clickable: true },
            cardsEffect: { perSlideOffset: 20, perSlideRotate: -15, rotate: true, slideShadows: false },
            on: {
                init(swiper) { applyColors(swiper); cardContainer.querySelectorAll("video")[swiper.activeIndex]?.play(); },
                slideChange(swiper) {
                    applyColors(swiper);
                    const videos = cardContainer.querySelectorAll("video");
                    videos.forEach(v => { v.pause(); v.currentTime = 0; });
                    videos[swiper.activeIndex]?.play();
                }
            }
        });
        return () => swiper.destroy();
    });
</script>

<div class="swiper" bind:this={cardContainer}>
    <div class="swiper-wrapper">
        {#each [1,2,3,4,5] as n}
            <div class="swiper-slide">
                <div class="overlay"></div>
                <video src="/Sport_Insoliti/Video_introduzione/Sp_Intro{n}.mp4" muted loop></video>
            </div>
        {/each}
    </div>
    <div class="swiper-pagination"></div>
</div>

<style>
    .swiper {
        /* scala con il viewport: su MBP14 1512px → 26.4vw ≈ 400px */
        width: clamp(100px, 26.4vw, 400px);
        /* rapporto 400:711 = 0.5626 → height = width / 0.5626 */
        height: clamp(177px, 47vw, 711px);
        padding-bottom: clamp(3.5rem, 3vh, 5rem); /* spazio per la pagination */
        box-sizing: content-box;
    }

    .swiper-slide {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
    }

    .overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        border-radius: 10px;
        opacity: 0;
        transition: opacity 0.3s ease, background-color 0.3s ease;
        pointer-events: none;
    }

    video { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }

    .swiper-pagination { position: absolute; bottom: 0; }

    :global(.swiper-pagination-bullet) { transition: all 0.3s ease; }
    :global(.swiper-pagination-bullet-active) {
        background-color: var(--brand-sport-insoliti-500);
        width: 16px;
        border-radius: 4px;
    }
</style>