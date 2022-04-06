const fs = require('fs')
const resemble = require('resemblejs')
const compareImages = require("resemblejs/compareImages");

let fileData = fs.readFileSync('./down.png')
let fileDataNext = fs.readFileSync('./downKey.png')
let result = fs.readFileSync('./out.png')
// const box = {
//     left: 100,
//     top: 200,
//     right: 200,
//     bottom: 600
// };
// resemble.outputSettings({ boundingBox: box });
var api = resemble(fileData).compareTo(result).onComplete(function (data) {
    console.log(data);
    
    
});


// var api = resemble(fileData).onComplete(function (data) {
//     console.log(data);
   
// });
// resemble.outputSettings({
//     errorColor: {
//         red: 255,
//         green: 0,
//         blue: 255
//     },
//     errorType: "movement",
//     transparency: 0.3,
//     largeImageThreshold: 1200,
//     useCrossOrigin: false,
//     outputDiff: true
// })
