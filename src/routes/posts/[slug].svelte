<script context="module">
  export const load = async ({ page: { params } }) => {
    const { slug } = params
    return { props: { slug } }
  }
</script>
<script>
  export let slug
  import { gql, operationStore, query } from '@urql/svelte'

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
  `
  // slug is passed as a parameter in the operationStore function
  const post = operationStore(productQuery, { slug })

  query(post)
</script>