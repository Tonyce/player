import PolkaRouter from 'polka';
import * as fs from 'fs';
import * as util from 'util';
const api = new PolkaRouter();

const fsStat = util.promisify(fs.stat);

const mp3_PATH = '/Users/ttang/testor/1.flac';
api.get('/music/1.mp3', async (req, res) => {
    const fileStat = await fsStat(mp3_PATH);
    const fileSizeInBytes = fileStat["size"];
    // console.log(fileStat);
    await new Promise((resolve, reject) => {
        res.statusCode = 200;
        res.setHeader('Content-Length', fileSizeInBytes);
        res.setHeader('Content-Type', 'chunked');
        const stream = fs.createReadStream(mp3_PATH);
        stream.on('data', (chunk) => res.write(chunk));
        stream.on('error', reject);
        stream.on('finish', resolve);
        // fs.readFile(mp3_PATH, (err, data) => {
        //     if (err) return reject(err)
        //     res.write(data);
        //     resolve();
        // });
    });
    res.end();
});

api.get('/version', async (req, res) => {
  const { APP_VERSION = '0.0.1' } = req;
  res.end(JSON.stringify({ appVersion: APP_VERSION}));
});


export default api;
