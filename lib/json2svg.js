const fs = require('fs');

class Json2Svg {
	constructor(opts) {
		this.inputFile = opts.inputFile;
		this.outputDir= opts.outputDir;
		this.cleanStepBefore = opts.cleanStepBefore;
		this.cleanStepAfter = opts.cleanStepAfter;
	}

	apply(compiler) {
		compiler.hooks.afterPlugins.tap('JSON2SVG', () => {
			let rawData = fs.readFileSync(this.inputFile);
      const svgJson = JSON.parse(rawData);

      if (this.cleanStepBefore && this.cleanStepBefore == true) {
        let regex = /[.]svg/;
        fs.readdirSync(this.outputDir).filter(f => regex.test(f)).map(f => fs.unlinkSync(this.outputDir + '/' + f));
      }

      for (const [idx, val] of Object.entries(svgJson)) {
        let cout = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="' + val.viewbox + '">';
        cout += val.svg
        cout += '</svg>'
        fs.writeFileSync(this.outputDir + '/' + idx + '.svg', cout);
      }
    });

    if (this.cleanStepAfter && this.cleanStepAfter == true) {
      compiler.hooks.done.tap('JSON2SVG', () => {
        let regex = /[.]svg$/
        fs.readdirSync(this.outputDir).filter(f => regex.test(f)).map(f => fs.unlinkSync(this.outputDir + '/' + f));
      });
    }
	}
}

module.exports = Json2Svg;
