import express, { Request, Response } from 'express';
import axios from 'axios';
import sharp, { Sharp } from 'sharp';

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

      let image: Sharp = sharp(imageBuffer)
        .resize(300, 200)
        .composite([{
          input: thumbnail,
          left: 0,
          top: 200 - 67
        }])

      let resultImageBuffer: Promise<Buffer> = image.toBuffer();

      await Promise.all([image.toFile('out.webp'), resultImageBuffer]);

      resultImageBuffer.then((buffer: Buffer) => {
        res.writeHead(200, {'Content-Type': 'image/webp'});

        res.end(buffer, 'binary');
      })

  } catch (error) {
    res.status(422).send(error.message).end();
    return;
  }
  return;
});

export default app;
