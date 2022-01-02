import{S as j,i as C,s as I,e as u,t as N,c as f,a as y,g as Q,d,f as H,I as s,J as B,j as g,l as b,O as p,b as $,Q as J,H as K,K as O,L as U,N as z}from"../../chunks/vendor-47137bd9.js";function L(i,a,t){const n=i.slice();return n[2]=a[t],n}function S(i){let a,t=i[2].name+"",n;return{c(){a=u("h1"),n=N(t)},l(o){a=f(o,"H1",{});var h=y(a);n=Q(h,t),h.forEach(d)},m(o,h){H(o,a,h),s(a,n)},p:B,d(o){o&&d(a)}}}function D(i){let a,t,n,o,h,k,q,E,v,R,w,c,m=i[0],r=[];for(let l=0;l<m.length;l+=1)r[l]=S(L(i,m,l));return{c(){a=u("ul"),t=u("li"),n=u("br"),o=g(),h=u("br"),k=g(),q=u("br"),E=g();for(let l=0;l<r.length;l+=1)r[l].c();v=g(),R=u("hr"),w=g(),c=u("a"),this.h()},l(l){a=f(l,"UL",{style:!0});var _=y(a);t=f(_,"LI",{});var e=y(t);n=f(e,"BR",{}),o=b(e),h=f(e,"BR",{}),k=b(e),q=f(e,"BR",{}),E=b(e);for(let A=0;A<r.length;A+=1)r[A].l(e);v=b(e),R=f(e,"HR",{}),w=b(e),c=f(e,"A",{style:!0,href:!0});var x=y(c);x.forEach(d),e.forEach(d),_.forEach(d),this.h()},h(){p(c,"text-decoration","none"),p(c,"text-align","center"),p(c,"margin","300px auto"),p(c,"color","black"),$(c,"href",""),p(a,"list-style","none"),p(a,"margin","180px auto")},m(l,_){H(l,a,_),s(a,t),s(t,n),s(t,o),s(t,h),s(t,k),s(t,q),s(t,E);for(let e=0;e<r.length;e+=1)r[e].m(t,null);s(t,v),s(t,R),s(t,w),s(t,c)},p(l,[_]){if(_&1){m=l[0];let e;for(e=0;e<m.length;e+=1){const x=L(l,m,e);r[e]?r[e].p(x,_):(r[e]=S(x),r[e].c(),r[e].m(t,v))}for(;e<r.length;e+=1)r[e].d(1);r.length=m.length}},i:B,o:B,d(l){l&&d(a),J(r,l)}}}function F(i){K({url:"https://api-us-east-1.graphcms.com/v2/ckxuwv77f0a9i01wb8uelh6wo/master"});const a=O`
		query Author {
			authors {
				name
				picture {
					fileName
				}
			}
		}
	`;let t=U(a);return z(t),[t]}class M extends j{constructor(a){super();C(this,a,F,D,I,{})}}export{M as default};
