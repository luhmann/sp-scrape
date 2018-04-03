const Xray = require('x-ray');
const Download = require('download');
const path = require('path');
const _ = require('lodash');
const url = require('url');

const x = Xray();
const QUALITY_PARAM = '?format=2500w';
const BASE_FOLDER = path.resolve(__dirname, 'dest');

console.log(`Download-Folder set to ${BASE_FOLDER}`);
// TODO: try spidering
const urls = [
  // People
  'http://www.jfdietrich.com/portraits',
  'http://www.jfdietrich.com/portraits-ii',
  'http://www.jfdietrich.com/olimpia',
  'http://www.jfdietrich.com/gallery-p',
  'http://www.jfdietrich.com/piece-of-cake',
  'http://www.jfdietrich.com/nightmares',
  // Travel

  'https://www.jfdietrich.com/norway/',
  'https://www.jfdietrich.com/barcelona/',
  'http://www.jfdietrich.com/france-2015',
  'http://www.jfdietrich.com/travel/iceland',
  'http://www.jfdietrich.com/new-zealand',
  'http://www.jfdietrich.com/india',
  'http://www.jfdietrich.com/nepal',
  // misc
  'http://www.jfdietrich.com/misc',
];

function scrape(url, counter) {
  'use strict';
  let agent = new Download({
    mode: '755',
  });
  let scraped;

  x(url, {
    title: '.active-link > a',
    images: x('.thumb', [
      {
        src: 'img@data-src',
      },
    ]),
  })((err, data) => {
    if (err) {
      console.error(`Error while scraping ${err}. Abort.`);
      return;
    }
    scraped = data;
    console.log(`Detected ${data.images.length} in Gallery ${data.title}`);
    data.images.forEach(function(img, index) {
      let url = `${img.src}${QUALITY_PARAM}`;
      console.log(`Downloading ${url}`);
      agent.get(url);
    });

    console.log(`Saving files to: ${BASE_FOLDER}/${data.title}`);
    agent
      .dest(`${BASE_FOLDER}/${data.title}`)
      .rename(function(path) {
        var prefix = _.findIndex(scraped.images, function(item) {
          return item.src.indexOf(path.basename) > -1;
        });
        path.basename = _.padStart(prefix, 2, '0') + '_' + path.basename;
        path.extname = '.jpg';
        console.log(`Renamed file to ${path.basename}${path.extname}`);
        return path;
      })
      .run(function(err, files) {
        console.log(`Error during download: ${err}`);
        main(++counter);
      });
  });

  console.log(
    '============================================================================'
  );
}

function main(index) {
  'use strict';

  if (urls[index]) {
    let url = urls[index];
    console.log(`Now scraping ${url}`);
    scrape(url, index);
  }
}

main(0);
