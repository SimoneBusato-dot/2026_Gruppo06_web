<script>
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/variables.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	
</svelte:head>

{@render children()}

<style>
    :global(body){
        margin: 0;
        padding: 0;
       

    /* Per Internet Explorer, Edge e Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    }

	:global(body::-webkit-scrollbar) {
    display: none; /* Chrome, Safari */
}
</style>
