const controller = require('./controller')

const routes = (app) => {
    app.route('/api')
        .get(controller.default)
    app.route('/api/users')
        .get(controller.getUsers)
        .post(controller.createUser)
    app.route('/api/users/:_id/logs')
        .get(controller.getLogs)
    app.route('/api/users/:id/exercises')
        .post(controller.createExercise)
    app.route('*')
        .get(controller.notFound)
        .post(controller.notFound)

}

module.exports = routes