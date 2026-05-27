<script>
   import SportInsoliti from '$lib/components/Sport_Strambi/Sport_Insoliti.svelte';

</script>

<SportInsoliti />

<style>
:global(.gsap-marker-end, .gsap-marker-start) {
    display: none;
}

:global(body) {
    overflow-x: hidden;
}

:global(::-webkit-scrollbar) {
    display: none;
}

:global(.pin-spacer) {
    pointer-events: none;
}

:global(.pin-spacer main) {
    pointer-events: auto;
}

</style>