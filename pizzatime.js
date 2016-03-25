var vorpal = require('vorpal')();
var _ = require('underscore');
var api = require('./api.js');
var Table = require('cli-table');
var figlet = require('figlet');
var menu = [];

figlet('Pizza Time', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
});

api.getMenu()
    .then(function(menu) {
        menu = menu;

        var table = new Table({ head: ['Name', 'Description', 'Price'] });
        _.map(menu, x => { return _.toArray(_.pick(x, 'name', 'description', 'price')); }).forEach(row => { table.push(row); });

        vorpal
            .command('menu', 'Output pizza list.')
            .alias('pizzas')
            .action(function(args, callback) {
                this.log(table.toString());
                callback();
            });

        vorpal
            .command('order <mail> <pizza> [pizzas...]', 'Order a pizza.')
            .autocomplete(_(menu).map(x => { return x.name; }))
            .action(function(args, callback) {
                var pizzaIds = _.chain(menu).filter(x => { return x.name === args.pizza || (args.pizzas && args.pizzas.indexOf(x.name) > -1); }).map(x => { return x.id; }).value();
                this.log('Ordering...');
                api.order(args.mail, pizzaIds)
                    .then(() => {
                        this.log('Done.');
                        callback();
                    })
                    .catch(() => {
                        this.log('Failed.');
                        callback();
                    });
            });

        vorpal
            .delimiter('PizzaTime$')
            .show();
    })
    .catch(function(error) {
        vorpal.log('API is unavailable.')
    });