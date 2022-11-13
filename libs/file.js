import { EasyZip } from 'easy-zip';
import { writeFile, mkdir, existsSync, writeFileSync, promises } from 'fs';
import path from 'path';
import { COMPANY } from '../libs/front/constText';
const AdmZip = require('adm-zip');

const defaultPath = ['static', 'download'];
const DOWNLOADPATH = path.join(process.cwd(), ...defaultPath);

const pureMakeFile = (fileName) => {
	const folder = `${DOWNLOADPATH}/${fileName}`;
	if (!existsSync(folder)) {
		mkdir(folder, '0777', (err) => {
			if (err) throw err;
		});
	}
};

const makeFile = (fileName, data, format, type) => {
	const folder = `${DOWNLOADPATH}/${fileName}`;
	const file = `${folder}/${COMPANY}${fileName}_${type}.csv`;
	let result;
	const writer = async (file, data, format) => {
		return await promises.writeFile(file, data, format, (err) => {
			if (err) throw err;
			//zipFile(folder);
			return true;
		});
	};

	if (existsSync(folder)) {
		result = writer(file, data, format);
	} else {
		mkdir(folder, '0777', (err) => {
			if (err) throw err;
			result = writer(file, data, format);
		});
	}

	return result;
};

const zipFile = async (fileName) => {
	var zip = new EasyZip();
	const folder = `${DOWNLOADPATH}/${fileName}`;
	const filePath = folder + '.zip';
	//const cb = send(ctx, 'csv.zip', { root: downloadPath })();
	try {
		zip.zipFolder(folder, async () => {
			zip.writeToFile(filePath);
		});
	} catch (e) {
		console.log(e);
	}
};

const admZip = async (fileName) => {
	const zip = new AdmZip();
	const outputFile = `${fileName}.zip`;
	const folder = `${DOWNLOADPATH}/${fileName}`;
	zip.addLocalFolder(folder);
	zip.writeZip(`${folder}.zip`);
	console.log(`Created ${outputFile} successfully`);
};

const checkFile = (fileName) => {
	const file = `${DOWNLOADPATH}/${fileName}/${COMPANY}${fileName}`;
	if (existsSync(file)) {
		return true;
	}
	return false;
};

export { makeFile, zipFile, checkFile, pureMakeFile, admZip };
