let i = 0
let j = 0
let leni = 10
let lenj = 10
while(i< leni){
    console.log('i',i)
    debugger
    while(j < lenj){
        console.log('j',j)
        debugger
        if(j === 5){
            console.log('break')
            j = 6
            debugger
            break
        }
        if(j === 7){
            console.log('continue')
            debugger
            continue
        }
        j++
        if(j == lenj){
            i++
            if(i == lenj){
                console.log('break')
                debugger
                break
            }
        }
        
    }
}