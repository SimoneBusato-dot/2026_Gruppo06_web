<script>
    // Importa il lifecycle hook di Svelte che serve per eseguire codice una volta montato il componente.
    import { onMount } from "svelte";

    // Qui elenchi i video da mostrare nello slider.
    // Puoi cambiare questi percorsi per usare altri file video o aggiungere nuove slide.
    let videos = $state([
        "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro3.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro4.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro5.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro1.mp4",
        "/Cucina_Italiana/Video_introduzione/Sp_Intro2.mp4"
    ]);

    // Riferimento al contenitore dei pulsanti di navigazione.
    // Cambiando questa variabile puoi collegare altri gruppi di bottoni o animazioni esterne.
    let buttons;

    // Liste e stato delle slide e dei video.
    // videoElements tiene i riferimenti agli elementi <video>, currentIndex traccia la slide attiva.
    let videoElements = $state([])
    let currentIndex = $state(0);
    let videoSlides = $state([]);

    // Queste props sono usate per esporre le slide e i bottoni al componente esterno.
    // Se vuoi usare questo slider da un altro componente, puoi passare o leggere questi valori.
    let {el = $bindable(), elActive = $bindable(), elButtons = $bindable()} = $props()

    // COSTANTI MATEMATICHE PER LO SPOSTAMENTO PERFETTO ANCORATO A SINISTRA
    // Modifica questi valori se vuoi cambiare larghezza e spaziatura delle slide.
    const slideWidth = 250; // Larghezza base della slide
    const baseGap = 20;     // Gap del flexbox
    const activeRightSpace = 180; // Lo spazio extra a destra della slide attiva per distanziare le successive

    // Gestisce il cambio di slide: ferma il video corrente, sposta l'indice e avvia il nuovo video.
    // Se desideri un cambio meno aggressivo, puoi togliere il reset currentTime o modificare il delay.
    function updateVideos(newIndex) {
        if (videoElements[currentIndex]) {
            videoElements[currentIndex].pause();
            videoElements[currentIndex].currentTime = 0;
        }

        currentIndex = newIndex;

        setTimeout(() => {
            if (videoElements[currentIndex]) {
                videoElements[currentIndex].play().catch(err => console.log(err));
            }
        }, 50);
    }

    // Effetto reattivo che aggiorna la slide attiva esterna quando cambia currentIndex.
    // Questo ti permette di sincronizzare lo stato con altri componenti.
    $effect(()=> {
        if (videoSlides.length === 0) return;
        elActive = videoSlides[currentIndex] ?? null;
    })

    // Funzione che va alla slide successiva. Usa il modulo per tornare alla prima.
    function nextSlide() {
        const nextIndex = (currentIndex + 1) % videos.length;
        updateVideos(nextIndex);
    }

    // Funzione che va alla slide precedente. Il wrap-around mantiene lo slider ciclico.
    function prevSlide() {
        const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
        updateVideos(prevIndex);
    }

    // onMount esegue il primo avvio del video e assegna i riferimenti alle props.
    // Puoi aggiungere qui ulteriori inizializzazioni, come un autoplay diverso o un observer.
    onMount(() => {
        elButtons = buttons
        el = videoSlides
        if (videoElements[0]) videoElements[0].play().catch(() => {});
    });
</script>

