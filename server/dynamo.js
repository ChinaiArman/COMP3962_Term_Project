import dotenv from "dotenv"
dotenv.config()

import crypto, { randomInt } from "crypto"
import pkg from 'aws-sdk'
import axios from "axios"
const { config, DynamoDB } = pkg


let awsConfig = {
    "region": "us-west-2",
    "endpoint": "http://dynamodb.us-west-2.amazonaws.com",
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY_ID
}
config.update(awsConfig)
const TABLENAME = "TeamSpaces"
let dynamoDB = new DynamoDB.DocumentClient();

const UNSPLASHED_ACCESS_KEY = process.env.UNSPLASHED_ACCESS_KEY
const UNSPLASHED_SECRET_KEY = process.env.UNSPLASHED_SECRET_KEY


export let getAllTeamSpaces = async function () {
    let params = {
        TableName: TABLENAME
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items
                }
                resolve(response)
            }
        })
    })
}

export let getAllTransactions = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let transactions = []
                for (let i = 0; i < data.Items[0].spendingCategories.length; i++) {
                    transactions = transactions.concat(data.Items[0].spendingCategories[i].transactions)
                }
                transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": transactions
                }
                resolve(response)
            }
        })
    })
}

export let getTransactionsBySpendingCategory = async function (teamSpaceID, spendingCategoryID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let transactions = []
                for (let i = 0; i < data.Items[0].spendingCategories.length; i++) {
                    if (data.Items[0].spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                        transactions = data.Items[0].spendingCategories[i].transactions
                    }
                }
                // sort transactions with latest ones appearing first in the list:
                transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": transactions
                }
                resolve(response)
            }
        })
    })
}

export let getAllSpendingCategories = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items[0].spendingCategories
                }
                resolve(response)
            }
        })
    })
}

export let getSpendingCategoryByID = async function (teamSpaceID, spendingCategoryID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                        let response = {
                            "status": 201,
                            "message": "Success",
                            "data": spendingCategories[i]
                        }
                        resolve(response)
                    }
                }
                let response = {
                    "status": 401,
                    "message": "Invalid spendingCategoryID",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getAllTeamSpaceUsers = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items[0].userList
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceLeader = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let userList = data.Items[0].userList
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].isTeamLeader) {
                        let response = {
                            "status": 201,
                            "message": "Success",
                            "data": userList[i]
                        }
                        resolve(response)
                    }
                }
                let response = {
                    "status": 401,
                    "message": "No user present with isTeamSpaceLeader TRUE",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceByUserID = async function (userID) {
    let params = {
        TableName: TABLENAME
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let teamSpaces = data.Items
                for (let i = 0; i < teamSpaces.length; i++) {
                    let userList = teamSpaces[i].userList
                    for (let j = 0; j < userList.length; j++) {
                        if (userList[j].userID === userID) {
                            let response = {
                                "status": 201,
                                "message": "Success",
                                "data": teamSpaces[i]
                            }
                            resolve(response)
                        }
                    }
                }
                let response = {
                    "status": 401,
                    "message": "No user found with UserID",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getTransactionsByUserID = async function (userID) {
    let params = {
        TableName: TABLENAME
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let teamSpaces = data.Items
                let transactions = []
                for (let i = 0; i < teamSpaces.length; i++) {
                    let userList = teamSpaces[i].userList
                    for (let j = 0; j < userList.length; j++) {
                        if (userList[j].userID === userID) {
                            for (let k = 0; k < teamSpaces[i].spendingCategories.length; k++) {
                                transactions = transactions.concat(teamSpaces[i].spendingCategories[k].transactions)
                            }
                        }
                    }
                }
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": transactions
                }
                resolve(response)
            }
        })
    })
}

export let createNewTeamSpace = async function (teamSpaceName, teamSpaceLeaderUserID, teamSpaceLeaderUsername) {
    let input = {
        "teamSpaceID": "T" + crypto.randomBytes(4).toString('hex'),
        "teamSpaceName": teamSpaceName,
        "teamSpaceLeaderUserID": teamSpaceLeaderUserID,
        "teamSpaceJoinCode": crypto.randomBytes(5).toString('hex'),
        "totalBudget": 0,
        "userList": [
            {
                "userID": teamSpaceLeaderUserID,
                "username": teamSpaceLeaderUsername,
                "isTeamLeader": true,
                "styles": {}
            }
        ],
        "spendingCategories": [],
        "styles": {}
    }
    let params = {
        TableName: TABLENAME,
        Item: input
    }
    return new Promise((resolve, reject) => {
        dynamoDB.put(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": {
                        "teamSpaceID": input.teamSpaceID,
                    }
                }
                resolve(response)
            }
        })
    })
}

