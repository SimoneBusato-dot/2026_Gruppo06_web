<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";
    import * as d3 from 'd3';
    import SplitType from "split-type";

    gsap.registerPlugin(ScrollTrigger);

    let section;
    let introTextsContainer;
    let galleryContainer;
    let intermediateContainer;
    let pastaContainer;
    let fusedContainer;
    let swiperDeckContainer;
    let chartContainer;

    // SVG elements
    let path;
    let path2;
    let pathIntermediate;
    let pathIntermediate2;
    let svgElement;

    // Slide 1 elements
    let p1;
    let p2Container;

    // Slide 3 elements
    let intermediateParagraphs;

    // Slide 4 elements
    let pastaTitle;

    // Slide 5 card deck elements
    let textLeft;
    let cardContainer;
    let cinematicCard;

    // Slide 7 D3 elements
    let chartText;

    // Swiper zafferano colors
    const colors = [
        null,           // active slide
        "#dc963e",      // brand-cibo-500
        "#d3792c",      // brand-cibo-600
        "#bb5b24",      // brand-cibo-700
        "#9c4120",      // brand-cibo-800
        "#7f3420",      // brand-cibo-900
    ];

    // Generate 30 video configurations representing the vertical gallery mosaic
    const videos = [
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "450px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "300px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "220px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "350px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "260px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "380px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "240px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "480px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "280px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "320px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "420px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "220px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "350px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "270px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "400px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "310px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "250px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "440px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "290px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "330px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "410px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "230px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "360px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "260px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "390px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4", height: "320px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4", height: "240px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4", height: "460px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4", height: "300px" },
        { src: "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4", height: "340px" }
    ];

    const columns = [
        videos.slice(0, 6),
        videos.slice(6, 12),
        videos.slice(12, 18),
        videos.slice(18, 24),
        videos.slice(24, 30)
    ];

    onMount(async () => {
        // ==========================================
        // D3.js Curling Trend Chart Initialization
        // ==========================================
        let svg = d3.select(svgElement);
        const box = svgElement.getBoundingClientRect();
        const width = box.width;
        const height = box.height;

        const renderChart = (chartData) => {
            const xValue = d => d.Time;
            const yValue = d => d.Curling;

            const xScale = d3.scaleTime()
                .domain(d3.extent(chartData, xValue))
                .range([0, width])
                .nice();

            const yScale = d3.scaleLinear()
                .domain(d3.extent(chartData, yValue))
                .range([height, 0])
                .nice();

            const xAxis = d3.axisBottom(xScale).tickSize(-height);
            const g = svg.append('g');
            const xAxisG = g.append('g').call(xAxis).attr('transform', `translate(0, ${height})`);
            xAxisG.selectAll('.domain').remove();

            const areaGenerator = d3.area()
                .x(d => xScale(xValue(d)))
                .y0(height)
                .y1(d => yScale(yValue(d)))
                .curve(d3.curveBasis);

            const curlingArea = g.append('path')
                .attr('d', areaGenerator(chartData))
                .attr('class', 'curlingArea');

            const clip = svg.append('defs')
                .append('clipPath')
                .attr('id', 'clip-area-cibo-restored')
                .append('rect')
                .attr('width', 0)
                .attr('height', height)
                .attr('x', 0)
                .attr('y', 0);

            curlingArea.attr('clip-path', 'url(#clip-area-cibo-restored)');

            const lineGenerator = d3.line()
                .x(d => xScale(xValue(d)))
                .y(d => yScale(yValue(d)))
                .curve(d3.curveBasis);

            const curlingLine = g.append('path')
                .attr('d', lineGenerator(chartData))
                .attr('class', 'curlingLine');

            const firstRecord = chartData[0];
            const lastRecord = chartData.at(-1);

            g.append('circle')
                .attr('cx', xScale(xValue(firstRecord)))
                .attr('cy', yScale(yValue(firstRecord)))
                .attr('r', 15)
                .attr('fill', 'var(--neutral-50)')
                .attr('id', 'firstCircle');

            g.append('circle')
                .attr('cx', xScale(xValue(lastRecord)))
                .attr('cy', yScale(yValue(lastRecord)))
                .attr('r', 15)
                .attr('fill', 'var(--neutral-50)')
                .attr('id', 'lastCircle');
        };

        const chartData = await d3.csv('/Sport_Insoliti/Sport_CSV/Olympics.csv', (d) => {
            return {
                ...d,
                Curling: +d.Curling,
                Time: new Date(d.Time)
            };
        });

        renderChart(chartData);

        let d3Path = svgElement.querySelector('.curlingLine');
        const d3Length = d3Path.getTotalLength();
        let d3Area = svgElement.querySelector('#clip-area-cibo-restored rect');

        // Set Swiper color utilities
        const applyColors = (swiper) => {
            swiper.slides.forEach((slide, i) => {
                const overlay = slide.querySelector(".overlay");
                const distance = i - swiper.activeIndex;

                if (distance === 0) {
                    overlay.style.opacity = "0";
                } else {
                    const absDistance = Math.abs(distance);
                    const color = colors[Math.min(absDistance, colors.length - 1)];
                    overlay.style.backgroundColor = color;
                    overlay.style.opacity = "1";
                }
            });
        };

        // Initialize Swiper with 1-slide-at-a-time touch limitation
        const swiperConfig = {
            effect: "cards",
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            cardsEffect: {
                perSlideOffset: 20,
                perSlideRotate: -15,
                rotate: true,
                slideShadows: false,
            },
            on: {
                init(swiper) {
                    applyColors(swiper);
                    const videos = cardContainer.querySelectorAll("video");
                    videos[swiper.activeIndex]?.play().catch(() => {});
                },
                slideChange(swiper) {
                    applyColors(swiper);
                    const videos = cardContainer.querySelectorAll("video");
                    videos.forEach(v => { v.pause(); v.currentTime = 0; });
                    videos[swiper.activeIndex]?.play().catch(() => {});
                    
                    // Stop scrolling through multiple slides in a single gesture
                    swiper.allowTouchMove = false;
                },
                touchEnd(swiper) {
                    // Re-allow drag moves only after user lifts their finger
                    setTimeout(() => {
                        swiper.allowTouchMove = true;
                    }, 50);
                }
            }
        };

        const swiper = new Swiper(cardContainer, swiperConfig);

        // ==========================================
        // GSAP ScrollTrigger timeline configuration
        // ==========================================
        const len1 = path.getTotalLength();
        const len2 = path2.getTotalLength();
        const lenIntermediate = pathIntermediate.getTotalLength();
        const lenIntermediate2 = pathIntermediate2.getTotalLength();

        gsap.set(path, { strokeDasharray: len1, strokeDashoffset: len1 });
        gsap.set(path2, { strokeDasharray: len2, strokeDashoffset: len2 });
        gsap.set(pathIntermediate, { strokeDasharray: lenIntermediate, strokeDashoffset: lenIntermediate, opacity: 0 });
        gsap.set(pathIntermediate2, { strokeDasharray: lenIntermediate2, strokeDashoffset: lenIntermediate2, opacity: 0 });
        gsap.set(d3Path, { strokeDasharray: d3Length, strokeDashoffset: d3Length });

        // Initialize states
        gsap.set('.intro-grid .left-col, .intro-grid .right-col', { opacity: 0, y: 100 });
        gsap.set(galleryContainer, { xPercent: 100 });
        gsap.set(intermediateContainer, { xPercent: 100 });
        gsap.set(fusedContainer, { xPercent: 0 });
        gsap.set(swiperDeckContainer, { xPercent: 100 });
        gsap.set(chartContainer, { xPercent: 100, opacity: 0 });
        gsap.set('.gallery-col', { y: 0 });
        gsap.set('#intermediateWrapper .para, .gusto-dharma', { opacity: 0, x: 100 });

        // Split PASTA OLIMPICA text into characters using SplitType to ensure natural kerning and layout
        new SplitType(pastaTitle, { types: 'chars', tagName: 'span' });

        gsap.set(pastaTitle, { xPercent: 0, opacity: 0 });
        const pastaTitleChars = pastaTitle.querySelectorAll('.char');
        const pastaWordChars = pastaTitle.querySelectorAll('.pasta-line:first-of-type .char');
        const olimpicaWordChars = pastaTitle.querySelectorAll('.pasta-line:last-of-type .char');
        gsap.set(pastaTitleChars, { yPercent: 100, opacity: 0 });
        gsap.set(textLeft, { xPercent: 0, opacity: 1 });
        gsap.set(cardContainer, { scale: 1.0, opacity: 1, y: 0 });
        gsap.set(cinematicCard, { scale: 1.0, opacity: 0, rotate: 0, borderRadius: 20, zIndex: 100 });
        gsap.set(chartText, { opacity: 0, x: 200 });
        gsap.set('#firstCircle', { r: 0 });
        gsap.set('#lastCircle', { r: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=1350%", // Fast snappy scroll speed to dramatically cut transition times
                scrub: 1,
                pin: true,
                pinSpacing: true,
                snap: {
                    snapTo: (value) => {
                        const points = [
                            0,
                            2.0 / 17.65,
                            3.5 / 17.65,
                            7.0 / 17.65,
                            8.5 / 17.65,
                            10.2 / 17.65,
                            12.0 / 17.65,
                            13.8 / 17.65,
                            15.4 / 17.65,
                            1
                        ];

                        // Free scroll ranges:
                        // 1. Vertical video gallery: from 3.5 to 7.0 timeline progress
                        const galleryStart = 3.5 / 17.65;
                        const galleryEnd = 7.0 / 17.65;
                        if (value > galleryStart && value < galleryEnd) {
                            return value; // Return current position (no snap)
                        }

                        // 2. D3 chart drawing animation: from 15.4 to 17.0 timeline progress
                        const chartStart = 15.4 / 17.65;
                        const chartEnd = 17.0 / 17.65;
                        if (value > chartStart && value < chartEnd) {
                            return value; // Return current position (no snap)
                        }

                        // Otherwise snap to closest point if within threshold
                        let closest = points[0];
                        let minDiff = Math.abs(value - closest);
                        for (let i = 1; i < points.length; i++) {
                            let diff = Math.abs(value - points[i]);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closest = points[i];
                            }
                        }

                        const threshold = 0.025; // Snaps only when within 2.5% of the transition points
                        if (minDiff < threshold) {
                            return closest;
                        }
                        return value; // Keep current scroll position in the middle of sections
                    },
                    duration: { min: 0.4, max: 0.8 },
                    delay: 0.25,
                    ease: "power2.out"
                },
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => gsap.set(section, { autoAlpha: 0 }),
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
            }
        });

        // 1. PHASE 1: Slide 1 - Figma intro texts grid
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 0)
          .to(path2, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 0)
          .to('.intro-grid .left-col, .intro-grid .right-col', { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power2.out" }, 0.2)
          
          // 2. PHASE 2: Transition to Slide 2 - Fullscreen phone vertical gallery (slides left on top of Slide 1)
          .to(galleryContainer, { xPercent: 0, duration: 1.5, ease: "power2.inOut" }, 2.0)
          .set(introTextsContainer, { opacity: 0 }, 3.5)

          // 3. PHASE 3: Portrait Video mosaic parallax scrolling
          .to('.col-0', { y: -800, ease: "none", duration: 3.5 }, 3.5)
          .to('.col-1', { y: 650, ease: "none", duration: 3.5 }, 3.5)
          .to('.col-2', { y: -1000, ease: "none", duration: 3.5 }, 3.5)
          .to('.col-3', { y: 550, ease: "none", duration: 3.5 }, 3.5)
          .to('.col-4', { y: -750, ease: "none", duration: 3.5 }, 3.5)

          // 4. PHASE 4: Transition to Slide 3 - Figma Intermediate Texts (slides left)
          .to(galleryContainer, { xPercent: -100, duration: 1.5, ease: "power2.inOut" }, 7.0)
          .to(intermediateContainer, { xPercent: 0, duration: 1.5, ease: "power2.inOut" }, 7.0)

          // 5. PHASE 5: Draw top intermediate curve & staggered text fade in (starts early at 7.2/7.4)
          .to(pathIntermediate, { strokeDashoffset: 0, opacity: 1, ease: "none", duration: 1.5 }, 7.2)
          .to('#intermediateWrapper .para, .gusto-dharma', { opacity: 1, x: 0, stagger: 0.15, duration: 1.2, ease: "power2.out" }, 7.4)
          // Bottom curve starts revealing at Y=1000 near end of Section 4, fading quickly to 100% opacity
          .to(pathIntermediate2, { opacity: 1, duration: 0.3, ease: "power1.out" }, 9.5)
          .to(pathIntermediate2, { strokeDashoffset: 0, ease: "none", duration: 2.2 }, 9.5)

          // 6. PHASE 6: Transition to Slide 4 - Fused Horizontal Scroll & Parallax
          .set(intermediateContainer, { zIndex: 10 }, 10.2)
          .to(fusedContainer, { xPercent: -50, duration: 1.5, ease: "power2.inOut" }, 10.2)
          .to('.inter-left-col > p', { xPercent: -50, duration: 1.5, ease: "power2.inOut" }, 10.2)
          .to('.gusto-block', { xPercent: -80, duration: 1.5, ease: "power2.inOut" }, 10.2)
          .to('.inter-right-col > p', { xPercent: -110, duration: 1.5, ease: "power2.inOut" }, 10.2)
          .fromTo(pastaTitle, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 10.2)
          // Animate PASTA and OLIMPICA almost together, staggered by 500ms
          .to(pastaWordChars, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.0, ease: "power3.out" }, 10.3)
          .to(olimpicaWordChars, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 1.0, ease: "power3.out" }, 10.8)

          // 7. PHASE 7: Transition to Slide 5 - Figma Cards Deck (left texts, right Swiper slider)
          .set(intermediateContainer, { zIndex: 5 }, 12.0)
          .to(intermediateContainer, { xPercent: -100, duration: 1.5, ease: "power2.inOut" }, 12.0)
          .to(swiperDeckContainer, { xPercent: 0, duration: 1.5, ease: "power2.inOut" }, 12.0)

          // 8. PHASE 8: Cinematic Card Expansion (one card grows to cover the screen)
          .to(textLeft, { xPercent: -150, opacity: 0, duration: 1.0, ease: "power2.in" }, 13.8)
          .to(cardContainer, { scale: 0.8, xPercent: -100, opacity: 0, duration: 1.2, ease: "power2.in" }, 13.8)
          .to(cinematicCard, { 
              opacity: 1, 
              scaleX: 5.5, 
              scaleY: 3.5, 
              rotate: 90, // Cinematic horizontal turn
              borderRadius: 0, 
              duration: 1.5, 
              ease: "power2.inOut" 
          }, 13.8)

          // 9. PHASE 9: Slide 6 - Restored D3 Curling Trend Graph drawn over the yellow background
          .to(chartContainer, { xPercent: 0, opacity: 1, duration: 0.1 }, 15.4)
          .to('#firstCircle', { r: 15, ease: "power2.out", duration: 0.1 }, 15.5)
          .to(d3Path, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 15.6)
          .to(d3Area, { width: "100vw", ease: "none", duration: 1.5 }, 15.6)
          .to(chartText, { opacity: 1, x: 0, ease: "power2.out", duration: 1.0 }, 15.6)
          .to('#lastCircle', { r: 15, ease: "power2.out", duration: 0.1 }, 16.9)

          // 10. PHASE 10: Bubble Zoom Exit (screen turns white) - Quick 0.6s exit zoom and 0.05s buffer to unpin immediately
          .to('#lastCircle', { r: "120vw", ease: "power2.in", duration: 0.6 }, 17.0)
          .to(chartText, { opacity: 0, y: -50, ease: "power2.out", duration: 0.5 }, 17.0)
          .to('.tick line', { attr: { y2: 0 }, ease: "power2.out", duration: 0.5 }, 17.0)

          // Tightened unpin buffer to complete transitions quickly
          .to({}, { duration: 0.05 }, 17.65);

        return () => {
            swiper.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });
