#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
// const execa = require('execa');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const mediaMap = Object.create(null);
mediaMap.all = new Set();

async function read1 (file) {
  const data = await readFile(file, 'utf8');
  const lines = data.split(/\n/);
  // let inMedia = false;
  let mediaName = 'all';
  console.log(lines[0]);
  for( let line of lines ) {
    let matches = /^\@media ([^{]*){/.exec(line);
    if(matches && matches[1].length > 0) {
      // inMedia = true;
      mediaName = matches[1];
      if( ! mediaMap[mediaName] ) {
        mediaMap[mediaName] = new Set();
      }
    } 
    else if( line === '}\n') mediaName = 'all';
    else {
      await cleanup(line)
        .then( (formline) => {
          mediaMap[mediaName].add(formline);
         } ); 
      
    }
  }
  // // console.log(mediaMap);
  // for( let m in mediaMap ) {
  //   console.log('****************' + m + '******************');
  //   console.log([...mediaMap[m]].join('\n'));
  // }
}

async function cleanup( line ) {
  line.replace('{',' {\n  ');
  line.replace(';',';\n  ');
  line.replace('  }','}');
  console.log('ya');
  return line;
}

let dir = process.argv[2] || './';
readdir(dir).then( async function(files) {
	console.log(dir);
	for( let file of files.filter(file => /\.css$/.test(file)) ) {
		console.log(file);
		await read1(dir + file);
  }
  //write global styles
  // console.log(mediaMap);
  let globals = [...mediaMap.all].join('\n')
  // console.log();
  fs.writeFileSync('out.css',globals);
    // .catch(e,() => { console.log('whoops'); });
  for( let medi in mediaMap ) {
    if( medi !== 'all' ) {
      fs.writeFileSync('out.css','\n@media '+medi+' {');
      // console.log('\n@media '+medi+' {');
      fs.writeStreamSync('out.css',([...mediaMap[medi]].join('\n').toString()));
      // console.log([...mediaMap[medi]].join('\n'));
    }
  }
});


// async function read2 (file) {
//   return new Promise(resolve => {
//     let header;
//     const label = `read2-${file}`;
//     // console.time(label);
//     const stream = fs.createReadStream(file, {encoding: 'utf8'});
//     stream.on('data', data => {
//       header = data.split(/\n/)[0];
//       stream.destroy();
//     });
//     stream.on('close', () => {
//       // console.timeEnd(label);
//       resolve();
//     });
//   });
// }

// async function startTests(files) {
//   for (let file of files) {
//     console.log(file);
//     await read1(file);
//     await read2(file);
//   }
// }

// const label = ;
// console.time(label);
// console.timeEnd(label);

