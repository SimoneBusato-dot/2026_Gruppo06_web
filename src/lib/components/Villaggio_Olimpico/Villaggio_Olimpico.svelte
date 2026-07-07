<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { browser } from "$app/environment";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import VillaggioOlimpicoHero from "./Villaggio_Olimpico_Hero.svelte";
    import VillaggioOlimpicoSection2 from "./Villaggio_Olimpico_Section2.svelte";
    import VillaggioOlimpicoSection3 from "./Villaggio_Olimpico_Section3.svelte";
    import VillaggioOlimpicoSection4 from "./Villaggio_Olimpico_Section4.svelte";
    import VillaggioOlimpicoSection5 from "./Villaggio_Olimpico_Section5.svelte";
    import VillaggioOlimpicoSection6 from "./Villaggio_Olimpico_Section6.svelte";
    import VillaggioOlimpicoSection7 from "./Villaggio_Olimpico_Section7.svelte";
    import VillaggioOlimpicoSection8 from "./Villaggio_Olimpico_Section8.svelte";


    // mobile
    import VillaggioOlimpicoHeroMobile from "./mobile/Villaggio_Olimpico_Hero_Mobile.svelte";
    import VillaggioOlimpicoSection2Mobile from "./mobile/Villaggio_Olimpico_Section2_Mobile.svelte";
    import VillaggioOlimpicoSection3Mobile from "./mobile/Villaggio_Olimpico_Section3_Mobile.svelte";
    import VillaggioOlimpicoSection4Mobile from "./mobile/Villaggio_Olimpico_Section4_Mobile.svelte";
    import VillaggioOlimpicoSection5Mobile from "./mobile/Villaggio_Olimpico_Section5_Mobile.svelte";
    import VillaggioOlimpicoSection6Mobile from "./mobile/Villaggio_Olimpico_Section6_Mobile.svelte";
    import VillaggioOlimpicoSection7Mobile from "./mobile/Villaggio_Olimpico_Section7_Mobile.svelte";
    

    let scrollTimeout;
    let isSnapping = false;
    let gestureStartY = null;
    let ready = false;

    let mobile = $state(browser ? window.innerWidth <= 450 : false);

    const THRESHOLD = 0.9;
    const THRESHOLD_BACK = 0.1;
    const LANDING_OFFSET = 0.15;
    const MIN_MOVEMENT = 5;
    const EPS = 2;
    const SNAP_STABLE_FRAMES = 4;   
    const SNAP_MAX_WAIT = 2000;    
    const DEBUG = true; 

    function isMobile() {
        if (!browser) return false;
        return window.innerWidth <= 451;
    }

    function getScrollY() {
        return Math.max(window.scrollY, 0);
    }

    function handleScroll() {
        if (isMobile()) return; 
        
        if (!ready || isSnapping) return;

        const currentY = getScrollY();

        if (gestureStartY === null) {
            gestureStartY = currentY;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            checkSnap();
            gestureStartY = null;
        }, 150);
    }

    function getSectionTriggers() {
        return ScrollTrigger.getAll()
            .filter((t) => t.vars.pin)
            .sort((a, b) => a.start - b.start);
    }

    function checkSnap() {
        if (!browser || isMobile() || gestureStartY === null) return;

        const endY = getScrollY();
        const delta = endY - gestureStartY;

        if (Math.abs(delta) < MIN_MOVEMENT) {
            if (DEBUG) console.log(`[snap] movimento troppo piccolo (${delta.toFixed(1)}px) -> ignorato`);
            return;
        }

        const direction = delta > 0 ? "down" : "up";
        const triggers = getSectionTriggers();
        const scrollY = endY;

        let currentIndex = -1;
        for (let i = triggers.length - 1; i >= 0; i--) {
            const t = triggers[i];
            if (scrollY >= t.start - EPS && scrollY <= t.end + EPS) {
                currentIndex = i;
                break;
            }
        }

        if (DEBUG) {
            console.log(
                `[snap] gestureStart=${gestureStartY.toFixed(1)} end=${endY.toFixed(1)} delta=${delta.toFixed(1)} dir=${direction} currentIndex=${currentIndex}`,
                currentIndex >= 0
                    ? { trigger: triggers[currentIndex].trigger?.id || triggers[currentIndex].trigger, start: triggers[currentIndex].start.toFixed(1), end: triggers[currentIndex].end.toFixed(1), progress: triggers[currentIndex].progress.toFixed(3) }
                    : { triggers: triggers.map(t => ({ start: t.start.toFixed(1), end: t.end.toFixed(1) })) }
            );
        }

        if (currentIndex === -1) {
            if (direction === "down") {
                const next = triggers.find((t) => t.start > scrollY + EPS);
                if (next && scrollY > EPS) {
                    if (DEBUG) console.log(`[snap] zona morta, vado avanti a start=${next.start.toFixed(1)}`);
                    scrollToY(next.start + (next.end - next.start) * LANDING_OFFSET);
                } else if (DEBUG) {
                    console.log(`[snap] zona morta ma scrollY<=EPS o nessun next -> ignorato`);
                }
            } else {
                const prevCandidates = triggers.filter((t) => t.end < scrollY - EPS);
                const prev = prevCandidates[prevCandidates.length - 1];
                if (prev) {
                    if (DEBUG) console.log(`[snap] zona morta, torno a end=${prev.end.toFixed(1)}`);
                    scrollToY(prev.start + (prev.end - prev.start) * (1 - LANDING_OFFSET));
                }
            }
            return;
        }

        const current = triggers[currentIndex];
        const progress = current.progress;

        const isHero = currentIndex === 0 || scrollY <= EPS;

        if (direction === "down" && progress >= THRESHOLD && triggers[currentIndex + 1]) {
            const next = triggers[currentIndex + 1];
            if (DEBUG) console.log(`[snap] AVANTI: progress=${progress.toFixed(3)} >= ${THRESHOLD} -> vado a index ${currentIndex + 1}`);
            scrollToY(next.start + (next.end - next.start) * LANDING_OFFSET);
        } else if (isHero && direction === "up") {
            if (DEBUG) console.log(`[snap] siamo nella Hero (index 0), THRESHOLD_BACK ignorato -> resto fermo`);
        } else if (direction === "up" && progress <= THRESHOLD_BACK && triggers[currentIndex - 1]) {
            const prev = triggers[currentIndex - 1];
            if (DEBUG) console.log(`[snap] INDIETRO: progress=${progress.toFixed(3)} <= ${THRESHOLD_BACK} -> vado a index ${currentIndex - 1}`);
            scrollToY(prev.start + (prev.end - prev.start) * (1 - LANDING_OFFSET));
        } else if (DEBUG) {
            console.log(`[snap] nessuna condizione soddisfatta, resto fermo (progress=${progress.toFixed(3)})`);
        }
    }

    function scrollToY(y) {
        isSnapping = true;

        clearTimeout(scrollTimeout);
        gestureStartY = null;

        const target = Math.max(y, 0);
        window.scrollTo({ top: target, behavior: "smooth" });

        const startTime = performance.now();
        let lastY = getScrollY();
        let stableFrames = 0;

        function watch() {
            const now = getScrollY();
            const elapsed = performance.now() - startTime;

            if (Math.abs(now - lastY) < 0.5) {
                stableFrames++;
            } else {
                stableFrames = 0;
            }
            lastY = now;

            const settled = stableFrames >= SNAP_STABLE_FRAMES || Math.abs(now - target) < 1;
            const timedOut = elapsed >= SNAP_MAX_WAIT;

            if (settled || timedOut) {
                if (DEBUG) console.log(`[snap] scrollTo completato (settled=${settled}, timedOut=${timedOut}, y=${now.toFixed(1)})`);
                isSnapping = false;
                gestureStartY = null; 
                return;
            }

            requestAnimationFrame(watch);
        }

        requestAnimationFrame(watch);
    }

    onMount(async () => {
        console.log('innerWidth:', window.innerWidth, 'outerWidth:', window.outerWidth);
        const mediaQuery = window.matchMedia('(max-width: 450px)');
    
    // Imposta lo stato iniziale
    mobile = mediaQuery.matches;

    // Ascolta i cambi di breakpoint (es. ridimensionamento finestra o rotazione)
    const handler = (e) => (mobile = e.matches);
    mediaQuery.addEventListener('change', handler);
        if (!browser) return;

        // Fix definitivo per lo scroll mobile che "perde sincronia" scrollando giù.
        // Va chiamato UNA SOLA VOLTA all'avvio, non dentro isMobile()/handleScroll.
    

        await tick();
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    ScrollTrigger.refresh();
    ready = true;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                ready = true;
                if (DEBUG) {
                    console.log("[snap] trigger pinnati dopo refresh:",
                        getSectionTriggers().map((t, i) => ({
                            index: i,
                            trigger: t.trigger?.id || t.trigger?.tagName,
                            start: t.start.toFixed(1),
                            end: t.end.toFixed(1)
                        }))
                    );
                }
            });
        });

        

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => mediaQuery.removeEventListener('change', handler);
        
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("scroll", handleScroll);
        }
        clearTimeout(scrollTimeout);
    });
</script>

{#if mobile}
    <VillaggioOlimpicoHeroMobile />
    <VillaggioOlimpicoSection2Mobile/>
    <VillaggioOlimpicoSection3Mobile/>
    <VillaggioOlimpicoSection4Mobile/>
    <VillaggioOlimpicoSection5Mobile/>
    <VillaggioOlimpicoSection6Mobile/>
    <VillaggioOlimpicoSection7Mobile/>


{:else}
    <VillaggioOlimpicoHero />
    <VillaggioOlimpicoSection2 />
    <VillaggioOlimpicoSection3 />
    <VillaggioOlimpicoSection4 />
    <VillaggioOlimpicoSection5 />
    <VillaggioOlimpicoSection6 />
    <VillaggioOlimpicoSection7 />
    <VillaggioOlimpicoSection8 />
{/if}

<style>
    @media(max-width:450px){
        :global(body){
            cursor: none;
        }
    }
</style>