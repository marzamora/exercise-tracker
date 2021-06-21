const User = require('../models/user')
const Exercise = require('../models/exercise')
const mongoose = require('mongoose')

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const controllers = {
    createUser: (req, res) => {
        const userData = {
            username: req.body.username
        }
        const user = new User(userData)
        user.save( (err, data) => {
            err ? res.json(err) : res.json({username: data.username, _id: data._id})
        })
    },
    getUsers: async (req, res) => {
        const all = await User.find({})
        res.send(all)
    },
    createExercise: (req, res) => {
        const body = req.body
        // Is id valid
        if (!mongoose.Types.ObjectId.isValid(body[':_id'])){
            res.send(
                'ID is invalid, see <a href="https://docs.mongodb.com/manual/reference/method/ObjectId">mongodb</a> for more info'
            )
            return;
        }
        /* checking if id belongs to known user */
        User.findById(body[':_id'], (err, user) => {
            if (err) {
                return res.json(err)
            }
            if (user === null) {
                console.log('NULL USER')
                return res.send('Unknown User ID')
            }
            if (body.description === ""){
                return res.send('Description required')
            }
            if (body.duration === ""){
                return res.send('Duration required')
            }
            const exerciseData = {
                _uid: body[':_id'],
                description: body.description,
                duration: body.duration,
                date:  body.date ? new Date(body.date) : new Date()
            }
            if (exerciseData.date == "Invalid Date")
                return res.send('Cast to date failed')
            const exercise = new Exercise(exerciseData)
            exercise.save( (err, data) => {
                if (err)
                    return res.json(err)
                const formattedDate = `${weekdays[data.date.getDay()]} ${months[data.date.getMonth()]} ${data.date.getUTCDate()} ${data.date.getFullYear()}`
                res.json({
                    _id: user._id,
                    username: user.username,
                    date: formattedDate,
                    duration: data.duration,
                    description: data.description
                })
            })
        })
    },
    getLogs: (req, res) => {
        User.findById(req.params._id, (err, user) => {
            if (err) {
                return res.json(err)
            }
            let query = Exercise.find({_uid: user._id})
            if (req.query.from)
                query.where('date').gte(new Date(req.query.from))
            if (req.query.to)
                query.where('date').lte(new Date(req.query.to))
            if (req.query.limit)
                query.limit(parseInt(req.query.limit))
            query.select({ _id: 0, _uid: 0, __v: 0})
            query.exec((err, log) => {
                if (err) {
                    return res.json(err)
                }
                res.json({
                    _id: user._id,
                    username: user.username,
                    count: log.length,
                    log: log
                })
                return;
            })
        })
    },
    notFound: (req, res) => {
        res.status(404)
            .send('Error, Not Found')
    },
    default: (req, res) => {
        res.json({
            message: "Hello friend"
        })
    }
}

module.exports = controllers