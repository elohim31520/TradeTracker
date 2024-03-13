const axios = require('axios')
const cheerio = require('cheerio')

axios.get('http://localhost:1234/mess').then(html => {
    const $ = cheerio.load(html.data);

    let len = $('.num').children().length

    for (let i = 0; i < len; i++) {
        let digit = $('.num i').eq(i).text()
        console.log(digit['x-attribsNamespace']);
    }

})