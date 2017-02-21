var ReactDom = require('react-dom');
var React = require('react');

// var DomHTML = require('../src/components/over');

var DomHTML = require('../src/components/live');

ReactDom.render(
    <DomHTML viewNum={123}/>,
    document.getElementById('box')
);