var apiConfig = require('config.json')('./api.config.json');
var axios = require('axios');
var endpoint = axios.create({
    baseURL: apiConfig.url,
});

// PIZZA TIME API
var api = {};

// Get pizza list
api.getMenu = function() {
    return new Promise(function(resolve, reject) {
        endpoint.get('pizzas.json')
            .then(function(response) {
                resolve(response.data);
            })
            .catch(function(error) {
                reject(error);
            });
    });
};
api.getPizzas = api.getMenu;

// Order some pizzas
api.order = function(mail, pizzaIds) {

    if (typeof pizzaIds !== 'Array') {
        pizzaIds = [ pizzaIds ];
    }

    return endpoint.post('orders', {
        email_user: mail,
        id_pizza_user: pizzaIds,
    });
};

module.exports = api;