const Xray = require('x-ray');
const Download = require('download');
const agent = new Download({mode: '755'});
const path = require('path');
const _ = require('lodash');
const url = require('url');

const x = Xray();
const QUALITY_PARAM = '?format=2500w';
const BASE_FOLDER = path.resolve(__dirname, 'dest');
var scraped;

console.log(BASE_FOLDER);
console.log(agent);

// require('proxy-agent-patch')();

x('http://www.jfdietrich.com/portraits', {
    title: '.active-link > a',
    images: x('.thumb', [{
        src: 'img@data-src'
    }])
})((err, data)  => {
    'use strict';
    if (err) {
      console.error(err);
      return;
    }
    scraped = data;
    console.log(err, data);
    data.images.forEach(function (img, index) {
        let url = `${img.src}${QUALITY_PARAM}`;
        console.log(url);
        agent.get(url);
    });

    agent
        .dest(`${BASE_FOLDER}/${data.title}`)
        .rename(function(path) {
          var prefix = _.findIndex(scraped.images, function(item) {
            return item.src.indexOf(path.basename) > -1;
          });
            path.basename = _.padStart(prefix, 2, '0') + '_' + path.basename;
            path.extname = '.jpg';
            console.log(path);
            return path;
        })
        .run(function(err, files) {
            console.log(err, files);
        });

});
