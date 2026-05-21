<script>
    import { onMount } from 'svelte';
    import {gsap} from 'gsap';
    import {ScrollTrigger} from 'gsap/ScrollTrigger';

    let path;
    let section;

    onMount(() => {


        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                scroller: window,
                start: "top top",
                end: "+=100%",
                scrub: 1,
                pin: true,
                pinSpacing: false,
                markers: true

        }
    })



})

</script>

<main id="section6" bind:this={section}>
    <div id="svgPerspective">
        <div id="svgContainer">
            <svg id="path" bind:this={path} width="24vw" height="61vh" fill="none">
                <path d="M6.52953 582.741C206.543 529.759 523.889 322.661 193.165 -81.879" stroke="#533EDC" stroke-width="51"/>
            </svg>

            <svg id="path2" width="37vw" height="27vh" fill="none">
                <path d="M566.755 81.3008C396.755 81.3008 166.201 -155.726 24.5451 347.229" stroke="#533EDC" stroke-width="51"/>
            </svg>

        </div>
    </div>

    <div id="text">
        <p id="paragraph">Grazie all'ironia e alla condivisibilità dei contenuti social, il pubblico ha trovato un punto di contatto umano e quotidiano con la disciplina, distaccandosi dai canoni rigidi dello sport classico.</p>
    </div>

</main>

<style>
    #section6{
        width: 100vw;
        height: 100vh;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }



    #path, #path2{
        position: absolute;
    }

    #path{
        top: -10%;
        left: -10%;
    }

    #path2{
        bottom: 0;
        right: 0;
    }

    #text{
        font-family: var(--font-family-text);
        color: var(--neutral-900);
        font-size: 3.125rem;
        font-style: normal;
        font-weight: 400;
        line-height: 110%; /* 3.4375rem */
        letter-spacing: -0.125rem;
        width: 72.625rem;
    }
</style>