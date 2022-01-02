import{S as a,i as l,s as i,K as c,L as g,N as p}from"../../chunks/vendor-47137bd9.js";const m=async({page:{params:t}})=>{const{slug:s}=t;return{props:{slug:s}}};function d(t,s,o){let{slug:e}=s;const r=c`
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
  `,u=g(r,{slug:e});return p(u),t.$$set=n=>{"slug"in n&&o(0,e=n.slug)},[e]}class h extends a{constructor(s){super();l(this,s,d,null,i,{slug:0})}}export{h as default,m as load};
