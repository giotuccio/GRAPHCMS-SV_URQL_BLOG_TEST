<script>
	import Authors from './lib/Authors.svelte';
	import { initClient } from '@urql/svelte';
	initClient({
		url: 'https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master'
	});
	import { gql, operationStore, query } from '@urql/svelte';

	const postsQuery = gql`
		query Posts {
			posts {
				title
				date
				excerpt
				tags
				author {
					biography
					name
					picture {
						id
						fileName
					}
				}
				coverImage {
					url(transformation: { image: { resize: { fit: clip, width: 600 } } })
					authorAvatar {
						picture {
							authorAvatar {
								name
							}
						}
					}
				}
				content {
					html
					text
				}
				publishedBy {
					name
					picture
					id
				}
				slug
			}
		}
	`;
	const authorQuery = gql`
		query Authors {
			authors {
				picture {
					fileName
					authorAvatar {
						name
					}
				}
			}
		}
	`;
	let authors = operationStore(authorQuery);
	const posts = operationStore(postsQuery);
	query(authors);
	query(posts);
</script>

{#if $posts.fetching}
	<p>loading..</p>
{:else if $posts.error}
	<p>Oopsie! {$posts.error.message}</p>
{:else}
	<h2
		style="margin-top: 190px ;font-size:50px;
    text-align: center;"
	>
		Welcome
	</h2>
	<ul style="list-style: none;    margin: 180px auto;">
		{#each $posts.data.posts as post}
			<li>
				<br /> <br />
				<br />
				<hr />
				<a
					style="text-decoration:none; text-align:center;margin:300px auto;color:black"
					href={post.slug}
				>
					<h2>{post.slug}</h2>
					<h2 style="font-size: 40px;">{post.title}</h2>
					<p>{post.excerpt}</p>
					<p>{post.author.name}</p>
					<h1>{post.date}</h1>
					<h1>												<img src={post.author.picture.fileName} style="border-radius: 50px;" alt={post.author.picture.fileName.length}/>
FILE FOR IMG:{post.author.picture.fileName}</h1>
					<br />
				
					<p>{post.content.text}</p>
		
					<figure style="padding:10em 0em 2em 0em">
						<img style="border-radius: 50px;" src={post.coverImage.url} alt={post.title} />
												<!-- svelte-ignore a11y-missing-attribute -->
												<!-- <Authors/> -->


					</figure>

					{#if post.tags}
						{#each post.tags as tag}
							<div>
								<span style="font-size: 22px;">{tag}</span>
							</div>
						{/each}
					{/if}
				</a>
			</li>
		{/each}
	</ul>
{/if}
	
		<!-- svelte-ignore empty-block -->
	