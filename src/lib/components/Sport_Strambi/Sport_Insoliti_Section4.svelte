<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import * as d3 from 'd3';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SplitType from 'split-type';

    gsap.registerPlugin(ScrollTrigger);
    let data = [];
    let svgElement, section, text;

    onMount(async () => {
        let svg = d3.select(svgElement);
        const box = svgElement.getBoundingClientRect();
        const width = box.width;
        const height = box.height;

        const render = data => {
            const xValue = d => d.Time;
            const yValue = d => d.Curling;

            const xScale = d3.scaleTime().domain(d3.extent(data, xValue)).range([0, width]).nice();
            const yScale = d3.scaleLinear().domain(d3.extent(data, yValue)).range([height, 0]).nice();

            const xAxis = d3.axisBottom(xScale).tickSize(-height);
            const g = svg.append('g');
            const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0, ${height})`);
            xAxisG.selectAll('.domain').remove();

            const areaGenerator = d3.area()
                .x(d => xScale(xValue(d))).y0(height).y1(d => yScale(yValue(d))).curve(d3.curveBasis);
            const curlingArea = g.append('path').attr('d', areaGenerator(data)).attr('class', 'curlingArea');

            const clip1 = svg.append('defs').append('clipPath').attr('id', 'clip-area1')
                .append('rect').attr('width', 0).attr('height', height).attr('x', 0).attr('y', 0);
            curlingArea.attr('clip-path', 'url(#clip-area1)');

            const lineGenerator = d3.line()
                .x(d => xScale(xValue(d))).y(d => yScale(yValue(d))).curve(d3.curveBasis);
            const curlingLine = g.append('path').attr('d', lineGenerator(data)).attr('class', 'curlingLine');
            curlingLine.attr('clip-path', 'url(#clip-area1)');

            const firstRecord = data[0];
            const lastRecord = data.at(-1);
            g.append('circle').attr('cx', xScale(xValue(firstRecord))).attr('cy', yScale(yValue(firstRecord))).attr('r', 15).attr('fill', '#533ddc').attr('id', 'firstCircle');
            g.append('circle').attr('cx', xScale(xValue(lastRecord))).attr('cy', yScale(yValue(lastRecord))).attr('r', 15).attr('fill', '#533ddc').attr('id', 'lastCircle');
        };

        data = await d3.csv('/Sport_Insoliti/Sport_CSV/Olympics.csv', d => ({
            ...d, Curling: +d.Curling, Time: new Date(d.Time)
        }));

        render(data);


    
        let area = svgElement.querySelector('#clip-area1 rect');

        let textSlitType = new SplitType(text, { types: 'lines', tagName: 'span' });
        let textLines = textSlitType.lines;

        gsap.set('#firstCircle', { r: "120vw" });

      
        gsap.set('#lastCircle', { r: 0 });
        gsap.set(textLines, { opacity: 0, x: 300 });
        gsap.set('#text4', { opacity: 0 });
        let text4Enter = gsap.fromTo(textLines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", stagger: 0.1, paused: true });
        let text4Exit= gsap.fromTo(textLines, { opacity: 1, x: 0 }, { opacity: 0, x: -300, duration: 0.5, ease: "power2.out", stagger: 0.1, paused: true });
        

        const tl = gsap.timeline({
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
                    const progress = self.progress;
                    if (progress >= 0.3) { text4Enter.play(); } else { text4Enter.reverse();}
                    if (progress >= 0.35) { gsap.to('#text4', { opacity: 1, duration: 0.5, ease: "power2.out" }); }
                    if (progress >= 0.7) { text4Exit.play(); } else { text4Exit.reverse(); }
                }
            }
        });

        tl.to('#firstCircle', { duration: 0.1, r: 1, ease: "power2.out" }, 0)
          .to(path, { strokeDashoffset: 0, ease: "none", duration: 0.2 }, 0.1)
          .to(area, { width: width, ease: "none", duration: 0.2 }, 0.1)
          .to('#lastCircle', { r: 15, ease: "power2.out", duration: 0.2 }, 0.2)
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
        <svg id="line" width="100%" height="100%" bind:this={svgElement}></svg>
    </div>
    <div id="text4">
        <p id="paragraph" bind:this={text}>Infatti, ha generato forti picchi di interesse appena è entrato in scena all'interno dei giochi olimpici 2026</p>
    </div>
</main>

<style>
    #section4 {
        position: relative;
        visibility: hidden;
        /* era margin-block-start: 100dvh — mantenuto perché necessario per il pinning */
        margin-block-start: 100dvh;
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
    :global(.curlingLine) { fill: none; stroke: var(--brand-sport-insoliti-500); stroke-width: clamp(6px, 0.9vw, 14px); }
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
</style>