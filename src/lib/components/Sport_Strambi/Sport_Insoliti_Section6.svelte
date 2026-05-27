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

        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        })

        gsap.set(path2, {
            strokeDasharray: length2,
            strokeDashoffset: length2
        })

        gsap.set(textLines, {opacity: 0, x: 200})


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true,
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
    

        }
    })

    

    

tl.to(path, { strokeDashoffset: -length, duration: 5, ease: "power2.out" })
  .to(path2, { strokeDashoffset: -length2, duration: 5, ease: "power2.out" }, "<")
  .to(textLines, { opacity: 1, x: 0, stagger: 0.1, ease: "power2.out", duration: 1 }, 0)
  .to(textLines, { opacity: 0, x: -200, stagger: 0.05, ease: "power2.in", duration: 0.8}, 4)

  

    
    





})

</script>

<main id="section6" bind:this={section}>
    <div id="svgPerspective">
        <div id="svgContainer">
            <svg id="path" width="24vw" height="61vh" fill="none">
                <path bind:this={path} d="M6.52953 582.741C206.543 529.759 523.889 322.661 193.165 -81.879" stroke="#533EDC" stroke-width="51"/>
            </svg>

            <svg id="path2" width="37vw" height="27vh" fill="none">
                <path bind:this={path2} d="M566.755 81.3008C396.755 81.3008 166.201 -155.726 24.5451 347.229" stroke="#533EDC" stroke-width="51"/>
            </svg>

        </div>
    </div>

    <div id="text">
        <p bind:this={text} id="paragraph">Niente canoni rigidi o gare asettiche: a suon di meme, i social ci hanno fatto innamorare dell'assurdità di questi strani sport, rendendoli incredibilmente più vicini a noi.</p>
    </div>

</main>

<style>
    #section6{
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        visibility: hidden;
    }



    #path, #path2{
        position: absolute;
    }

    #path{
        top: -10%;
        left: -10%;
    }

    #path2{
        bottom: 0;
        right: 0;
    }

    #text{
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 3.125rem;
        font-style: normal;
        font-weight: 400;
        line-height: 110%; /* 3.4375rem */
        letter-spacing: -0.125rem;
        width: 72.625rem;
    }
</style>