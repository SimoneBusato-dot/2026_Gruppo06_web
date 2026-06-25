<script>
    import gsap from "gsap";
    import { onMount } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";
    import * as d3 from 'd3';
    import SplitType from "split-type";
    import Comments from "../Comments.svelte";
    import { goto } from '$app/navigation';

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

    // Slide 7 Quote elements
    let quoteContainer;
    let quotePath;
    let quoteTextElement;

    // Slide 8 Comments elements
    let commentsContainer;
    let commentsCards;
    let commentsVideoScroll;
    let commentsLine;
    let commentsPath;

    // Slide 9 Redirect elements
    let redirectContainer;
    let redirectLine;
    let redirectPath;
    let redirectTextElement;
    let progressCircle;

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
        let isSwipingSwiper = false;
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
                touchStart(swiper) {
                    isSwipingSwiper = true;
                },
                touchEnd(swiper) {
                    isSwipingSwiper = false;
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
        const lenQuote = quotePath.getTotalLength();
        const lenComments = commentsPath.getTotalLength();
        const lenRedirect = redirectPath.getTotalLength();

        gsap.set(path, { strokeDasharray: len1, strokeDashoffset: len1 });
        gsap.set(path2, { strokeDasharray: len2, strokeDashoffset: len2 });
        gsap.set(pathIntermediate, { strokeDasharray: lenIntermediate, strokeDashoffset: lenIntermediate, opacity: 0 });
        gsap.set(pathIntermediate2, { strokeDasharray: lenIntermediate2, strokeDashoffset: lenIntermediate2, opacity: 0 });
        gsap.set(d3Path, { strokeDasharray: d3Length, strokeDashoffset: d3Length });
        gsap.set(quotePath, { strokeDasharray: lenQuote, strokeDashoffset: lenQuote });
        gsap.set(commentsPath, { strokeDasharray: lenComments, strokeDashoffset: lenComments, x: 0 });
        gsap.set(redirectPath, { strokeDasharray: lenRedirect, strokeDashoffset: lenRedirect });
        gsap.set(progressCircle, { strokeDasharray: 188.5, strokeDashoffset: 188.5 });

        // Initialize states
        gsap.set('.intro-grid .left-col, .intro-grid .right-col', { opacity: 0, y: 100 });
        gsap.set(galleryContainer, { xPercent: 100 });
        gsap.set(intermediateContainer, { xPercent: 100 });
        gsap.set(fusedContainer, { xPercent: 0 });
        gsap.set(swiperDeckContainer, { xPercent: 100 });
        gsap.set(chartContainer, { xPercent: 100, opacity: 0 });
        gsap.set(quoteContainer, { xPercent: 100, opacity: 0 });
        gsap.set(commentsContainer, { xPercent: 0 });
        gsap.set(commentsLine, { yPercent: 100 });
        gsap.set(commentsVideoScroll, { x: "180%" });
        gsap.set(redirectContainer, { xPercent: 0 });
        gsap.set('.circular-progress-container', { opacity: 0, scale: 0.8 });
        gsap.set('.gallery-col', { y: 0 });
        gsap.set('#intermediateWrapper .para, .gusto-dharma', { opacity: 0, x: 100 });

        // Split quote text into lines
        const quoteSplit = new SplitType(quoteTextElement, { types: 'lines', tagName: 'span' });
        const quoteTextLines = quoteSplit.lines;
        gsap.set(quoteTextLines, { opacity: 0, x: 200 });

        // Split redirect text into words
        const redirectSplit = new SplitType(redirectTextElement, { types: 'words', tagName: 'span' });
        const redirectTextWords = redirectSplit.words;
        gsap.set(redirectTextWords, { opacity: 0, y: 50 });

        // Comments perspective mousemove listener
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            if (commentsCards) {
                gsap.to(commentsCards, {
                    duration: 1.2,
                    rotateY: xPercent * 25,
                    rotateX: -yPercent * 25,
                    ease: "power2.out",
                    overwrite: "auto",
                    stagger: 0.04,
                });
            }

            gsap.to('#commentsContainer .comments', {
                duration: 1.2,
                rotateY: -xPercent * 35,
                rotateX: yPercent * 35,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.04,
            });

            gsap.to('#commentsContainer .card-bg', {
                duration: 1.2,
                rotateY: xPercent * 18,
                rotateX: -yPercent * 18,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.04,
            });
        };
        window.addEventListener("mousemove", moveElements);

        // Split PASTA OLIMPICA text into characters using SplitType to ensure natural kerning and layout
        new SplitType(pastaTitle, { types: 'chars', tagName: 'span' });

        gsap.set(pastaTitle, { xPercent: 0, opacity: 0 });
        const pastaTitleChars = pastaTitle.querySelectorAll('.char');
        const pastaWordChars = pastaTitle.querySelectorAll('.pasta-line:first-of-type .char');
        const olimpicaWordChars = pastaTitle.querySelectorAll('.pasta-line:last-of-type .char');
        gsap.set(pastaTitleChars, { yPercent: 100, opacity: 0 });
        gsap.set(textLeft, { xPercent: 0, opacity: 1 });
        gsap.set(cardContainer, { scale: 1.0, opacity: 1, y: 0 });
        gsap.set(cinematicCard, { scale: 0.8, opacity: 0, rotate: -15, x: 40, y: 10, borderRadius: 20, zIndex: 1 });
        gsap.set(chartText, { opacity: 0, x: 200 });
        gsap.set('#firstCircle', { r: 0 });
        gsap.set('#lastCircle', { r: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=2600%", // Extended scroll height for slide 7, 8 and 9
                scrub: 1,
                pin: true,
                pinSpacing: true,
                snap: {
                    snapTo: (value) => {
                        // Snapping logic for redirect lock (from 28.0 to 40.0)
                        const lockStart = 28.0 / 40.0;
                        if (value >= lockStart && value < 1.0) {
                            if (value < 39.8 / 40.0) {
                                return lockStart; // Snap back to start of redirect slide
                            } else {
                                return 1.0; // Snap to homepage redirect
                            }
                        }

                        const points = [
                            0,
                            2.0 / 40.0,
                            3.5 / 40.0,
                            7.0 / 40.0,
                            8.5 / 40.0,
                            10.2 / 40.0,
                            12.0 / 40.0,
                            13.8 / 40.0,
                            15.4 / 40.0,
                            17.5 / 40.0,
                            19.0 / 40.0,
                            20.5 / 40.0,
                            22.0 / 40.0,
                            24.0 / 40.0,
                            25.5 / 40.0,
                            27.0 / 40.0,
                            28.0 / 40.0,
                            1
                        ];

                        // Free scroll ranges:
                        // 1. Vertical video gallery: from 3.5 to 7.0 timeline progress
                        const galleryStart = 3.5 / 40.0;
                        const galleryEnd = 7.0 / 40.0;
                        if (value > galleryStart && value < galleryEnd) {
                            return value; // Return current position (no snap)
                        }

                        // 2. D3 chart drawing animation: from 15.4 to 17.0 timeline progress
                        const chartStart = 15.4 / 40.0;
                        const chartEnd = 17.0 / 40.0;
                        if (value > chartStart && value < chartEnd) {
                            return value; // Return current position (no snap)
                        }

                        // 3. Comments horizontal scrolling animation: from 22.0 to 25.5 progress
                        const commentsScrollStart = 22.0 / 40.0;
                        const commentsScrollEnd = 25.5 / 40.0;
                        if (value > commentsScrollStart && value < commentsScrollEnd) {
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
                    duration: { min: 0.1, max: 0.2 },
                    delay: 0.1,
                    ease: "power3.out"
                },
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => {
                    gsap.set(section, { autoAlpha: 0 });
                    goto('/');
                    console.log('onLeave triggered');
                },
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {
                    const p = self.progress;
                    const startP = 28.0 / 40.0;

                    // If we reached the end, redirect immediately
                    if (p >= 0.999) {
                        gsap.set(section, { autoAlpha: 0 });
                        goto('/');
                        return;
                    }

                    if (p >= startP) {
                        // User is scrolling to fill the progress circle
                        const f = Math.max(0, Math.min(1, (p - startP) / (1 - startP)));
                        const offset = 188.5 * (1 - f);
                        if (progressCircle) {
                            progressCircle.style.strokeDashoffset = offset;
                        }
                    } else {
                        if (progressCircle) {
                            progressCircle.style.strokeDashoffset = 188.5;
                        }
                    }
                }
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
          .set(cinematicCard, { opacity: 0 }, 13.8)
          .to(cinematicCard, { opacity: 1, duration: 0.15, ease: "power1.out" }, 13.8)
          .to(cinematicCard, { 
              x: 260, 
              y: -30, 
              scale: 0.95, 
              rotate: -5, 
              duration: 0.4, 
              ease: "power2.out" 
          }, 13.8)
          .to(cinematicCard, { 
              x: 0, 
              y: 0, 
              scale: 1.0, 
              rotate: 0, 
              zIndex: 100, 
              duration: 0.4, 
              ease: "power2.out" 
          }, 14.2)
          .to(textLeft, { xPercent: -150, opacity: 0, duration: 0.4, ease: "power2.in" }, 14.5)
          .to(cardContainer, { scale: 0.8, xPercent: -100, opacity: 0, duration: 0.4, ease: "power2.in" }, 14.5)
          .to(cinematicCard, { 
              scaleX: 5.5, 
              scaleY: 3.5, 
              rotate: 90, // Cinematic horizontal turn
              borderRadius: 0, 
              duration: 0.8, 
              ease: "power2.inOut" 
          }, 14.6)

          // 9. PHASE 9: Slide 6 - Restored D3 Curling Trend Graph drawn over the yellow background
          .to(chartContainer, { xPercent: 0, opacity: 1, duration: 0.1 }, 15.4)
          .to('#firstCircle', { r: 15, ease: "power2.out", duration: 0.1 }, 15.5)
          .to(d3Path, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 15.6)
          .to(d3Area, { width: "100vw", ease: "none", duration: 1.5 }, 15.6)
          .to(chartText, { opacity: 1, x: 0, ease: "power2.out", duration: 1.0 }, 15.6)
          .to('#lastCircle', { r: 15, ease: "power2.out", duration: 0.1 }, 16.9)

          // 10. PHASE 10: Transition to Slide 7 (Quote section) with opacity cross-fade
          .to(chartContainer, { xPercent: -100, opacity: 0, duration: 1.5, ease: "power2.inOut" }, 17.5)
          .to(cinematicCard, { xPercent: -150, opacity: 0, duration: 1.5, ease: "power2.inOut" }, 17.5)
          .to(quoteContainer, { xPercent: 0, opacity: 1, duration: 1.5, ease: "power2.inOut" }, 17.5)
          .to(quotePath, { strokeDashoffset: 0, duration: 1.5, ease: "none" }, 17.5)
          .to(quoteTextLines, { opacity: 1, x: 0, stagger: 0.1, ease: "power2.out", duration: 1.0 }, 18.0)

          // 11. PHASE 11: Transition to Slide 8 (Comments section) with quote retraction and comments line bottom entrance
          .to(quoteTextLines, { opacity: 0, stagger: 0.05, ease: "power2.in", duration: 0.8 }, 20.5)
          .to(quotePath, { strokeDashoffset: -lenQuote, duration: 1.5, ease: "power2.inOut" }, 20.5)
          .to(commentsLine, { yPercent: 0, duration: 1.5, ease: "power2.inOut" }, 20.5)
          .to(commentsVideoScroll, { x: "-200%", ease: "none", duration: 5.0 }, 20.5)
          .to(commentsPath, { strokeDashoffset: 0, ease: "none", duration: 5.0, x: "-60%" }, 20.5)
          .to(commentsPath, { strokeDashoffset: -lenComments, ease: "none", duration: 1.5 }, 24.0)

          // 12. PHASE 12: Transition to Slide 9 (Redirect section)
          .to(redirectPath, { strokeDashoffset: 0, ease: "none", duration: 1.5 }, 25.5)
          .to(redirectTextWords, { opacity: 1, y: 0, stagger: 0.1, duration: 1.0, ease: "power2.out" }, 27.0)
          .fromTo('.circular-progress-container', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out" }, 27.0)
          .to({}, { duration: 12.0 }, 28.0);

        const preventDefaultScroll = (e) => {
            if (isSwipingSwiper) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('wheel', preventDefaultScroll, { passive: false });
        window.addEventListener('touchmove', preventDefaultScroll, { passive: false });

        return () => {
            swiper.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
            window.removeEventListener('wheel', preventDefaultScroll);
            window.removeEventListener('touchmove', preventDefaultScroll);
            window.removeEventListener("mousemove", moveElements);
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

    <!-- ========================================================== -->
    <!-- SLIDE 7: Quote Section (Section 6)                         -->
    <!-- ========================================================== -->
    <div id="quoteContainer" class="slide-container" bind:this={quoteContainer}>
        <div id="quoteSvgContainer">
            <svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={quotePath} d="M -100 320 C 200 320, 250 120, 450 120 C 650 120, 800 180, 950 180 C 1100 180, 1150 -50, 1250 -100" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
            </svg>
        </div>

        <div id="quoteText">
            <p bind:this={quoteTextElement} id="quoteParagraph">Vederli godersi questi piatti con la nostra stessa voglia ha fatto <span class="highlight">crollare l'immagine</span> dell'atleta distante, freddo e rigoroso.</p>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 8: Comments Section (Section 7)                      -->
    <!-- ========================================================== -->
    <div id="commentsContainer" class="slide-container" bind:this={commentsContainer}>
        <div id="commentsPerspective" bind:this={commentsCards}>
            <div id="commentsContent">
                <div id="commentsVideoContainer" bind:this={commentsVideoScroll}>
                    <!-- Card 1 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">Te la sogni 'sta roba in Usa</Comments>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">sono stati creativi in cucina 🇮🇹👏🏻</Comments>
                        </div>
                    </div>

                    <!-- Card 3 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">Dude send me some tiramisu that looks so good 🤤😭</Comments>
                        </div>
                    </div>

                    <!-- Card 4 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">nessuno ha notato che la pasta è a 5 cerchi</Comments>
                        </div>
                    </div>

                    <!-- Card 5 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">olympic muffins, olympic tiramisu, and now olympic pasta??</Comments>
                        </div>
                    </div>

                    <!-- Card 6 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">as an italian i want that</Comments>
                        </div>
                    </div>

                    <!-- Card 7 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow">qui non facciamo fare i menu ai nutrizionisti, ma alle nonne</Comments>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="commentsSvgContainer" bind:this={commentsLine}>
            <svg width="200%" height="100%" viewBox="0 0 2374 219" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={commentsPath} d="M25.1792 395.969C46.2211 264.612 269.241 39.0184 401.679 26.4684C549.667 12.4449 663.179 154.468 758.679 229.969C935.179 369.506 809.673 322.658 974.179 254.469C1104.49 200.455 1153.99 150.045 1284.68 96.9687C1489.35 13.847 1657.03 392.953 1857.18 299.469C1949.36 256.416 1967.82 159.328 2077.18 140.969C2145.68 129.469 2200.82 151.427 2239.68 224.469C2278.87 298.144 2324.47 370.376 2348.68 450.238" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 9: Redirect Section (Section 8)                      -->
    <!-- ========================================================== -->
    <div id="redirectContainer" class="slide-container" bind:this={redirectContainer}>
        <div id="redirectSvgContainer" bind:this={redirectLine}>
            <svg viewBox="0 0 1920 1080" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={redirectPath} d="M400 -100 C 400 200, 600 300, 800 200 C 1000 100, 1200 400, 1400 300 C 1600 200, 1800 600, 2100 500" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
            </svg>
        </div>

        <div id="redirectText">
            <p id="redirectParagraph" bind:this={redirectTextElement}>
                Continua a scrollare per tornare alle card
            </p>
        </div>

        <div class="circular-progress-container">
            <svg class="progress-ring" width="80" height="80">
                <circle class="progress-ring__background" stroke="rgba(0,0,0,0.1)" stroke-width="6" fill="transparent" r="30" cx="40" cy="40" />
                <circle class="progress-ring__circle" bind:this={progressCircle} stroke="var(--brand-cibo-500)" stroke-width="6" fill="transparent" r="30" cx="40" cy="40" />
            </svg>
            <svg class="arrow-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="var(--brand-cibo-500)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
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

    #quoteContainer {
        z-index: 9;
        justify-content: center;
        background-color: var(--neutral-50);
    }

    #quoteSvgContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
    }

    #quoteSvgContainer svg {
        width: 100%;
        height: 100%;
        overflow: visible !important;
    }

    #quoteText {
        position: relative;
        z-index: 10;
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 24pt;
        font-style: normal;
        font-weight: 400;
        line-height: 145%;
        letter-spacing: -0.06rem;
        width: 72.625rem;
        pointer-events: none;
    }

    #commentsContainer {
        z-index: 11;
        justify-content: center;
        background-color: transparent;
    }

    #commentsPerspective, #commentsContent {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
    }

    #commentsPerspective {
        perspective: 1000px;
    }

    #commentsVideoContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 16rem;
        height: 100%;
    }

    #commentsVideoContainer .v {
        position: relative;
        height: 52vh;
        width: calc(52vh * 9 / 16);
        flex-shrink: 0;
        perspective: 800px; 
    }

    #commentsVideoContainer .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
    }

    #commentsVideoContainer .v:nth-child(1) .video-wrapper { transform: translateZ(0px) rotateY(-25deg) translateY(8%); }
    #commentsVideoContainer .v:nth-child(2) .video-wrapper { transform: translateZ(0px) rotateY(20deg) translateY(-18%); }
    #commentsVideoContainer .v:nth-child(3) .video-wrapper { transform: translateZ(0px) rotateY(-15deg) translateY(22%); }
    #commentsVideoContainer .v:nth-child(4) .video-wrapper { transform: translateZ(0px) rotateY(25deg) translateY(-22%); }
    #commentsVideoContainer .v:nth-child(5) .video-wrapper { transform: translateZ(0px) rotateY(-10deg) translateY(18%); }
    #commentsVideoContainer .v:nth-child(6) .video-wrapper { transform: translateZ(0px) rotateY(22deg) translateY(-12%); }
    #commentsVideoContainer .v:nth-child(7) .video-wrapper { transform: translateZ(0px) rotateY(-25deg) translateY(4%); }

    #commentsVideoContainer .card-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: var(--brand-cibo-400); /* Zafferano Yellow */
        border-radius: 12px;
        z-index: -1;
        transform-style: preserve-3d;
    }

    #commentsVideoContainer .v:nth-child(1) .card-bg { transform: translateZ(-70px) rotateZ(3deg); top: 8%; left: 8%; }
    #commentsVideoContainer .v:nth-child(2) .card-bg { transform: translateZ(-70px) rotateZ(-4deg); top: 6%; left: -10%; }
    #commentsVideoContainer .v:nth-child(3) .card-bg { transform: translateZ(-70px) rotateZ(2deg); top: 8%; left: 6%; }
    #commentsVideoContainer .v:nth-child(4) .card-bg { transform: translateZ(-70px) rotateZ(-3deg); top: 8%; left: -8%; }
    #commentsVideoContainer .v:nth-child(5) .card-bg { transform: translateZ(-70px) rotateZ(4deg); top: 5%; left: 10%; }
    #commentsVideoContainer .v:nth-child(6) .card-bg { transform: translateZ(-70px) rotateZ(-2deg); top: 8%; left: -12%; }
    #commentsVideoContainer .v:nth-child(7) .card-bg { transform: translateZ(-70px) rotateZ(3deg); top: 6%; left: 8%; }

    #commentsVideoContainer video {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        object-fit: cover;
        position: relative;
        z-index: 2;
        transform: translateZ(20px); 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    }

    #commentsVideoContainer .comments {
        position: absolute;
        width: 90%;
        z-index: 10;
        transform: translateZ(40px);
    }

    #commentsVideoContainer .v:nth-child(1) .comments { top: 35%; left: 55%; }
    #commentsVideoContainer .v:nth-child(2) .comments { transform: translateZ(40px) translateY(-145%); left: -60%; }
    #commentsVideoContainer .v:nth-child(3) .comments { top: 22%; left: 55%; }
    #commentsVideoContainer .v:nth-child(4) .comments { transform: translateZ(40px) translateY(-135%); left: -60%; }
    #commentsVideoContainer .v:nth-child(5) .comments { top: 42%; left: 55%; }
    #commentsVideoContainer .v:nth-child(6) .comments { transform: translateZ(40px) translateY(-150%); left: -60%; }
    #commentsVideoContainer .v:nth-child(7) .comments { top: 50%; left: 55%; }

    #commentsSvgContainer {
        position: absolute;
        bottom: -40%;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    #commentsSvgContainer svg {
        overflow: visible !important;
    }

    #redirectContainer {
        z-index: 12;
        justify-content: center;
        background-color: transparent;
    }

    #redirectSvgContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    #redirectSvgContainer svg {
        overflow: visible !important;
    }

    #redirectText {
        position: relative;
        z-index: 1;
        font-size: 1.625rem;
        color: var(--neutral-900);
        font-family: var(--font-family-text);
    }

    .circular-progress-container {
        position: absolute;
        bottom: 15%;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        z-index: 10;
    }

    .progress-ring {
        transform: rotate(-90deg);
        transform-origin: center;
    }

    .progress-ring__circle {
        transition: stroke-dashoffset 0.05s linear;
    }

    .arrow-icon {
        position: absolute;
        animation: bounce-cibo 2s infinite;
        pointer-events: none;
    }

    @keyframes bounce-cibo {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(6px);
        }
        60% {
            transform: translateY(3px);
        }
    }
</style>