//Dados do site
var baseUrl = "https://api.whatsapp.com/send?phone=557191315366&text="
const produtos = [
    {
        id: 1,
        nome: 'Bicarbonato de sódio',
        img: '../img/produtos/bicarbon.png',
        valor: 40.00
    },
    {
        id: 2,
        nome: 'Cúrcuma 60C',
        img: '',
        valor: 30.90
    },
    {
        id: 3,
        nome: 'Amora Miura 90C',
        img: '',
        valor: 29.90
    },
	{
        id: 4,
        nome: 'Essência de Eucalipto 100ml',
        img: '',
        valor: 35.90
    },
]

const pontos = [
    "Salvador Shopping",
    "Salvador Shopping Norte",
    "Shopping da Bahia",
    "Shopping Paralela",
    "Shopping Bela Vista",
    "Estação do Metrô"
]

//Funções do Site
function renderProdutos(){
    var container = document.querySelector('select#product')

    produtos.forEach(item => {
        var optionEl = document.createElement('option')
        optionEl.value = item.id
        optionEl.appendChild(document.createTextNode(item.nome))

        container.appendChild(optionEl)
    })
}

function renderPontos(){
    var container = document.querySelector('select#point')

    pontos.forEach(item => {
        var optionEl = document.createElement('option')
        optionEl.value = item
        optionEl.appendChild(document.createTextNode(item))

        container.appendChild(optionEl)
    })
}

function send(){
    //Recebendo dados do pedido
    const fields = {
        name: document.querySelector('select#product').value,
		nome: document.querySelector('input#nome').value,
        price: document.querySelector('input#price').value,
        deliveryType: document.querySelector('select#delivery').value,
        paymentType: document.querySelector('select#payment').value
    }

    var product = produtos.find(item => item.id == fields.name)
    fields.name = product.nome

    //Forma de Entrega
    if(fields.deliveryType == 1){
        fields.deliveryType = 'Ponto Fixo'
        fields.point = document.querySelector('select#point').value
    }else{
        fields.deliveryType = 'Receber em Casa'
        fields.cep = document.querySelector('input#cep').value
        fields.uf = document.querySelector('input[name="uf"]').value
        fields.city = document.querySelector('input[name="city"]').value
        fields.street = document.querySelector('input[name="street"]').value
        fields.number = document.querySelector('input#number').value
        fields.complement = document.querySelector('input[name="complement"]').value
        fields.district = document.querySelector('input[name="district"]').value 
    }

    //Forma de pagamento
    if(fields.paymentType == 1){
        fields.paymentType = "Dinheiro"
        fields.coins = document.querySelector('input#coins').value
    }else if(fields.paymentType == 2){
        fields.paymentType = "Boleto"
    }else if(fields.paymentType == 3){
        fields.paymentType = "Cartão"
    }

    //Preparando Url de Mensagem
    if(Object.values(fields).includes('')){
        alert("Todos os campos devem ser preenchidos!")
        return
    }

    let requestUrl = baseUrl + formatedText(fields)
    requestUrl = requestUrl.replace(/\s/g, '%20')

    window.open(requestUrl)
}

function formatedText(fields){
    var text = `*Nome do Cliente*:${fields.nome} \n *Produto*: ${fields.name}   *Preço*:${fields.price}  
    *Forma de Entrega*:${fields.deliveryType}`

    //Forma de Entrega
    if(fields.deliveryType == 'Ponto Fixo'){
        text = text + `  *Ponto*:${fields.point}`  
    }else{
        text = text + `  *CEP*:${fields.cep}  *Cidade*:${fields.city}  *UF*:${fields.uf}
          *Rua*:${fields.street}  *N°*:${fields.number}  *Complemento*:${fields.complement}
          *Bairro*:${fields.district} ` 
    }

    //Forma de pagamento
    if(fields.paymentType == 'Dinheiro'){
        text = text + `  *Forma de Pagamento*:${fields.paymentType}  *Troco*:${fields.coins}`
    }else{
        text = text + `  *Forma de Pagamento*:${fields.paymentType}`;
    }  
    
    return text
}

function changeProduct(){
    var idProduct = document.querySelector('select#product').value

    var product = produtos.find(item => item.id == idProduct)
    
    document.querySelector('input#price').value = product.valor + ' R$'
}

function changeDeliveryFields(){
    let deliveryType = document.querySelector('select#delivery').value
    if(deliveryType == 1){
        document.querySelector('#home-delivery').classList.add('d-none')
        document.querySelector('#point-delivery').classList.remove('d-none')
        renderPontos()
    }else if(deliveryType == 2){
        document.querySelector('#point-delivery').classList.add('d-none')
        document.querySelector('#home-delivery').classList.remove('d-none')
    }else{
        document.querySelector('#point-delivery').classList.add('d-none')
        document.querySelector('#home-delivery').classList.add('d-none')
    }
}

function changePaymentFields(){
    let deliveryType = document.querySelector('select#payment').value
    if(deliveryType == 1){
        document.querySelector('#pay-money').classList.remove('d-none')
    }else{
        document.querySelector('#pay-money').classList.add('d-none')
    }
}

async function searchCEP(){
    const cep =document.querySelector('input[name="cep"]').value

    //Validação
    if(isNumeric(cep) && (String(cep).length == 8)){
        //Requisição
        var localization = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
        localization = localization.data

        if(localization.erro){
            alert('CEP não foi encontrado!')
        }else{
            //Preenchendo campos
            document.querySelector('input[name="uf"]').value = localization.uf

            document.querySelector('input[name="city"]').value = localization.localidade

            document.querySelector('input[name="street"]').value = localization.logradouro

            document.querySelector('input[name="complement"]').value = localization.complemento

            document.querySelector('input[name="district"]').value = localization.logradouro

            return
        }
    }

    alert('CEP inválido!')
}

function isNumeric(str){
  var er = /^[0-9]+$/;
  return (er.test(str));
}

renderProdutos()