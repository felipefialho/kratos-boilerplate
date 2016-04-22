examples.lang = {
	color: function (pre, value) {
		var colors = pre.parentNode.insertBefore(document.createElement('div'), pre);
		var lines = value.trim().split(/\n+/);

		colors.className = 'colors';

		lines.map(parseLine).map(parseColor).forEach(colors.appendChild, colors);

		function parseLine(line) {
			line = line.trim();

			var color = {};
			var match = /@([^:]+):\s*(.+?)(?=\s+@|$)/g;
			var prop;

			while (prop = match.exec(line)) color[prop[1]] = prop[2];

			return color;
		}

		function parseColor(color) {
			var colorNode = document.createElement('div');

			colorNode.className = 'color';

			var swatchNode = colorNode.appendChild(document.createElement('div'));

			swatchNode.className = 'color-swatch';

			swatchNode.style.backgroundColor = color.color;

			var contrastColor = contrast(color.color);

			swatchNode.style.color = contrastColor;

			swatchNode.style.textShadow = '0 0 1px ' + (contrastColor === '#ffffff' ? '#000000' : '#ffffff');

			swatchNode.appendChild(document.createTextNode(color.color));

			Object.keys(color).filter(function (key) { return key !== 'color' }).forEach(function (key) {
				var propertyNode = colorNode.appendChild(document.createElement('div'));

				propertyNode.className = 'color-property';

				propertyNode.setAttribute('data-name', key);

				propertyNode.appendChild(document.createTextNode(color[key]));
			});

			return colorNode;
		}

		function hex2rgb(hex) {
			var bigint = parseInt(hex.slice(1).replace(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3'), 16);
			var r = (bigint >> 16) & 255;
			var g = (bigint >> 8) & 255;
			var b = bigint & 255;

			return [r, g, b];
		}

		function getRGB(color) {
			return /^#/.test(color) ? hex2rgb(color) : color.replace(/[^\d,]+/g, '').split(/,/).map(function (part) { return part * 1; });
		}

		function contrast(color) {
			var rgb = getRGB(color);
			var o   = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);

			return o <= 180 ? '#ffffff' : '#000000';
		}
	},
	html: function (pre, value, conf) {
		// get wrap
		var wrap = pre.parentNode;

		var iframe = wrap.insertBefore(document.createElement('iframe'), pre);
		var style  = iframe.style;

		// get iframe dom
		var iwin = iframe.contentWindow;
		var idoc = iwin.document;

		// write example content to iframe
		idoc.open();

		var html = '<base' + (
			examples.base && ' href="' + examples.base + '"'
		) + (
			examples.target && ' target="' + examples.target + '"'
		) + '>';

		html += examples.css.map(function (css) {
			return '<link href="' + css + '" rel="stylesheet">';
		}).join('');

		html += examples.js.map(function (js) {
			return '<script src="' + js + '"></script>';
		}).join('');

		html += value;

		html += examples.bodyjs.map(function (js) {
			return '<script src="' + js + '"></script>';
		}).join('');

		idoc.write(html);

		idoc.close();

		// add default block styles to iframe dom
		idoc.documentElement.setAttribute('style', examples.htmlcss);
		idoc.body.setAttribute('style', examples.bodycss);

		if (conf.width) style.width = String(conf.width);

		// set iframe height based on content
		var documentElement = idoc.documentElement;
		var scrollHeight;

		function resize() {
			var currentScrollHeight = documentElement.scrollHeight;

			if (scrollHeight !== currentScrollHeight) {
				scrollHeight = currentScrollHeight;

				style.height = 0;

				style.height = documentElement.scrollHeight + (iframe.offsetHeight - iwin.innerHeight) + 'px';
			}
		}

		iwin.addEventListener('load', resize);

		resize();

		setInterval(resize, 334);
	}
};
