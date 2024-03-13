const axios = require('axios')

function register(userId, pwd) {
    axios.post('http://localhost:1234/users/register', {
        userId,
        pwd,
    }).then(res =>{
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
    })
}

function login(userId, pwd) {
    axios.post('http://localhost:1234/users/login', {
        userId,
        pwd,
    }).then(res =>{
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
    })
}