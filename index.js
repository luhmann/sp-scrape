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

x('http://www.jfdietrich.com/portraits', {
    title: '.active-link > a',
    images: x('.thumb', [{
        src: 'img@data-src'
    }])
})((err, data)  => {
    'use strict';
    scraped = data;
    console.log(err, data);
    var counter = 1;
    data.images.forEach(function (img, index) {
        let url = `${img.src}${QUALITY_PARAM}`;
        let prefix = _.padStart(index, 2, '0');
        let filename = path.basename(img.src);
        agent.get(url/*, `${BASE_FOLDER}/${data.title}/${prefix}_${filename}`*/);
    });

    agent
        .dest(`${BASE_FOLDER}/${data.title}`)
        .rename(function(path) {
            // path.basename = prefix + '_' + path.basename;
            path.extname = '.jpg';
            console.log(path);
            return path;
        })
        .run(function(err, files) {
            console.log(err, files);
        });

});
