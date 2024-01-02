const homeRouter = require('./home')
const listQuantrangRouter = require('./listQuantrang')
const warehouseRouter = require('./warehouse')
function route(app) {
    app.use('/quantrang', listQuantrangRouter)
    app.use('/warehouse', warehouseRouter)
    app.use('/', homeRouter);
}

module.exports = route;