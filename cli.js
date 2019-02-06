#!/usr/bin/env node
const fs = require('fs');
const util = require('util');
// var CSSSteal = require('css-steal');
// var ape = require('./ape');
// var css = CSSSteal(document.querySelector('.my-class'));
// css.toCSSText(); // produces formatted CSS styles
// css.toJS(): // returns an array of objects containing the styles
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
  var outline = "";
  outline = line.replace(/\{/g,' {\n  ');
  outline = outline.replace(/\,/g,', ');
  outline = outline.replace(/;/g,';\n  ');
  outline = outline.replace(/\s\s\}/g,'}\n');
  // console.log('ya');
  return outline;
}


let url = process.argv[2];
let dir = process.argv[3] || './';

// ape.callapify(url);
// return;

readdir(dir).then( async function(files) {
  fs.unlinkSync("out.css");
  let stream = fs.createWriteStream("out.css", {flags:'a'});

	console.log(dir);
	for( let file of files.filter(file => /\.css$/.test(file)) ) {
		console.log(file);
		await read1(dir + file);
  }
  //write global styles
  // console.log(mediaMap);
  let globals = [...mediaMap.all].join('\n')
  // console.log();

  // fs.writeFileSync('out.css',globals);
    // .catch(e,() => { console.log('whoops'); });
  for( let medi in mediaMap ) {
    if( medi !== 'all' ) {
      stream.write('\n@media '+medi+' {\n\n');
      // console.log('\n@media '+medi+' {');
      stream.write([...mediaMap[medi]].join('\n'));
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

