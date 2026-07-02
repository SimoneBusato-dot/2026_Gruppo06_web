<script>
    import gsap from "gsap";
    import { onMount, onDestroy } from "svelte";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import Swiper from "swiper/bundle";
    import "swiper/css/bundle";
    import * as d3 from 'd3';
    import SplitType from "split-type";
    import Comments from "../Comments.svelte";
    import { goto } from '$app/navigation';
    // =========================================================================
    // CONFIGURAZIONE SNAP E SCROLL - SEZIONE CUCINA ITALIANA (PER VSCODE)
    // Modifica questi valori per cambiare i punti di calamita (snapping) e i
    // range di scroll libero in questa sezione.
    // =========================================================================
    const totalD = 24.0; // Durata temporale logica della timeline GSAP
    const SECTION_SNAP_CONFIG = {
        // Punti di Snap per i Testi Iniziali (Slide 1)
        slide1Text1: 1.4 / totalD,   // Snap al primo testo ("Non c'è creator...")
        slide1Text2: 2.2 / totalD,   // Snap al secondo testo ("I feed sono stati...")
        slide1Text3: 3.05 / totalD,  // Snap al terzo testo ("Ogni pasto l'ha trasformato...")
        
        // Transizioni di scorrimento
        galleryTransition: 3.5 / totalD, // Inizio comparsa galleria verticale
        galleryScrollStart: 4.5 / totalD, // Inizio scroll libero galleria verticale
        intermediateTransition: 6.0 / totalD, // Transizione ai testi intermedi (Slide 3)

        // Punti di Snap per i Testi Intermedi (Slide 3)
        slide3Text1: 7.2 / totalD,   // Snap al quarto testo ("Il cibo si è...")
        slide3Text2: 8.0 / totalD,   // Snap al quinto testo ("Le Olimpiadi non...")
        slide3Text3: 8.9 / totalD,   // Snap al sesto testo ("Ma la vera mascotte...")

        // Nuovi punti di snap per gli step del carosello/grafici
        pastaOlimpicaSnap: 10.5 / totalD,  // Snap con PASTA OLIMPICA completamente a schermo e animata (Hold)
        swiperDeckSnap: 12.5 / totalD,     // Snap al carosello di card (Hold statico per consentire interazione)
        chartPeak1Snap: 15.3 / totalD,     // Snap al picco 1 del grafico con testo completato
        chartPeak2Snap: 16.2 / totalD,     // Snap al picco 2 del grafico con testo completato
        quoteSnap: 19.4 / totalD,          // Snap alla citazione (linea finita in alto a destra, prima dei commenti)

        // Altre transizioni di sezione
        deckTransition: 11.0 / totalD,     // Inizio transizione Swiper deck
        chartTransition: 14.6 / totalD,    // Inizio transizione grafico D3
        quoteTransition: 17.4 / totalD,    // Inizio transizione citazione grande
        commentsTransition: 19.9 / totalD, // Inizio transizione commenti
        redirectTransition: 21.9 / totalD, // Inizio contatore di caricamento finale

        // Range di Scroll Libero (senza calamita)
        freeScroll: {
            gallery: { start: 4.5 / totalD, end: 6.0 / totalD },
            swiper: { start: 12.0 / totalD, end: 13.5 / totalD },
            chart: { start: 14.7 / totalD, end: 17.2 / totalD },
            comments: { start: 19.9 / totalD, end: 21.9 / totalD }
        }
    };

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
    let chartPath;

    // Slide 1 elements
    let introText1;
    let introText2;
    let introText3;

    // Slide 3 elements
    let interText1;
    let interText2;
    let interText3;

    // SplitType lines arrays
    let intro1Lines, intro2Lines, intro3Lines;
    let inter1Lines, inter2Lines, inter3Lines;
    let pastaDescLines;
    let chartText1Lines, chartText2Lines;

    // Slide 4 elements
    let pastaTitle;

    // Slide 5 card deck elements
    let textLeft;
    let cardContainer;
    let cinematicCard;

    // Swiper single-slide lock variables
    let swiperInstance;

    const handleStartGesture = () => {
        if (swiperInstance) {
            swiperInstance.allowTouchMove = true;
        }
    };

    onDestroy(() => {
        if (cardContainer) {
            cardContainer.removeEventListener('mousedown', handleStartGesture, true);
            cardContainer.removeEventListener('touchstart', handleStartGesture, true);
        }
    });

    // Slide 7 Chart elements
    let chartText1;
    let chartText2;
    let chartClipRect;
    let chartFirstCircle;
    let chartLastCircle;

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

    // Generate 31 unique video configurations representing the vertical gallery mosaic
    // 1. 21 Intro Videos
    const introVideos = Array.from({ length: 21 }, (_, i) => {
        const id = i + 1;
        const heights = ["450px", "300px", "220px", "350px", "260px", "380px", "240px", "480px", "280px", "320px", "420px"];
        return {
            src: `/Cucina_Italiana/Video_introduzione/Sp_Intro${id}.mp4`,
            height: heights[i % heights.length]
        };
    });

    // 2. 10 Comment Videos (as unique additional items to prevent duplication)
    const commentVideos = Array.from({ length: 10 }, (_, i) => {
        const id = i + 1;
        const heights = ["350px", "270px", "400px", "310px", "250px", "440px", "290px", "330px", "410px", "380px"];
        return {
            src: `/Cucina_Italiana/Video_commenti/Commento${id}.mp4`,
            height: heights[i % heights.length]
        };
    });

    const allVideos = [...introVideos, ...commentVideos];

    const columns = [
        [...allVideos.slice(0, 6), ...allVideos.slice(6, 8)],
        [...allVideos.slice(6, 12), ...allVideos.slice(12, 14)],
        [...allVideos.slice(12, 18), ...allVideos.slice(18, 20)],
        [...allVideos.slice(18, 24), ...allVideos.slice(24, 26)],
        [...allVideos.slice(24, 31), ...allVideos.slice(0, 2)]
    ];

    onMount(async () => {
        let isSwipingSwiper = false;

        cardContainer.addEventListener('mousedown', handleStartGesture, true);
        cardContainer.addEventListener('touchstart', handleStartGesture, true);
        // ==========================================
        // D3.js Curling Trend Chart Initialization
        // ==========================================
        // Non-d3 static chart initialization

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

                    // Lock Swiper dragging in the current gesture instantly upon slide change
                    swiper.allowTouchMove = false;
                },
                touchStart(swiper) {
                    isSwipingSwiper = true;
                },
                touchEnd(swiper) {
                    isSwipingSwiper = false;
                }
            }
        };

        swiperInstance = new Swiper(cardContainer, swiperConfig);

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
        gsap.set(quotePath, { strokeDasharray: lenQuote, strokeDashoffset: lenQuote });
        gsap.set(commentsPath, { strokeDasharray: lenComments, strokeDashoffset: lenComments, x: 0 });
        gsap.set(redirectPath, { strokeDasharray: lenRedirect, strokeDashoffset: lenRedirect });
        gsap.set(progressCircle, { strokeDasharray: 188.5, strokeDashoffset: 188.5 });

        // Initialize states
        gsap.set([introText1, introText2, introText3], { opacity: 1, y: 0 });
        gsap.set(galleryContainer, { xPercent: 100 });
        gsap.set(intermediateContainer, { xPercent: 100 });
        gsap.set(fusedContainer, { xPercent: 0 });
        gsap.set(swiperDeckContainer, { xPercent: 100 });
        gsap.set(chartContainer, { xPercent: 100, opacity: 0 });
        gsap.set(quoteContainer, { xPercent: 0, opacity: 0 });
        gsap.set(commentsContainer, { xPercent: 0 });
        gsap.set(commentsLine, { yPercent: 0, opacity: 0, x: 0 });
        gsap.set(commentsVideoScroll, { x: "180%" });
        gsap.set(redirectContainer, { xPercent: 0 });
        gsap.set('.circular-progress-container', { opacity: 0, scale: 0.8 });
        gsap.set('.gallery-col', { y: 0 });
        gsap.set([interText1, interText2, interText3], { opacity: 1, y: 0 });

        // Split texts into lines
        const intro1Split = new SplitType(introText1.querySelector('.para'), { types: 'lines', tagName: 'span' });
        intro1Lines = intro1Split.lines;

        const intro2Split = new SplitType(introText2.querySelector('.para'), { types: 'lines', tagName: 'span' });
        intro2Lines = intro2Split.lines;

        const intro3Split = new SplitType(introText3, { types: 'lines', tagName: 'span' });
        intro3Lines = intro3Split.lines;

        const inter1Split = new SplitType(interText1.querySelector('.para'), { types: 'lines', tagName: 'span' });
        inter1Lines = inter1Split.lines;

        const inter2Split = new SplitType(interText2, { types: 'lines', tagName: 'span' });
        inter2Lines = inter2Split.lines;

        const inter3Split = new SplitType(interText3, { types: 'lines', tagName: 'span' });
        inter3Lines = inter3Split.lines;

        const pastaDescSplit = new SplitType(document.getElementById('pastaDesc'), { types: 'lines', tagName: 'span' });
        pastaDescLines = pastaDescSplit.lines;

        const chartText1Split = new SplitType(document.getElementById('chartParagraph'), { types: 'lines', tagName: 'span' });
        chartText1Lines = chartText1Split.lines;

        const chartText2Split = new SplitType(document.getElementById('chartParagraph2'), { types: 'lines', tagName: 'span' });
        chartText2Lines = chartText2Split.lines;

        gsap.set([intro1Lines, intro2Lines, intro3Lines, inter1Lines, inter2Lines, inter3Lines, pastaDescLines, chartText1Lines, chartText2Lines], { opacity: 0, x: 300 });

        // Split quote text into lines
        const quoteSplit = new SplitType(quoteTextElement, { types: 'lines', tagName: 'span' });
        const quoteTextLines = quoteSplit.lines;
        gsap.set(quoteTextLines, { opacity: 0, x: 300 });

        // Split redirect text into words
        const redirectSplit = new SplitType(redirectTextElement, { types: 'words', tagName: 'span' });
        const redirectTextWords = redirectSplit.words;
        gsap.set(redirectTextWords, { opacity: 0, y: 50 });

        // Comments perspective mousemove listener
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            // 1. Rotate the mosaic video cards (Slide 2)
            gsap.to('.video-card', {
                duration: 1.2,
                rotateY: xPercent * 15,
                rotateX: -yPercent * 15,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.01
            });

            // 2. Rotate the Swiper container card deck (Slide 5)
            if (cardContainer) {
                gsap.to(cardContainer, {
                    duration: 1.2,
                    rotateY: xPercent * 15,
                    rotateX: -yPercent * 7,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }

            // 3. Rotate the cinematic card (Slide 5 expansion)
            if (cinematicCard) {
                gsap.to(cinematicCard, {
                    duration: 1.2,
                    rotateY: xPercent * 15,
                    rotateX: -yPercent * 7,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }

            // 4. Rotate comments section video wrapper (Slide 8)
            gsap.to('#commentsVideoContainer .video-wrapper', {
                duration: 1.2,
                rotateY: xPercent * 15,
                rotateX: -yPercent * 15,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.01
            });

            // 5. Rotate comments section cards overlay (Slide 8)
            gsap.to('#commentsVideoContainer .comments', {
                duration: 1.2,
                rotateY: -xPercent * 30,
                rotateX: yPercent * 30,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.01
            });

            // 6. Rotate comments section background cards (Slide 8)
            gsap.to('#commentsVideoContainer .card-bg', {
                duration: 1.2,
                rotateY: xPercent * 15,
                rotateX: -yPercent * 15,
                ease: "power2.out",
                overwrite: "auto",
                stagger: 0.01
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
        gsap.set([chartText1, chartText2], { opacity: 1, y: 0 });
        gsap.set(chartClipRect, { attr: { width: 0 } });
        gsap.set([chartFirstCircle, chartLastCircle], { scale: 0, xPercent: -50, yPercent: -50, transformOrigin: "center center", opacity: 1 });
        gsap.set('.chart-area', { opacity: 1 });
        gsap.set('#svgChartContainer', { x: "0vw" });
        gsap.set('#chartTextWrapper', { x: "0vw" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=3200%", // Extended scroll height for slide 7, 8 and 9
                scrub: 1,
                pin: true,
                pinSpacing: true,
                snap: {
                    snapTo: (value) => {
                        // Snapping logic for redirect lock
                        const lockStart = 23.3 / totalD;
                        const commentsEnd = 21.9 / totalD;
                        if (value > commentsEnd && value < 0.999) {
                            return lockStart; // Snap to start of redirect slide (before loading begins)
                        }

                        const points = [
                            0,
                            SECTION_SNAP_CONFIG.slide1Text1,
                            SECTION_SNAP_CONFIG.slide1Text2,
                            SECTION_SNAP_CONFIG.slide1Text3,
                            SECTION_SNAP_CONFIG.galleryTransition,
                            SECTION_SNAP_CONFIG.galleryScrollStart,
                            SECTION_SNAP_CONFIG.intermediateTransition,
                            SECTION_SNAP_CONFIG.slide3Text1,
                            SECTION_SNAP_CONFIG.slide3Text2,
                            SECTION_SNAP_CONFIG.slide3Text3,
                            SECTION_SNAP_CONFIG.pastaOlimpicaSnap,
                            SECTION_SNAP_CONFIG.swiperDeckSnap,
                            SECTION_SNAP_CONFIG.chartPeak1Snap,
                            SECTION_SNAP_CONFIG.chartPeak2Snap,
                            SECTION_SNAP_CONFIG.quoteSnap,
                            SECTION_SNAP_CONFIG.commentsTransition,
                            SECTION_SNAP_CONFIG.redirectTransition,
                            1
                        ];

                        // Free scroll ranges:
                        // 1. Vertical video gallery
                        if (value > SECTION_SNAP_CONFIG.freeScroll.gallery.start && value < SECTION_SNAP_CONFIG.freeScroll.gallery.end) {
                            return value;
                        }

                        // 2. Swiper cards deck hold
                        if (value > SECTION_SNAP_CONFIG.freeScroll.swiper.start && value < SECTION_SNAP_CONFIG.freeScroll.swiper.end) {
                            return value;
                        }

                        // 3. D3 chart drawing animation (extending to end of hold)
                        if (value > SECTION_SNAP_CONFIG.freeScroll.chart.start && value < SECTION_SNAP_CONFIG.freeScroll.chart.end) {
                            return value;
                        }

                        // 4. Comments horizontal scrolling
                        if (value > SECTION_SNAP_CONFIG.freeScroll.comments.start && value < SECTION_SNAP_CONFIG.freeScroll.comments.end) {
                            return value;
                        }

                        // Otherwise snap unconditionally to closest point (calamita)
                        let closest = points[0];
                        let minDiff = Math.abs(value - closest);
                        for (let i = 1; i < points.length; i++) {
                            let diff = Math.abs(value - points[i]);
                            if (diff < minDiff) {
                                minDiff = diff;
                                closest = points[i];
                            }
                        }
                        return closest;
                    },
                    duration: { min: 0.2, max: 0.6 },
                    delay: 0.05,
                    ease: "power2.out"
                },
                onEnter: () => gsap.set(section, { autoAlpha: 1 }),
                onLeave: () => {
                    goto('/?from=trend', { noScroll: true });
                    console.log('onLeave triggered');
                },
                onEnterBack: () => gsap.set(section, { autoAlpha: 1 }),
                onLeaveBack: () => gsap.set(section, { autoAlpha: 0 }),
                onUpdate: (self) => {
                    const p = self.progress;
                    const totalD = 24.0;
                    const startP = 23.3 / totalD;

                    // Dynamically disable snapping in the comments range to preserve browser momentum
                    const commentsStart = 19.8 / totalD;
                    const commentsEnd = 22.0 / totalD;
                    if (p >= commentsStart && p <= commentsEnd) {
                        if (self.vars.snap) {
                            if (!self.originalSnapConfig) {
                                self.originalSnapConfig = self.vars.snap;
                            }
                            self.vars.snap = null;
                        }
                    } else {
                        if (!self.vars.snap && self.originalSnapConfig) {
                            self.vars.snap = self.originalSnapConfig;
                        }
                    }

                    // If we reached the end, redirect immediately
                    if (p >= 0.999) {
                        goto('/?from=trend', { noScroll: true });
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
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 2.0 }, 0)
          .to(path2, { strokeDashoffset: 0, ease: "none", duration: 2.0 }, 0.1)
          .fromTo(intro1Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" }, 1.0)
          .to(intro1Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.2, ease: "power2.in" }, 1.5)
          .fromTo(intro2Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" }, 1.8)
          .to(intro2Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.2, ease: "power2.in" }, 2.3)
          .fromTo(intro3Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.35, ease: "power2.out" }, 2.6)
          .to(intro3Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.25, ease: "power2.in" }, 3.25)
          
          // 2. PHASE 2: Transition to Slide 2 - Fullscreen phone vertical gallery (slides left on top of Slide 1)
          .to(galleryContainer, { xPercent: 0, duration: 1.0, ease: "power2.inOut" }, 3.5)
          .set(introTextsContainer, { opacity: 0 }, 4.5)

          // 3. PHASE 3: Portrait Video mosaic parallax scrolling
          .to('.col-0', { y: -800, ease: "none", duration: 1.5 }, 4.5)
          .to('.col-1', { y: 650, ease: "none", duration: 1.5 }, 4.5)
          .to('.col-2', { y: -1000, ease: "none", duration: 1.5 }, 4.5)
          .to('.col-3', { y: 550, ease: "none", duration: 1.5 }, 4.5)
          .to('.col-4', { y: -750, ease: "none", duration: 1.5 }, 4.5)

          // 4. PHASE 4: Transition to Slide 3 - Figma Intermediate Texts (slides left)
          .to(galleryContainer, { xPercent: -100, duration: 1.0, ease: "power2.inOut" }, 6.0)
          .to(intermediateContainer, { xPercent: 0, duration: 1.0, ease: "power2.inOut" }, 6.0)

          // 5. PHASE 5: Draw top intermediate curve & sequential text appearances
          // 5A: Draw curve and fade in Text 1 ("Il cibo...")
          .to(pathIntermediate, { strokeDashoffset: 0, opacity: 1, ease: "none", duration: 1.5 }, 6.0)
          .fromTo(inter1Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" }, 6.8)
          .to(inter1Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.2, ease: "power2.in" }, 7.3)
          .fromTo(inter2Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.3, ease: "power2.out" }, 7.6)
          .to(inter2Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.2, ease: "power2.in" }, 8.1)
          .fromTo(inter3Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.35, ease: "power2.out" }, 8.4)

          // Bottom curve starts revealing at Y=1000 near end of Section 4, fading quickly to 100% opacity
          .to(pathIntermediate2, { opacity: 1, duration: 0.2, ease: "power1.out" }, 8.5)
          .to(pathIntermediate2, { strokeDashoffset: 0, ease: "none", duration: 1.0 }, 8.5)

          // 6. PHASE 6: Transition to Slide 4 - Fused Horizontal Scroll & Parallax
          .set(intermediateContainer, { zIndex: 10 }, 9.0)
          .to(fusedContainer, { xPercent: -50, duration: 1.0, ease: "power2.inOut" }, 9.0)
          // Parallax movement as Panel 1 scrolls out to the left
          .to('.inter-right-col > p', { xPercent: -150, opacity: 0, duration: 1.0, ease: "power2.inOut" }, 9.0)
          .fromTo(pastaTitle, { xPercent: -60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.0, ease: "power2.inOut" }, 9.0)
          // Animate PASTA and OLIMPICA almost together, staggered by 400ms
          .to(pastaWordChars, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out" }, 9.1)
          .to(olimpicaWordChars, { yPercent: 0, opacity: 1, stagger: 0.04, duration: 0.6, ease: "power3.out" }, 9.5)
          // Hold PASTA OLIMPICA visible on screen (Hold snap)
          .to({}, { duration: 1.0 }, 10.0)

          // 7. PHASE 7: Transition to Slide 5 - Figma Cards Deck (left texts, right Swiper slider)
          .set(intermediateContainer, { zIndex: 5 }, 11.0)
          .to(intermediateContainer, { xPercent: -100, duration: 1.0, ease: "power2.inOut" }, 11.0)
          .to(swiperDeckContainer, { xPercent: 0, duration: 1.0, ease: "power2.inOut" }, 11.0)
          .fromTo(pastaDescLines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, ease: "power2.out" }, 11.3)
          // Swiper active/hold state (Hold snap)
          .to({}, { duration: 1.5 }, 12.0)

          // 8. PHASE 8: Cinematic Card Expansion (one card grows to cover the screen)
          .set(cinematicCard, { opacity: 0 }, 13.5)
          .to(cinematicCard, { opacity: 1, duration: 0.1, ease: "power1.out" }, 13.5)
          .to(cinematicCard, { 
              x: 260, 
              y: -30, 
              scale: 0.95, 
              rotate: -5, 
              duration: 0.3, 
              ease: "power2.out" 
          }, 13.5)
          .to(cinematicCard, { 
              x: 0, 
              y: 0, 
              scale: 1.0, 
              rotate: 0, 
              zIndex: 100, 
              duration: 0.3, 
              ease: "power2.out" 
          }, 13.8)
          .to(textLeft, { xPercent: -150, opacity: 0, duration: 0.3, ease: "power2.in" }, 14.0)
          .to(pastaDescLines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.3, ease: "power2.in" }, 14.0)
          .to(cardContainer, { scale: 0.8, xPercent: -100, opacity: 0, duration: 0.3, ease: "power2.in" }, 14.0)
          .to(cinematicCard, { 
              scaleX: 5.5, 
              scaleY: 3.5, 
              rotate: 90, // Cinematic horizontal turn
              borderRadius: 0, 
              duration: 0.6, 
              ease: "power2.inOut" 
          }, 14.1)

          // 9. PHASE 9: Slide 6 - New Chart Section
          .to(chartContainer, { xPercent: 0, opacity: 1, duration: 0.1 }, 14.6)
          // Phase 9A: Draw peaks (0.6 duration) and fade in first text
          .to(chartClipRect, { attr: { width: 540 }, ease: "none", duration: 0.6 }, 14.7)
          .to(chartFirstCircle, { scale: 1, duration: 0.2, ease: "back.out(1.7)" }, 14.7)
          .fromTo(chartText1Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }, 14.8)
          // Parallax horizontal scroll of graph
          .to('#svgChartContainer', { x: "0vw", ease: "none", duration: 0.6 }, 14.7)

          // Phase 9B: Fast transition to post-Olympic section (0.3 duration)
          .to(chartText1Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.3, ease: "power2.in" }, 15.3)
          .to('#svgChartContainer', { x: "-30vw", ease: "power2.inOut", duration: 0.3 }, 15.3)

          // Phase 9C: Draw second section (post-Olympic ripples) (0.4 duration) and fade in second text
          .to(chartClipRect, { attr: { width: 2035 }, ease: "none", duration: 0.4 }, 15.6)
          .to(chartLastCircle, { scale: 1, duration: 0.2, ease: "back.out(1.7)" }, 15.8)
          .fromTo(chartText2Lines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.4, ease: "power2.out" }, 15.7)
          // Parallax continued scroll slightly
          .to('#svgChartContainer', { x: "-35vw", ease: "none", duration: 0.4 }, 15.6)
          // Hold Peak 2 visible (Hold snap)
          .to({}, { duration: 1.1 }, 16.1)

          // Phase 9D: Zoom Circle Transition to Slide 7 (0.2 duration - extremely quick!)
          .to(chartText2Lines, { opacity: 0, x: -200, stagger: 0.05, duration: 0.3, ease: "power2.in" }, 17.2)
          .to([chartFirstCircle, '.chart-area', '.chart-main-line'], { opacity: 0, duration: 0.1 }, 17.2)
          .to(cinematicCard, { backgroundColor: "#ffffff", duration: 0.2, ease: "power2.inOut" }, 17.2)
          .to(chartLastCircle, { scale: 350, fill: "#ffffff", duration: 0.2, ease: "power2.in" }, 17.2)
          .set(chartContainer, { opacity: 0 }, 17.4)

          // 10. PHASE 10: Transition to Slide 7 (Quote section) with opacity cross-fade (no sliding)
          .to(chartContainer, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, 17.4)
          .to(cinematicCard, { opacity: 0, duration: 1.0, ease: "power2.inOut" }, 17.4)
          .to(quoteContainer, { opacity: 1, duration: 1.0, ease: "power2.inOut" }, 17.4)
          .to(quotePath, { strokeDashoffset: 0, duration: 1.0, ease: "none" }, 17.9)
          .fromTo(quoteTextLines, { opacity: 0, x: 300 }, { opacity: 1, x: 0, stagger: 0.05, ease: "power2.out", duration: 0.6 }, 17.9)
          // Hold Quote page visible (line exited top right, text fully read) (Hold snap)
          .to({}, { duration: 1.0 }, 18.9)

          // 11. PHASE 11: Transition to Slide 8 (Comments section) with quote retraction and comments line bottom entrance
          .to(quoteTextLines, { opacity: 0, x: -200, stagger: 0.05, ease: "power2.in", duration: 0.4 }, 19.9)
          .to(quotePath, { strokeDashoffset: -lenQuote, duration: 1.0, ease: "power2.inOut" }, 19.9)
          .to(commentsLine, { opacity: 1, duration: 1.0, ease: "power2.inOut" }, 19.9)
          .to(commentsLine, { x: "-60vw", ease: "none", duration: 2.0 }, 19.9)
          .to(commentsVideoScroll, { x: "-200%", ease: "none", duration: 2.0 }, 19.9)
          .to(commentsPath, { strokeDashoffset: 0, ease: "none", duration: 2.0 }, 19.9)

          // 12. PHASE 12: Transition to Slide 9 (Redirect section)
          .to(redirectPath, { strokeDashoffset: 0, ease: "none", duration: 1.0 }, 21.9)
          .to(commentsPath, { strokeDashoffset: -lenComments - 500, ease: "power2.inOut", duration: 0.8 }, 21.5)
          .set(commentsLine, { opacity: 0 }, 22.3)
          .to(redirectTextWords, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: "power2.out" }, 22.4)
          .fromTo('.circular-progress-container', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1.0, duration: 0.8, ease: "power2.out" }, 22.4)
          .to({}, { duration: 24.0 - 23.0 }, 23.0);

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
            </svg>
        </div>
        <div id="svgContainerPart1_right">
            <svg style="overflow: visible;" width="100%" height="100%" viewBox="0 0 588 394" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={path2} d="M-150 600 C-50 550 154.281 264.428 249.618 253.057C313.753 245.407 314.596 339.527 379.118 336.557C516.689 330.224 650 -100 750 -150" stroke="#DC953E" stroke-width="51" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="intro-wrapper-center">
            <div class="intro-text-block text-1" bind:this={introText1}>
                <p class="para">Non c'è creator, atleta o turista che non abbia ripreso i piatti della cucina italiana.</p>
            </div>
            <div class="intro-text-block text-2" bind:this={introText2}>
                <p class="para">I feed <span class="highlight">sono stati invasi</span> da atleti di ogni nazione intenti a scoprire pizza, pasta e dolci tipici, in un trionfo di tradizione e puro <span class="highlight">food porn.</span></p>
            </div>
            <div class="intro-text-block text-3" bind:this={introText3}>
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
                    <path bind:this={pathIntermediate2} d="M 950 1000 C 1050 780, 1150 720, 1250 760 C 1320 780, 1380 900, 1420 1000" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
                </svg>
            </div>

            <!-- Panel 1 (100vw): Section 4 Content -->
            <div id="intermediatePanel">
                <div id="intermediateSvgContainer">
                    <svg style="overflow: visible;" width="100%" viewBox="0 0 1085 237" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path bind:this={pathIntermediate} d="M-300 41 C-150 41, 188.61 290.8, 336.882 119.501 C434.382 6.85782, 618.882 193.001, 786.882 193.001 C927.882 193.001, 1062.88 -21, 1600 -21" stroke="#DC953E" stroke-width="51" stroke-linecap="round"/>
                    </svg>
                </div>
                <div id="intermediateWrapper" class="inter-wrapper-center">
                    <div class="inter-text-block inter-text-1" bind:this={interText1}>
                        <p class="para para-olympic">
                            Il cibo si è trasformato in un'esperienza <span class="highlight">non solo da assaggiare, ma da raccontare.</span> Gli atleti hanno filmato tutto, ogni boccone diventava una mini-recensione social.
                        </p>
                    </div>
                    <div class="inter-text-block inter-text-2" bind:this={interText2}>
                        <p class="para para-olympic" style="margin-bottom: 0.5rem;">
                            Le Olimpiadi non sono solo medaglie e rigore, ma anche condivisione, curiosità e
                        </p>
                        <h2 class="gusto-dharma">GUSTO</h2>
                    </div>
                    <div class="inter-text-block inter-text-3" bind:this={interText3}>
                        <p class="para para-olympic">
                            Ma la vera <span class="highlight">mascotte gastronomica</span> di Milano Cortina è stata...
                        </p>
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
                        </div>

                        <!-- Slide 2 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4" muted loop playsinline></video>
                        </div>

                        <!-- Slide 3 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4" muted loop playsinline></video>
                        </div>

                        <!-- Slide 4 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4" muted loop playsinline></video>
                        </div>

                        <!-- Slide 5 -->
                        <div class="swiper-slide">
                            <div class="overlay"></div>
                            <video src="/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4" muted loop playsinline></video>
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
            <svg id="chartLine" viewBox="0 0 2035 708.5" width="135vw" height="100%" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
                <defs>
                    <clipPath id="chartClip">
                        <rect bind:this={chartClipRect} x="0" y="0" width="0" height="708.5" />
                    </clipPath>
                </defs>
                <!-- Area underneath the curve -->
                <path class="chart-area" clip-path="url(#chartClip)" d="M32 289C18 289 0 219.5 0 219.5V708.5H2035V603.5C2035 603.5 1965 584.5 1927.5 584.5C1912.46 584.5 1908.94 601.75 1894 603.5C1882.13 604.89 1876.11 597.5 1864 597.5C1852.09 597.5 1844.41 603.5 1832.5 603.5C1804.38 603.5 1788.49 606.183 1760.5 603.5C1735.6 601.114 1722.48 593.112 1697.5 592C1689.31 591.635 1684.7 592 1676.5 592C1668.3 592 1663.68 591.445 1655.5 592C1635.89 593.33 1626.04 601.341 1606.5 603.5C1588.64 605.473 1577.09 596.614 1560.5 603.5C1549.93 607.887 1537 621 1537 621H1431C1431 621 1414 520.5 1401.5 520.5H1364C1349.5 520.5 1334.5 621 1334.5 621H792.5C792.5 621 774 491 760.5 491C747 491 728.5 621 728.5 621H525.5C525.5 621 497.5 470 460.5 476C444.136 478.654 446.078 505 429.5 505C369.5 505 349 2.6921e-10 329 0C314.5 2.67858e-10 315.5 225.5 297 225.5C271.059 225.5 286.441 170 260.5 170C225 170 234.5 358 198.5 358C168.747 358 129 -0.000357951 99.5 0C70 0.000357952 57 289 32 289Z" fill="#E3B166"/>
                <!-- Outline -->
                <path bind:this={chartPath} class="chart-main-line" transform="translate(0, -10)" clip-path="url(#chartClip)" d="M6.77588 226.5C6.77588 226.5 24.7759 296 38.7759 296C63.7759 296 76.7759 7.00036 106.276 7C135.776 6.99964 175.523 365 205.276 365C241.276 365 231.776 177 267.276 177C293.217 177 277.835 232.5 303.776 232.5C322.276 232.5 321.276 7 335.776 7C355.776 7 376.276 512 436.276 512C452.854 512 450.912 485.654 467.276 483C504.276 477 532.276 628 532.276 628H735.276C735.276 628 753.776 498 767.276 498C780.776 498 799.276 628 799.276 628H1341.28C1341.28 628 1356.28 527.5 1370.78 527.5C1385.42 527.5 1393.63 527.5 1408.28 527.5C1420.78 527.5 1437.78 628 1437.78 628H1543.78C1543.78 628 1556.71 614.887 1567.28 610.5C1583.87 603.614 1595.42 612.473 1613.28 610.5C1632.81 608.341 1642.67 600.33 1662.28 599C1670.46 598.445 1675.07 599 1683.28 599C1691.48 599 1696.08 598.635 1704.28 599C1729.26 600.113 1742.38 608.114 1767.28 610.5C1795.27 613.183 1811.16 610.5 1839.28 610.5C1851.19 610.5 1858.86 604.5 1870.78 604.5C1882.88 604.5 1888.91 611.89 1900.78 610.5C1915.71 608.75 1919.24 591.5 1934.28 591.5C1971.78 591.5 2032.78 610.5 2032.78 610.5" />
            </svg>
            <!-- HTML Dots to prevent ellipse distortion while stretching SVG -->
            <div bind:this={chartFirstCircle} class="chart-circle-html first-circle"></div>
            <div bind:this={chartLastCircle} class="chart-circle-html last-circle"></div>
        </div>

        <div id="chartTextWrapper">
            <div id="chartText1" class="chart-paragraph" bind:this={chartText1}>
                <p id="chartParagraph">Il trend della pasta ha avuto picchi altissimi le prime settimane, per poi gradualmente attenuarsi in un entusiasmo a salti sporadici e ritorni improvvisi.</p>
            </div>
            <div id="chartText2" class="chart-paragraph right" bind:this={chartText2}>
                <p id="chartParagraph2">Anche dopo lo spegnersi dei riflettori olimpici, il trend ha continuato a registrare inaspettati picchi di interesse online, dimostrando come la curiosità attorno a questo formato di pasta sia rimasta viva ben oltre la fine dei Giochi.</p>
            </div>
        </div>
    </div>

    <!-- ========================================================== -->
    <!-- SLIDE 7: Quote Section (Section 6)                         -->
    <!-- ========================================================== -->
    <div id="quoteContainer" class="slide-container" bind:this={quoteContainer}>
        <div id="quoteSvgContainer">
            <svg style="overflow: visible;" width="100%" viewBox="0 0 1559 244" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path bind:this={quotePath} d="M-200 -150 C 62.501 -248.146, 284.606 44.1801, 388.939 118.5 C 493.272 192.82, 775.44 278.503, 898.939 157.501 C 1022.44 36.4994, 1121.94 241, 1292.94 181.5 C 1463.94 122, 1650 -37, 1800 -37" stroke="#DC953E" stroke-width="51" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
        </div>

        <div id="quoteText">
            <p bind:this={quoteTextElement} id="quoteParagraph">Vederli godersi questi piatti con la nostra stessa voglia ha fatto <br><span class="highlight">crollare l'immagine</span> dell'atleta distante, freddo e rigoroso.</p>
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
                            <video src="/Cucina_Italiana/Video_commenti/Commento1.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="fuoriditest">Te la sogni ‘sta roba in Usa</Comments>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento2.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="Roxit">Italian strategy: fill the others with carbs so they get tired and we won 🤭</Comments>
                        </div>
                    </div>

                    <!-- Card 3 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento3.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="IituTiitu">Dude send me some tiramisu that looks so good☹️😔</Comments>
                        </div>
                    </div>

                    <!-- Card 4 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento4.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="userino5519">abbiamo fatto mangiare bene tutto il mondo 🤣🤣😂</Comments>
                        </div>
                    </div>

                    <!-- Card 5 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento5.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="dwnmov">olympians have turned into mukbangers</Comments>
                        </div>
                    </div>

                    <!-- Card 6 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento6.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="Lisa Langlois">WHAT ABOUT THE MUFFINS</Comments>
                        </div>
                    </div>

                    <!-- Card 7 -->
                    <div class="v">
                        <div class="video-wrapper">
                            <video src="/Cucina_Italiana/Video_commenti/Commento7.mp4" autoplay muted loop playsinline></video>
                            <div class="card-bg"></div>
                        </div>
                        <div class="comments">
                            <Comments variant="yellow" user="AlessiaIoana">qui non facciamo fare i menù ai nutrizionisti, ma alle nonne</Comments>
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
                <path bind:this={redirectPath} d="M400 -100 C 400 200, 600 300, 800 200 C 1000 100, 1200 400, 1400 300 C 1600 200, 1800 -100, 2000 -150" stroke="var(--brand-cibo-500)" stroke-width="51" stroke-linecap="round"/>
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
    /* Enforce uniform 51px screen line thickness on all decorative paths except chart */
    #svgContainerPart1 svg path,
    #svgContainerPart1_right svg path,
    #intermediateSvgContainer svg path,
    #svgContainerPart2 svg path,
    #quoteSvgContainer svg path,
    #commentsSvgContainer svg path,
    #redirectSvgContainer svg path {
        vector-effect: non-scaling-stroke;
        stroke-width: 51px !important;
    }

    main {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #ffffff;
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

    .intro-wrapper-center,
    .inter-wrapper-center {
        position: absolute;
        top: 50%;
        left: 35vw;
        transform: translateY(-50%);
        width: 60%;
        max-width: 800px;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        z-index: 10;
        pointer-events: none;
    }

    .intro-text-block,
    .inter-text-block {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        text-align: left;
        opacity: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .para {
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 26px;
        font-weight: 400;
        line-height: 145%;
        margin: 0;
    }

    .p2-sub {
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 26px;
        margin: 0 0 1rem 0;
        font-weight: 400;
        letter-spacing: -0.05rem;
    }

    .p2-dharma {
        font-family: var(--font-family);
        color: var(--brand-cibo-500);
        font-size: 128px;
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
        perspective: 1000px;
        transform-style: preserve-3d;
    }

    .gallery-col {
        display: flex;
        flex-direction: column;
        gap: 40px;
        width: calc(20% - 32px);
        flex-shrink: 0;
    }

    .col-0 { margin-top: -10vh; }
    .col-1 { margin-top: -100vh; }
    .col-2 { margin-top: -10vh; }
    .col-3 { margin-top: -90vh; }
    .col-4 { margin-top: -10vh; }

    .video-card {
        background: var(--neutral-900);
        border-radius: 12px;
        overflow: hidden;
        position: relative;
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

     #svgContainerPart1_right {
        position: absolute;
        bottom: -60px;
        right: -120px;
        width: 588px;
        height: 394px;
        z-index: 1;
        pointer-events: none;
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

    #intermediateSvgContainer {
        position: absolute;
        top: -160px;
        left: 0;
        width: 100vw;
        z-index: 1;
        pointer-events: none;
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



    .gusto-dharma {
        font-family: var(--font-family);
        font-size: 128px;
        font-weight: 900;
        color: var(--brand-cibo-500);
        line-height: 0.9;
        margin: 0;
    }

    .highlight {
        color: var(--brand-cibo-500) !important;
        font-weight: regular !important;
    }

    .para-olympic {
        font-family: var(--font-family-text);
        font-size: 26px;
        font-weight: 400;
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
        font-size: 26px;
        font-weight: 400;
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
        pointer-events: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
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
        transform-origin: center center;
        z-index: 100;
    }

    /* Slide 6: Restored Svelte D3 vector line curling graph - Transparent BG to see expanded card underneath */
    #d3ChartContainer {
        z-index: 8;
        background-color: transparent !important; /* Transparent background to show cinematic grow card */
        opacity: 0;
        pointer-events: none;
    }

    #svgChartContainer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 135vw;
        height: 65vh; /* Imposta altezza per allinearlo in basso e sollevarlo a sufficienza */
        z-index: 1;
        display: flex;
        align-items: flex-end;
        box-sizing: border-box;
    }

    #chartLine {
        width: 135vw;
        height: 100%;
        overflow: visible !important;
        padding-left: 0;   /* Parte vicino al bordo sinistro come nel grafico blu */
        padding-right: 0;  /* Finisce perfettamente al bordo destro */
        box-sizing: border-box;
    }

    .chart-main-line {
        stroke: #ffffff !important;
        stroke-width: 16px;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        transform-origin: center center;
    }

    #chartTextWrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        z-index: 5;
        pointer-events: none;
    }

    .chart-paragraph {
        position: absolute;
        top: 12vh;
        width: 28vw;
        font-size: 26px;
        color: var(--neutral-50) !important;
        font-weight: 400;
        font-family: var(--font-family-text);
        line-height: 140%;
        text-align: left;
    }

    #chartText1 {
        left: 60vw;
        right: auto;
        top: 24vh;
    }

    #chartText2 {
        left: 65vw;
        right: auto;
        top: 24vh;
    }

    .chart-area {
        fill: #E3B166 !important;
        opacity: 1;
        pointer-events: none;
    }

    .chart-circle-html {
        position: absolute;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: #ffffff !important;
        pointer-events: none;
        z-index: 10;
    }

    .first-circle {
        left: 0.33%;
        top: 30.55%;
    }

    .last-circle {
        left: 99.89%;
        top: 84.75%;
    }


    #quoteContainer {
        z-index: 9;
        justify-content: center;
        background-color: #ffffff;
        pointer-events: none;
    }

    #quoteSvgContainer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        z-index: 1;
        pointer-events: none;
    }

    #quoteSvgContainer svg {
        width: 100%;
        overflow: visible !important;
    }

    #quoteText {
        position: relative;
        z-index: 10;
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 26px;
        font-style: normal;
        font-weight: 400;
        line-height: 145%;
        letter-spacing: -0.06rem;
        width: 46rem;
        text-align: left;
        pointer-events: none;
    }

    #commentsContainer {
        z-index: 13;
        justify-content: center;
        background-color: transparent;
        pointer-events: none;
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
        gap: 15rem;
        height: 100%;
    }

    #commentsVideoContainer .v {
        position: relative;
        height: 50vh;
        width: calc(50vh * 9 / 16);
        flex-shrink: 0;
        perspective: 800px; 
    }

    #commentsVideoContainer .video-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        transform-style: preserve-3d;
    }

    #commentsVideoContainer .v:nth-child(1) .video-wrapper { transform: translateZ(0px) rotateY(30deg); }
    #commentsVideoContainer .v:nth-child(2) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) translateY(-30%); }
    #commentsVideoContainer .v:nth-child(3) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
    #commentsVideoContainer .v:nth-child(4) .video-wrapper { transform: translateZ(0px) rotateY(-30deg) translateY(-30%); }
    #commentsVideoContainer .v:nth-child(5) .video-wrapper { transform: translateZ(0px) rotateY(10deg); }
    #commentsVideoContainer .v:nth-child(6) .video-wrapper { transform: translateZ(0px) rotateY(-20deg) translateY(-30%); }
    #commentsVideoContainer .v:nth-child(7) .video-wrapper { transform: translateZ(0px) rotateY(30deg); }

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
    }

    #commentsVideoContainer .comments {
        position: absolute;
        top: 40%;
        left: 55%;
        width: 90%;
        z-index: 10;
        transform: translateZ(40px);
    }

    #commentsVideoContainer .v:nth-child(2) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }
    #commentsVideoContainer .v:nth-child(4) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }
    #commentsVideoContainer .v:nth-child(6) .comments { transform: translateZ(40px) translateY(-140%); left: -55%; }

    #commentsSvgContainer {
        position: absolute;
        bottom: -30%;
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
        pointer-events: none;
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