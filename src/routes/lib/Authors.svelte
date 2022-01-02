<script >
	import { initClient } from '@urql/svelte';
	initClient({
		url: 'https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master'
	});
	import { gql, operationStore, query } from '@urql/svelte';

	const authorQuery = gql`
		query Author {
			authors {
				name
				picture {
					fileName
				}
			}
		}
	`;
	let authors = operationStore(authorQuery);
	query(authors);
</script>

<ul style="list-style: none;    margin: 180px auto;">
	<li>
		<br /> <br />
		<br />
		{#each authors as author}
		<h1>{author.name}</h1>
		{/each}
		<hr />
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a style="text-decoration:none; text-align:center;margin:300px auto;color:black" href="">
		</a>
	</li>
</ul>
