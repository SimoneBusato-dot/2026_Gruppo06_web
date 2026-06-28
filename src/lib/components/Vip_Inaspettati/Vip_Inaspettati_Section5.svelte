<script>
    import { onMount } from 'svelte';
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);

    let snoopSection;
    let snoopTitle;

    onMount(() => {
        gsap.set(snoopSection, { autoAlpha: 0 });

        const titleChars = new SplitType(snoopTitle, { types: 'chars', tagName: 'span' }).chars;
        gsap.set(titleChars, { opacity: 0, y: 120, rotate: 8 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#snoopSection',
                scroller: window,
                start: 'top top',
                end: '+=100%',
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeave: () => gsap.set(snoopSection, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(snoopSection, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(snoopSection, { autoAlpha: 0 }),
            }
        });

        tl.to(titleChars, {
            opacity: 1,
            y: 0,
            rotate: 0,
            stagger: 0.04,
            ease: 'power3.out',
            duration: 0.8,
        }, 0.1);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="snoopSection" bind:this={snoopSection}>
    <h2 id="snoopTitle" bind:this={snoopTitle}>
        SNOOP<br>DOGG
    </h2>
</main>

<style>
    #snoopSection {
        width: 200vw;
        height: 100vh;
        background-color: var(--brand-vip-500);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: clamp(3rem, 7vw, 8rem);
        box-sizing: border-box;
        overflow: hidden;
        margin-block-start: 500vh; /* Serve per far partire la sezione dopo la fine della precedente */
    }

    #snoopTitle {
        color: var(--brand-vip-100);
        /* da 31.25rem fisso → scala col viewport */
        font-size: clamp(29rem, 22vw, 31.25rem);
        font-family: var(--font-family);
        font-weight: 900;
        line-height: 76%;
        margin: 0;
        text-align: left;
    }

    /* Serve per SplitType: ogni char va in overflow hidden */
    :global(#snoopTitle .char) {
        display: inline-block;
        overflow: hidden;
    }
</style>

