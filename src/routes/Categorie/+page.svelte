<script>
    import Categorie from "$lib/components/Card_Selection/Categorie.svelte";
	import Warning from "$lib/components/Card_Selection/warning.svelte";
	import Considerations from "$lib/components/Card_Selection/considerations.svelte";
	import Footer from "$lib/components/Card_Selection/footer.svelte";
	import ScrollBackProgress from "$lib/components/Card_Selection/ScrollBackProgress.svelte";

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
 <Warning />
 <Considerations/>
 <Footer />

 