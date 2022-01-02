import { c as create_ssr_component } from "../../chunks/index-6fe57fc4.js";
import { i as initClient } from "../../chunks/urql-svelte-9d42347b.js";
const _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  initClient({
    url: "https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master"
  });
  return `${slots.default ? slots.default({}) : ``}`;
});
export { _layout as default };
