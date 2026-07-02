<script>
	import { onMount, onDestroy } from 'svelte';
	import { init, cleanup } from '$lib/counter-app.js';
	import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
	import SplitType from 'split-type';
	import { goto } from '$app/navigation';
	import '$lib/styles/counter.css';

	let resizeObserver;
	let blueSplit;
	let redSplit;
	let videoObserver;

	gsap.registerPlugin(ScrollTrigger);

	function adjustPageHeight() {
		const selezCategorie = document.getElementById('Selezione-Categorie');
		if (selezCategorie) {
			let offsetTop = 0;
			let el = selezCategorie;
			while (el) {
				offsetTop += el.offsetTop;
				el = el.offsetParent;
			}
			
			// La pagina deve finire esattamente quando il carosello occupa tutto lo schermo
			const targetBodyHeight = offsetTop + window.innerHeight;
			document.body.style.minHeight = `${targetBodyHeight}px`;
		}
	}

	onMount(() => {
		init();
		
		// Esegui il calcolo iniziale e aggiungi il listener di resize
		setTimeout(adjustPageHeight, 100); // Piccolo delay per attendere il rendering di Svelte
		window.addEventListener('resize', adjustPageHeight);
		
		// Monitora le modifiche di dimensione della sezione scrollabile per ri-calcolare l'altezza
		const scrollableSection = document.getElementById('scrollable-content-section');
		if (scrollableSection) {
			resizeObserver = new ResizeObserver(() => {
				adjustPageHeight();
			});
			resizeObserver.observe(scrollableSection);
		}

		// --- ANIMAZIONI GSAP SCROLLTRIGGER ---
		gsap.registerPlugin(ScrollTrigger);

		// Slide 1 (Blue)
		const blueText = document.querySelector('#text-blue-slide .slide-subtitle');
		const blueCard = document.querySelector('.slide-blue .video-card-wrapper');
		if (blueText) {
			blueSplit = new SplitType(blueText, { types: "lines", tagName: "span" });
			const blueLines = blueSplit.lines;
			gsap.fromTo(blueLines,
				{ x: 300, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					stagger: 0.1,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#text-blue-slide",
						start: "top 85%",
						toggleActions: "play none none reverse"
					}
				}
			);
		}
		if (blueCard) {
			gsap.fromTo(blueCard,
				{ x: -150, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: ".slide-blue",
						start: "top 80%",
						toggleActions: "play none none reverse"
					}
				}
			);
		}

		// Animazione disegno linea ondulata blu
		const blueWavyPath = document.querySelector('.line-blue-slide path');
		if (blueWavyPath) {
			const length = blueWavyPath.getTotalLength();
			gsap.set(blueWavyPath, { strokeDasharray: length, strokeDashoffset: length });
			gsap.to(blueWavyPath, {
				strokeDashoffset: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".slide-blue",
					start: "top 95%",
					end: "top 15%",
					scrub: 0.1
				}
			});
		}

		// Slide 2 (Red)
		const redText = document.querySelector('#text-red-slide .slide-subtitle');
		const redCard = document.querySelector('.slide-red .video-card-wrapper');
		if (redText) {
			redSplit = new SplitType(redText, { types: "lines", tagName: "span" });
			const redLines = redSplit.lines;
			gsap.fromTo(redLines,
				{ x: 300, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					stagger: 0.1,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#text-red-slide",
						start: "top 85%",
						toggleActions: "play none none reverse"
					}
				}
			);
		}
		if (redCard) {
			gsap.fromTo(redCard,
				{ x: 150, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: ".slide-red",
						start: "top 80%",
						toggleActions: "play none none reverse"
					}
				}
			);
		}


		ScrollTrigger.create({
			trigger: document.body, // non #intro
			start: "top top",
			end: "max",             // fine reale dello scroll del documento
			onLeave: () => {
				goto('/Categorie');
			}
		});
		// Animazione disegno linea ondulata rossa
		const redWavyPath = document.querySelector('.line-red-slide path');
		if (redWavyPath) {
			const length = redWavyPath.getTotalLength();
			gsap.set(redWavyPath, { strokeDasharray: length, strokeDashoffset: -length });
			gsap.to(redWavyPath, {
				strokeDashoffset: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".slide-red",
					start: "top 95%",
					end: "top 15%",
					scrub: 0.1
				}
			});
		}

		// --- INTERSECTION OBSERVER PER CAROSELLO VIDEO ---
		const videoElements = document.querySelectorAll('.carousel-video');
		const observerOptions = {
			root: null,
			threshold: 0.5 // Attiva quando visibile almeno al 50%
		};

		videoObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const video = entry.target;
				if (entry.isIntersecting) {
					video.play().catch(err => {
						// Ignora errori da policy autoplay se non c'è interazione
						console.log("Autoplay interrotto o bloccato:", err);
					});
				} else {
					video.pause();
				}
			});
		}, observerOptions);

		videoElements.forEach(video => videoObserver.observe(video));
	});

	onDestroy(() => {
		cleanup();
		if (blueSplit) blueSplit.revert();
		if (redSplit) redSplit.revert();
		if (typeof window !== 'undefined' && window.gsap) {
			// fallback in case ScrollTrigger is registered globally
			ScrollTrigger.getAll().forEach(t => t.kill());
		} else {
			ScrollTrigger.getAll().forEach(t => t.kill());
		}
		if (typeof document !== 'undefined') {
			document.documentElement.style.backgroundColor = '';
			document.body.style.minHeight = '';
		}
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', adjustPageHeight);
		}
		if (videoObserver) {
			videoObserver.disconnect();
		}
	});
