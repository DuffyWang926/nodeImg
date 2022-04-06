const fs = require('fs')
const resemble = require('resemblejs')
const compareImages = require("resemblejs/compareImages");
let getPixelPromise = require('get-pixel-promise')


let fileData = fs.readFileSync('./down.png')
let fileDataNext = fs.readFileSync('./downKey.png')


async function handleImg(path){
    let width = 0
    let height = 0
    let minX = 0
    let minY = 0
    let maxX = 0
    let maxY = 0
    try{
       let res = await getPixelPromise(path)
       const pixels = res
       if(res.data){
            let compareList = (a,b) =>{
                let aFlag = Math.abs( a[0]-b[0]) < 15
                let bFlag = Math.abs( a[1]-b[1]) < 15
                let cFlag = Math.abs( a[2]-b[2]) < 15
                if(aFlag && bFlag && cFlag){
                    return true
                }else{
                    return false
                }
            }
            let { shape } = pixels
            console.log('shape', shape)
            let len = 0
            let lenj = 0
            let lenk = 0
            if(shape.length > 2){
                len = shape[0]
                lenj = shape[1]
                lenk = shape[2]
                width = shape[0]
                height = shape[1]
            }
            let result = []
            let pList = []
            let repleatObjList = []
            
            for(var i=0; i<len; ++i) {
                for(var j=0; j<lenj; ++j) {
                    for(var k=0; k<4; ++k) {
                        let pixel = pixels.get(i,j,k)
                        pList.push(pixel)
                    }
                    if( (pList[0] == 0) && (pList[1] == 0) && (pList[2] == 0)  ){

                    }else{
                        let isPush = false
                        debugger
                        for(let m = 0, lenm = repleatObjList.length; m < lenm; m ++){
                            let { sum } = repleatObjList[m]
                            let init = repleatObjList[m].list
                            flag = compareList(init,pList)
                            if(flag){
                                repleatObjList[m].sum = +sum + 1
                                repleatObjList[m].locationList.push([i,j])
                                isPush = true
                            }
                        }
                        if(!isPush){
                            let res = {
                                list:pList,
                                sum:0,
                                locationList:[[i,j]],
                            }
                            repleatObjList.push(res)

                        }
                        location = [i,j]
                        result.push({
                            location,
                            pList:pList
                        })
                    }
                    pList = []
                }
            }
            repleatObjList.sort( (a,b) =>{
                return  b.sum - a.sum
            })
            let goalLocation = []
            let goalLocationInit = []
            repleatObjList.forEach( v =>{
                let { list } = v
                let flagA = Math.abs( list[0] - 88) < 50
                let flagB = Math.abs( list[1] - 51) < 50
                let flagC = Math.abs( list[2] - 34) < 50
                if(flagA && flagB && flagC){
                    // console.log('v',v)
                    goalLocationInit.push(v)
                }
            })
            if(goalLocationInit.length > 0 ){
                goalLocationInit.sort( (a,b) =>{
                    return b.sum - a.sum
                })
                goalLocation = goalLocationInit[0].locationList
    
                // console.log('result',result)
                // console.log('repleatObjList[0]',repleatObjList[0])
                // console.log('repleatObjList[1]',repleatObjList[1])
                // console.log('repleatObjList[2]',repleatObjList[2])
                console.log('goalLocation',goalLocation)
                
                
                goalLocation.forEach( v =>{
                    let x = v[0]
                    let y = v[1]
                    if(!minX){
                        minX = x
                    }else if( x < minX ){
                        minX = x
                    }
                    if(!maxY){
                        maxY = y
                    }else if( y > maxY ){
                        maxY = y
                    }
                })
                
                goalLocation.forEach( v =>{
                    let x = v[0]
                    let y = v[1]
                    if( x - minX < 50){
                        if(!minY){
                            minY = y
                        }else if( y < minY){
                            minY = y
                        }
                    }
                    if( maxY - y < 50){
                        if(!maxX){
                            maxX = x
                        }else if( x > maxX){
                            maxX = x
                        }
                    }
                })
                console.log('min', minX, maxX, minY, maxY)
                let goalRes = {}
                goalLocation.forEach( v =>{
                    let val = v[0]
                    let res = []
                    if(!goalRes[val]){
                        res.push(v[1])
                        goalRes[val] = res
                    }else{
                        res = goalRes[val]
                        res.push(v[1])
                        goalRes[val] = res
                    }
                })
                // for(let i in goalRes){
                //     let list = goalRes[i]
                //     list.sort( (a,b) =>{
                //         return a -b
                //     })
                //     console.log('goalRes',i,list)
                // }
            }
            
            let res = {
                width,
                height,
                minX,
                minY,
                maxX,
                maxY
            }
        
            return res
       }
        console.log('res',res)
    }catch(e){
        throw(e)
    }
    
}
async function test(){
    let path = './down.png'
    let pathKey = './downKey.png'
    let result =  await handleImg(path)
    let resultKey =  await handleImg(pathKey)
    console.log('handle result', result)
    console.log('handle resultKey', resultKey)
}
test()



// a b c d [ 119, 88 ] [ 279, 134 ] [ 119, 126 ] [ 285, 115 ]
// efgh [ 157, 88 ] [ 119, 88 ] [ 279, 134 ] [ 281, 134 ]
// min 119 285 88 134
// end 119 285 77 134
// 1746
// #583223
// 88,51,35
// #583323
// 88,51,35
// #573121
// 87,49,33
// #583222
// 88,50,34