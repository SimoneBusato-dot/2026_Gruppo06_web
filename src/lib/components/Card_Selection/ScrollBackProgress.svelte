<!-- ScrollBackProgress.svelte -->
<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { scale, fade } from 'svelte/transition';
    import { cubicOut } from 'svelte/easing';

    let progress = $state(0); // 0 -> 100
    let visible = $state(false);
    let navigating = $state(false);

    const RADIUS = 26;
    const CIRC = 2 * Math.PI * RADIUS;
    const TRIGGER_DELAY = 350; // ms di attesa prima che parta l'accumulo

    let decayTimeout;
    let holdTimer = null;
    let holding = false;
    let delayPassed = false;
    let isAtTop = $state(true);

    function checkTop() {
        isAtTop = window.scrollY <= 0;
    }

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
            resetProgress();
            cancelHold();
        }, 400);
    }

    function accumulate(amount) {
        // Finché il delay non è passato, il gesto viene "assorbito" senza riempire il cerchio
        if (!delayPassed) return;

        visible = true;
        progress = Math.min(100, progress + amount);

        if (progress >= 100 && !navigating) {
            navigating = true;
            setTimeout(() => {
                goto('/');
            }, 150);
        }
    }

    function handleWheel(e) {
        if (navigating) return;
        checkTop();

        if (isAtTop && e.deltaY < 0) {
            e.preventDefault();
            startHold();
            accumulate(Math.abs(e.deltaY) * 0.4);
            scheduleDecay();
        }
    }

    function resetProgress() {
        const interval = setInterval(() => {
            progress -= 6;
            if (progress <= 0) {
                progress = 0;
                visible = false;
                clearInterval(interval);
            }
        }, 16);
    }

    let touchStartY = 0;
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e) {
        if (navigating) return;
        checkTop();
        const deltaY = e.touches[0].clientY - touchStartY;

        if (isAtTop && deltaY > 0) {
            startHold();
            accumulate(deltaY * 0.3);
            scheduleDecay();
        }
    }

    onMount(() => {
        checkTop();
        window.addEventListener('scroll', checkTop, { passive: true });
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('scroll', checkTop);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    });
</script>

{#if visible}
    <div
        class="scroll-back-progress"
        class:complete={progress >= 100}
        in:scale={{ duration: 350, start: 0.7, easing: cubicOut }}
        out:fade={{ duration: 250 }}
    >
        <div class="icon-wrapper" in:fade={{ duration: 300, delay: 50 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle
                    cx="30" cy="30" r={RADIUS}
                    fill="none"
                    stroke="var(--neutral-800)"
                    stroke-width="4"
                />
                <circle
                    cx="30" cy="30" r={RADIUS}
                    fill="none"
                    stroke="var(--brand-vip-500)"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-dasharray={CIRC}
                    stroke-dashoffset={CIRC - (progress / 100) * CIRC}
                    transform="rotate(-90 30 30)"
                    style="transition: stroke-dashoffset 0.05s linear;"
                />
            </svg>
            <span class="arrow">↑</span>
        </div>
        <p id="backText" in:fade={{ duration: 300, delay: 100 }}>Scorri per riguardare la Intro</p>
    </div>
{/if}

<style>
    .scroll-back-progress {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9998;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        flex-direction: column;
        width: 100%;
        padding: 40px 0 60px;
        background: linear-gradient(
            var(--neutral-50) 60%,
            transparent 100%
        );
    }

    .icon-wrapper {
        position: relative;
        width: 60px;
        height: 60px;
        transition: transform 0.2s ease-out;
    }

    .scroll-back-progress.complete .icon-wrapper {
        transform: scale(1.08);
    }

    .scroll-back-progress .arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--brand-vip-500);
        font-size: 20px;
        font-weight: bold;
        font-family: var(--font-family-text);
    }

    .scroll-back-progress.complete svg circle:last-child {
        stroke: var(--brand-vip-500);
    }

    #backText {
        font-family: var(--font-family-text);
        font-size: 1rem;
        margin: 8px 0 0;
        color: var(--neutral-900);
    }
</style>