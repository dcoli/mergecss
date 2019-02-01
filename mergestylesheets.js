#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
const execa = require('execa');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const outset = new Set();

async function read1 (file) {
  const data = await readFile(file, 'utf8');
  const lines = data.split(/\n/);
  console.log(lines[0]);
  process.stdout.write(lines[0]);
}

async function read2 (file) {
  return new Promise(resolve => {
    let header;
    const label = `read2-${file}`;
    // console.time(label);
    const stream = fs.createReadStream(file, {encoding: 'utf8'});
    stream.on('data', data => {
      header = data.split(/\n/)[0];
      stream.destroy();
    });
    stream.on('close', () => {
      // console.timeEnd(label);
      resolve();
    });
  });
}

async function startTests(files) {
  for (let file of files) {
    console.log(file);
    await read1(file);
    await read2(file);
  }
}

let dir = process.argv[2];
readdir(dir).then(files => {
	console.log(dir);
	for( let file of files.filter(file => /\.css$/.test(file)) ) {
		console.log(file);
		read1(dir + file);
	}
});
// const label = ;
// console.time(label);
// console.timeEnd(label);

