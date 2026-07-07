<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);
    let svgElement, section, text;

    // Coordinate del sistema di riferimento interno dell'SVG (viewBox).
    // Sostituiscono width/height che prima venivano letti da getBoundingClientRect().
    const width = 1000;
    const height = 420;

    onMount(() => {
        let area = svgElement.querySelector('#clip-area1 rect');

        let textSlitType = new SplitType(text, { types: 'lines', tagName: 'span' });
        let textLines = textSlitType.lines;

        gsap.set('#firstCircle', { r: "120vw" });


        gsap.set('#lastCircle', { r: 0 });
        let text4Enter = gsap.fromTo(textLines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.1, paused: true });
        let text4Exit= gsap.fromTo(textLines, { opacity: 1, x: 0 }, { opacity: 0, x: -300, duration: 0.5, ease: "power2.out", stagger: 0.1, paused: true });


        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=200%",
                scrub: 1,
                pin: true,
             
                
                pinSpacing: false,
                onEnter: () => {gsap.set(section, { autoAlpha: 1 }); gsap.set(textLines, { opacity: 0, x: 300 })},
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),

                onUpdate: (self) => {
                    const progress = self.progress;
                    if (progress >= 0.3) { text4Enter.play(); } else { text4Enter.reverse();}
                    if (progress >= 0.7) { text4Exit.play(); } else { text4Exit.reverse(); }
                }
            }
        });

        tl.to('#firstCircle', { duration: 0.1, r: 0.5, ease: "power2.out" }, 0)
          .to(path, { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0.1)
          .to(area, { width: width, ease: "none", duration: 0.2 }, 0.1)
          .to('#lastCircle', { r: 5, ease: "power2.out", duration: 0.2 }, 0.2)
          .to(path, { strokeDashoffset: -length, ease: "none", duration: 0.2 }, 0.5)
          .to('#firstCircle', { r: 0, ease: "power2.out", duration: 0.2 }, 0.5)
          .to(area, { width: 0, x: width, ease: "none", duration: 0.2 }, 0.5)
          .to('#lastCircle', { r: 0, ease: "power2.out", duration: 0.2 }, 0.55)
          .to(text, { opacity: 0, x: -300, ease: "power2.out", duration: 0.3 }, 0.6)
          .to('.tick line', { attr: { y2: 0 }, ease: "power2.out", duration: 0.3 }, 0.5);

        return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    });
</script>

