<script>
    import { onMount, onDestroy } from "svelte";
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

    const THRESHOLD = 0.75;
    const THRESHOLD_BACK = 0.1;
    const LANDING_OFFSET = 0.15;
    const MIN_MOVEMENT = 5;

    function handleScroll() {
        if (isSnapping) return;

        if (gestureStartY === null) {
            gestureStartY = window.scrollY;
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

        const endY = window.scrollY;
        const delta = endY - gestureStartY;

        if (Math.abs(delta) < MIN_MOVEMENT) return;

        const direction = delta > 0 ? "down" : "up";
        const triggers = getSectionTriggers();
        const scrollY = endY;

        // Con l'overlap, più trigger possono risultare "attivi"
        // contemporaneamente nello stesso range di scrollY. Prendiamo
        // sempre quello con lo start più alto (il più "avanzato") tra
        // quelli attivi, perché è la sezione visivamente dominante.
        let currentIndex = -1;
        for (let i = triggers.length - 1; i >= 0; i--) {
            const t = triggers[i];
            if (scrollY >= t.start && scrollY <= t.end) {
                currentIndex = i;
                break;
            }
        }

        // Zona morta residua (nessun trigger attivo): agganciati al
        // trigger più vicino nella direzione di marcia.
        if (currentIndex === -1) {
            if (direction === "down") {
                const next = triggers.find((t) => t.start > scrollY);
                if (next) scrollToY(next.start + (next.end - next.start) * LANDING_OFFSET);
            } else {
                const prevCandidates = triggers.filter((t) => t.end < scrollY);
                const prev = prevCandidates[prevCandidates.length - 1];
                if (prev) scrollToY(prev.start + (prev.end - prev.start) * (1 - LANDING_OFFSET));
            }
            return;
        }

        const current = triggers[currentIndex];
        const progress = current.progress;

        if (direction === "down" && progress >= THRESHOLD && triggers[currentIndex + 1]) {
            const next = triggers[currentIndex + 1];
            scrollToY(next.start + (next.end - next.start) * LANDING_OFFSET);
        } else if (direction === "up" && progress <= THRESHOLD_BACK && triggers[currentIndex - 1]) {
            const prev = triggers[currentIndex - 1];
            scrollToY(prev.start + (prev.end - prev.start) * (1 - LANDING_OFFSET));
        }
    }

    function scrollToY(y) {
        isSnapping = true;
        window.scrollTo({ top: y, behavior: "smooth" });
        setTimeout(() => { isSnapping = false; }, 700);
    }

    onMount(() => {
        if (!browser) return;
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