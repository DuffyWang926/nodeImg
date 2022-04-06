const sharp = require('sharp');
const fs = require('fs')

test = async () =>{
    const semiTransparentRedPng = await sharp('./down.png')
      .greyscale()
        .png()
        .toBuffer();

    try{
        fs.writeFile('./out.png',semiTransparentRedPng,{'flag':'a'},(e) =>{
            console.log(e)
        })

    }catch(e){
        console.log(e)

    }

    const next = await sharp('./downKey.png')
      .greyscale()
        .png()
        .toBuffer();

    try{
        fs.writeFile('./nextout.png',next,{'flag':'a'},(e) =>{
            console.log(e)
        })

    }catch(e){
        console.log(e)

    }

}

test()
