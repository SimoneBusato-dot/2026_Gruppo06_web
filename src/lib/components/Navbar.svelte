<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    let isOpen = $state(false);

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    function closeMenu() {
        isOpen = false;
        document.body.style.overflow = '';
    }

    function handleOverlayClick() {
        if (!isOpen) {
            toggleMenu();
        }
    }

    // Close menu on navigation
    $effect(() => {
        const path = $page.url.pathname;
        closeMenu();
    });

    onMount(() => {
        return () => {
            document.body.style.overflow = '';
        };
    });
</script>

<!-- Click Backdrop to capture clicks outside the slanted menu -->
{#if isOpen}
    <div class="menu-backdrop" onclick={closeMenu} onkeydown={(e) => e.key === 'Escape' && closeMenu()} role="presentation"></div>
{/if}

<!-- Main floating Navbar header -->
<header class="navbar-header" class:menu-open={isOpen}>
    <!-- Brand Logo Capsule -->
    <a href="/Categorie" class="logo-capsule" onclick={closeMenu}>
        22MLD
    </a>

    <!-- Hamburger Toggle Button (Fixed outside the skewed overlay to ensure X/≡ align perfectly on screen) -->
    <button class="hamburger-btn" onclick={toggleMenu} aria-label="Toggle Menu">
        <div class="hamburger" class:open={isOpen}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </button>
</header>

<!-- Morphing Menu Overlay Container (Single Unified Shape) -->
<!-- Starts as the small hamburger capsule in closed state, expands to slanted overlay in open state -->
<div 
    class="menu-overlay" 
    class:open={isOpen} 
    onclick={handleOverlayClick}
    role="button"
    tabindex={isOpen ? -1 : 0}
    onkeydown={(e) => { if (!isOpen && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleMenu(); } }}
>
    <!-- Menu Navigation Links (hidden in closed state, staggered fade-in in open state) -->
    <nav class="menu-links">
        <div class="links-container">
            <a 
                href="/" 
                class="menu-link link-intro" 
                class:active={$page.url.pathname === '/'}
                onclick={closeMenu}
            >
                INTRODUZIONE
            </a>
            <a 
                href="/Sport_Insoliti" 
                class="menu-link link-sport" 
                class:active={$page.url.pathname === '/Sport_Insoliti'}
                onclick={closeMenu}
            >
                SPORT INSOLITI
            </a>
            <a 
                href="/Vip_Inaspettati" 
                class="menu-link link-vip" 
                class:active={$page.url.pathname === '/Vip_Inaspettati'}
                onclick={closeMenu}
            >
                VIP INASPETTATI
            </a>
            <a 
                href="/Villaggio_Olimpico" 
                class="menu-link link-villaggio" 
                class:active={$page.url.pathname === '/Villaggio_Olimpico'}
                onclick={closeMenu}
            >
                VILLAGGIO OLIMPICO
            </a>
            <a 
                href="/Cucina_Italiana" 
                class="menu-link link-cucina" 
                class:active={$page.url.pathname === '/Cucina_Italiana'}
                onclick={closeMenu}
            >
                CUCINA ITALIANA
            </a>
        </div>
    </nav>
</div>

<style>
    /* Transparent click backdrop for clicks outside the black container */
    .menu-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9997;
        background-color: transparent;
        pointer-events: auto;
    }

    /* Fixed Positioning and Stack Index for Header */
    .navbar-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 52px;
        z-index: 9999;
        pointer-events: none; /* Let clicks pass through gaps */
        padding: 0;
    }

    /* Logo Capsule Styling (compact size to match button height) */
    .logo-capsule {
        pointer-events: auto; /* Enable clicks */
        background-color: transparent !important; /* Managed by the ::before pseudo-element */
        color: var(--neutral-50);
        font-family: var(--font-family), sans-serif;
        font-size: 2.1rem;
        font-weight: 800;
        text-transform: uppercase;
        text-decoration: none;
        padding: 0 26px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        letter-spacing: 0.5px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        height: 52px;
        box-sizing: border-box;
    }

    /* Sliding skewed black capsule behind Logo */
    .logo-capsule::before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px; /* Extend past screen edge to hide skew seam */
        width: calc(100% + 20px);
        height: 100%;
        background-color: var(--neutral-800);
        border-bottom-right-radius: 28px;
        z-index: -1;
        transform: skewX(-10deg);
        transform-origin: top left;
        /* Slide out transition to the left */
        transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
    }

    .logo-capsule::after{
        content: 'Clicca per andare alle Categorie!';
        position: absolute;
        bottom: -37px;
        right: -40px;
        font-family: var(--font-family-text);
        font-size: 0.5rem;
        padding: 0.5rem 1rem;
        color: var(--neutral-50);
        background-color: var(--neutral-800);
        opacity: 0;
        border-radius: 10px;
        transition: opacity 0.2s ease;
    }

    .logo-capsule:hover::after{
        opacity: 1;
    }

    /* Slides the logo capsule background out of the viewport to the left when open */
    .navbar-header.menu-open .logo-capsule::before {
        transform: skewX(-10deg) translateX(-110%);
    }

    /* Hamburger Toggle Button (Fixed at the top-right corner to prevent any shifting) */
    .hamburger-btn {
        pointer-events: auto;
        position: absolute;
        top: 15px; /* Centered in the 52px capsule height relative to space below */
        right: 33px; /* Centered in the 68px capsule width, adjusted for skew */
        width: 26px;
        height: 16px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        outline: none;
        z-index: 10000;
        box-sizing: border-box;
    }

    /* Hamburger Icon Styling & Animations */
    .hamburger {
        position: relative;
        width: 26px;
        height: 16px;
    }

    .hamburger span {
        position: absolute;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--neutral-50);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, background-color 0.3s ease;
        border-radius: 1px;
    }

    .hamburger span:nth-child(1) {
        top: 0;
    }

    .hamburger span:nth-child(2) {
        top: 7px;
    }

    .hamburger span:nth-child(3) {
        top: 14px;
    }

    .hamburger.open span {
        background-color: var(--neutral-50);
    }

    .hamburger.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }

    .hamburger.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
    }

    .hamburger.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    /* Morphing Menu Overlay Container (Single Unified Shape) */
    .menu-overlay {
        position: fixed;
        top: -15vh; /* Extends above viewport top to hide top slanted edge */
        right: -250px; /* Deep offset to keep the skewed right edge off-screen at the bottom */
        background-color: var(--neutral-900);
        z-index: 9998;
        
        /* Closed state size & shape (matches right capsule button: 68px wide, 52px high) */
        width: calc(68px + 250px);
        height: calc(15vh + 52px);
        border-bottom-left-radius: 28px; /* Circular corner matches logo capsule exactly */
        
        /* Skew variables for unified animation */
        --skew-y: 0deg;
        --unskew-y: 0deg;
        
        /* Skewed shape to make it cohesive with site diagonals */
        transform: skewX(-10deg) skewY(var(--skew-y));
        transform-origin: top right;
        
        /* Smooth transition for size, curves and skews */
        transition: 
            width 0.65s cubic-bezier(0.77, 0, 0.175, 1),
            height 0.65s cubic-bezier(0.77, 0, 0.175, 1),
            border-bottom-left-radius 0.65s cubic-bezier(0.77, 0, 0.175, 1),
            transform 0.65s cubic-bezier(0.77, 0, 0.175, 1);
        
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: calc(15vh + 35px); /* Shifted higher to prevent bottom diagonal clipping */
        box-sizing: border-box;
        pointer-events: auto;
        cursor: pointer; /* Enable pointer when closed */
        outline: none;
    }

    /* Open State of Overlay */
    .menu-overlay.open {
        width: calc(102vw + 250px);
        height: calc(15vh + 70vh);
        border-bottom-left-radius: 28px; /* Rounded corner is identical in open state as requested */
        --skew-y: -4deg; /* Slices the bottom edge on a unified angle */
        --unskew-y: 4deg;
        cursor: default; /* Reset pointer cursor when open */
    }

    /* Links container rules */
    .menu-links {
        width: 100%;
        padding-left: 14vw; /* Moved texts further right to create breathing room and alignment */
        box-sizing: border-box;
        pointer-events: none;
        z-index: 7;
        /* Un-skew the links container so all text renders perfectly horizontal */
        transform: skewX(10deg) skewY(var(--unskew-y));
        transform-origin: top left;
        transition: transform 0.65s cubic-bezier(0.77, 0, 0.175, 1);
    }

    .menu-overlay.open .menu-links {
        pointer-events: auto;
    }

    .links-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.05rem; /* Slightly more compact gap to ensure no bottom cutoff */
    }

    /* Link item base style */
    .menu-link {
        font-family: var(--font-family), sans-serif;
        font-size: clamp(2.5rem, 6vw, 4.85rem); /* Giant typography */
        font-weight: 800;
        text-transform: uppercase;
        color: var(--neutral-50);
        text-decoration: none;
        line-height: 0.95;
        display: inline-block;
        
        /* Stagger entrance properties from far right (translateX 180px) with calm transition delays */
        opacity: 0;
        transform: translateX(180px);
        transition: 
            opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s), 
            transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0s),
            color 0.15s ease 0s, 
            padding-left 0.2s ease 0s;
    }

    .menu-link:hover {
        transform: translateX(-12px); /* Moves left on hover since they slide in from right */
        padding-left: 4px;
    }

    /* Stagger fade/slide-in transition when open */
    .menu-overlay.open .menu-link {
        opacity: 1;
        transform: translateX(0);
    }

    /* Calm, deliberate staggered delays */
    .menu-overlay.open .menu-link:nth-child(1) { --delay: 0.12s; }
    .menu-overlay.open .menu-link:nth-child(2) { --delay: 0.22s; }
    .menu-overlay.open .menu-link:nth-child(3) { --delay: 0.32s; }
    .menu-overlay.open .menu-link:nth-child(4) { --delay: 0.42s; }
    .menu-overlay.open .menu-link:nth-child(5) { --delay: 0.52s; }

    /* Light hover colors matching brand categories */
    .link-intro:hover {
        color: var(--neutral-200);
    }

    .link-sport:hover {
        color: var(--brand-sport-insoliti-300);
    }

    .link-vip:hover {
        color: var(--brand-vip-300);
    }

    .link-villaggio:hover {
        color: var(--brand-villaggio-200);
    }

    .link-cucina:hover {
        color: var(--brand-cibo-300);
    }

    /* Active section indicator dot */
    .menu-link.active {
        position: relative;
    }

    .menu-link.active::before {
        content: '';
        position: absolute;
        left: -20px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--neutral-50);
    }

    .navbar-header {
    view-transition-name: navbar;
    }

    .menu-overlay {
        view-transition-name: menu-overlay;
    }
</style>
