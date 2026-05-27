<script>
    import Page from "../../routes/+page.svelte";

    let { variant = 'blue', children} = $props();
</script>

<div class={`comm comm-${variant}`}>
    <svg width="44" height="49" viewBox="0 0 44 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path id="background-icon" d="M0 22C0 9.84974 9.84974 0 22 0C34.1503 0 44 9.84974 44 22V27C44 39.1503 34.1503 49 22 49C9.84974 49 0 39.1503 0 27V22Z"/>
        <ellipse id="head-icon" cx="6" cy="7" rx="6" ry="7" transform="matrix(1 0 0 -1 16 22)"/>
        <path id="body-icon" d="M22 41C16.4772 41 12 36.5228 12 31H32C32 36.5228 27.5228 41 22 41Z"/>
    </svg>

    <div id="textContainer">
        <p id="User">User</p>
        {@render children?.()}
    </div>
</div>


<style>

:global(*){
    margin: 0;
    padding: 0;
}
    .comm{
        display: flex;
        flex-direction: row;
        gap: 1.31rem;
        padding: 12px;
        height: fit-content;
        width: fit-content;
        justify-content: center;
        align-items: flex-start;
        border-radius: 16px;
    }

    #textContainer{
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        width: 12.2rem;
        height: fit-content;
        color: var(--neutral-50);
        font-family: var(--font-family-text);
        font-size: 1.25rem;
    }

    #User{
        font-size: 1rem;

    }

    .comm-blue{
        background-color: var(--brand-sport-insoliti-500);
    }

    .comm-blue #head-icon, 
    .comm-blue #body-icon{
        fill: var(--brand-sport-insoliti-500);
    }

    .comm-blue #background-icon{
        fill: var(--brand-sport-insoliti-300);
    }
    
    .comm-red{
        background-color: var(--brand-villaggio-500);
    }

    .comm-red #head-icon, 
    .comm-red #body-icon{
        fill: var(--brand-villaggio-500);
    }

    .comm-red #background-icon{
        fill: var(--brand-villaggio-200);
    }
   
   
    .comm-yellow{
        background-color: var(--brand-cibo-500);
    }

    .comm-yellow #head-icon, 
    .comm-yellow #body-icon{
        fill: var(--brand-cibo-500);
    }

    .comm-yellow #background-icon{
        fill: var(--brand-cibo-300);
    }
    
    
    .comm-purple{
        background-color: var(--brand-vip-500);
    }

    .comm-purple #head-icon, 
    .comm-purple #body-icon{
        fill: var(--brand-vip-500);
    }

    .comm-purple #background-icon{
        fill: var(--brand-vip-300);
    }
</style>
