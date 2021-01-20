const fs = require('fs');

class Json2Svg {
	constructor(opts) {
		this.relativePath = opts.relativePath;
		this.inputFile = opts.inputFile;
	}

	apply(compiler) {
		compiler.hooks.afterPlugins.tap('JSON2SVG', () => {
				const pth = compiler.context + '/' + this.relativePath + '/' + this.inputFile;
				let rawData = fs.readFileSync(pth);
				const svgJson = JSON.parse(rawData);
				for (const [idx, val] of Object.entries(svgJson)) {
					let cout = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';
					cout += '<symbol id="' + idx + '" viewBox="' + val.viewbox + '">';
					cout += val.svg
					cout += '</symbol></defs>'
					fs.writeFileSync(compiler.context + '/' + this.relativePath + '/' + idx + '.svg', cout);
				}
		});
		compiler.hooks.done.tap('JSON2SVG', () => {
			const pth = compiler.context + '/' + this.relativePath;
			let regex = /[.]svg$/
			fs.readdirSync(pth).filter(f => regex.test(f)).map(f => fs.unlinkSync(pth + '/' + f));
		});
	}
}
	
module.exports = Json2Svg;