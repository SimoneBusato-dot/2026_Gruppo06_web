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

<!-- Main floating Navbar header -->
<header class="navbar-header" class:menu-open={isOpen}>
    <!-- Brand Logo Capsule -->
    <a href="/" class="logo-capsule" onclick={closeMenu}>
        22MLD
    </a>

    <!-- Hamburger Toggle Capsule -->
    <button class="menu-capsule" onclick={toggleMenu} aria-label="Toggle Menu">
        <div class="hamburger" class:open={isOpen}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </button>
</header>

<!-- Slanted Dark Overlay Menu -->
<div class="menu-overlay" class:open={isOpen}>
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
                href="/Sport_Insoliti" 
                class="menu-link link-villaggio" 
                onclick={closeMenu}
            >
                VILLAGGIO OLIMPICO
            </a>
            <a 
                href="/Sport_Insoliti" 
                class="menu-link link-vip" 
                onclick={closeMenu}
            >
                PERSONAGGI FAMOSI
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
    /* Fixed Positioning and Stack Index for Navbar Elements */
    .navbar-header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        z-index: 9999;
        pointer-events: none; /* Allows click through the transparent gaps */
        padding: 0;
    }

    /* Logo Capsule Styling */
    .logo-capsule {
        pointer-events: auto; /* Re-enable clicks */
        background-color: var(--neutral-900);
        color: var(--neutral-50);
        font-family: var(--font-family), sans-serif;
        font-size: 2.375rem;
        font-weight: 800;
        text-transform: uppercase;
        text-decoration: none;
        padding: 16px 36px 14px 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-bottom-right-radius: 28px;
        transition: background-color 0.4s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s ease;
        line-height: 1;
        letter-spacing: 0.5px;
    }

    .logo-capsule:hover {
        color: var(--neutral-200);
    }

    /* Hamburger Capsule Button Styling */
    .menu-capsule {
        pointer-events: auto; /* Re-enable clicks */
        background-color: var(--neutral-900);
        border: none;
        cursor: pointer;
        padding: 24px 36px 20px 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-bottom-left-radius: 28px;
        transition: background-color 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        outline: none;
    }

    /* Transparent backgrounds when open */
    .navbar-header.menu-open .logo-capsule {
        background-color: transparent;
    }

    .navbar-header.menu-open .menu-capsule {
        background-color: transparent;
    }

    /* Hamburger Icon Styling & Animations */
    .hamburger {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 26px;
        height: 16px;
    }

    .hamburger span {
        display: block;
        width: 100%;
        height: 2px;
        background-color: var(--neutral-50);
        transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease, background-color 0.3s ease;
        border-radius: 1px;
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

    /* Slanted Fullscreen Overlay Menu Container */
    .menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: var(--neutral-900);
        z-index: 9998;
        transform: translateY(-100%);
        /* Diagonal slanted bottom */
        clip-path: polygon(0 0, 100% 0, 100% 82%, 0 98%);
        transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-top: 15vh;
        box-sizing: border-box;
    }

    .menu-overlay.open {
        transform: translateY(0);
    }

    /* Menu Navigation Links List styling */
    .menu-links {
        width: 100%;
        padding-left: 7vw;
        box-sizing: border-box;
    }

    .links-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1.75rem;
    }

    /* Menu Item Link Styling */
    .menu-link {
        font-family: var(--font-family), sans-serif;
        font-size: clamp(3rem, 7vw, 5.25rem);
        font-weight: 800;
        text-transform: uppercase;
        color: var(--neutral-50);
        text-decoration: none;
        line-height: 0.9;
        transition: color 0.3s cubic-bezier(0.25, 1, 0.5, 1), transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), padding-left 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        display: inline-block;
    }

    /* Subtle hover slide and dynamic color transitions based on category page */
    .menu-link:hover {
        transform: translateX(12px);
        padding-left: 4px;
    }

    .link-intro:hover {
        color: var(--neutral-200);
    }

    .link-sport:hover {
        color: var(--brand-sport-insoliti-300);
    }

    .link-villaggio:hover {
        color: var(--brand-villaggio-200);
    }

    .link-vip:hover {
        color: var(--brand-vip-300);
    }

    .link-cucina:hover {
        color: var(--brand-cibo-300);
    }

    /* Active page state styling */
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
</style>