export let createNewSpendingCategory = async function (teamSpaceID, spendingCategoryName, budgetLimit) {
    await axios.get(`https://api.unsplash.com/search/photos/?query=${spendingCategoryName.replace(" ", "-")}&orientation=landscape&client_id=${UNSPLASHED_ACCESS_KEY}`)
        .then(response => {
            let randInt = randomInt(0, response.data.results.length)
            let image = response.data.results[randInt].urls.regular ? response.data.results[randInt].urls.regular : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
            let input = {
                "spendingCategoryID": "C" + crypto.randomBytes(4).toString('hex'),
                "spendingCategoryName": spendingCategoryName,
                "amountUsed": 0,
                "budgetLimit": budgetLimit,
                "transactions": [],
                "styles": { "image": image }
            }
            let params = {
                TableName: TABLENAME,
                Key: {
                    "teamSpaceID": teamSpaceID
                },
                UpdateExpression: "SET spendingCategories = list_append(spendingCategories, :category)",
                ExpressionAttributeValues: {
                    ":category": [input]
                }
            }
            return new Promise((resolve, reject) => {
                dynamoDB.update(params, (err, data) => {
                    if (err) {
                        let response = {
                            "status": 401,
                            "message": err.message,
                            "data": null
                        }
                        resolve(response)
                    } else {
                        let response = {
                            "status": 201,
                            "message": "Success",
                            "data": {
                                "spendingCategoryID": input.spendingCategoryID,
                            }
                        }
                        resolve(response)
                    }
                })
            })
        }).catch(err => {
            let response = {
                "status": 401,
                "message": err.message,
                "data": null
            }
            resolve(response)
        })
}

export let createNewTransaction = async function (teamSpaceID, spendingCategoryID, spendingCategoryName, userID, username, transactionName, transactionAmount) {
    await axios.get(`https://api.unsplash.com/search/photos/?query=${transactionName.replace(" ", "-")}&orientation=squarish&client_id=${UNSPLASHED_ACCESS_KEY}`)
    .then(response => {
        let randInt = randomInt(0, response.data.results.length)
        let image = response.data.results[randInt].urls.regular ? response.data.results[randInt].urls.regular : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
        let paramsOne = {
            TableName: TABLENAME,
            FilterExpression: "teamSpaceID = :teamSpaceID",
            ExpressionAttributeValues: {
                ":teamSpaceID": teamSpaceID
            }
        }

        let input = {
            "transactionDate": new Date().toDateString(),
            "transactionName": transactionName,
            "userID": userID,
            "username": username,
            "spendingCategoryID": spendingCategoryID,
            "spendingCategoryName": spendingCategoryName,
            "transactionID": "T" + crypto.randomBytes(4).toString('hex'),
            "transactionAmount": transactionAmount,
            "styles": {"image": image}
        }
        return new Promise((resolve, reject) => {
            dynamoDB.scan(paramsOne, (err, data) => {
                if (err) {
                    let response = {
                        "status": 401,
                        "message": err.message,
                        "data": null,
                    }
                    resolve(response)
                } else {
                    let spendingCategories = data.Items[0].spendingCategories
                    for (let i = 0; i < spendingCategories.length; i++) {
                        if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                            let paramsTwo = {
                                TableName: TABLENAME,
                                Key: {
                                    "teamSpaceID": teamSpaceID
                                },
                                UpdateExpression: "SET spendingCategories[" + i + "].transactions = list_append(spendingCategories[" + i + "].transactions, :transaction)",
                                ExpressionAttributeValues: {
                                    ":transaction": [input]
                                }
                            }
                            dynamoDB.update(paramsTwo, (err, data) => {
                                if (err) {
                                    let response = {
                                        "status": 401,
                                        "message": err.message,
                                        "data": null
                                    }
                                    resolve(response)
                                } else {
                                    let paramsThree = {
                                        TableName: TABLENAME,
                                        Key: {
                                            "teamSpaceID": teamSpaceID
                                        },
                                        UpdateExpression: "SET spendingCategories[" + i + "].amountUsed = spendingCategories[" + i + "].amountUsed + :transactionAmount",
                                        ExpressionAttributeValues: {
                                            ":transactionAmount": transactionAmount
                                        }
                                    }
                                    dynamoDB.update(paramsThree, (err, data) => {
                                        if (err) {
                                            let response = {
                                                "status": 401,
                                                "message": err.message,
                                                "data": null
                                            }
                                            resolve(response)
                                        } else {
                                            let response = {
                                                "status": 201,
                                                "message": "Success",
                                                "data": {
                                                    "transactionID": input.transactionID,
                                                }
                                            }
                                            resolve(response)
                                        }
                                    })
                                }
                            })
                        }
                    }
                    let response = {
                        "status": 402,
                        "message": "An unexpected error occurred.",
                        "data": null
                    }
                    resolve(response)
                }
            })
        })
    }).catch(err => {
        let response = {
            "status": 401,
            "message": err.message,
            "data": null
        }
        resolve(response)
    })
}

