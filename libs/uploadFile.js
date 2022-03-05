import errorCode from './errorCode';
import formidable from 'formidable';
import parse from 'csv-parser';
import fs from 'fs';
import path from 'path'
import { strToDate } from './common';
import { v4 as uuidv4 } from 'uuid';

const defaultPath = ['static', 'images'];

const isImage = (type) => {
  const validTypes = ["jpg", "jpeg", "png"];
  if (validTypes.indexOf(type) === -1) {
    return false;
  }
  return true;
};

const uploadImage = function(req, res, imagePath) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    const uploadFolder = path.join(process.cwd(), ...defaultPath, imagePath);

    form.parse(req, function (err, _fields, files) {
      if (err) {
        res.status(400).json(errorCode.UploadFailed);
        return;
      }

      if (!files.file || Array.isArray(files.file) ) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      const file = files.file;
      const baseName = file.filepath.replace(/.*_/, '');
      const fileExt = file.originalFilename.split('.').pop();
      const isValid = isImage(fileExt);

      if (!isValid) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      if (!fs.existsSync(uploadFolder)) {
        try {
          fs.mkdirSync(uploadFolder);
        } catch (e) {
          res.status(500).json(errorCode.InternalServerError);
          return;
        }
      }

      let fileName;
      let filePath;
      do {
        fileName = `${uuidv4()}.${fileExt}`
        filePath = path.join(uploadFolder, fileName);
      } while (fs.existsSync(filePath));

      try {
        fs.renameSync(file.filepath, filePath);
      } catch (e) {
        console.log(e)
        res.status(500).json(errorCode.InternalServerError);
        return;
      }

      res.status(200).json({
        imageUrl: `${path.join(imagePath, fileName)}`
      })
    });
  });
}

const uploadCSV = function(req, res, cb, cbArgs) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, async function (err, _fields, files) {
      if (err) {
        res.status(400).json(errorCode.UploadFailed);
        return;
      }

      if (!files.file || Array.isArray(files.file) ) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      const file = files.file;
      const fileExt = file.name.split('.').pop();
      const isValid = fileExt.toLowerCase() === 'csv';

      if (!isValid) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      let records = []
      const parser = fs.createReadStream(file.path).pipe(parse());
      for await (const record of parser) {
        if (!record[0]) {
          continue;
        }

        records.push(record)
      }

      try {
        fs.rmSync(file.path);
      } catch (e) {
        res.status(500).json(errorCode.InternalServerError);
      }

      try {
        const result = await cb(records, cbArgs);
        res.status(200).json(result);
      } catch (e) {
        res.status(e.statusCode).json(e);
      }
    });
  });
}

const uploadJSON = function(req, res, create) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });

    form.parse(req, async function (err, _fields, files) {
      if (err) {
        res.status(400).json(errorCode.UploadFailed);
        return;
      }

      if (!files.file || Array.isArray(files.file) ) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      const file = files.file;
      const fileExt = file.originalFilename.split('.').pop();
      const isValid = fileExt.toLowerCase() === 'csv';

      if (!isValid) {
        res.status(400).json(errorCode.BadRequest);
        return;
      }

      let records = []
      const parser = fs.createReadStream(file.filepath).pipe(parse({}));
      for await (const record of parser) {
        let tpe = strToDate(record['train_period_end']);
        record['train_period_start'] = strToDate(record['train_period_start']);
        record['train_period_end'] = tpe;
        record['train_period_exam'] = new Date(tpe).addDays(3)
        records.push(record)
      }

      try {
        fs.rmSync(file.filepath);
      } catch (e) {
        res.status(500).json(errorCode.InternalServerError);
      }

      try {
        const result = await create(records);
        res.status(200).json(result);
      } catch (e) {
        res.status(e.statusCode).json(e);
      }

    });
  });
}

export { uploadImage, uploadCSV, uploadJSON };