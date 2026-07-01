<script>
    import { onMount } from "svelte";
        import gsap from "gsap";
        import { ScrollTrigger } from "gsap/ScrollTrigger";
        import SplitText from 'gsap/SplitText';

        gsap.registerPlugin(ScrollTrigger, SplitText);

        onMount(()=>{
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#firstEnding",
                    start: "top top",
                    end: "+=150%",
                    scrub: true,
                    pin: true,
                }
            });
        })
</script>

<main id="ending">
    <section id="firstEnding">
        <div id="svgContainer1">
            <svg width="169" height="820" viewBox="0 0 169 820" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M398.298 812.015C343.02 619.523 62.6996 671.217 27.749 444.902C-0.46257 262.225 246.217 169.202 284.486 5.81536" stroke="#533EDC" stroke-width="51"/>
            </svg>
        </div>
        <div id="textContainer1">
            <p id="Upper">Questa socialità è uno sviluppo naturale dei massmedia?</p>
            <p id="paragraph">Le prossime olimpiadi avranno la stessa viralità, o questa è stata solo una eccezione?</p>
        </div>
    </section>
    <section id="secondEnding">

    </section>
</main>


<style>
    #firstEnding {
        display: flex;
        width: 100vw;
        height: 100vh;
        position: relative;
    }

    #svgContainer1 {
        width: 10%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0;
    }

    #textContainer1 {
        width: 62.4375rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        font-size: 1.625rem;
        text-align: left;
        margin-left: 5%;
        font-family:var(--font-family-text)
        
    }

    #Upper {
        font-weight: 900;
        font-size: 8rem;
        margin-bottom: 1rem;
        font-family:var(--font-family);
        text-transform: uppercase;
        line-height: 80%;
        color: var(--brand-sport-insoliti-500);
    }
</style>