export let addUserToTeamSpace = async function (teamSpaceJoinCode, userID, username) {
    let input = {
        "userID": userID,
        "username": username,
        "isTeamLeader": false,
        "styles": {}
    }
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceJoinCode = :teamSpaceJoinCode",
        ExpressionAttributeValues: {
            ":teamSpaceJoinCode": teamSpaceJoinCode
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                if (data.Items[0] == null) {
                    let response = {
                        "status": 401,
                        "message": "Invalid Join Code",
                        "data": null
                    }
                    resolve(response)
                } else {
                    var teamSpaceID = data.Items[0].teamSpaceID
                    let paramsTwo = {
                        TableName: TABLENAME,
                        Key: {
                            "teamSpaceID": data.Items[0].teamSpaceID
                        },
                        UpdateExpression: "SET userList = list_append(userList, :userList)",
                        ExpressionAttributeValues: {
                            ":userList": [input]
                        }
                    }
                    dynamoDB.update(paramsTwo, (err, data) => {
                        if (err) {
                            let response = {
                                "status": 401,
                                "message": err.message,
                                "data": null
                            }
                            resolve(response)
                        } else {
                            let response = {
                                "status": 201,
                                "message": "Success",
                                "data": {
                                    "teamSpaceID": teamSpaceID,

                                }
                            }
                            resolve(response)
                        }
                    })
                }
            }
        })
    })
}

export let getJoinCode = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items[0].teamSpaceJoinCode
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceByID = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items[0]
                }
                resolve(response)
            }
        })
    })
}

