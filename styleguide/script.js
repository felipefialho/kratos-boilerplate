/* eslint-env browser */
/* global examples, Prism */

document.addEventListener('DOMContentLoaded', function () {
	Array.prototype.forEach.call(document.querySelectorAll('pre code[class^="lang"]'), function (code) {
		// set pre, wrap, opts, and get meta data from code
		var pre  = code.parentNode;
		var wrap = pre.parentNode.insertBefore(document.createElement('figure'), pre);
		var conf = {};
		var text = String(code.textContent || code.innerText || '');

		// get meta data from code class
		code.className.replace(/^lang-(\w+)(?::(\w+))?/, function ($0, $1, $2) {
			if ($2) return 'example:' + $2 + ',lang:' + $2;

			if ($1 === 'example') return 'example:html';

			return 'lang:' + $1;
		}).split(/\s*,\s*/).forEach(function (opt) {
			opt = opt.split(':');

			conf[opt.shift().trim()] = opt.join(':').trim();
		});

		code.removeAttribute('class');

		wrap.appendChild(pre);

		// conditionally syntax highlight code
		if (conf.lang in Prism.languages) code.innerHTML = Prism.highlight(text, Prism.languages[conf.lang]);

		// conditionally create code examples
		if (conf.example in examples.lang) {
			examples.lang[conf.example](pre, text, conf);

			if (!(conf.lang in Prism.languages)) wrap.removeChild(pre);
		}
	});
});
