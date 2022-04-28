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
            
            for(let x=0; x<len; x++) {
                let resultY = []
                for(let y=0; y<lenj; y++) {
                    let pList = []
                    for(let k=0; k<4; ++k) {
                        let pixel = pixels.get(x,y,k)
                        pList.push(pixel)
                    }
                    resultY[y] = pList
                }
                result[x] = resultY
            }

            let i = 0
            let j = 0
            let k = 0
            let repleatObjList = []
            let lastJ = 0
            let lastI = 0
            // while( i < len){
            while( i < 15){
                let resultY = result[i]
                // while( j < lenj){
                while( j < 15){
                    let pList = resultY[j]
                    let colorGap = 15
                    debugger
                    let repleatObjListLen = repleatObjList.length
                    if(repleatObjListLen == 0){
                        let res = {
                            list:pList,
                            colorList:[pList],
                            sum:1,
                            locationList:[[i,j]],
                            lastLocation:[i,j],
                            locationLimit:{
                                footRight:[i,j],
                                topK:null,
                                footK:null,
                                minX:null,
                                maxX:null,
                                minY:null,
                                maxY:null,
                                topLeftList:[[i,j]],
                                leftKList:[],
                                footLeftList:[[i,j]],
                                downIndex:0
                            }
                        }
                        repleatObjList.push(res)
                        j++
                    }else{
                        for(let m = 0; m < repleatObjListLen; m++){
                            let { list, locationLimit, sum } = repleatObjList[m]
                            let flag = false
                            //判断色值是否相近
                            
                            let colorFlag = compareColor(list,pList,colorGap)
                            if(colorFlag){
                                let { 
                                    minX,
                                    maxX,
                                    minY,
                                    maxY,
                                    topK,
                                    leftK,
                                    footK,
                                    rightK,
                                    topLeft,
                                    footLeft,
                                    footRight,
                                    topRight,
                                    topLeftList,
                                    leftKList,
                                    footLeftList,
                                    downIndex
                                } = locationLimit
                                let addFlag = true
                                //计算k值
                                
                                
                                function down(locationLimit){
                                    let { topLeftList, leftKList, footLeftList, downIndex} = locationLimit
                                    let topLeft = topLeftList[downIndex]
                                    let leftK = leftKList[downIndex]
                                    
                                    let topLeftInitX = topLeft[0]
                                    let topLeftInitY = topLeft[1]
                                    let tempLeftK = null
                                    if(i - topLeftInitX){
                                        tempLeftK = ((j - topLeftInitY)/(i - topLeftInitX)).toFixed(2)
                                    }else{
                                        tempLeftK = 1000
                                    }
                                    if( leftK === undefined ){
                                        leftKList[downIndex] = tempLeftK
                                    }else if(tempLeftK === leftK ){
                                        footLeftList[downIndex] = [i,j]
                                    }else if(tempLeftK < leftK){
                                        downIndex += 1
                                        locationLimit.downIndex = downIndex
                                        left(locationLimit)
                                    }else if(tempLeftK > leftK){
                                        downIndex += 1
                                        locationLimit.downIndex = downIndex
                                        right(locationLimit)
                                    }
                                }
                                if( leftK === null ){
                                    leftK = tempLeftK
                                }else if(tempLeftK === leftK ){
                                    footLeft = [i,j]
                                }else if(tempLeftK < leftK){
                                    let footLeftInitX = footLeft[0]
                                    let footLeftInitY = footLeft[1]
                                    debugger
                                    let tempFootK = ((j - footLeftInitY)/(i - footLeftInitX)).toFixed(2)
                                    if(footK === null){
                                        footK = tempFootK
                                    }else if(tempFootK == footK ){
                                        footRight = [i,j]
                                    }else if(tempFootK < footK ){
                                        let footRightInitX = footRight[0]
                                        let footRightInitY = footRight[1]
                                        debugger
                                        let tempRightK = ((j - footRightInitY)/(i - footRightInitX)).toFixed(2)
                                        if(rightK === null){
                                            rightK = tempRightK
                                        }else if(tempRightK === rightK){
                                            topRight = [i,j]
                                        }
                                    }else if(tempFootK > footK ){

                                    }
                                }
                                

                                // if( topK === null ){
                                //     topK = tempTopK
                                //     addFlag = true
                                // }else{
                                //     if(tempTopK === topK ){
                                //         addFlag = true
                                //     }
                                // }
                                if(addFlag){
                                    let locationLimitNext = {
                                        minX,
                                        maxX,
                                        minY,
                                        maxY,
                                        topK,
                                        leftK,
                                        footK,
                                        rightK,
                                        topLeft,
                                        footLeft,
                                        footRight,
                                        topRight
                                    }
                                    let listLast = repleatObjList[m].list
                                    let listNext = []
                                    for(let i = 0,len = listLast.length; i< len; i++){
                                        let adverage = null 
                                        adverage = Math.round((listLast[i] + pList[i])/2)
                                        listNext.push(adverage)
                                    }
                                    repleatObjList[m].sum = +sum + 1
                                    repleatObjList[m].locationList.push([i,j])
                                    repleatObjList[m].colorList.push(pList)
                                    repleatObjList[m].locationLimit = locationLimitNext
                                    repleatObjList[m].list = listNext
                                }

                            }
                        }
                        //判断下一步坐标
                        let pListNext = resultY[j+1]
                        let colorFlagNext = compareColor(pList,pListNext,colorGap)
                        
                        if(colorFlagNext){
                            debugger
                            lastJ = j
                            j++
                        }else{
                            debugger
                            let resultYNext = result[i+1]
                            let pListNext = resultYNext[j]
                            colorFlagNext = compareColor(pList,pListNext,colorGap)
                            if(colorFlagNext){
                                i++
                            }else{
                                break
                            }
                        }
                        
                    }
                }
            }
            
            repleatObjList.sort( (a,b) =>{
                return  b.sum - a.sum
            })
            // console.log('result',result)
            console.log('repleatObjList[0]',repleatObjList[0])
            // console.log('repleatObjList[1]',repleatObjList[1])
            // console.log('repleatObjList[2]',repleatObjList[2])
            
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
function compareColor(listInit,pList,colorGap){
    let aFlag = Math.abs( listInit[0]-pList[0]) < colorGap 
    let bFlag = Math.abs( listInit[1]-pList[1]) < colorGap
    let cFlag = Math.abs( listInit[2]-pList[2]) < colorGap
    let colorFlag = aFlag && bFlag && cFlag

    return colorFlag
}
async function test(){
    let path = './down.png'
    let pathKey = './downKey.png'
    let result =  await handleImg(path)
    // let resultKey =  await handleImg(pathKey)
    console.log('handle result', result)
    // console.log('handle resultKey', resultKey)
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