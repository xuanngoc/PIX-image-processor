import express, { Request, response, Response } from 'express';
import axios, { AxiosError } from 'axios';
import sharp, { Sharp } from 'sharp';
import fs from 'fs';

const app = express();

app.set("port", process.env.PORT || 3000);

app.get('/', async(req: Request, res: Response) => {
  const fileURL: string = req.query.pathUrl as string;

  if (fileURL === undefined || fileURL === '') {
    res.status(422).end();
    return;
  }

  try {
    let imageBuffer: Buffer = await axios
      .get(fileURL, { responseType: 'arraybuffer' })
      .then(res => Buffer.from(res.data, 'binary'));

      let thumbnail: Buffer = await sharp(imageBuffer).resize(100, 67).toBuffer();

      let image: Sharp = await sharp(imageBuffer)
        .resize(300, 200)
        .composite([{
          input: thumbnail,
          left: 0,
          top: 200 - 67
        }])

      await image.toFile('out.webp');

      fs.readFile('out.webp', (err:  NodeJS.ErrnoException, data: Buffer) => {
        if (err) throw err;

        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data);
      })
      return;
  } catch (error) {
    res.status(422).send(error.message).end();
    return;
  }

});

export default app;
