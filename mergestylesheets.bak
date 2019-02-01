/*
create lines:Set for global styles
create a media:Map for media sections
read a list of files, maybe all .css files in a directory
loop: open files
{	loop: read lines
	{
		if scan for ^@media (\([^\)]*)\)){
		{	create an entry with that media type label or use existing. Have the label point to a Set. 
			loop: take each line until }, and add to the current Set.
			move past }
		}
		else add each line to lines:Set
	} 
	close file
}
create new outfile with date in name
loop: lines:Set
{
	write line to outfile + \n
}
loop: media:Map
{
	write media declaration to outfile
	loop: entries in media 
	{
		write line to outfile + \n
	}
	close media bracket + \n
}
close outfile
*/

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

async function read1 (file) {
  const label = `read1-${file}`;
  console.time(label);
  const data = await readFile(file, 'utf8');
  const lines = data.split(/\n/);
  print(lines[0]);
  process.stdout.write(lines[0]);
  // console.timeEnd(label);
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

readdir(process.argv[2]).then(files => {
	for( let file of files.filter(file => /dummy\d+\.csv/.test(file)) ) {
		console.error('ya');
		read1(file);
	}
});

