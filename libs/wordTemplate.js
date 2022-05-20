import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
// import PizZipUtils from 'pizzip/utils/index.js';

const fs = require('fs');
const path = require('path');
import { getToday } from './common';
import { WEBTITLE } from './front/constText';

// Load the docx file as binary content

export const wordTemplate = async function (data) {
	data.today = getToday();
	data.school_name = WEBTITLE;
	let type = data.train_period_name.substr(-1);
	let fileName = `${data.user_name}_${data.user_id}.docx`;

	const content = fs.readFileSync(
		path.resolve(`static/word/contract_${type}.docx`),
		'binary'
	);

	const zip = new PizZip(content);

	const doc = new Docxtemplater(zip, {
		paragraphLoop: true,
		linebreaks: true,
	});

	// Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
	doc.render(data);

	const buf = doc.getZip().generate({
		type: 'nodebuffer',
		// compression: DEFLATE adds a compression step.
		// For a 50MB output document, expect 500ms additional CPU time
		compression: 'DEFLATE',
	});

	// buf is a nodejs Buffer, you can either write it to a
	// file or res.send it with express for example.
	try {
		fs.writeFileSync(path.resolve(`static/word/${fileName}`), buf);
		return `${fileName}`;
	} catch (e) {
		console.log(`write file err ==================== ${e}`);
		return '檔案產生失敗';
	}
};
