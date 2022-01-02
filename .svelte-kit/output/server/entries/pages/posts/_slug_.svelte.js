import { c as create_ssr_component } from "../../../chunks/index-6fe57fc4.js";
import { g as gql, o as operationStore, q as query } from "../../../chunks/urql-svelte-9d42347b.js";
const load = async ({ page: { params } }) => {
  const { slug } = params;
  return { props: { slug } };
};
const U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { slug } = $$props;
  const productQuery = gql`
    query Post($slug: String!) {
      post(where: { slug: $slug }) {
        title
        date
        tags
        content {
          html
        }
        coverImage {
          url(transformation: { image: { resize: { fit: clip, width: 600 } } })
        }
      }
    }
  `;
  const post = operationStore(productQuery, { slug });
  query(post);
  if ($$props.slug === void 0 && $$bindings.slug && slug !== void 0)
    $$bindings.slug(slug);
  return ``;
});
export { U5Bslugu5D as default, load };
