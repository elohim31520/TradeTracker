const axios = require('axios')
const { headers } = require('./token')

function addRecords(data) {
    axios.post('http://localhost:1234/sellRecords/add', data, headers).then(res => {
        console.log(res.data);
    }).catch(err => {
        console.log(err);
    })
}

function deleteRecords(data) {
    axios.post('http://localhost:1234/sellRecords/del', data, headers).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

function postRecordsAvg(userId, token) {
    axios.post("http://localhost:1234/sellRecords/avg",
        { userId },
        headers
    ).then(res => {
        console.log(res.data);
    }).catch(e => {
        console.log(e);
    })
}

addRecords(
    [
        {
            userId: 'lewis.lee',
            share: 2,
            price: 94.95,
            company: "GOOG",
            dividend: 0,
            total: 189.89,
            open_time: '2023-03'
        },
    ]
)