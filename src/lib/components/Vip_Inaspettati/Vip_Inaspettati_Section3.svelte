<script>
    import { onMount } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    let section;

    onMount(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=101%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    });
</script>

<main bind:this={section}>
    <div id="content">
        <!-- slider verrà aggiunto dopo -->
        <div id="text">
            <p>Oggi il mito del VIP diventa riconoscibile.</p>
            <p>È questa la...</p>
        </div>
    </div>
</main>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--brand-vip-500);
        visibility: hidden;
        overflow: hidden;
        margin-block-start: 50dvh;
    
    }

    #content {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 4rem;
        box-sizing: border-box;
    }

    #text {
        color: var(--neutral-50);
        font-family: var(--font-family-text);
        font-size: clamp(1.2rem, 1.5vw, 1.8rem);
        max-width: 300px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>