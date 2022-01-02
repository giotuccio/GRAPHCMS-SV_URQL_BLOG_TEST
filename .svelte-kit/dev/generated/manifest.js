const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\posts\\[slug].svelte"),
	() => import("..\\..\\..\\src\\routes\\lib\\Authors.svelte"),
	() => import("..\\..\\..\\src\\routes\\lib\\Post.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/posts/[slug].svelte
	[/^\/posts\/([^/]+?)\/?$/, [c[0], c[3]], [c[1]], (m) => ({ slug: d(m[1])})],

	// src/routes/lib/Authors.svelte
	[/^\/lib\/Authors\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/lib/Post.svelte
	[/^\/lib\/Post\/?$/, [c[0], c[5]], [c[1]]]
];

// we import the root layout/error components eagerly, so that
// connectivity errors after initialisation don't nuke the app
export const fallback = [c[0](), c[1]()];