export let deleteTransaction = async function (teamSpaceID, transactionID) {
    let paramsOne = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(paramsOne, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    let transactions = spendingCategories[i].transactions
                    for (let j = 0; j < transactions.length; j++) {
                        if (transactions[j].transactionID === transactionID) {
                            let paramsTwo = {
                                TableName: TABLENAME,
                                Key: {
                                    "teamSpaceID": teamSpaceID
                                },
                                UpdateExpression: "REMOVE spendingCategories[" + i + "].transactions[" + j + "]"
                            }
                            dynamoDB.update(paramsTwo, (err, data) => {
                                if (err) {
                                    let response = {
                                        "status": 401,
                                        "message": err.message,
                                        "data": null
                                    }
                                    resolve(response)
                                } else {
                                    let paramsThree = {
                                        TableName: TABLENAME,
                                        Key: {
                                            "teamSpaceID": teamSpaceID
                                        },
                                        UpdateExpression: "SET spendingCategories[" + i + "].amountUsed = spendingCategories[" + i + "].amountUsed - :transactionAmount",
                                        ExpressionAttributeValues: {
                                            ":transactionAmount": transactions[j].transactionAmount
                                        }
                                    }
                                    dynamoDB.update(paramsThree, (err, data) => {
                                        if (err) {
                                            let response = {
                                                "status": 401,
                                                "message": err.message,
                                                "data": null
                                            }
                                            resolve(response)
                                        } else {
                                            let response = {
                                                "status": 201,
                                                "message": "Success",
                                                "data": {
                                                    "transaction": transactions[j],
                                                }
                                            }
                                            resolve(response)
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getUserByID = async function (userID) {
    let params = {
        TableName: TABLENAME,
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let teamSpaces = data.Items
                for (let i = 0; i < teamSpaces.length; i++) {
                    let userList = teamSpaces[i].userList
                    for (let j = 0; j < userList.length; j++) {
                        if (userList[j].userID === userID) {
                            let response = {
                                "status": 201,
                                "message": "Success",
                                "data": userList[j]
                            }
                            resolve(response)
                        }
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let removeUserFromTeamSpaceByID = async function (teamSpaceID, userID) {
    let paramsOne = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(paramsOne, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let userList = data.Items[0].userList
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i].userID === userID) {
                        let paramsTwo = {
                            TableName: TABLENAME,
                            Key: {
                                "teamSpaceID": teamSpaceID
                            },
                            UpdateExpression: "REMOVE userList[" + i + "]"
                        }
                        dynamoDB.update(paramsTwo, (err, data) => {
                            if (err) {
                                let response = {
                                    "status": 401,
                                    "message": err.message,
                                    "data": null,
                                }
                                resolve(response)
                            } else {
                                let response = {
                                    "status": 201,
                                    "message": "Success",
                                    "data": {
                                        "user": userList[i]
                                    }
                                }
                                resolve(response)
                            }
                        })
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let generateNewTeamSpaceJoinCode = async function (teamSpaceID) {
    let input = {
        "teamSpaceJoinCode": crypto.randomBytes(5).toString('hex')
    }
    let params = {
        TableName: TABLENAME,
        Key: {
            "teamSpaceID": teamSpaceID
        },
        UpdateExpression: "SET teamSpaceJoinCode = :teamSpaceJoinCode",
        ExpressionAttributeValues: {
            ":teamSpaceJoinCode": input.teamSpaceJoinCode
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.update(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null,
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": {
                        "joinCode": input.teamSpaceJoinCode
                    }
                }
                resolve(response)
            }
        })
    })
}

export let deleteSpendingCategory = async function (teamSpaceID, spendingCategoryID) {
    let paramsOne = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(paramsOne, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                        let paramsTwo = {
                            TableName: TABLENAME,
                            Key: {
                                "teamSpaceID": teamSpaceID
                            },
                            UpdateExpression: "REMOVE spendingCategories[" + i + "]"
                        }
                        dynamoDB.update(paramsTwo, (err, data) => {
                            if (err) {
                                let response = {
                                    "status": 401,
                                    "message": err.message,
                                    "data": null
                                }
                                resolve(response)
                            } else {
                                let response = {
                                    "status": 202,
                                    "message": "Success",
                                    "data": null
                                }
                                resolve(response)
                            }
                        })
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let changeBudgetLimit = async function (teamSpaceID, spendingCategoryID, newBudgetLimit) {
    let paramsOne = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(paramsOne, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                        let paramsTwo = {
                            TableName: TABLENAME,
                            Key: {
                                "teamSpaceID": teamSpaceID
                            },
                            UpdateExpression: "SET spendingCategories[" + i + "].budgetLimit = :newBudgetLimit",
                            ExpressionAttributeValues: {
                                ":newBudgetLimit": newBudgetLimit
                            }
                        }
                        dynamoDB.update(paramsTwo, (err, data) => {
                            if (err) {
                                let response = {
                                    "status": 401,
                                    "message": err.message,
                                    "data": null
                                }
                                resolve(response)
                            } else {
                                let response = {
                                    "status": 202,
                                    "message": "Success",
                                    "data": null
                                }
                                resolve(response)
                            }
                        })
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceStyleObject = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": data.Items[0].styles
                }
                resolve(response)
            }
        })
    })
}

export let getSpendingCategoryStyleObject = async function (teamSpaceID, spendingCategoryID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                        let response = {
                            "status": 201,
                            "message": "Success",
                            "data": spendingCategories[i].styles
                        }
                        resolve(response)
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getTransactionStyleObject = async function (teamSpaceID, transactionID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                for (let i = 0; i < spendingCategories.length; i++) {
                    let transactions = spendingCategories[i].transactions
                    for (let j = 0; j < transactions.length; j++) {
                        if (transactions[j].transactionID === transactionID) {
                            let response = {
                                "status": 201,
                                "message": "Success",
                                "data": transactions[j].styles
                            }
                            resolve(response)
                        }
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getUserStyleObject = async function (userID) {
    let params = {
        TableName: TABLENAME,
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let teamSpaces = data.Items
                for (let i = 0; i < teamSpaces.length; i++) {
                    let userList = teamSpaces[i].userList
                    for (let j = 0; j < userList.length; j++) {
                        if (userList[j].userID === userID) {
                            let response = {
                                "status": 201,
                                "message": "Success",
                                "data": userList[j].styles
                            }
                            resolve(response)
                        }
                    }
                }
                let response = {
                    "status": 402,
                    "message": "An unexpected error occurred.",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let editSpendingCategory = async function (teamSpaceID, spendingCategoryID, oldSpendingCategoryName, newSpendingCategoryName, newSpendingCategoryBudgetLimit, oldImage) {
    await axios.get(`https://api.unsplash.com/search/photos/?query=${newSpendingCategoryName.replace(" ", "-")}&orientation=landscape&client_id=${UNSPLASHED_ACCESS_KEY}`)
    .then(response => {
        let randInt = randomInt(0, response.data.results.length)
        if (oldSpendingCategoryName !== newSpendingCategoryName) {
            var newImage = response.data.results[randInt].urls.regular ? response.data.results[randInt].urls.regular : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
        } else {
            var newImage = oldImage
        }
        let paramsOne = {
            TableName: TABLENAME,
            FilterExpression: "teamSpaceID = :teamSpaceID",
            ExpressionAttributeValues: {
                ":teamSpaceID": teamSpaceID
            }
        }
        return new Promise((resolve, reject) => {
            dynamoDB.scan(paramsOne, (err, data) => {
                if (err) {
                    let response = {
                        "status": 401,
                        "message": err.message,
                        "data": null
                    }
                    resolve(response)
                } else {
                    let spendingCategories = data.Items[0].spendingCategories
                    for (let i = 0; i < spendingCategories.length; i++) {
                        if (spendingCategories[i].spendingCategoryID === spendingCategoryID) {
                            let paramsTwo = {
                                TableName: TABLENAME,
                                Key: {
                                    "teamSpaceID": teamSpaceID
                                },
                                UpdateExpression: "SET spendingCategories[" + i + "].budgetLimit = :newBudgetLimit, spendingCategories[" + i + "].spendingCategoryName = :newName, spendingCategories[" + i + "].styles = :newStyles",
                                ExpressionAttributeValues: {
                                    ":newBudgetLimit": newSpendingCategoryBudgetLimit,
                                    ":newName": newSpendingCategoryName,
                                    ":newStyles": {"image": newImage}
                                }
                            }
                            dynamoDB.update(paramsTwo, (err, data) => {
                                if (err) {
                                    let response = {
                                        "status": 401,
                                        "message": err.message,
                                        "data": null
                                    }
                                    resolve(response)
                                } else {
                                    let response = {
                                        "status": 202,
                                        "message": "Success",
                                        "data": null
                                    }
                                    resolve(response)
                                }
                            })
                        }
                    }
                    let response = {
                        "status": 402,
                        "message": "An unexpected error occurred.",
                        "data": null
                    }
                    resolve(response)
                }
            })
        })
    })
}

export let editTransaction = async function (teamSpaceID, transactionID, oldTransactionName, newtransactionName, newtransactionAmount, oldImage) {
    await axios.get(`https://api.unsplash.com/search/photos/?query=${newtransactionName.replace(" ", "-")}&orientation=squarish&client_id=${UNSPLASHED_ACCESS_KEY}`)
    .then(response => {
        let randInt = randomInt(0, response.data.results.length)
        if (oldTransactionName !== newtransactionName) {
            var newImage = response.data.results[randInt].urls.regular ? response.data.results[randInt].urls.regular : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
        } else {
            var newImage = oldImage
        }
        let paramsOne = {
            TableName: TABLENAME,
            FilterExpression: "teamSpaceID = :teamSpaceID",
            ExpressionAttributeValues: {
                ":teamSpaceID": teamSpaceID
            }
        }
        return new Promise((resolve, reject) => {
            dynamoDB.scan(paramsOne, (err, data) => {
                if (err) {
                    let response = {
                        "status": 401,
                        "message": err.message,
                        "data": null
                    }
                    resolve(response)
                } else {
                    let spendingCategories = data.Items[0].spendingCategories
                    for (let i = 0; i < spendingCategories.length; i++) {
                        let transactions = spendingCategories[i].transactions
                        for (let j = 0; j < transactions.length; j++) {
                            if (transactions[j].transactionID === transactionID) {
                                let costDifference = transactions[j].transactionAmount - newtransactionAmount
                                let paramsTwo = {
                                    TableName: TABLENAME,
                                    Key: {
                                        "teamSpaceID": teamSpaceID
                                    },
                                    UpdateExpression: "SET spendingCategories[" + i + "].transactions[" + j + "].transactionName = :newtransactionName, spendingCategories[" + i + "].transactions[" + j + "].transactionAmount = :newtransactionAmount, spendingCategories[" + i + "].transactions[" + j + "].styles = :newStyles",
                                    ExpressionAttributeValues: {
                                        ":newtransactionName": newtransactionName,
                                        ":newtransactionAmount": newtransactionAmount,
                                        ":newStyles": {"image": newImage}
                                    }
                                }
                                dynamoDB.update(paramsTwo, (err, data) => {
                                    if (err) {
                                        let response = {
                                            "status": 401,
                                            "message": err.message,
                                            "data": null
                                        }
                                        resolve(response)
                                    } else {
                                        let paramsThree = {
                                            TableName: TABLENAME,
                                            Key: {
                                                "teamSpaceID": teamSpaceID
                                            },
                                            UpdateExpression: "SET spendingCategories[" + i + "].amountUsed = spendingCategories[" + i + "].amountUsed - :costDifference",
                                            ExpressionAttributeValues: {
                                                ":costDifference": costDifference,
                                            }
                                        }
                                        dynamoDB.update(paramsThree, (err, data) => {
                                            if (err) {
                                                let response = {
                                                    "status": 401,
                                                    "message": err.message,
                                                    "data": null
                                                }
                                                resolve(response)
                                            } else {
                                                let response = {
                                                    "status": 202,
                                                    "message": "Success",
                                                    "data": null
                                                }
                                                resolve(response)
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    }
                    let response = {
                        "status": 402,
                        "message": "An unexpected error occurred.",
                        "data": null
                    }
                    resolve(response)
                }
            })
        })
    })
}

export let editTeamSpace = async function (teamSpaceID, newTeamSpaceName, newTotalBudget) {
    let params = {
        TableName: TABLENAME,
        Key: {
            "teamSpaceID": teamSpaceID
        },
        UpdateExpression: "SET teamSpaceName = :newTeamSpaceName, totalBudget = :newTotalBudget",
        ExpressionAttributeValues: {
            ":newTeamSpaceName": newTeamSpaceName,
            ":newTotalBudget": newTotalBudget
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.update(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 202,
                    "message": "Success",
                    "data": null
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceTotalBudget = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": {
                        "totalBudget": data.Items[0].totalBudget
                    }
                }
                resolve(response)
            }
        })
    })
}

export let getTeamSpaceTotalAmountUsed = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                let totalAmountUsed = 0
                for (let i = 0; i < spendingCategories.length; i++) {
                    totalAmountUsed += spendingCategories[i].amountUsed
                }
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": {
                        "totalAmountUsed": totalAmountUsed
                    }
                }
                resolve(response)
            }
        })
    })
}

export let getRecentTransactions = async function (teamSpaceID) {
    let params = {
        TableName: TABLENAME,
        FilterExpression: "teamSpaceID = :teamSpaceID",
        ExpressionAttributeValues: {
            ":teamSpaceID": teamSpaceID
        }
    }
    return new Promise((resolve, reject) => {
        dynamoDB.scan(params, (err, data) => {
            if (err) {
                let response = {
                    "status": 401,
                    "message": err.message,
                    "data": null
                }
                resolve(response)
            } else {
                let spendingCategories = data.Items[0].spendingCategories
                let recentTransactions = []
                for (let i = 0; i < spendingCategories.length; i++) {
                    let transactions = spendingCategories[i].transactions
                    for (let j = 0; j < transactions.length; j++) {
                        if (transactions[j].transactionDate === new Date().toDateString()) {
                            recentTransactions.push(transactions[j])
                        }
                    }
                    for (let j = 0; j < transactions.length; j++) {
                        if (transactions[j].transactionDate === new Date(Date.now() - 864e5).toDateString()) {
                            recentTransactions.push(transactions[j])
                        }
                    }
                    recentTransactions.sort((a, b) => {
                        return new Date(b.transactionDate) - new Date(a.transactionDate)
                    })
                }
                let response = {
                    "status": 201,
                    "message": "Success",
                    "data": {
                        "recentTransactions": recentTransactions,
                    }
                }
                resolve(response)
            }
        })
    })
}