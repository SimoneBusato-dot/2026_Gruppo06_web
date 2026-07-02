<script>
    import { onMount } from "svelte";
        import gsap from "gsap";
        import { ScrollTrigger } from "gsap/ScrollTrigger";
        import SplitText from 'gsap/SplitText';

        gsap.registerPlugin(ScrollTrigger, SplitText);
        let footer;
        let footerContent;
        let footerTitle;
        
        onMount(()=>{
            let cat = Array.from(footer.querySelectorAll('.categ'));
            const splitFooter = new SplitText(footerTitle, { type: "words", mask: "words" });
            const footerTitleEnter = gsap.fromTo(splitFooter.words, { y: "120%"}, { y: "0%", duration: 0.6, stagger:0.1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 0.5});
            const categEnter = gsap.fromTo(cat, {y: "100%"}, {y: "0%", duration: 1, stagger: 0.1, ease:"elastic.out(0.5,0.4)", paused: true, delay: 1});
            const footerEnter = gsap.fromTo(footerContent, {height: "0"}, {height: "40dvh", duration: 1, ease:"power2.out", paused: true , delay: 0.3});
            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footer,
                    onEnter() {footerEnter.play(); categEnter.play(); footerTitleEnter.play();},
                    onLeave() {footerEnter.reverse(); categEnter.reverse(); footerTitleEnter.reverse();},
                    onEnterBack() {footerEnter.play(); categEnter.play(); footerTitleEnter.play();},
                    onLeaveBack() {footerEnter.reverse(); categEnter.reverse(); footerTitleEnter.reverse();}
                }
            })
        })
</script>

<footer id="footer" bind:this={footer}>
    <div id="footerContent" bind:this={footerContent}>
    <div id="footerTitle">
        <h1 id="fT" bind:this={footerTitle}>LE PIU VISTE DELLA STORIA</h1>
    </div>
    <div id="smallCategories">
        <div class="categ">
            <p class="catText">Sport insoliti</p>
        </div>
        <div class="categ">
            <p class="catText">VIP inaspettati</p>
        </div>
        <div class="categ">
            <p class="catText">Villaggio olimpico</p>
        </div>
        <div class="categ">
            <p class="catText">Cucina italiana</p>
        </div>
    </div>
    <div id="designedBy">
        <p>Designed by: Luca Assinnato, Simone Busato, Nicola Castriotta, Edoardo Cicerone, Filippo Esposito, Mattia Lampugnani</p>
    </div>
    </div>
</footer>

<style>
    #footer {
        width: 100vw;
        height: 40vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #footerContent {
        width: 100%;
        height: 40vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        background-color: var(--neutral-900);
        transform-origin: bottom center;
    }

    #footerTitle {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 6rem;
        font-family: var(--font-family);
        font-weight: 900;
        color: var(--neutral-50);
        margin: none;
    }

    #smallCategories {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        overflow: hidden;
        
    }

    
    .catText {
        font-size: 1.625rem;
        font-family: var(--font-family-text);
        font-weight: 300;
        color: var(--neutral-50);
        padding: 0.5rem 1rem;
    }
    .categ {
        border-radius: 1rem;
    }

    .categ:first-child {
        background-color: var(--brand-sport-insoliti-500);
    }
    .categ:nth-child(2) {
        background-color: var(--brand-vip-500);
    }
    .categ:nth-child(3) {
        background-color: var(--brand-villaggio-500);
    }
    .categ:nth-child(4) {
        background-color: var(--brand-cibo-500);
    }

    #designedBy {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        font-family: var(--font-family-text);
        font-weight: 300;
        color: var(--neutral-50);
        margin-top: 2rem;
    }
</style>