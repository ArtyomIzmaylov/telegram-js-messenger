
function delay(time) {
    const promise = new Promise(resolve => {
        setTimeout(() => {
            console.log('секунда прошла!')
            resolve()
        }, time)
    })
    return promise
}

module.exports = delay
