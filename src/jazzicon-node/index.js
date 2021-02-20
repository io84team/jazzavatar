const MersenneTwister = require('mersenne-twister')
const Color = require('color')
const jsdom = require("jsdom")
const xmlserializer = require('xmlserializer')

const JSDOM = jsdom.JSDOM;
const shapeCount = 4
const svgns = 'http://www.w3.org/2000/svg'
const window = new JSDOM('<!DOCTYPE html>').window;
const document = window.document;

const colors = [
    '#01888C', // teal
    '#FC7500', // bright orange
    '#034F5D', // dark teal
    '#F73F01', // orangered
    '#FC1960', // magenta
    '#C7144C', // raspberry
    '#F3C100', // goldenrod
    '#1598F2', // lightning blue
    '#2465E1', // sail blue
    '#F19E02', // gold
]

var generator

function generateIdenticon (diameter, seed) {
    generator = new MersenneTwister(seed);
    var remainingColors = hueShift(colors.slice(), generator)

    var bgColor = genColor(remainingColors)

    var svg = document.createElementNS(svgns, 'svg')
    svg.setAttributeNS(null, 'x', '0')
    svg.setAttributeNS(null, 'y', '0')
    svg.setAttributeNS(null, 'width', diameter)
    svg.setAttributeNS(null, 'height', diameter)
    svg.style.background = bgColor

    for (var i = 0; i < shapeCount - 1; i++) {
        genShape(remainingColors, diameter, i, shapeCount - 1, svg)
    }

    return xmlserializer.serializeToString(svg)
}

function genShape (remainingColors, diameter, i, total, svg) {
    var center = diameter / 2

    var shape = document.createElementNS(svgns, 'rect')
    shape.setAttributeNS(null, 'x', '0')
    shape.setAttributeNS(null, 'y', '0')
    shape.setAttributeNS(null, 'width', diameter)
    shape.setAttributeNS(null, 'height', diameter)

    var firstRot = generator.random()
    var angle = Math.PI * 2 * firstRot
    var velocity = diameter / total * generator.random() + (i * diameter / total)

    var tx = (Math.cos(angle) * velocity)
    var ty = (Math.sin(angle) * velocity)

    var translate = 'translate(' + tx + ' ' + ty + ')'

    // Third random is a shape rotation on top of all of that.
    var secondRot = generator.random()
    var rot = (firstRot * 360) + secondRot * 180
    var rotate = 'rotate(' + rot.toFixed(1) + ' ' + center + ' ' + center + ')'
    var transform = translate + ' ' + rotate
    shape.setAttributeNS(null, 'transform', transform)
    var fill = genColor(remainingColors)
    shape.setAttributeNS(null, 'fill', fill)

    svg.appendChild(shape)
}

function genColor (colors) {
    var rand = generator.random()
    var idx = Math.floor(colors.length * generator.random())
    var color = colors.splice(idx, 1)[0]
    return color
}

var wobble = 30

function hueShift (colors, generator) {
    var amount = (generator.random() * 30) - (wobble / 2)
    return colors.map(function (hex) {
        var color = Color(hex)
        color.rotate(amount)
        return color.hex()
    })
}

module.exports = generateIdenticon
