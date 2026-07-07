<script>
    import { onMount } from "svelte";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";
    import gsap from "gsap";

    let cardContainer;
    let {el = $bindable()} = $props();

    const colors = [null, "#ee84e3", "#f5b2ef", "#fbd4f8", "#fdeafd" ];

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
            centeredSlides: true,
            initialSlide: 2,
            pagination: { el: ".swiper-pagination", clickable: true },
            cardsEffect: {
                perSlideOffset: 28,
                perSlideRotate: -1,
                rotate: true,
                slideShadows: false,
                

            },
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
                <video src="/Vip_Inaspettati/Video_SliderSezione3/Vip_Slid{n}.mp4" muted loop></video>
            </div>
        {/each}
    </div>
    <div class="swiper-pagination"></div>
</div>

<style>
    .swiper {
        /* scala con il viewport: su MBP14 1512px → 26.4vw ≈ 400px */
        width: clamp(220px, 55vw, 400px);
        /* rapporto 400:711 = 0.5626 → height = width / 0.5626 */
        height: clamp(391px, 97vw, 711px);
        padding-bottom: clamp(3.5rem, 3vh, 5rem); /* spazio per la pagination */
        box-sizing: content-box;
    }

    .swiper-slide {
        position: relative;
        border-radius: 10px;
        overflow: hidden;;
        flex-shrink: 0;  
        
        
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

    .swiper :global(.swiper-pagination-bullet) { transition: all 0.3s ease; }
    .swiper :global(.swiper-pagination-bullet-active) {
        background: var(--brand-vip-200);
        width: 16px;
        border-radius: 4px;
    }

</style>