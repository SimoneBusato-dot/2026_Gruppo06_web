<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import * as d3 from 'd3';
   
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    

    gsap.registerPlugin(ScrollTrigger);
    let data = [];  
    let svgElement;
    let section;
    let text;
    
    onMount(async () =>{

        let svg = d3.select(svgElement)
        const box = svgElement.getBoundingClientRect()
        const width = box.width
        const height = box.height

         const render = data => {
            const xValue = d => d.Time
            const yValue = d => d.Curling

            const xScale = d3.scaleTime()
                .domain(d3.extent(data, xValue))
                .range([0, width])
                .nice()

            const yScale = d3.scaleLinear()
                .domain(d3.extent(data, yValue))
                .range([height, 0])
                .nice()

           const xAxis = d3.axisBottom(xScale)
                .tickSize(-height)

        
            const g = svg.append('g')
                

            const xAxisG = g.append('g').call(xAxis)
                .attr('transform', `translate(0, ${height})`)
    
                

            xAxisG.selectAll('.domain').remove()

            const areaGenerator = d3.area()
                .x(d => xScale(xValue(d)))
                .y0(height)
                .y1(d => yScale(yValue(d)))
                .curve(d3.curveBasis)

            const curlingArea = g.append('path')
                .attr('d', areaGenerator(data))
                .attr('class', 'curlingArea')

                const clip1 = svg.append('defs')
                .append('clipPath')
                .attr('id', 'clip-area1')
                .append('rect')
                .attr('width', 0) // Inizia da zero
                .attr('height', height)
                .attr('x', 0)
                .attr('y', 0);

                 curlingArea.attr('clip-path', 'url(#clip-area1)');

            const lineGenerator = d3.line()
                .x(d => xScale(xValue(d)))
                .y(d => yScale(yValue(d)))
                .curve(d3.curveBasis)
            // visto che è una linea sola, posso anche non selezionare tutti i cerchi o altro
            const curlingData = g.append('path')
                .attr('d', lineGenerator(data))
                .attr('class', 'curlingLine')

            const firstRecord = data[0]
            const lastRecord = data.at(-1)


            
            g.append('circle')
                .attr('cx', xScale(xValue(firstRecord)))
                .attr('cy', yScale(yValue(firstRecord)))
                .attr('r', 15)
                .attr('fill', '#dc963e')
                .attr('id', 'firstCircle')
                

            g.append('circle')
                .attr('cx', xScale(xValue(lastRecord)))
                .attr('cy', yScale(yValue(lastRecord)))
                .attr('r', 15)
                .attr('fill', '#dc963e')
                .attr('id', 'lastCircle')
                


              
    }

    data = await d3.csv('/Sport_Insoliti/Sport_CSV/Olympics.csv', (d) => {
            return{
                ...d,
                Curling: +d.Curling,
                Time: new Date(d.Time)
            }
        })

        render(data)

        let path = svgElement.querySelector('.curlingLine');
        const length = path.getTotalLength();
        let area = svgElement.querySelector('#clip-area1 rect');



        gsap.set('#firstCircle', {r: "120vw"})
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.set(text, {opacity: 0, x: 300})

        gsap.set('#lastCircle', {r: 0})

        

        const tl = gsap.timeline({
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
        
        tl.to('#firstCircle', {
            duration: 0.1,
            r: 1,
            ease: "power2.out",
            overwrite: "auto",
        }, 0)
            .to(path, { strokeDashoffset: 0, ease: "none", duration: 0.2}, 0.1)
            .to(area, {width: "100vw", ease: "none", duration: 0.2}, 0.1)
            .to(text, {opacity: 1, x: 0, ease: "power2.out", duration: 0.3}, 0.05)
            .to('#lastCircle', {r: 15, ease: "power2.out", duration: 0.2}, 0.2)
            .to(path, {strokeDashoffset: -length, ease: "none", duration: 0.2}, 0.5)
            .to('#firstCircle', {r: 0, ease: "power2.out", duration: 0.2}, 0.5)
            .to(area, {width: 0, x: width, ease: "none", duration: 0.2}, 0.5)
            .to('#lastCircle', {r: 0, ease: "power2.out", duration: 0.2}, 0.55)
            .to(text, {opacity: 0, x: -300, ease: "power2.out", duration: 0.3}, 0.6)
            .to('.tick line', {attr: {y2: 0}, ease: "power2.out", duration: 0.3}, 0.5)
            

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        }
    })
</script>

<main id="section4" bind:this={section}>
    <div id="svgContainer">
        <svg id="line" width="100vw" height="100vh" bind:this={svgElement}>
        </svg>
    </div>

    <div id="text">
        <p id="paragraph" bind:this={text}>Il trend della pasta ha avuto picchi altissimi le prime settimane, per poi gradualmente attenuarsi in un entusiasmo a salti sporadici e ritorni improvvisi.</p>
    </div>

</main>

<style>

    #section4{
        position: relative;
        visibility: hidden;
        margin-block-start: 100dvh;
    }


    :global(.tick line){
        stroke: var(--neutral-100);
    }

    :global(.curlingLine){
        fill: none;
        stroke: var(--brand-cibo-500);
        stroke-width: 14px;
    }

    :global(.curlingArea){
        fill: var(--brand-cibo-200);

    }

    #text{
        position: absolute;
        top: 30%;
        left: 40%;
        width: 40%;
        z-index: 1;
    }

    #paragraph{
        font-size: 2rem;
        color: var(--neutral-900);
        font-weight: 400;
        font-family: var(--font-family-text);
    }
</style>