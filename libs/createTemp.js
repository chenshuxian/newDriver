import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import expressions from 'angular-expressions';
import { merge, map } from 'lodash';
const fs = require('fs');
const path = require('path');

function angularParser(tag) {
	if (tag === '.') {
		return {
			get: function (s) {
				return s;
			},
		};
	}
	const expr = expressions.compile(tag.replace(/(’|“|”|‘)/g, "'"));
	return {
		get: function (scope, context) {
			let obj = {};
			const scopeList = context.scopeList;
			const num = context.num;
			for (let i = 0, len = num + 1; i < len; i++) {
				obj = merge(obj, scopeList[i]);
			}
			return expr(scope, obj);
		},
	};
}

const createTemplate = (tempName, data) => {
	const content = fs.readFileSync(
		path.resolve(`static/word/${tempName}.docx`),
		'binary'
	);

	// console.log(JSON.stringify(data));

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
		parser: angularParser,
	});

	// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
	doc.render(data);

	const buf = doc.getZip().generate({
		type: 'nodebuffer',
		// compression: DEFLATE adds a compression step.
		// For a 50MB output document, expect 500ms additional CPU time
		compression: 'DEFLATE',
	});

	return buf;
};

export { createTemplate };
