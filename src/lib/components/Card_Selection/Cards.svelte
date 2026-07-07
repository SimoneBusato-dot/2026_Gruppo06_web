<script>
import gsap from "gsap"
import { goto } from '$app/navigation'
import { hasNavigatedCategory } from '$lib/store/categoryNav.js';

    let {variant = 'blue'} = $props()
    let cardEl = $state(null)

    const routes = {
        blue: '/Sport_Insoliti',
        red: '/Villaggio_Olimpico',
        purple: '/Vip_Inaspettati',
        yellow: '/Cucina_Italiana',
    };

   function handleClick(){
    hasNavigatedCategory.markNavigated();
}
</script>
<!---->
<div class={`card card-${variant}`} bind:this={cardEl} >
{#if variant === 'blue'}
    <a href={routes.blue} id="link" onclick={handleClick}>
        <div id="content">
            <svg id="logo" viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.8599 2L30.4925 2L35.3687 10.6378M2 20.9255C2 15.7331 4.34249 11.7894 7.83235 11.2201C11.3222 10.6508 35.3687 10.6378 35.3687 10.6378C35.3687 10.6378 38.9064 10.4687 41.1533 10.4687C43.4002 10.4687 48.255 16.0319 47.9895 20.9255M47.9895 20.9255C47.7552 25.2458 43.448 30 41.7269 30C40.0059 30 11.8003 30 9.50557 30C7.21086 30 2 26.1179 2 20.9255M47.9895 20.9255L2 20.9255" stroke="#F3F3F3" stroke-width="4"/>
            </svg>
            <div id="text">
                <h3>SPORT INSOLITI</h3>
                <p>sport imbarazzanti, di nicchia e divertenti</p>
            </div>
        </div>
        <svg id="decoration-blue" viewBox="0 0 434 282" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-222 527.388C-222 527.388 373.5 606.889 79 249.389C-215.5 -108.111 531 249.389 531 249.389" stroke="#8688F3" stroke-width="181"/>
        </svg>
    </a>
{:else if variant === 'red'}
    <a href={routes.red} id="link" onclick={handleClick}>
        <div id = 'content'>
            <svg id="logo" width="38" height="32" viewBox="0 0 38 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 29.2373H5.33333M5.33333 29.2373H15.3333M5.33333 29.2373V14.9908C5.33333 14.1003 5.33333 13.6548 5.44162 13.2404C5.53758 12.8731 5.69632 12.5256 5.90951 12.2115C6.15007 11.8572 6.4844 11.5633 7.15462 10.9769L15.1573 3.97454C16.3997 2.88738 17.021 2.34376 17.7207 2.13684C18.3377 1.95439 18.9953 1.95439 19.6123 2.13684C20.3125 2.34391 20.9347 2.88804 22.179 3.97685L30.179 10.9769C30.8492 11.5633 31.1837 11.8572 31.4243 12.2115C31.6375 12.5256 31.795 12.8731 31.8909 13.2404C31.9992 13.6548 32 14.1003 32 14.9908V29.2373M15.3333 29.2373H22M15.3333 29.2373V22.5706C15.3333 20.7297 16.8257 19.2373 18.6667 19.2373C20.5076 19.2373 22 20.7297 22 22.5706V29.2373M22 29.2373H32M32 29.2373H35.3333" stroke="#F3F3F3" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div id="text">
                <h3>VILLAGGIO OLIMPICO</h3>
                <p>room tour e retroscena come in un reality show</p>
            </div>
        </div>
        <svg id="decoration-red" viewBox="0 0 434 354" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-127.306 4.4886C-127.306 4.4886 -98.1393 606.608 254.603 232.702C607.346 -141.204 346.374 675.287 346.374 675.287" stroke="#FAA7A9" stroke-width="181"/>
        </svg>
    </a>
{:else if variant === 'purple'}
    <a href={routes.purple} id="link" onclick={handleClick}>
        <div id="content">
            <svg id="logo" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.6444 15.5879L22.1167 4.58789L16.9876 15.5879L4.49707 17.1106L13.4265 25.459L11.2207 37.5879L22.1167 31.6547L33.0924 37.5879L30.9663 25.459L39.4971 17.1106L27.6444 15.5879Z" stroke="#F3F3F3" stroke-width="4"/>
            </svg>
            <div id="text">
                <h3>VIP INASPETTATI</h3>
                <p>il mito non vive più nella distanza ma nella vicinanza</p>
            </div>
        </div>
        <svg id="decoration-purple" viewBox="0 0 434 283" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.5 480.295C64.5 480.295 -164.854 163.589 292 87.2953C748.854 11.001 101.262 602.395 101.262 602.395" stroke="#F5B2EF" stroke-width="161"/>
        </svg>
    </a>
{:else if variant === 'yellow'}
    <a href={routes.yellow} id="link" onclick={handleClick}>
        <div id="content">
            <svg id="logo" viewBox="0 0 44 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 17.1579C43.9969 14.2624 42.8369 11.4864 40.7745 9.43899C38.7122 7.39157 35.9159 6.23996 32.9993 6.23687C32.6516 6.23687 32.3039 6.25637 31.9602 6.28757C31.0732 4.40814 29.6651 2.81855 27.9009 1.70498C26.1366 0.59142 24.0893 0 21.9987 0C19.9081 0 17.8607 0.59142 16.0965 1.70498C14.3322 2.81855 12.9242 4.40814 12.0372 6.28757C11.6934 6.25637 11.3457 6.23687 10.998 6.23687C8.50082 6.23747 6.07814 7.08153 4.12824 8.63031C2.17833 10.1791 0.817231 12.3404 0.268693 14.759C-0.279846 17.1775 0.0168178 19.7094 1.10992 21.9384C2.20302 24.1674 4.0275 25.9608 6.28344 27.0239V35.8797C6.28344 36.7073 6.61458 37.5009 7.20402 38.0861C7.79345 38.6713 8.5929 39 9.42649 39H34.5709C35.4044 39 36.2039 38.6713 36.7933 38.0861C37.3828 37.5009 37.7139 36.7073 37.7139 35.8797V27.0239C39.5933 26.1366 41.1811 24.739 42.2935 22.993C43.406 21.247 43.9976 19.2239 44 17.1579ZM34.5709 35.8797H9.42649V27.9658C9.94689 28.0411 10.4721 28.0789 10.998 28.079H32.9993C33.5252 28.0789 34.0505 28.0411 34.5709 27.9658V35.8797ZM32.9993 24.9587H30.2983L31.3807 20.6565C31.4738 20.258 31.4054 19.839 31.1903 19.49C30.9753 19.141 30.6307 18.8898 30.2309 18.7906C29.8311 18.6914 29.408 18.752 29.0528 18.9595C28.6976 19.167 28.4387 19.5047 28.3319 19.8999L27.057 24.9587H23.5702V20.2782C23.5702 19.8644 23.4046 19.4676 23.1099 19.175C22.8152 18.8824 22.4155 18.7181 21.9987 18.7181C21.5819 18.7181 21.1822 18.8824 20.8874 19.175C20.5927 19.4676 20.4272 19.8644 20.4272 20.2782V24.9587H16.9403L15.6654 19.8999C15.6183 19.6981 15.5312 19.5077 15.4091 19.3397C15.2871 19.1717 15.1326 19.0295 14.9546 18.9214C14.7766 18.8133 14.5787 18.7415 14.3725 18.7101C14.1662 18.6787 13.9558 18.6885 13.7534 18.7387C13.551 18.7889 13.3607 18.8787 13.1935 19.0027C13.0264 19.1267 12.8859 19.2826 12.7801 19.4611C12.6743 19.6396 12.6053 19.8372 12.5773 20.0425C12.5492 20.2477 12.5626 20.4565 12.6167 20.6565L13.6991 24.9587H10.998C8.91404 24.9587 6.91542 24.1368 5.44184 22.6739C3.96825 21.2109 3.14039 19.2268 3.14039 17.1579C3.14039 15.089 3.96825 13.1049 5.44184 11.642C6.91542 10.179 8.91404 9.35717 10.998 9.35717H11.1119C11.0358 9.87377 10.9977 10.3952 10.998 10.9173C10.998 11.3311 11.1636 11.7279 11.4583 12.0205C11.753 12.3131 12.1527 12.4775 12.5695 12.4775C12.9863 12.4775 13.386 12.3131 13.6808 12.0205C13.9755 11.7279 14.1411 11.3311 14.1411 10.9173C14.1411 8.84843 14.9689 6.86428 16.4425 5.40135C17.9161 3.93843 19.9147 3.11657 21.9987 3.11657C24.0826 3.11657 26.0813 3.93843 27.5548 5.40135C29.0284 6.86428 29.8563 8.84843 29.8563 10.9173C29.8563 11.3311 30.0219 11.7279 30.3166 12.0205C30.6113 12.3131 31.011 12.4775 31.4278 12.4775C31.8446 12.4775 32.2443 12.3131 32.539 12.0205C32.8338 11.7279 32.9993 11.3311 32.9993 10.9173C32.9997 10.3952 32.9616 9.87377 32.8854 9.35717H32.9993C35.0833 9.35717 37.0819 10.179 38.5555 11.642C40.0291 13.1049 40.857 15.089 40.857 17.1579C40.857 19.2268 40.0291 21.2109 38.5555 22.6739C37.0819 24.1368 35.0833 24.9587 32.9993 24.9587Z" fill="#F3F3F3"/>
            </svg>
            <div id="text">
                <h3>CUCINA ITALIANA</h3>
                <p>il cibo trasformato in un vero momento pop</p>
            </div>
        </div>
        <svg id="decoration-yellow" viewBox="0 0 434 358" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M491.5 73.0488C491.5 73.0488 -263.354 422.343 193.5 346.049C650.355 269.754 101.261 687.149 101.261 687.149" stroke="#EDCE9A" stroke-width="161"/>
        </svg>
    </a>
{/if}
</div>

<style>
    /*
        La card usa una custom property --card-w definita qui.
        Tutto dentro scala proporzionalmente rispetto a quella.
        Su MBP 14" (1512px) → 28.7vw ≈ 434px — identico all'originale.
        Su 1920px → ~28.7vw ≈ 551px, max bloccato a 500px.
        Su 1280px → ~28.7vw ≈ 367px, min bloccato a 320px.
    */
    .card {
        --card-w: clamp(320px, 28.7vw, 500px);
        /* Rapporto originale 434:570 = 0.761 → height = card-w / 0.761 */
        --card-h: calc(var(--card-w) / 0.761);

        width: var(--card-w);
        height: var(--card-h);
        overflow: hidden;
        border-radius: clamp(10px, 1vw, 15px);
        position: relative;
    }

    #link {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        text-decoration: none;
        position: relative;
    }

    #content {
        /* larghezza interna proporzionale alla card */
        width: calc(var(--card-w) * 0.576); /* 250/434 ≈ 0.576 */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: calc(var(--card-w) * 0.048); /* 21/434 ≈ 0.048 */
        margin-top: calc(var(--card-h) * 0.053); /* ~3rem su base originale */
        position: relative;
        z-index: 1;
    }

    /* Icone SVG: scalano con la card */
    #logo {
        width: calc(var(--card-w) * 0.115);  /* ~50px su 434px */
        height: auto;
        flex-shrink: 0;
    }

    #text {
        width: 100%;
        display: flex;
        flex-direction: column;
        text-align: center;
        color: var(--neutral-50);
        gap: calc(var(--card-w) * 0.018); /* 8/434 */
    }

    #text h3 {
        font-family: var(--font-family);
        /* 4.375rem su 434px card → scala proporzionalmente */
        font-size: calc(var(--card-w) * 0.161); /* 70/434 ≈ 0.161 */
        font-style: normal;
        font-weight: 800;
        line-height: 80%;
        margin: 0;
    }

    #text p {
        font-family: var(--font-family-text);
        font-size: calc(var(--card-w) * 0.046); /* 20/434 ≈ 0.046 */
        font-style: normal;
        font-weight: 300;
        line-height: 110%;
        margin: 0;
    }

    /* Decorazioni SVG: occupano tutta la card, posizionate in basso */
    #decoration-blue,
    #decoration-red,
    #decoration-purple,
    #decoration-yellow {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: auto;
        pointer-events: none;
    }

    .card-blue   { background-color: var(--brand-sport-insoliti-500); }
    .card-red    { background-color: var(--brand-villaggio-500); }
    .card-purple { background-color: var(--brand-vip-500); }
    .card-yellow { background-color: var(--brand-cibo-500); }

    @media(max-width: 450px){
        a{
            cursor: none;
        }

    }
</style>