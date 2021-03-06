var log = console.log
let a = { a: [1]}
a.next = a
let objList = []

function cloneDeep (obj){
    debugger;
    if(typeof obj === 'object'){
        for(let j = 0, lenj = objList.length; j < lenj; j < lenj){
            let itemJ = objList[j]
            if(itemJ === obj){
               return itemJ 
            }else{
                objList.push(itemJ)
            }
        }
        log(Object.prototype.toString.call(obj))
        if(Object.prototype.toString.call(obj) === '[object Array]'){
            let arrRes = []
            if(obj.length > 0){
                for(let i = 0, len = obj.length; i < len; i++){
                    let item = obj[i]
                    if(typeof item === 'object'){
                        let itemEnd = cloneDeep(item)
                        arrRes.push(itemEnd)
                    }else{
                        arrRes.push(item)
                    }
                }
                return arrRes
            }else{
                return arrRes
            }

        }else{
            let objRes = {}
            for(let i in obj){
                let value = obj[i]
                if(typeof value === 'object'){
                    objRes[i] = cloneDeep(value)
                }else{
                    objRes[i] = value
                }
            }
            return objRes
        }

    }else{
        return obj
    }
}

function isObject(arr){
    return Object.prototype.toString.call(arr) === 'object Array'
}

var b = cloneDeep(a)
console.log('b',b)

