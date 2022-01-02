import { c as create_ssr_component, b as subscribe, e as escape, d as each, f as add_attribute } from "../../chunks/index-6fe57fc4.js";
import { i as initClient, g as gql, o as operationStore, q as query } from "../../chunks/urql-svelte-9d42347b.js";
const Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $posts, $$unsubscribe_posts;
  initClient({
    url: "https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master"
  });
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
  $$unsubscribe_posts = subscribe(posts, (value) => $posts = value);
  query(authors);
  query(posts);
  $$unsubscribe_posts();
  return `${$posts.fetching ? `<p>loading..</p>` : `${$posts.error ? `<p>Oopsie! ${escape($posts.error.message)}</p>` : `<h2 style="${"margin-top: 190px ;font-size:50px; text-align: center;"}">Welcome
	</h2>
	<ul style="${"list-style: none; margin: 180px auto;"}">${each($posts.data.posts, (post) => `<li><br> <br>
				<br>
				<hr>
				<a style="${"text-decoration:none; text-align:center;margin:300px auto;color:black"}"${add_attribute("href", post.slug, 0)}><h2>${escape(post.slug)}</h2>
					<h2 style="${"font-size: 40px;"}">${escape(post.title)}</h2>
					<p>${escape(post.excerpt)}</p>
					<p>${escape(post.author.name)}</p>
					<h1>${escape(post.date)}</h1>
					<h1><img${add_attribute("src", post.author.picture.fileName, 0)} style="${"border-radius: 50px;"}"${add_attribute("alt", post.author.picture.fileName.length, 0)}>
FILE FOR IMG:${escape(post.author.picture.fileName)}</h1>
					<br>
				
					<p>${escape(post.content.text)}</p>
		
					<figure style="${"padding:10em 0em 2em 0em"}"><img style="${"border-radius: 50px;"}"${add_attribute("src", post.coverImage.url, 0)}${add_attribute("alt", post.title, 0)}>
												
												</figure>

					${post.tags ? `${each(post.tags, (tag) => `<div><span style="${"font-size: 22px;"}">${escape(tag)}</span>
							</div>`)}` : ``}</a>
			</li>`)}</ul>`}`}
	
		`;
});
export { Routes as default };