</script>

<main id="section2" bind:this={section}>
    <!-- ========================================================== -->
    <!-- SLIDE 1: Figma Intro Grid side-by-side texts and curves     -->
    <!-- ========================================================== -->
    <div id="introTexts" class="slide-container" bind:this={introTextsContainer}>
        <div id="svgContainerPart1" class="svg-bg-layer">
            <svg class="deco-svg" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={path} d="M -300 200 C 100 100 200 400 350 -200" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
                <path bind:this={path2} d="M 1800 800 C 1500 700 1300 1000 1100 1200" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="intro-grid">
            <div class="left-col" bind:this={p1}>
                <p class="para">
                    Non c'è creator, atleta o turista a Milano Cortina che non abbia ripreso i piatti della cucina italiana. <br><br>
                    I feed sono stati invasi da atleti di ogni nazione intenti a scoprire pizza, pasta, parmigiano e dolci tipici, in un trionfo di tradizione e puro food porn.
                </p>
            </div>
            <div class="right-col" bind:this={p2Container}>
                <p class="p2-sub">Ogni pasto l'ha trasformato in un</p>
                <h1 class="p2-dharma">TREND DA <br> MILIONI DI <br> LIKE</h1>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 2: Fullscreen Yellow Parallax Video Gallery Mosaic    -->
    <!-- ========================================================== -->
    <div id="videoGalleryContainer" class="slide-container" bind:this={galleryContainer}>
        <div class="gallery-wrapper">
            {#each columns as col, colIdx}
                <div class="gallery-col col-{colIdx}">
                    {#each col as video}
                        <div class="video-card" style="height: {video.height}; aspect-ratio: 9/16;">
                            <video src={video.src} autoplay muted loop playsinline></video>
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- FUSED SLIDE 3 & 4: Horizontal Scroll Panel with Parallax    -->
    <!-- ========================================================== -->
    <div id="intermediateTextsContainer" class="slide-container" bind:this={intermediateContainer}>
        <div id="fusedContainer" bind:this={fusedContainer}>
            <!-- Shared SVG background inside fusedContainer (scrolls horizontally with it) -->
            <div id="svgContainerPart2" class="svg-bg-layer">
                <svg class="deco-svg" viewBox="0 0 2880 900" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- pathIntermediate: top curve (Section 4) -->
                    <path bind:this={pathIntermediate} d="M -500 60 C -200 60, 100 40, 300 80 C 500 120, 650 30, 850 60 C 1050 90, 1200 30, 1350 -100" stroke="var(--brand-cibo-500)" stroke-width="38" stroke-linecap="round"/>
                    <!-- pathIntermediate2: bottom curve starting in Section 4 and ending before Section 5 (exits bottom-right of Section 4) -->
                    <path bind:this={pathIntermediate2} d="M 950 1000 C 1050 780, 1150 720, 1250 760 C 1320 780, 1380 900, 1420 1000" stroke="var(--brand-cibo-500)" stroke-width="38" stroke-linecap="round"/>
                </svg>
            </div>

            <!-- Panel 1 (100vw): Section 4 Content -->
            <div id="intermediatePanel">
                <div id="intermediateWrapper" bind:this={intermediateParagraphs}>
                    <div class="inter-top-row">
                        <div class="inter-left-col">
                            <p class="para para-olympic">
                                Il cibo si è trasformato in un'esperienza <span class="highlight">non solo da assaggiare, ma da raccontare.</span> Gli atleti hanno filmato tutto, ogni boccone diventava una mini-recensione social.
                            </p>
                        </div>
                        <div class="inter-right-col">
                            <p class="para para-olympic">
                                Ma la vera <span class="highlight">mascotte gastronomica</span> di Milano Cortina è stata...
                            </p>
                        </div>
                    </div>
                    <div class="inter-bottom-row">
                        <div class="gusto-block">
                            <p class="para para-olympic" style="margin-bottom: 0;">
                                Le Olimpiadi non sono solo medaglie e rigore, ma anche condivisione, curiosità e
                            </p>
                            <h2 class="gusto-dharma">GUSTO</h2>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Panel 2 (100vw): Section 5 Content -->
            <div id="pastaPanel" bind:this={pastaContainer}>
                <h1 id="pastaTitle" bind:this={pastaTitle}>
                    <span class="pasta-line">PASTA</span>
                    <br>
                    <span class="pasta-line">OLIMPICA</span>
                </h1>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 5: Figma 2-Column Cards deck (left text, right Swiper)-->
    <!-- ========================================================== -->
    <div id="swiperDeckContainer" class="slide-container" bind:this={swiperDeckContainer}>
        <div id="deckWrapper">
            <!-- Left Side: normal styled text (not Dharma, not Yellow) -->
            <div id="leftColumn" bind:this={textLeft}>
                <h2 id="pastaSub">o "pasta a cinque cerchi"...</h2>
                <p id="pastaDesc">Lo strano formato di pasta, nato per queste Olimpiadi Invernali, ha conquistato atleti e turisti.</p>
            </div>

            <!-- Right Side: Card Deck Swiper on the right, no border outlines -->
            <div id="rightColumn">
                <div class="swiper" bind:this={cardContainer}>
                    <div class="swiper-wrapper">
                        <!-- Slide 1 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4" muted loop playsinline></video>
                            <div class="card-desc">Pasta taste test: gli atleti approvano il puro food porn!</div>
                        </div>

                        <!-- Slide 2 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" muted loop playsinline></video>
                            <div class="card-desc">Bolognese in villaggio: il piatto più cercato e amato.</div>
                        </div>

                        <!-- Slide 3 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4" muted loop playsinline></video>
                            <div class="card-desc">Tiramisù mania: la ricarica dolce preferita dai campioni.</div>
                        </div>

                        <!-- Slide 4 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4" muted loop playsinline></video>
                            <div class="card-desc">Pizza party: la tradizione italiana conquista tutti.</div>
                        </div>

                        <!-- Slide 5 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4" muted loop playsinline></video>
                            <div class="card-desc">Caffè espresso e colazione: l'energia prima delle gare.</div>
                        </div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </div>

        <!-- Floating cinematic yellow card executing the fly-out grow transition -->
        <div id="cinematicCard" bind:this={cinematicCard}></div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 6: Restored D3 Curling trend vector graph section    -->
    <!-- ========================================================== -->
    <div id="d3ChartContainer" class="slide-container" bind:this={chartContainer}>
        <div id="svgChartContainer">
            <svg id="chartLine" width="100vw" height="100vh" bind:this={svgElement}></svg>
        </div>

        <div id="chartText" bind:this={chartText}>
            <p id="chartParagraph">Il trend della pasta ha avuto picchi altissimi le prime settimane, per poi gradualmente attenuarsi in un entusiasmo a salti sporadici e ritorni improvvisi.</p>
        </div>
    </div>
</main>

<style>
    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: var(--neutral-50);
        visibility: hidden;
    }

    .slide-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    /* Background SVG Graphic layers */
    .svg-bg-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1; /* Below content */
        pointer-events: none;
    }

    .deco-svg {
        width: 100%;
        height: 100%;
    }

    /* Slide 1 Styles */
    #introTexts {
        z-index: 3;
        justify-content: center;
        background-color: var(--neutral-50);
    }

    .intro-grid {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        max-width: 1400px;
        margin: 0 auto;
        gap: 8rem;
    }

    .left-col {
        width: 48%;
        text-align: left;
    }

    .right-col {
        width: 48%;
        text-align: left;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .para {
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 2.1rem;
        line-height: 145%;
        margin: 0;
    }

    .p2-sub {
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 2.1rem;
        margin: 0 0 1rem 0;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: -0.05rem;
    }

    .p2-dharma {
        font-family: var(--font-family);
        color: var(--brand-cibo-500);
        font-size: 8.3rem;
        line-height: 0.85;
        font-weight: 900;
        margin: 0;
    }

    /* Slide 2 Styles - Fullscreen Yellow Parallax Video Gallery */
    #videoGalleryContainer {
        z-index: 4;
        background-color: var(--brand-cibo-500);
    }

    .gallery-wrapper {
        display: flex;
        flex-direction: row;
        gap: 40px;
        height: 100vh;
        width: 100vw;
        padding: 5vh 40px;
        box-sizing: border-box;
        align-items: flex-start;
        justify-content: center;
    }

    .gallery-col {
        display: flex;
        flex-direction: column;
        gap: 40px;
        width: calc(20% - 32px);
        flex-shrink: 0;
    }

    .col-0 { margin-top: 5vh; }
    .col-1 { margin-top: -30vh; }
    .col-2 { margin-top: 20vh; }
    .col-3 { margin-top: -20vh; }
    .col-4 { margin-top: 10vh; }

    .video-card {
        background: var(--neutral-900);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 10px 25px rgba(0,0,0,0.35);
        border: none !important; /* No borders allowed */
        outline: none !important;
        width: 100%;
    }

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Slide 3 & 4 Fused Horizontal Panel */
    #intermediateTextsContainer {
        z-index: 5;
        background-color: var(--neutral-50);
        justify-content: flex-start;
    }

    #fusedContainer {
        width: 200vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        z-index: 2;
    }

    #svgContainerPart2 {
        position: absolute;
        top: 0;
        left: 0;
        width: 200vw;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }

    #svgContainerPart2 svg {
        width: 100%;
        height: 100%;
    }

    #intermediatePanel {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        z-index: 10;
    }

    #pastaPanel {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex-shrink: 0;
        z-index: 10;
    }

    #intermediateWrapper {
        width: 85%;
        max-width: 1400px;
        z-index: 10;
        position: relative;
        padding-left: 6rem; /* Shift text safe from the top-left curve! */
        display: flex;
        flex-direction: column;
        gap: 6rem;
    }

    .inter-top-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12rem;
    }

    .inter-left-col {
        width: 46%;
    }

    .inter-right-col {
        width: 46%;
    }

    .inter-bottom-row {
        display: flex;
        justify-content: flex-start;
    }

    .gusto-block {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2.5rem;
    }

    .gusto-dharma {
        font-family: var(--font-family);
        font-size: 7.2rem; /* Adjusted slightly to avoid curve overlaps */
        font-weight: 900;
        color: var(--brand-cibo-500);
        line-height: 0.9;
        margin: 0;
    }

    .highlight {
        color: var(--brand-cibo-500);
        font-weight: 500;
    }

    .para-olympic {
        font-size: 1.9rem; /* Adjusted slightly to avoid curve overlaps */
        line-height: 145%;
    }

    :global(#pastaTitle .char) {
        display: inline-block;
        transform-origin: center bottom;
        will-change: transform, opacity;
    }

    .pasta-line {
        display: inline-block;
        overflow: hidden;
        vertical-align: bottom;
        padding-bottom: 0.15em; /* Padding for high letter bounds */
    }

    #pastaTitle {
        opacity: 0;
        color: var(--brand-cibo-500);
        font-family: var(--font-family);
        font-size: clamp(29rem, 22vw, 31.25rem); /* Matches Curling Mania size */
        font-weight: 900;
        line-height: 76%; /* Matches Curling Mania line-height */
        text-align: center;
        pointer-events: none;
        margin: 0;
        text-transform: uppercase;
    }

    #pastaTitle .pasta-line:first-of-type {
        position: relative;
        top: 4.5rem; /* Lowers PASTA to prevent top screen cutoff while keeping OLIMPICA height */
    }

    /* Slide 5: Figma 2-Column Cards deck */
    #swiperDeckContainer {
        z-index: 7;
        background-color: var(--neutral-50);
    }

    #deckWrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 90%;
        max-width: 1400px;
        margin: 0 auto;
        height: 100%;
        gap: 6rem;
        z-index: 10;
        position: relative;
    }

    #leftColumn {
        width: 45%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        text-align: left;
        gap: 1.5rem;
    }

    #pastaSub {
        font-family: var(--font-family-text);
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--neutral-900);
        margin: 0;
        line-height: 1.1;
        letter-spacing: -0.08rem;
    }

    #pastaDesc {
        font-family: var(--font-family-text);
        font-size: 1.6rem;
        font-weight: 300;
        color: var(--neutral-700);
        margin: 0;
        line-height: 140%;
    }

    #rightColumn {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .swiper {
        width: 400px;
        height: 711px;
        perspective: 1000px;
        transform-style: preserve-3d;
        pointer-events: auto !important;
        z-index: 5;
    }

    .swiper-slide {
        position: relative;
        border-radius: 20px;
        overflow: hidden;
        border: none !important;
        outline: none !important;
        box-shadow: 0 15px 35px rgba(0,0,0,0.25);
        background: var(--neutral-900);
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        border-radius: 20px;
        opacity: 0;
        transition: opacity 0.3s ease, background-color 0.3s ease;
        pointer-events: none;
    }

    .swiper-slide video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
    }

    .card-desc {
        position: absolute;
        bottom: 16px;
        left: 16px;
        right: 16px;
        background: rgba(0, 0, 0, 0.7);
        color: var(--neutral-50);
        padding: 10px 16px;
        border-radius: 10px;
        font-family: var(--font-family-text);
        font-size: 1.15rem;
        font-weight: 300;
        z-index: 5;
        line-height: 1.3;
    }

    .swiper-pagination {
        position: absolute;
        bottom: -8% !important;
    }

    :global(.swiper-pagination-bullet) {
        pointer-events: auto !important;
        transition: all 0.3s ease;
    }

    :global(.swiper-pagination-bullet-active) {
        background: var(--brand-cibo-500) !important;
        width: 18px !important;
        border-radius: 4px !important;
    }

    /* Cinematic card overlay flyout grow element */
    #cinematicCard {
        position: absolute;
        top: 15%;
        left: 60%;
        width: 400px;
        height: 711px;
        border-radius: 20px;
        background-color: var(--brand-cibo-500);
        pointer-events: none;
        opacity: 0;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
        transform-origin: center center;
        z-index: 100;
    }

    /* Slide 6: Restored Svelte D3 vector line curling graph - Transparent BG to see expanded card underneath */
    #d3ChartContainer {
        z-index: 8;
        background-color: transparent !important; /* Transparent background to show cinematic grow card */
        opacity: 0;
    }

    #svgChartContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    :global(.tick line) {
        stroke: rgba(255, 255, 255, 0.15) !important;
    }

    :global(.curlingLine) {
        fill: none;
        stroke: var(--neutral-50) !important;
        stroke-width: 14px;
    }

    :global(.curlingArea) {
        fill: rgba(255, 255, 255, 0.15) !important;
    }

    #chartText {
        position: absolute;
        top: 30%;
        left: 45%;
        width: 40%;
        z-index: 5;
        pointer-events: none;
    }

    #chartParagraph {
        font-size: 2.2rem;
        color: var(--neutral-50) !important;
        font-weight: 300;
        font-family: var(--font-family-text);
        line-height: 140%;
    }
</style>