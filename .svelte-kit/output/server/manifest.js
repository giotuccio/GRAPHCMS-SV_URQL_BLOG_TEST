export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png"]),
	_: {
		mime: {".png":"image/png"},
		entry: {"file":"start-5e8e0af4.js","js":["start-5e8e0af4.js","chunks/vendor-47137bd9.js"],"css":["assets/start-61d1577b.css"]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js')
		],
		routes: [
			{
				type: 'page',
				pattern: /^\/$/,
				params: null,
				path: "/",
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/posts\/([^/]+?)\/?$/,
				params: (m) => ({ slug: m[1]}),
				path: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/lib\/Authors\/?$/,
				params: null,
				path: "/lib/Authors",
				a: [0,4],
				b: [1]
			},
			{
				type: 'page',
				pattern: /^\/lib\/Post\/?$/,
				params: null,
				path: "/lib/Post",
				a: [0,5],
				b: [1]
			}
		]
	}
};
