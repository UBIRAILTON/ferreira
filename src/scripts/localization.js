const axios = require('axios')

module.exports = async function search(cep){
                    const localization = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

                    return localization.data
                }