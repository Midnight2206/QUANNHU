const homeRouter = require('./home')
const listQuantrangRouter = require('./listQuantrang')
const warehouseRouter = require('./warehouse')
const sharedRouter = require('./shared')
function route(app) {
    app.use('/shared', sharedRouter)
    app.use('/quantrang', listQuantrangRouter)
    app.use('/warehouse', warehouseRouter)
    app.use('/', homeRouter);
}

module.exports = route;