<!-- Contenitore esterno dello slider: modifica padding e larghezza qui. -->
<div class="slider-outer">
    <div 
        class="slider-wrapper" 
        style="transform: translateX(-{currentIndex * (slideWidth + baseGap)}px);"
    >
        {#each videos as src, index}
            <!-- Ogni slide è un blocco video. Cambia la struttura interna se vuoi mostrare titolo o metadati. -->
            <div class="slider-slide" class:active={index === currentIndex} bind:this={videoSlides[index]}>
                <div class="video-container">
                    <video 
                        bind:this={videoElements[index]}
                        {src} 
                        muted 
                        loop 
                        playsinline
                    ></video>
                </div>
            </div>
        {/each}
    </div>

    <div class="navigation-container" bind:this={buttons}>
        <!-- Pulsante precedente: qui puoi cambiare classe, icona o comportamento. -->
        <button class="nav-btn" onclick={prevSlide} aria-label="Previous slide">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.106547 6.06082L8.55519 0.146764C9.08542 -0.224391 9.81396 0.154931 9.81396 0.802149V11.7291C9.81396 12.3763 9.08542 12.7556 8.55519 12.3845L0.106548 6.47043C-0.0356315 6.37091 -0.0356319 6.16034 0.106547 6.06082Z" fill="#F3F3F3"/>
            </svg>
        </button>

        <!-- Pulsante successivo: sostituisci l'icona o aggiungi aria-label personalizzata. -->
        <button class="nav-btn" onclick={nextSlide} aria-label="Next slide">
            <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.70742 6.06082L1.25877 0.146764C0.728548 -0.224391 0 0.154931 0 0.802149V11.7291C0 12.3763 0.728549 12.7556 1.25877 12.3845L9.70742 6.47043C9.8496 6.37091 9.8496 6.16034 9.70742 6.06082Z" fill="#F3F3F3"/>
            </svg>
        </button>
    </div>
</div>

<style>
    /* Impedisce lo scorrimento orizzontale sulla pagina globale. */
    :global(body) {
        overflow-x: hidden;
    }

    /* Contenitore principale dello slider: modifica dimensioni e padding. */
    .slider-outer {
        position: relative;
        width: 100dvw;
        padding: 40px 0;
    }

    /* Wrapper che scorre orizzontalmente: cambia gap e altezza per variare layout. */
    .slider-wrapper {
        display: flex;
        align-items: flex-end;
        gap: 20px; /* baseGap dello script */
        padding-left: 5%; /* Ancoraggio iniziale a sinistra di tutta la linea */
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        will-change: transform;
        height: 750px;
    }

    /* Stile base delle slide. Per slide più grandi usa width/height maggiori. */
    .slider-slide {
        flex-shrink: 0;
        width: 250px; /* slideWidth dello script */
        height: 444px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: margin 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    /* Regole per la slide attiva: puoi cambiare margine e trasformazione qui. */
    .slider-slide.active {
        margin-left: 40px;   /* Margine sinistro leggero per dare respiro allo scale(1.5) */
        margin-right: 20%; /* Spazio fisso generoso (activeRightSpace) per spingere le slide successive a destra */
    }

    /* Se la prima slide è attiva, mantieni il layout iniziale con padding-left. */
    .slider-slide.active:first-child {
        margin-left: 40px; /* Mantiene lo spazio per l'effetto zoom iniziale */
    }

    /* Contenitore del video: qui puoi aggiungere bordi, ombre o effetti hover. */
    .video-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 20px;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        transform: scale(1);
    }

    /* Effetto sulla slide attiva: modifica la scala o l'origine per cambiare l'animazione. */
    .slider-slide.active .video-container {
        transform: scale(1.7);
        transform-origin: bottom center;
        z-index: 2;
    }

    /* Stile del video all'interno della slide. */
    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20px;
    }

    /* Contenitore dei pulsanti: sposta i bottoni cambiando absolute/bottom/right. */
    .navigation-container {
        position: absolute;
        bottom: -5%;
        right: 21%;
        display: flex;
        gap: 15px;
        z-index: 10;
    }

    /* Stile dei pulsanti di navigazione. Cambia dimensione, colore o bordo qui. */
    .nav-btn {
        width: 50px;
        height: 50px;
        background: var(--brand-cibo-500);
        border-radius: 8px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s, transform 0.1s;
        border: none;
    }

    /* Stato attivo del bottone: cambia questo per effetti diversi al click. */
    .nav-btn:active {
        transform: scale(0.95);
    }
</style>