</script>

<svelte:head>
	<title>Scroll Counter | 22MLD</title>
	<meta name="description" content="Contatore interattivo legato direttamente allo scroll, con design grafico split-color da 0 a 22 miliardi." />
</svelte:head>

<main id="intro">
<!-- Mask Defs for Brush effect -->
<svg width="0" height="0" style="position: absolute; pointer-events: none;">
	<defs>
		<clipPath id="sfondo-clip">
			<path d="M0 32C0 14.3269 14.3269 0 32 0L1480 0C1497.6731 0 1512 14.3269 1512 32L1512 838C1512 855.6731 1497.6731 870 1480 870L32 870C14.3269 870 0 855.6731 0 838L0 32Z" />
		</clipPath>
		<mask id="brush-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1512" height="870">
			<rect width="1512" height="870" fill="black" />
			<g clip-path="url(#sfondo-clip)">
				<path id="mask-brush-path" d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213" transform="scale(1.15, 1.31)" stroke="white" stroke-width="400" stroke-linecap="round" stroke-linejoin="round" fill="none" />
			</g>
		</mask>
	</defs>
</svg>

<!-- Base Layer (Magenta Background) -->
<div class="viewport-layer layer-base">
</div>

<!-- Main Overlay Layout (Solid layer on top of background) -->
<div class="main-layout-container">
	<div class="column-left">
		<h2 class="section-title" id="card-title">VISUALIZZAZIONI</h2>
	</div>

	<div class="column-center">
		<div class="morph-card">
			<!-- SVG container for the morphing path -->
			<svg id="morph-svg" viewBox="0 0 609 378" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
				<path id="morph-path" d="M83.4264 31.2829C87.2475 17.6812 99.5363 8.19496 113.662 7.94264L558.038 0.00519967C575.234 -0.301956 589.597 13.0383 590.559 30.2101L608.13 343.844C609.175 362.495 594.089 378.072 575.414 377.625L31.2516 364.587C10.3741 364.087 -4.43754 344.047 1.21056 323.942L83.4264 31.2829Z" fill="#533EDC"/>
			</svg>

			<!-- Back text (placed after SVG to stack naturally on top of it) -->
			<div id="counter-display-back" class="counter-display">
				<span class="digits-span">0</span><span class="suffix-span"></span>
			</div>

			<!-- Dynamic text centered inside the morphing card (Slot Machine Reel) -->
			<div class="card-text-mask">
				<div class="numbers-reel" id="numbers-reel">
					<!-- Item 0 (Card 1) -->
					<div class="reel-item" data-index="0">
						<div class="number-wrapper">
							<span class="number-digits">22</span>
							<span class="number-suffix">MLD</span>
						</div>
					</div>
					<!-- Item 1 (Card 2) -->
					<div class="reel-item" data-index="1">
						<div class="number-wrapper">
							<span class="number-digits">1.0</span>
							<span class="number-suffix">MLD</span>
						</div>
					</div>
					<!-- Item 2 (Card 3) -->
					<div class="reel-item" data-index="2">
						<div class="number-wrapper">
							<span class="number-digits">27</span>
							<span class="number-suffix">MLN</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Final Screen Overlay (TU HAI VISTO QUESTI VIDEO?) -->
			<div class="final-screen" id="final-screen">
				<h1 class="final-title">
					<span class="line-mask"><span class="line-content">TU HAI VISTO</span></span>
					<span class="line-mask"><span class="line-content">QUESTI VIDEO?</span></span>
				</h1>
				
				<div class="final-cards-container">
					<div class="final-cards-track">
						{#each Array(30) as _, i}
							<div class="carousel-card-item">
								<video
									src="/assets/carousel_videos/video_{i + 1}.mp4"
									poster="/assets/carousel_videos/poster_{i + 1}.jpg"
									muted
									loop
									playsinline
									preload="none"
									class="carousel-video"
								></video>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Glare effect overlay -->
			<div class="card-glare"></div>
		</div>
	</div>

	<div class="column-right">
		<p class="description-text" id="card-description">
			Quasi tre volte l'intera popolazione mondiale. Un flusso ininterrotto di sguardi incollati ai video di queste Olimpiadi Invernali.
		</p>
	</div>
</div>

<!-- Scroll indicator (non-clickable down arrow + scroll text) -->
<div class="scroll-indicator" id="scroll-indicator">
	<span class="scroll-text">scroll</span>
	<svg class="scroll-arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M12 6v12M12 18l-5-5M12 18l5-5" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
	</svg>
</div>

<!-- Decorative Line 1 (prima_linea.svg shifted to X=0 and reversed) -->
<svg id="prima-linea" class="decor-line" viewBox="0 0 620 225" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M0 19.3828C0 19.3828 115.943 118.632 202.5 111.383C271.783 105.58 290.633 23.6943 360 28.3828C452.445 34.6312 521.5 141.883 606.5 203.883" stroke="#533EDC" stroke-width="51" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


<!-- Sezione Testuale Bianca Sottostante (Step 5) -->
<div class="scrollable-content-section" id="scrollable-content-section">
	<div class="content-wrapper">
		
		<!-- Slide 1: Blue -->
		<div class="video-slide slide-blue">
			<svg class="slide-wavy-line line-blue-slide" viewBox="0 0 965 624" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M33.3964 12.7461C33.3964 12.7461 -14.1036 94.7461 123.896 175.746C261.896 256.746 760.397 221.746 736.397 400.246C712.397 578.746 796.897 604.246 963.397 596.246" stroke="#533EDC" stroke-width="51" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			
			<div class="slide-content-left">
				<div class="video-card-wrapper">
					<img class="card-shadow-blue" src="/assets/svg_video/1_ombra.svg" alt="" />
					<img class="card-front-blue" src="/assets/svg_video/1_sopra.svg" alt="Video Olimpico" />
				</div>
			</div>
			
			<div class="slide-content-right">
				<div class="slide-text-container" id="text-blue-slide">
					<p class="slide-subtitle">
						<span class="highlight-blue">Un'Olimpiade iper-condivisa,</span> in cui il racconto social si è rivelato estremamente
						<span class="slide-title blue-text">DECENTRALIZZATO<br>DALLO SPORT</span>
					</p>
				</div>
			</div>
		</div>

		<!-- Slide 2: Red -->
		<div class="video-slide slide-red">
			<svg class="slide-wavy-line line-red-slide" viewBox="0 0 774 1096" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M107.399 1070.33C508.033 1065.51 778.02 932.824 744.998 809.825C711.975 686.826 399.837 707.41 330.314 606.609C260.791 505.808 504.222 328.962 423.047 178.295C339.754 23.6947 0.124064 25.5009 0.124064 25.5009" stroke="#DC3E41" stroke-width="51" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			
			<div class="slide-content-left">
				<div class="slide-text-container" id="text-red-slide">
					<p class="slide-subtitle">
						<span class="highlight-red">Persino chi non segue</span> queste discipline si è sentito chiamato in causa a
						<span class="slide-title red-text">RECENSIRE<br>QUESTO EVENTO</span>
					</p>
				</div>
			</div>
			
			<div class="slide-content-right">
				<div class="video-card-wrapper">
					<img class="card-shadow-red" src="/assets/svg_video/2_ombra.svg" alt="" />
					<img class="card-front-red" src="/assets/svg_video/2_sopra.svg" alt="Video Recensione" />
				</div>
			</div>
		</div>

	</div>

	<!-- Trend Selection Section (Carosello Categorie alla fine dello Scroll) -->
	<div class="trend-intro-section">
		<div style="width: 100%; padding: 0 10vw; box-sizing: border-box;">
			<div class="fine-card-wrapper">
				<img class="fine-card-bg" src="/assets/svg/fine.svg" alt="" />
				<img class="fine-card-text" src="/assets/svg/Tutti hanno interagito secondo trend prestabiliti.svg" alt="Tutti hanno interagito secondo trend prestabiliti" />
			</div>
		</div>
	</div>
	
	
</div>
</main>