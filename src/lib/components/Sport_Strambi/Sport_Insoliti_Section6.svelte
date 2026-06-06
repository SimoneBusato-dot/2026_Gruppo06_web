<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    let path;
    let path2;
    let section;
    let text;

    onMount(() => {
        const textSplitType = new SplitType(text, { types: 'lines', tagName: 'span' });
        const textLines = textSplitType.lines;

        const length = path.getTotalLength()
        const length2 = path2.getTotalLength()

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
        gsap.set(path2, { strokeDasharray: length2, strokeDashoffset: length2 })
       const text6Enter = gsap.fromTo(textLines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, duration: 0.7, ease: "power2.out", stagger: 0.1, paused: true });
       const text6Exit = gsap.fromTo(textLines, { opacity: 1, x: 0 }, { opacity: 0, x: -300, duration: 0.7, ease: "power2.in", stagger: 0.05, paused: true });

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {
                    if (self.progress >= 0.1) { text6Enter.play(); } else { text6Enter.reverse(); }
                    if (self.progress >= 0.7) { text6Exit.play(); } else { text6Exit.reverse(); }
                }
            }
        })

        tl.to(path, { strokeDashoffset: -length, duration: 5, ease: "power2.out" })
          .to(path2, { strokeDashoffset: -length2, duration: 5, ease: "power2.out" }, "<")

        return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
    })
</script>

<main id="section6" bind:this={section} >
    <div id="svgContainer">
        <svg id="path" fill="none">
            <path bind:this={path} d="M6.52953 582.741C206.543 529.759 523.889 322.661 193.165 -81.879" stroke="#533EDC" stroke-width="51"/>
        </svg>
        <svg id="path2" fill="none">
            <path bind:this={path2} d="M566.755 81.3008C396.755 81.3008 166.201 -155.726 24.5451 347.229" stroke="#533EDC" stroke-width="51"/>
        </svg>
    </div>

    <div id="text">
        <p bind:this={text} id="paragraph">Niente canoni rigidi o gare asettiche: a suon di meme, i social ci hanno fatto innamorare dell'assurdità di questi strani sport, rendendoli incredibilmente più vicini a noi.</p>
    </div>
</main>

<style>
    #section6 {
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
        margin-block-start: 100dvh;
        background-color: var(--neutral-50);
        overflow: hidden;
    }

    #svgContainer {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    #path {
        position: absolute;
        top: -10%;
        left: -15%;
        /* vw/vh invece di px fissi — scala con il viewport */
        width: 24vw;
        height: 61vh;
    }

    #path2 {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 37vw;
        height: 27vh;
    }

    #text {
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        /* da 3.125rem fisso a clamp: min 1.5rem, ideale 3.2vw, max 3.125rem */
        font-size: clamp(1rem, 3.2vw, 1.5rem);
        font-style: normal;
        font-weight: 400;
        line-height: 110%;
        letter-spacing: -0.125rem;
        /* da 72.625rem fisso a clamp: non sfora mai lo schermo */
        width: clamp(300px, 72vw, 72.625rem);
        position: relative;
        z-index: 1;
    }
</style>