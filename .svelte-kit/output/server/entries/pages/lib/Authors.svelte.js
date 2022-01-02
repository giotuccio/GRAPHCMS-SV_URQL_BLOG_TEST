import { c as create_ssr_component, d as each, e as escape } from "../../../chunks/index-6fe57fc4.js";
import { i as initClient, g as gql, o as operationStore, q as query } from "../../../chunks/urql-svelte-9d42347b.js";
const Authors = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  initClient({
    url: "https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master"
  });
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
  return `<ul style="${"list-style: none; margin: 180px auto;"}"><li><br> <br>
		<br>
		${each(authors, (author) => `<h1>${escape(author.name)}</h1>`)}
		<hr>
		
		<a style="${"text-decoration:none; text-align:center;margin:300px auto;color:black"}" href="${""}"></a></li></ul>`;
});
export { Authors as default };
