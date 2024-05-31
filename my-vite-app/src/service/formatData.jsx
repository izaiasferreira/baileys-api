




var database = [
    { type: 'message', section: 'xbh', parent: 3, step: 14, indexS: 2, index: 1 },
    { type: 'options', section: 'xbj', parent: 15, step: 8, indexS: 3, index: 1, },
    { type: 'input', section: 'xbb', parent: 3, step: 4, indexS: 1, index: 1 },
    { type: 'message', section: 'xbl', parent: 8, step: 10, indexS: 2, index: 1 },
    { type: 'start', section: 'main', parent: 'main', step: 1, indexS: 1, index: 1 },
    { type: 'transfer', section: 'xbi', parent: 15, step: 7, indexS: 2, index: 1 },
    { type: 'options', section: 'xbh', parent: 3, step: 15, index: 2, },
    { type: 'message', section: 'main', parent: 'main', step: 2, index: 2 },
    { type: 'transfer', section: 'xbk', parent: 8, step: 9, indexS: 1, index: 1 },
    { type: 'message', section: 'xbc', parent: 15, step: 6, indexS: 1, index: 1 },
    { type: 'transfer', section: 'xbb', parent: 3, step: 5, index: 2 },
    { type: 'transfer', section: 'xbm', parent: 8, step: 36, indexS: 1, index: 1 },
    { type: 'options', section: 'main', parent: 'main', step: 3, index: 3, },
    { type: 'transfer', section: 'xbl', parent: 8, step: 31, index: 2 },
]

function groupArrays(array, key) {
    return array.reduce((accumulator, item) => {
        if (!accumulator[item[key]]) {
            accumulator[item[key]] = []
        }
        accumulator[item[key]].push(item)
        return accumulator
    }, {})

}
function transformObjectsToArray(data) {
    var dataFormated = []
    for (const key in data) {
        dataFormated.push(data[key])
    }
    return dataFormated
}
function includeDataInChildrens(dataSections, finalArray) {
    for (let index = 0; index < dataSections.length; index++) {
        if (dataSections[index]) {
            var arrayToInclude = dataSections[index]
            var parent = dataSections[index][0].parent
            verifyIndex(finalArray, arrayToInclude, parent, (response) => {
                if (response) {
                    dataSections = dataSections.filter(section => section !== arrayToInclude)
                    index--
                }
            })
            if (dataSections.length - 1 === index) {
                index = 0
            }
        }
    }
    if (dataSections.length === 0) {
        return finalArray
    }
    return finalArray
}
function verifyIndex(finalArray, arrayToInclude, parent, callback) {
    var index = finalArray.findIndex(step => step.type === 'options')
    if (index !== -1) {
        if (!finalArray[index].hasOwnProperty('children')) {
            finalArray[index]['children'] = []
        }
        if (finalArray[index].step === parent) {
            finalArray[index].children.push(arrayToInclude)
            callback(true)
        } else {
            if (finalArray[index].children.length > 0) {
                for (let index2 = 0; index2 < finalArray[index].children.length; index2++) {
                    verifyIndex(finalArray[index].children[index2], arrayToInclude, parent, (response) => {
                        callback(response)
                    })

                }
            } else {
                callback(null)
            }
        }
    } else {
        callback(null)
    }
    return finalArray
}
export default function formatData(database) {
    var sections = groupArrays(database, 'section')
    var dataSections = transformObjectsToArray(sections)
    var finalArray = dataSections.filter(section => section[0].section === 'main')[0]
    dataSections = dataSections.filter(section => section[0].parent !== 'main')
    return includeDataInChildrens(dataSections, finalArray)
}