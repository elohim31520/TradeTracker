const axios = require('axios')
const { headers } = require('./config')

function getUserSubscribeCompanyNews(data) {
	axios.post(`http://localhost:1234/news/subscription`, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
		console.log(err.response.data);
	})
}

function getUserFavoriteNews(data) {
	axios.post(`http://localhost:1234/favorite/news`, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
		console.log(err.response.data);
	})
}

function setUserFavoriteNews (data){
	axios.post(`http://localhost:1234/favorite/news/set`, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
		console.log(err.response.data);
	})
}

function getAllNews (data){
	axios.post(`http://localhost:1234/news/queryall`, data, headers).then(res => {
		console.log(res.data);
	}).catch(err => {
		console.log(err.message);
		console.log(err.response.data);
	})
}


// getUserSubscribeCompanyNews({
// 	userId: "lewis.lee"
// })

getUserFavoriteNews({})

// setUserFavoriteNews({
// 	userId: "lewis.lee",
// 	newsId: 123
// })

// getAllNews({
// 	startDate: "2023-08-17",
// 	endDate: "2023-08-18"`
// })
