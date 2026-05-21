<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';
    import SportSlider2 from './Sport_Slider2.svelte';

    gsap.registerPlugin(ScrollTrigger);
</script>

<main id="Section5">
    <div id="svgContainer">
        <svg id="section5Path" width="100vw" height="100vh" >
            <path d="M16.9741 982C208.307 811.333 679.374 733.6 880.974 966C1016.12 1121.79 1082.97 504.5 1346.97 663C1610.97 821.5 1574.93 -5.81252 1551.97 -13"/>
        </svg>

    </div>
    <SportSlider2 />
</main>


<style>
    #Section5{
        position: relative;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-block-start: 130dvh;
    }

    #svgContainer{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    #section5Path{
        fill: none;
        stroke: var(--brand-sport-insoliti-500);
        stroke-width: var(--line-thickness);
        
    }

</style>