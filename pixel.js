const fs = require('fs')
const resemble = require('resemblejs')
const compareImages = require("resemblejs/compareImages");
let getPixels = require('get-pixels')


let fileData = fs.readFileSync('./down.png')
let fileDataNext = fs.readFileSync('./downKey.png')

// getPixels('./downKey.png',(err,pixels) =>{
    getPixels('./down.png',(err,pixels) =>{
    if(err){
        console.log(err)
        return
    }else{
        let { shape } = pixels
        console.log('shape', shape)
        let len = 0
        let lenj = 0
        let lenk = 0
        if(shape.length > 2){
            len = shape[0]
            lenj = shape[1]
            lenk = shape[2]
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
        repleatObjList.forEach( v =>{
            let { list } = v
            let flagA = Math.abs( list[0] - 88) < 20
            let flagB = Math.abs( list[1] - 51) < 20
            let flagC = Math.abs( list[2] - 34) < 20
            if(flagA && flagB && flagC){
                console.log('v',v)
                goalLocation = v.locationList
            }
        })
        // console.log('result',result)
        // console.log('repleatObjList[0]',repleatObjList[0])
        // console.log('repleatObjList[1]',repleatObjList[1])
        // console.log('repleatObjList[2]',repleatObjList[2])
        console.log('goalLocation',goalLocation)
        let a = []
        let b = []
        let c = []
        let d = []
        goalLocation.forEach( v =>{
            
            let x = v[0]
            let y = v[1]
            if(a.length == 0){
                a[0] = x
                a[1] = y
            }else if(x < a[0]){
                a[0] = x
                a[1] = y
            }else if(x == a[0]){
                if(y > a[1]){
                    a[1] = y
                }
            }
            if(b.length == 0){
                b[0] = x
                b[1] = y
            }else if(x > b[0]){
                b[0] = x
                b[1] = y
            }else if(x == b[0]){
                if(y > b[1]){
                    b[1] = y
                }
            }

            if(c.length == 0){
                c[0] = x
                c[1] = y
            }else if(x < c[0]){
                c[0] = x
                c[1] = y
            }else if(x == c[0]){
                if(y < c[1]){
                    c[1] = y
                }
            }

            if(d.length == 0){
                d[0] = x
                d[1] = y
            }else if(x > d[0]){
                d[0] = x
                d[1] = y
            }else if(x == d[0]){
                if(y < d[1]){
                    d[1] = y
                }
            }

        })
        console.log('a b c d', a, b, c, d)
    }
})

let compareList = (a,b) =>{
    let aFlag = Math.abs( a[0]-b[0]) < 15
    let bFlag = Math.abs( a[1]-b[1]) < 15
    let cFlag = Math.abs( a[2]-b[2]) < 15
    if(aFlag && bFlag && cFlag){
        return true
    }else{
        return false
    }
    
    // if(Math.abs( a[3]-b[3]) < 50){
    //     return true
    // }else{
    //     return false
    // }
}
// a b c d [ 119, 126 ] [ 285, 115 ] [ 119, 88 ] [ 285, 114 ]
// 1746
// #583223
// 88,51,35
// #583323
// 88,51,35
// #573121
// 87,49,33
// #583222
// 88,50,34