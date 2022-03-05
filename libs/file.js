import { EasyZip } from 'easy-zip';
import { writeFile, mkdir, existsSync, writeFileSync, promises } from 'fs';
import path from "path";


const defaultPath = ['static','download']
const DOWNLOADPATH = path.join(process.cwd(), ...defaultPath);
const COMPANY = '260002';

const makeFile = (fileName, data, format, type) => {

    const folder = `${DOWNLOADPATH}/${fileName}`;
    const file = `${folder}/${COMPANY}${fileName}_${type}.csv`;
    let result;
    const writer = async (file, data, format) => {
        return await promises.writeFile(file, data, format, (err) => {
            if (err) throw err;
            //zipFile(folder);
            return true;
        })
    }

    if (existsSync(folder)) {
        result = writer(file, data, format)
    } else {
        mkdir(folder, '0777', (err) => {
            if (err) throw err;
            result = writer(file, data, format)
        })
    }

    return result;

}

const zipFile = (fileName) => {
    var zip = new EasyZip();
    const folder = `${DOWNLOADPATH}/${fileName}`;
    const filePath = folder + '.zip';
    //const cb = send(ctx, 'csv.zip', { root: downloadPath })();
    zip.zipFolder(folder, async () => {
        zip.writeToFileSycn(filePath);
    });
   
}

const checkFile = (fileName) => {
    const file = `${DOWNLOADPATH}/${fileName}/${COMPANY}${fileName}`;
    if (existsSync(file)) {
        return true;
    }
     return false;
}


export { makeFile, zipFile, checkFile };