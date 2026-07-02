<script>
    import { onMount, onDestroy } from "svelte";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SplitText from 'gsap/SplitText';

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let warning;
    let fillBar;
    let st; // riferimento allo scrollTrigger per pulizia
    let triangle;
    let EM;
    let Wtitle;
    let Wsubtitle;
    let svgBar;

    // --- LOGICA DI GATING (presa dal componente ScrollBackProgress) ---
    const TRIGGER_DELAY = 350; // ms di attesa prima che parta l'accumulo
    const FILL_RATE_WHEEL = 0.4;
    const FILL_RATE_TOUCH = 0.3;
    const DECAY_STEP = 6;
    const DECAY_INTERVAL = 16;
    const DECAY_TIMEOUT = 400;

    let fillProgress = 0; // 0 -> 100, stato "sorgente di verità" della barra
    let isPinned = false;  // true quando siamo dentro la sezione pinnata
    let unlocked = false;  // true quando la barra ha raggiunto il 100%

    let holdTimer = null;
    let holding = false;
    let delayPassed = false;
    let decayTimeout = null;
    let decayInterval = null;

    function startHold() {
        if (holding) return;
        holding = true;
        holdTimer = setTimeout(() => {
            delayPassed = true;
        }, TRIGGER_DELAY);
    }

    function cancelHold() {
        holding = false;
        delayPassed = false;
        clearTimeout(holdTimer);
    }

    function scheduleDecay() {
        clearTimeout(decayTimeout);
        decayTimeout = setTimeout(() => {
            startDecay();
            cancelHold();
        }, DECAY_TIMEOUT);
    }

    function startDecay() {
        clearInterval(decayInterval);
        decayInterval = setInterval(() => {
            fillProgress = Math.max(0, fillProgress - DECAY_STEP);
            setFillVisual(fillProgress);
            if (fillProgress <= 0) {
                clearInterval(decayInterval);
            }
        }, DECAY_INTERVAL);
    }

    function setFillVisual(value) {
        if (!fillBar) return;
        gsap.killTweensOf(fillBar);
        gsap.set(fillBar, { scaleX: value / 100 });
    }

    function accumulate(amount) {
        if (!delayPassed || unlocked) return;

        clearInterval(decayInterval); // stiamo riempiendo, niente decadimento
        fillProgress = Math.min(100, fillProgress + amount);
        setFillVisual(fillProgress);

        if (fillProgress >= 100 && !unlocked) {
            completeGate();
        }
    }

    function completeGate() {
        unlocked = true;
        cancelHold();
        clearTimeout(decayTimeout);
        clearInterval(decayInterval);

        // piccolo delay per far vedere la barra piena, poi si sblocca lo scroll
        setTimeout(() => {
            window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }, 200);
    }

    function handleWheel(e) {
        if (!isPinned || unlocked) return;

        // Blocchiamo solo lo scroll "in avanti" (verso il basso)
        if (e.deltaY > 0) {
            e.preventDefault();
            startHold();
            accumulate(Math.abs(e.deltaY) * FILL_RATE_WHEEL);
            scheduleDecay();
        }
    }

    let touchStartY = 0;
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
        if (!isPinned || unlocked) return;

        const deltaY = touchStartY - e.touches[0].clientY; // positivo = dito verso l'alto = scroll avanti

        if (deltaY > 0) {
            e.preventDefault();
            startHold();
            accumulate(deltaY * FILL_RATE_TOUCH);
            scheduleDecay();
            touchStartY = e.touches[0].clientY; // aggiorna per delta incrementali
        }
    }
    // --- FINE LOGICA DI GATING ---

    onMount(() => {
        const moveElements = (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            gsap.to(triangle, { duration: 1.2, rotateY: xPercent * 30, rotateX: -yPercent * 15, scale: 1, ease: "power2.out", overwrite: "auto" });
        };

        const splitTitle = new SplitText(Wtitle, { type: "lines", mask: "lines" });
        const splitSubtitle = new SplitText(Wsubtitle, { type: "lines", mask: "lines" });
        gsap.set(fillBar, { scaleX: 0, transformOrigin: "left center" });

        const triangleEnter = gsap.fromTo(triangle, { y: "110%" }, { y: "0%", duration: 1, ease: "elastic.out(0.5,0.4)", paused: true, });
        const EmEnter = gsap.fromTo(EM, { y: "110%" }, { y: "0%", duration: 1, ease: "elastic.out(0.5,0.4)", paused: true, delay: 0.2});
        const enterTitle = gsap.fromTo(splitTitle.lines, { y: "110%" }, { y: "0%", duration: 0.6, ease: "power2.out", paused: true, delay: 0.2});
        const enterSubtitle = gsap.fromTo(splitSubtitle.lines, { y: "110%" }, { y: "0%", duration: 0.5, ease: "power2.out", paused: true, delay: 0.3});
        const enterSvg = gsap.fromTo(svgBar, { y: "100%" }, { y: "0%", duration: 0.5, ease: "power2.out", paused: true, delay: 0.3});

        // Pin "puro": niente scrub, la sezione resta ferma finché non la sblocchiamo noi
        st = ScrollTrigger.create({
            trigger: warning,
            scroller: window,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: true,
            onEnter: () => {
                isPinned = true;
                triangleEnter.play(); EmEnter.play(); enterTitle.play(); enterSubtitle.play(); enterSvg.play();
            },
            onLeave: () => {
                isPinned = false;
                triangleEnter.reverse(); EmEnter.reverse(); enterTitle.reverse(); enterSubtitle.reverse(); enterSvg.reverse();
            },
            onEnterBack: () => {
                isPinned = true;
                triangleEnter.play(); EmEnter.play(); enterTitle.play(); enterSubtitle.play(); enterSvg.play();
            },
            onLeaveBack: () => {
                isPinned = false;
                triangleEnter.reverse(); EmEnter.reverse(); enterTitle.reverse(); enterSubtitle.reverse(); enterSvg.reverse();

                // Se l'utente torna indietro sopra la sezione, ri-armiamo il gate
                // (rimuovi queste 3 righe se preferisci che resti sbloccato per sempre)
                unlocked = false;
                fillProgress = 0;
                setFillVisual(0);
            },
        });

        window.addEventListener("mousemove", moveElements);
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener("mousemove", moveElements);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });

    onDestroy(() => {
        clearTimeout(holdTimer);
        clearTimeout(decayTimeout);
        clearInterval(decayInterval);
        if (st) st.kill();
    });
