<script>
    import { onMount } from "svelte";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";
    import gsap from "gsap";

    let cardContainer;
    let {el = $bindable()} = $props();

    const colors = [null, "#dc3e41", "#b61e22", "#961e20", "#7d1f21" ];

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
                perSlideOffset: 20,
                perSlideRotate: 5,
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
                <video src="/Villaggio_Olimpico/Video_Carosello/vl_intro{n}.mp4" muted loop></video>
            </div>
        {/each}
    </div>
    <div class="swiper-pagination"></div>
</div>

<style>
    .swiper {
        /* scala con il viewport: su MBP14 1512px → 26.4vw ≈ 400px */
        width: clamp(175px, 47vw, 320px);
        /* rapporto 400:711 = 0.5626 → height = width / 0.5626 */
        height: clamp(142px, 47vw, 569px);
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

    :global(.swiper-pagination-bullet) { transition: all 0.3s ease; }
    :global(.swiper-pagination-bullet-active) {
        background-color: var(--brand-villaggio-500);
        width: 16px;
        border-radius: 4px;
    }

</style>