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
                    console.log('i,j',i,j)
                    let pList = resultY[j]
                    let colorGap = 15
                    // debugger
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
                                rightKList:[],
                                footRightList:[],
                                indexList:[0,-1,-1,-1],//down right up left
                                directionFlag:{
                                    isDown:true,
                                    isRight:false,
                                    isLeft:false,
                                    isUp:false,
                                    fromType:null, // 0 down 1 right 2 up 3 left
                                }
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
                                
                                let addFlag = true
                                //判断方向
                                let { directionFlag, indexList, footLeftList, footRightList  } = locationLimit
                                const { 
                                    isDown,
                                    isRight,
                                    isLeft,
                                    isUp,
                                    fromType
                                } = directionFlag || {}
                                
                                if(isDown){
                                    down(locationLimit, fromType)
                                }else if(isRight){
                                    right(locationLimit, fromType)
                                }else if(isLeft){
                                    left(locationLimit, fromType)
                                }else if(isUp){
                                    up(locationLimit, fromType)
                                }
                                

                                //计算k值
                                let locationLimitNext = {}
                                
                                function down(locationLimit, fromType){
                                    let { topLeftList, leftKList, footLeftList, indexList} = locationLimit
                                    // debugger
                                    let lastIndex = -1
                                    let footLeft = []
                                    if(fromType == 0){
                                        lastIndex = indexList[0]
                                        footLeft = footLeftList[lastIndex]
                                    }else if(fromType == 1){
                                        lastIndex = indexList[1]
                                        footLeft = footRightList[lastIndex]
                                    }
                                    let rightIndex = indexList[1]
                                    debugger
                                    let rightK = rightKList[rightIndex]
                                    let changeIndex = indexList[0]
                                    let topLeft = topLeftList[changeIndex]
                                    let leftK = leftKList[changeIndex]
                                    //计算相对topLeft的k
                                    let topLeftInitX = topLeft[0]
                                    let topLeftInitY = topLeft[1]
                                    let tempLeftK = null
                                    if(i - topLeftInitX){
                                        tempLeftK = ((j - topLeftInitY)/(i - topLeftInitX)).toFixed(2)
                                    }else{
                                        tempLeftK = 1000
                                    }
                                    //根据k的比较，判断下一步
                                    if( leftK === undefined ){
                                        leftKList[changeIndex] = tempLeftK
                                    }else if(tempLeftK === leftK ){
                                        footLeftList[changeIndex] = [i,j]
                                    }else if(tempLeftK < leftK){
                                        let rightIndex = indexList[1]
                                        rightIndex += 1
                                        indexList[1] = rightIndex
                                        locationLimit.indexList = indexList
                                        directionFlag.isDown = false
                                        directionFlag.isRight = true
                                        directionFlag.fromType = 0
                                        locationLimit.directionFlag = directionFlag
                                        
                                        right(locationLimit, 0)
                                    }else if(tempLeftK > leftK){
                                        let leftIndex = indexList[3]
                                        leftIndex += 1
                                        indexList[3] = leftIndex
                                        locationLimit.indexList = indexList
                                        directionFlag.isDown = false
                                        directionFlag.isLeft = true
                                        directionFlag.fromType = 0
                                        locationLimit.directionFlag = directionFlag
                                        
                                        left(locationLimit)
                                    }
                                }
                                function right(locationLimit, fromType){
                                    let {  rightKList, footRightList, indexList} = locationLimit
                                    let lastIndex = -1
                                    let footLeft = []
                                    if(fromType == 0){
                                        lastIndex = indexList[0]
                                        footLeft = footLeftList[lastIndex]
                                    }else if(fromType == 1){
                                        lastIndex = indexList[1]
                                        footLeft = footRightList[lastIndex]
                                    }
                                    let rightIndex = indexList[1]
                                    debugger
                                    let rightK = rightKList[rightIndex]

                                    let footLeftInitX = footLeft[0]
                                    let footLeftInitY = footLeft[1]
                                    let tempRightK = ((j - footLeftInitY)/(i - footLeftInitX)).toFixed(2)
                                    if(rightK === undefined){
                                        rightKList[rightIndex] = tempRightK
                                    }else if(tempRightK == rightK ){
                                        footRightList[rightIndex] = [i,j]
                                    }else if(tempRightK < rightK ){
                                        let upIndex = indexList[2]
                                        upIndex += 1
                                        indexList[2] = upIndex
                                        locationLimit.indexList = indexList
                                        directionFlag.isRight = false
                                        directionFlag.isUp = true
                                        directionFlag.fromType = 1
                                        locationLimit.directionFlag = directionFlag
                                        up(locationLimit,1)
                                    }else if(tempRightK > rightK ){
                                        let downIndex = indexList[0]
                                        downIndex += 1
                                        indexList[0] = downIndex
                                        locationLimit.indexList = indexList
                                        directionFlag.isRight = false
                                        directionFlag.isDown = true
                                        directionFlag.fromType = 1
                                        locationLimit.directionFlag = directionFlag
                                        down(locationLimit,1)
                                    }
                                }
                                function up(locationLimit, fromType){

                                    let {  rightKList, footRightList, indexList} = locationLimit
                                    let lastIndex = -1
                                    let footRight = []
                                    if(fromType == 0){
                                        lastIndex = indexList[0]
                                        footRight = footLeftList[lastIndex]
                                    }else if(fromType == 1){
                                        lastIndex = indexList[1]
                                        footRight = footRightList[lastIndex]
                                    }
                                    let rightIndex = indexList[1]
                                    debugger
                                    let rightK = rightKList[rightIndex]

                                    let footLeftInitX = footLeft[0]
                                    let footLeftInitY = footLeft[1]
                                    let tempRightK = ((j - footLeftInitY)/(i - footLeftInitX)).toFixed(2)
                                    if(rightK === undefined){
                                        rightKList[rightIndex] = tempRightK
                                    }else if(tempRightK == rightK ){
                                        footRightList[rightIndex] = [i,j]
                                    }else if(tempRightK < rightK ){
                                        changeIndex += 1
                                        locationLimit.changeIndex = changeIndex
                                        let upIndex = indexList[2]
                                        upIndex += 1
                                        indexList[2] = upIndex
                                        locationLimit.indexList = indexList
                                        directionFlag.isRight = false
                                        directionFlag.isUp = true
                                        directionFlag.fromType = 1
                                        locationLimit.directionFlag = directionFlag
                                        up(locationLimit)
                                    }else if(tempRightK > rightK ){
                                        changeIndex += 1
                                        locationLimit.changeIndex = changeIndex
                                        // down(locationLimit)
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
                                    locationLimitNext = locationLimit
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
                            // debugger
                            lastJ = j
                            j++
                        }else{
                            // debugger
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