</script>


<main id="warning" bind:this={warning}>
    <div id="warningContent">
        <div id="triangle">
            <svg bind:this={triangle} id="warningTriangle" width="377" height="333" viewBox="0 0 377 333" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M164.738 13.5C175.131 -4.50002 201.111 -4.5 211.504 13.5L372.585 292.5C382.977 310.5 369.986 333 349.202 333H27.0403C6.25574 333 -6.73463 310.5 3.65768 292.5L164.738 13.5Z" fill="#DC3E41"/>
            </svg>

            <h1 id="EM" bind:this={EM}>!</h1>
        </div>
        <div id="warningText">
            <h3 id="warningTitle" bind:this={Wtitle}>Sei sicuro di voler continuare? </h3>
            <p id="warningSubtitle" bind:this={Wsubtitle}>La prossima parte è legata alle 4 card, guarda prima quelle per avere un esperienza completa, altrimenti continua a scrollare.</p>
        </div>
        <div id="warningProgress" >
            <svg bind:this={svgBar} width="17.375rem" height="2.3125rem">
                <rect y="50%" width="100%" height="30%" id="warningBar" rx="5"/>
                <rect bind:this={fillBar} y="50%" width="100%" height="30%" id="warningFill" rx="5"/>

            </svg>
        </div>
    </div>
</main>


<style>
    #warning{
        position: relative;
        width: 100dvw;
        height: 100dvh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--neutral-50);
        perspective: 1000px;
    }

    #warningContent{
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;

    }

    #triangle{
        position: relative;
        overflow: hidden;
    }

    #warningTriangle{
        position: relative;
       
    }

    #EM{
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18rem;
        color: var(--brand-villaggio-200);
        font-family: var(--font-family);
    }

    #warningText{
        position: relative;
        text-align: center;
        color: var(--brand-villaggio-500);
        width: 55.875rem;
        font-size: 1.625rem;
    }

    #warningProgress{
        overflow: hidden;
    }


    #warningBar{
        fill: var(--neutral-200);
        position: relative;
    }

    #warningFill{
        fill: var(--brand-villaggio-500);
        position: absolute;
        top: 0;
        transition: fill 0.2s ease;
    }
</style>