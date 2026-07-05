<script>
    import { onMount, onDestroy, tick } from "svelte";
    import { browser } from "$app/environment";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import SportInsolitiHero from "./Sport_Insoliti_Hero.svelte";
    import SportInsolitiSection2 from "./Sport_Insoliti_Section2.svelte";
    import SportInsolitiSection3 from "./Sport_Insoliti_Section3.svelte";
    import SportInsolitiSection4 from "./Sport_Insoliti_Section4.svelte";
    import SportInsolitiSection5 from "./Sport_Insoliti_Section5.svelte";
    import SportInsolitiSection6 from "./Sport_Insoliti_Section6.svelte";
    import SportInsolitiSection7 from "./Sport_Insoliti_Section7.svelte";
    import SportInsolitiSection8 from "./Sport_Insoliti_Section8.svelte";

    let scrollTimeout;
    let isSnapping = false;
    let gestureStartY = null;
    let ready = false;

    const THRESHOLD = 0.75;
    const THRESHOLD_BACK = 0.1;
    const LANDING_OFFSET = 0.15;
    const MIN_MOVEMENT = 5;
    const EPS = 2;
    const SNAP_STABLE_FRAMES = 4;   // frame consecutivi senza movimento = scroll finito
    const SNAP_MAX_WAIT = 2000;    // sicurezza: mai aspettare più di 2s
    const DEBUG = true; // metti a false quando hai finito di diagnosticare

    function getScrollY() {
        return Math.max(window.scrollY, 0);
    }

    function handleScroll() {
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
        if (!browser || gestureStartY === null) return;

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

        // La Hero è sempre l'indice 0: da lì non si torna indietro.
        // Guardia doppia: sia sull'indice sia sulla posizione reale, per
        // essere robusti anche a eventuali sfasamenti di indice.
        const isHero = currentIndex === 0 || scrollY <= EPS;

        if (direction === "down" && progress >= THRESHOLD && triggers[currentIndex + 1]) {
            const next = triggers[currentIndex + 1];
            if (DEBUG) console.log(`[snap] AVANTI: progress=${progress.toFixed(3)} >= ${THRESHOLD} -> vado a index ${currentIndex + 1}`);
            scrollToY(next.start + (next.end - next.start) * LANDING_OFFSET);
        } else if (isHero && direction === "up") {
            if (DEBUG) console.log(`[snap] siamo nella Hero (index 0), THRESHOLD_BACK ignorato -> resto fermo`);
            // nessuno snap: la Hero non ha una sezione precedente su cui rimbalzare
        } else if (direction === "up" && progress <= THRESHOLD_BACK && triggers[currentIndex - 1]) {
            const prev = triggers[currentIndex - 1];
            if (DEBUG) console.log(`[snap] INDIETRO: progress=${progress.toFixed(3)} <= ${THRESHOLD_BACK} -> vado a index ${currentIndex - 1}`);
            scrollToY(prev.start + (prev.end - prev.start) * (1 - LANDING_OFFSET));
        } else if (DEBUG) {
            console.log(`[snap] nessuna condizione soddisfatta, resto fermo (progress=${progress.toFixed(3)})`);
        }
    }

    // FIX: invece di un timeout fisso (che con distanze lunghe scade PRIMA
    // che l'animazione nativa "smooth" sia davvero finita), aspettiamo che
    // scrollY smetta di muoversi per un certo numero di frame consecutivi.
    // Questo evita che il tail dell'animazione venga scambiato per un nuovo
    // gesto dell'utente, che era la causa del "sobbalzo in avanti".
    function scrollToY(y) {
        isSnapping = true;

        // annulla eventuali timer di debounce residui, per non far scattare
        // un checkSnap "vecchio" mentre iniziamo un nuovo snap
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
                gestureStartY = null; // ripulisce eventuale stato accumulato durante l'animazione
                return;
            }

            requestAnimationFrame(watch);
        }

        requestAnimationFrame(watch);
    }

    onMount(async () => {
        if (!browser) return;

        await tick();

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
    });

    onDestroy(() => {
        if (browser) {
            window.removeEventListener("scroll", handleScroll);
        }
        clearTimeout(scrollTimeout);
    });
</script>

<SportInsolitiHero />
<SportInsolitiSection2 />
<SportInsolitiSection3 />
<SportInsolitiSection4 />
<SportInsolitiSection5 />
<SportInsolitiSection6 />
<SportInsolitiSection7 />
<SportInsolitiSection8 />