<main id="section4" bind:this={section} >
    <div id="svgContainer">
        <svg id="line" viewBox="0 0 1000 420" preserveAspectRatio="none" width="100%" height="100%" bind:this={svgElement}>
            <defs>
                <clipPath id="clip-area1">
                    <rect x="0" y="0" width="0" height="420"></rect>
                </clipPath>
            </defs>

            <g class="x-axis">
                <g class="tick" transform="translate(0,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">5 feb</text></g>
                <g class="tick" transform="translate(103.45,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">8 feb</text></g>
                <g class="tick" transform="translate(206.9,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">11 feb</text></g>
                <g class="tick" transform="translate(310.34,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">14 feb</text></g>
                <g class="tick" transform="translate(413.79,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">17 feb</text></g>
                <g class="tick" transform="translate(517.24,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">20 feb</text></g>
                <g class="tick" transform="translate(620.69,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">23 feb</text></g>
                <g class="tick" transform="translate(724.14,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">26 feb</text></g>
                <g class="tick" transform="translate(827.59,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">1 mar</text></g>
                <g class="tick" transform="translate(931.03,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">4 mar</text></g>
                <g class="tick" transform="translate(1000,420)"><line x1="0" x2="0" y1="0" y2="-420"></line><text y="20" dy="0.71em" text-anchor="middle">6 mar</text></g>
            </g>

            <path class="curlingArea" clip-path="url(#clip-area1)"
                d="M0,348.6 L5.75,338.8 C11.49,329 22.99,309.4 34.48,294.7 C45.98,280 57.47,270.2 68.97,258.3 C80.46,246.4 91.95,232.4 103.45,212.8 C114.94,193.2 126.44,168 137.93,131.6 C149.43,95.2 160.92,47.6 172.41,53.2 C183.91,58.8 195.4,117.6 206.9,154 C218.39,190.4 229.89,204.4 241.38,212.8 C252.87,221.2 264.37,224 275.86,214.2 C287.36,204.4 298.85,182 310.34,182.7 C321.84,183.4 333.33,207.2 344.83,227.5 C356.32,247.8 367.82,264.6 379.31,273.7 C390.8,282.8 402.3,284.2 413.79,288.4 C425.29,292.6 436.78,299.6 448.28,303.8 C459.77,308 471.26,309.4 482.76,317.1 C494.25,324.8 505.75,338.8 517.24,345.8 C528.74,352.8 540.23,352.8 551.72,353.5 C563.22,354.2 574.71,355.6 586.21,360.5 C597.7,365.4 609.2,373.8 620.69,380.8 C632.18,387.8 643.68,393.4 655.17,394.1 C666.67,394.8 678.16,390.6 689.66,392 C701.15,393.4 712.64,400.4 724.14,403.9 C735.63,407.4 747.13,407.4 758.62,408.1 C770.11,408.8 781.61,410.2 793.1,410.9 C804.6,411.6 816.09,411.6 827.59,411.6 C839.08,411.6 850.57,411.6 862.07,410.9 C873.56,410.2 885.06,408.8 896.55,408.1 C908.05,407.4 919.54,407.4 931.03,407.4 C942.53,407.4 954.02,407.4 965.52,406.7 C977.01,406 988.51,404.6 994.25,403.9 L1000,403.2 L1000,420 L994.25,420 C988.51,420 977.01,420 965.52,420 C954.02,420 942.53,420 931.03,420 C919.54,420 908.05,420 896.55,420 C885.06,420 873.56,420 862.07,420 C850.57,420 839.08,420 827.59,420 C816.09,420 804.6,420 793.1,420 C781.61,420 770.11,420 758.62,420 C747.13,420 735.63,420 724.14,420 C712.64,420 701.15,420 689.66,420 C678.16,420 666.67,420 655.17,420 C643.68,420 632.18,420 620.69,420 C609.2,420 597.7,420 586.21,420 C574.71,420 563.22,420 551.72,420 C540.23,420 528.74,420 517.24,420 C505.75,420 494.25,420 482.76,420 C471.26,420 459.77,420 448.28,420 C436.78,420 425.29,420 413.79,420 C402.3,420 390.8,420 379.31,420 C367.82,420 356.32,420 344.83,420 C333.33,420 321.84,420 310.34,420 C298.85,420 287.36,420 275.86,420 C264.37,420 252.87,420 241.38,420 C229.89,420 218.39,420 206.9,420 C195.4,420 183.91,420 172.41,420 C160.92,420 149.43,420 137.93,420 C126.44,420 114.94,420 103.45,420 C91.95,420 80.46,420 68.97,420 C57.47,420 45.98,420 34.48,420 C22.99,420 11.49,420 5.75,420 L0,420 Z">
            </path>

            <path class="curlingLine" clip-path="url(#clip-area1)"
                d="M0,348.6 L5.75,338.8 C11.49,329 22.99,309.4 34.48,294.7 C45.98,280 57.47,270.2 68.97,258.3 C80.46,246.4 91.95,232.4 103.45,212.8 C114.94,193.2 126.44,168 137.93,131.6 C149.43,95.2 160.92,47.6 172.41,53.2 C183.91,58.8 195.4,117.6 206.9,154 C218.39,190.4 229.89,204.4 241.38,212.8 C252.87,221.2 264.37,224 275.86,214.2 C287.36,204.4 298.85,182 310.34,182.7 C321.84,183.4 333.33,207.2 344.83,227.5 C356.32,247.8 367.82,264.6 379.31,273.7 C390.8,282.8 402.3,284.2 413.79,288.4 C425.29,292.6 436.78,299.6 448.28,303.8 C459.77,308 471.26,309.4 482.76,317.1 C494.25,324.8 505.75,338.8 517.24,345.8 C528.74,352.8 540.23,352.8 551.72,353.5 C563.22,354.2 574.71,355.6 586.21,360.5 C597.7,365.4 609.2,373.8 620.69,380.8 C632.18,387.8 643.68,393.4 655.17,394.1 C666.67,394.8 678.16,390.6 689.66,392 C701.15,393.4 712.64,400.4 724.14,403.9 C735.63,407.4 747.13,407.4 758.62,408.1 C770.11,408.8 781.61,410.2 793.1,410.9 C804.6,411.6 816.09,411.6 827.59,411.6 C839.08,411.6 850.57,411.6 862.07,410.9 C873.56,410.2 885.06,408.8 896.55,408.1 C908.05,407.4 919.54,407.4 931.03,407.4 C942.53,407.4 954.02,407.4 965.52,406.7 C977.01,406 988.51,404.6 994.25,403.9 L1000,403.2">
            </path>

            <circle id="firstCircle" cx="0" cy="348.6" r="5" fill="#533ddc"></circle>
            <circle id="lastCircle" cx="1000" cy="403.2" r="5" fill="#533ddc"></circle>
        </svg>
    </div>
    <div id="text4">
        <p id="paragraph" bind:this={text}>Il curling ha generato <mark class="highlight">forti picchi</mark> di interesse appena è entrato in scena all’interno dei giochi olimpici 2026</p>
    </div>
</main>

<style>
    #section4 {
        position: relative;
        visibility: hidden;
        /* era margin-block-start: 100dvh — mantenuto perché necessario per il pinning */
        margin-block-start: 200dvh;
        width: 100vw;
        height: 100vh;
        background-color: var(--neutral-50);
    }

    #svgContainer {
        position: absolute;
        inset: 0;
    }

    #svgContainer svg {
        width: 100%;
        height: 100%;
    }

    :global(.tick line) { stroke: var(--neutral-100); }
    :global(.curlingLine) { fill: none; stroke: var(--brand-sport-insoliti-500); stroke-width: clamp(6px, 0.9vw, 8px); }
    :global(.curlingArea) { fill: var(--brand-sport-insoliti-200); }

    #text4 {
        position: absolute;
        /* posizione relativa al viewport invece di px fissi */
        top: 30%;
        left: 40%;
        width: 40%;
        z-index: 1;
    }

    #paragraph {
        font-size: clamp(1rem, 1.8vw, 2rem);
        color: var(--neutral-900);
        font-weight: 400;
        font-family: var(--font-family-text);
    }

    .highlight{
        color: var(--brand-sport-insoliti-500);
        background-color: transparent;
    }
</style>