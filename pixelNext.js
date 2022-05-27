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
            let m = -1 // repleatObjList的index
            let repleatObjList = []
            let lastJ = 0
            let lastI = 0
            len = 100
            lenj = 100
            let lastLocation = []
            let endTemp = []
            //方向
            let isDown = true
            let isRight = false
            let isLeft = false
            let isUp = false
            let fromType = 0
            let startLocation = [0,0]
            let isAreaDown = true
            
            function getLocation(i,j){
                m++
                console.log('repleatObjList', repleatObjList)
                while( i < len){
                    while( j < lenj){
                        console.log('i,j',i,j)
                        //死循环跳到下一步
                        if(i === lastLocation[0]  &&  j ===  lastLocation[1]){
                            debugger
                            let nextI = i
                            let nextJ = j
                            if(j >= (lenj -1)){
                                if(i >= (lenj -1)){
                                    return
                                }else{
                                    nextI = i + 1
                                }
                            }else{
                                nextJ = j + 1 
                            }
                            startLocation = [ nextI, nextJ]
                            isDown = true
                            isRight = false
                            isLeft = false
                            isUp = false
                            return getLocation(nextI,nextJ)
                        }else{
                            
                            let resultY = result[i]
                            if(!resultY){
                                i++
                                continue
                            }
                            let pList = resultY[j]
                            let colorGap = 30
                            // debugger
                            let repleatObjListLen = repleatObjList.length
                            if(!repleatObjList[m]){
                                let res = {
                                    list:pList,
                                    colorList:[pList],
                                    sum:1,
                                    locationList:[[i,j]],
                                    lastLocation:[i,j],
                                    locationLimit:{
                                        topLeftLocation:startLocation,
                                        topRightLocation:[],
                                        footLeftLocation:[],
                                        footRightLocation:[],
                                        minX:null,
                                        maxX:null,
                                        minY:null,
                                        maxY:null,
                                        leftKList:[],
                                        downEndList:[],
                                        rightKList:[],
                                        rightEndList:[],
                                        upKList:[],
                                        upEndList:[],
                                        indexList:[0,-1,-1,-1],//down right up left
                                    }
                                }
                                repleatObjList.push(res)
                            }else{
                                let { list, locationLimit, sum } = repleatObjList[m]
                                let { 
                                        topRightLocation,
                                        footLeftLocation,
                                        footRightLocation,
                                        topLeftLocation,
                                        leftKList, downEndList, indexList, rightEndList, leftEndList
                                    } = locationLimit
                                let flag = false
                                //判断色值是否相近
                                console.log('locationLimit', locationLimit)
                                let colorFlag = compareColor(list,pList,colorGap)
                                if(colorFlag){
                                    let addFlag = true
                                    //记录边界坐标
                                    if(isDown){
                                        if(footLeftLocation.length > 0){
                                            if(j > footLeftLocation[1]){
                                                footLeftLocation= [i,j]
                                            }
                                        }else{
                                            footLeftLocation= [i,j]
                                        }
                                        locationLimit.footLeftLocation = footLeftLocation
                                    }else if(isRight){
                                        if(footRightLocation.length > 0){
                                            if(i > footRightLocation[0]){
                                                footRightLocation= [i,j]
                                            }
                                        }else{
                                            footRightLocation= [i,j]
                                        }
                                        locationLimit.footRightLocation = footRightLocation
                                    }else if(isLeft){
                                        if(topLeftLocation.length > 0){
                                            if(i < topLeftLocation[0]){
                                                topLeftLocation= [i,j]
                                            }
                                        }else{
                                            topLeftLocation= [i,j]
                                        }
                                        locationLimit.footRightLocation = footRightLocation
                                    }else if(isUp){
                                        if(topRightLocation.length > 0){
                                            if(j < topRightLocation[1]){
                                                topRightLocation= [i,j]
                                            }
                                        }else{
                                            topRightLocation= [i,j]
                                        }
                                        locationLimit.topRightLocation = topRightLocation
                                    }
                                    //结束
                                    if((i === startLocation[0]  &&  j ===  startLocation[1]) ){
                                        let nextI = footLeftLocation[0]
                                        let nextJ = footLeftLocation[1] + 1
                                        debugger
                                        console.log('end')
                                        if(isAreaDown){
                                            nextI = footLeftLocation[0]
                                            nextJ = footLeftLocation[1] + 1
                                        }
                                        
                                        startLocation = [ nextI, nextJ]
                                        isDown = true
                                        isRight = false
                                        isLeft = false
                                        isUp = false
                                        return getLocation(nextI,nextJ)
                                    }
                                    //判断方向
                                    // if(isDown){
                                    //     down(locationLimit, fromType)
                                    // }else if(isRight){
                                    //     right(locationLimit, fromType)
                                    // }else if(isLeft){
                                    //     left(locationLimit, fromType)
                                    // }else if(isUp){
                                    //     up(locationLimit, fromType)
                                    // }
                                    //计算k值
                                    let locationLimitNext = {}
                                    function down(locationLimit, fromType){
                                        let lastIndex = -1
                                        let downStart = []
                                        if(fromType == 0){
                                            downStart = startLocation
                                        }else if(fromType == 1){
                                            lastIndex = indexList[1]
                                            downStart = rightEndList[lastIndex]
                                        }else if(fromType == 2){
                                            lastIndex = indexList[2]
                                            downStart = leftEndList[lastIndex]
                                        }
                                        debugger
                                        let downIndex = indexList[0]
                                        // let topLeft = downStartList[downIndex]
                                        let leftK = leftKList[downIndex]
                                        //计算相对topLeft的k
                                        let topLeftInitX = downStart[0]
                                        let topLeftInitY = downStart[1]
                                        let tempLeftK = null
                                        if(i - topLeftInitX){
                                            tempLeftK = ((j - topLeftInitY)/(i - topLeftInitX)).toFixed(2)
                                        }else{
                                            tempLeftK = 1000
                                        }
                                        //根据k的比较，判断下一步
                                        if( leftK === undefined ){
                                            leftKList[downIndex] = tempLeftK
                                        }else if(tempLeftK === leftK ){
                                            endTemp = [i,j]
                                        }else if(tempLeftK < leftK){
                                            //记录end坐标
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            downEndList[downIndex] = endList
                                            locationLimit.downEndList = downEndList
                                            //修改rihgtIndex
                                            let rightIndex = indexList[1]
                                            rightIndex += 1
                                            indexList[1] = rightIndex
                                            locationLimit.indexList = indexList
                                            
    
                                            // isDown = false
                                            // isRight = true
                                            fromType = 0
                                            
                                            // right(locationLimit, 0)
                                        }else if(tempLeftK > leftK){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            downEndList[downIndex] = endList
                                            locationLimit.downEndList = downEndList
                                            let leftIndex = indexList[3]
                                            leftIndex += 1
                                            indexList[3] = leftIndex
                                            locationLimit.indexList = indexList
                                            // isDown = false
                                            // isLeft = true
                                            fromType = 0
                                            
                                            // left(locationLimit)
                                        }
                                        
                                    }
                                    function right(locationLimit, fromType){
                                        let {  rightKList, rightEndList, indexList, downEndList} = locationLimit
                                        let lastIndex = -1
                                        let rightStart = []
                                        if(fromType == 0){
                                            lastIndex = indexList[0]
                                            rightStart = downEndList[lastIndex]
                                        }else if(fromType == 1){
                                            lastIndex = indexList[1]
                                            rightStart = rightEndList[lastIndex]
                                        }
                                        let rightIndex = indexList[1]
                                        debugger
                                        let rightK = rightKList[rightIndex]
    
                                        let footLeftInitX = rightStart[0]
                                        let footLeftInitY = rightStart[1]
                                        let tempRightK = ((j - footLeftInitY)/(i - footLeftInitX)).toFixed(2)
                                        let endTemp = []
                                        if(rightK === undefined){
                                            rightKList[rightIndex] = tempRightK
                                        }else if(tempRightK == rightK ){
                                            endTemp = [i,j]
                                        }else if(tempRightK < rightK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            rightEndList[rightIndex] = endList
                                            locationLimit.rightEndList = rightEndList
                                            let upIndex = indexList[2]
                                            upIndex += 1
                                            indexList[2] = upIndex
                                            locationLimit.indexList = indexList
                                            // isRight = false
                                            // isUp = true
                                            fromType = 1
                                            
                                            // up(locationLimit,1)
                                        }else if(tempRightK > rightK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            rightEndList[rightIndex] = endList
                                            locationLimit.rightEndList = rightEndList
    
                                            let downIndex = indexList[0]
                                            downIndex += 1
                                            indexList[0] = downIndex
                                            locationLimit.indexList = indexList
                                            // isRight = false
                                            // isDown = true
                                            fromType = 1
                                            
                                            // down(locationLimit,1)
                                        }
                                    }
                                    function up(locationLimit, fromType){
                                        let {  upKList, upEndList, indexList, rightEndList, leftEndList} = locationLimit
                                        let lastIndex = -1
                                        let upStart = []
                                        if(fromType == 1){
                                            lastIndex = indexList[1]
                                            upStart = rightEndList[lastIndex]
                                        }else if(fromType == 3){
                                            lastIndex = indexList[1]
                                            upStart = leftEndList[lastIndex]
                                        }
                                        let upIndex = indexList[2]
                                        debugger
                                        let upK = upKList[upIndex]
                                        let upStartInitX = upStart[0]
                                        let upStartInitY = upStart[1]
                                        let tempUpK = null
                                        if(i - upStartInitX){
                                            tempUpK = ((j - upStartInitY)/(i - upStartInitX)).toFixed(2)
                                        }else{
                                            tempUpK = -1000
                                        }
                                        if(upK === undefined){
                                            upKList[upIndex] = tempUpK
                                        }else if(tempUpK == upK ){
                                            endTemp = [i,j]
                                        }else if(tempUpK < upK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            upEndList[upIndex] = endList
                                            locationLimit.upEndList = upEndList
    
                                            let rightIndex = indexList[1]
                                            rightIndex += 1
                                            indexList[1] = rightIndex
                                            locationLimit.indexList = indexList
                                            // isUp = false
                                            // isRight = true
                                            fromType = 2
                                            // right(locationLimit, 2)
                                        }else if(tempUpK > upK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            upEndList[upIndex] = endList
                                            locationLimit.upEndList = upEndList
                                            let leftIndex = indexList[3]
                                            leftIndex += 1
                                            indexList[3] = leftIndex
                                            locationLimit.indexList = indexList
                                            // isUp = false
                                            // isLeft = true
                                            fromType = 2
                                            
                                            // left(locationLimit,2)
                                        }
                                    }
                                    function left(locationLimit, fromType){
                                        let {  downEndList, upEndList, leftKList, leftEndList, indexList, } = locationLimit
                                        let lastIndex = -1
                                        let leftStart = []
                                        if(fromType == 0){
                                            lastIndex = indexList[0]
                                            leftStart = downEndList[lastIndex]
                                        }else if(fromType == 2){
                                            lastIndex = indexList[2]
                                            leftStart = upEndList[lastIndex]
                                        }
                                        let leftIndex = indexList[2]
                                        debugger
                                        let leftK = leftKList[leftIndex]
                                        let leftInitX = leftStart[0]
                                        let leftInitY = leftStart[1]
                                        let tempLeftK = ((j - leftInitY)/(i - leftInitX)).toFixed(2)
                                        if(leftK === undefined){
                                            leftKList[leftIndex] = tempLeftK
                                        }else if(tempLeftK == leftK ){
                                            endTemp = [i,j]
                                        }else if(tempLeftK < leftK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            leftEndList[leftIndex] = endList
                                            locationLimit.leftEndList = leftEndList
                                            let upIndex = indexList[2]
                                            upIndex += 1
                                            indexList[2] = upIndex
                                            locationLimit.indexList = indexList
                                            fromType = 3
                                            // up(locationLimit,3)
                                        }else if(tempLeftK > leftK ){
                                            let endList = []
                                            if(endTemp.length > 0){
                                                endList = [endTemp[0], endTemp[1]]
                                            }else{
                                                endList = [lastLocation[0], lastLocation[1]]
                                            }
                                            endTemp = []
                                            leftEndList[leftIndex] = endList
                                            locationLimit.leftEndList = leftEndList
        
                                            let downIndex = indexList[0]
                                            downIndex += 1
                                            indexList[0] = downIndex
                                            locationLimit.indexList = indexList
                                            
                                            fromType = 3
                                            // down(locationLimit,2)
                                        }
                                    }
                                    
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
                            let yIndex = -1
                            let xIndex = -1
                            let colorFlagNext = false
                            lastLocation = [i,j]
                            debugger
                            if(isDown){
                                colorFlagNext = isDownFn(pList,j,colorGap)
                                if(colorFlagNext){
                                    j++
                                }else{
                                    isDown = false
                                    colorFlagNext = isRightFn(pList,i,colorGap)
                                    if(colorFlagNext){
                                        isRight = true
                                        i++
                                    }else{
                                        colorFlagNext = isLeftFn(pList,i,colorGap)
                                        if(colorFlagNext){
                                            isLeft = true
                                            i--
                                        }
                                    }
                                    //回退
                                    if(!colorFlagNext){
                                        let nextJ = j -1
                                        let nextPList = resultY[nextJ]
                                        colorFlagNext = isRightFn(nextPList,i,colorGap)
                                        if(colorFlagNext){
                                            isRight = true
                                            j--
                                            i++
                                        }else{
                                            colorFlagNext = isLeftFn(nextPList,i,colorGap)
                                            if(colorFlagNext){
                                                isLeft = true
                                                i--
                                                j--
                                            }else{
                                                debugger
                                                break
                                            }
                                        }

                                    }
                                }
                            }else if(isRight){
                                colorFlagNext = isRightFn(pList,i,colorGap)
                                if(colorFlagNext){
                                    i++
                                }else{
                                    isRight = false
                                    colorFlagNext =  isDownFn(pList,j,colorGap)
                                    if(colorFlagNext){
                                        isUp = true
                                        j++
                                    }else{
                                        colorFlagNext =  isUpFn(pList,j,colorGap)
                                        if(colorFlagNext){
                                            isUp = true
                                            j--
                                        }
                                    }
                                    //回退
                                    if(!colorFlagNext){
                                        let nextI = i -1
                                        let resultYNext = result[nextI] 
                                        let nextPList = resultYNext[j]
                                        colorFlagNext =  isDownFn(nextPList,j,colorGap)
                                        if(colorFlagNext){
                                            isUp = true
                                            j++
                                            i--
                                        }else{
                                            colorFlagNext =  isUpFn(nextPList,j,colorGap)
                                            if(colorFlagNext){
                                                isUp = true
                                                j--
                                                i--
                                            }else{
                                                debugger
                                                break
                                            }
                                        }
                                    }
                                }
                            }else if(isUp){
                                colorFlagNext = isUpFn(pList,j,colorGap)
                                if(colorFlagNext){
                                    j--
                                }else{
                                    isUp = false
                                    colorFlagNext =  isRightFn(pList,i,colorGap)
                                    if(colorFlagNext && j !== 0){
                                        isRight = true
                                        i++
                                        
                                    }else{
                                        colorFlagNext =  isLeftFn(pList,i,colorGap)
                                        if(colorFlagNext){
                                            isLeft = true
                                            i--
                                        }
                                    }
                                    //回退
                                    if(!colorFlagNext){
                                        let nextJ = j++
                                        let nextPList = resultY[nextJ]
                                        colorFlagNext = isRightFn(nextPList,i,colorGap)
                                        if(colorFlagNext){
                                            isRight = true
                                            i++
                                            j++
                                        }else{
                                            colorFlagNext = isLeftFn(nextPList,i,colorGap)
                                            if(colorFlagNext){
                                                isLeft = true
                                                i--
                                                j++
                                            }else{
                                                debugger
                                                break
                                            }
                                        }
                                    }
                                }
                            }else if(isLeft){
                                colorFlagNext = isLeftFn(pList,i,colorGap)
                                if(colorFlagNext){
                                    i--
                                }else{
                                    isLeft = false
                                    colorFlagNext =  isUpFn(pList,j,colorGap)
                                    if(colorFlagNext){
                                        isUp = true
                                        j--
                                    }else{
                                        colorFlagNext =  isDownFn(pList,j,colorGap)
                                        if(colorFlagNext){
                                            isUp = true
                                            j++
                                        }else{
                                            debugger
                                            break
                                        }
                                    }
                                    //回退
                                    if(!colorFlagNext){
                                        let nextI = i + 1
                                        let resultYNext = result[nextI] 
                                        let nextPList = resultYNext[j]
                                        colorFlagNext =  isDownFn(nextPList,j,colorGap)
                                        if(colorFlagNext){
                                            isUp = true
                                            j++
                                            i++
                                        }else{
                                            colorFlagNext =  isUpFn(nextPList,j,colorGap)
                                            if(colorFlagNext){
                                                isUp = true
                                                j--
                                                i++
                                            }else{
                                                debugger
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                            //判断下一步
                            function isDownFn(pList,j,colorGap){
                                yIndex = j + 1
                                let colorFlagNext = false
                                if(yIndex >= 0 && yIndex < lenj){
                                    let pListNext = resultY[yIndex]
                                    if(!pListNext){
                                        return false
                                    }
                                    colorFlagNext = compareColor(pList,pListNext,colorGap)
                                }
                                return colorFlagNext
                            }
                            function isUpFn(pList,j,colorGap){
                                yIndex = j - 1
                                let colorFlagNext = false
                                if(yIndex >= 0 && yIndex < lenj){
                                    let pListNext = resultY[yIndex]
                                    colorFlagNext = compareColor(pList,pListNext,colorGap)
                                }
                                return colorFlagNext
                            }
                            function isRightFn(pList,i,colorGap){
                                xIndex = i+1
                                let colorFlagNext = false
                                if( xIndex >=0 && xIndex < len){
                                    let resultYNext = result[xIndex] 
                                    if(!resultYNext){
                                        return false
                                    }
                                    let pListNext = resultYNext[j]
                                    colorFlagNext = compareColor(pList,pListNext,colorGap)
                                }
                                return colorFlagNext
                            }
                            function isLeftFn(pList,i,colorGap){
                                xIndex = i-1
                                let colorFlagNext = false
                                if( xIndex >=0 && xIndex < len){
                                    let resultYNext = result[xIndex]
                                    let pListNext = resultYNext[j]
                                    colorFlagNext = compareColor(pList,pListNext,colorGap)
                                }
                                return colorFlagNext
                            }   

                        }
                        
                    }
                }
            }
            // getLocation(0,0)  
            getLocation(0,40)
                           
            
            
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
    if(!pList || !listInit){
        return false
    }
    let aFlag = Math.abs( listInit[0]-pList[0]) < colorGap 
    let bFlag = Math.abs( listInit[1]-pList[1]) < colorGap
    let cFlag = Math.abs( listInit[2]-pList[2]) < colorGap
    let colorFlag = aFlag && bFlag && cFlag
    if(!colorFlag){
        console.log("colorGap1",listInit[0],listInit[1],listInit[2])
        console.log("colorGap2",pList[0],pList[1],pList[2])
        console.log("colorGap",listInit[0]-pList[0],listInit[1]-pList[1], listInit[2]-pList[2] )
    }
    

    return colorFlag
}

async function test(){
    let path = './down.png'
    let pathKey = './downKey.png'
    // let result =  await handleImg(path)
    let resultKey =  await handleImg(pathKey)
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