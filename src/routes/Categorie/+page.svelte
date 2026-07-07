<script>
    import Categorie from "$lib/components/Card_Selection/Categorie.svelte";
    import Warning from "$lib/components/Card_Selection/warning.svelte";
    import Considerations from "$lib/components/Card_Selection/considerations.svelte";
    import Footer from "$lib/components/Card_Selection/footer.svelte";
    import ScrollBackProgress from "$lib/components/Card_Selection/ScrollBackProgress.svelte";
    import { hasNavigatedCategory, warningGateCompleted } from "$lib/store/categoryNav.js";

    function resetBodyHeight(node) {
        node.classList.add('no-scroll-counter');
        return {
            destroy() {
                node.classList.remove('no-scroll-counter');
            }
        };
    }
</script>

<svelte:body use:resetBodyHeight />

<ScrollBackProgress />
<Categorie />
{#if !$hasNavigatedCategory && !$warningGateCompleted}
    <Warning />
{/if}
<Considerations />
<Footer />

<style>
    @media(max-width:450px){
        :global(body){
            cursor: none;
        }
    }
</style>