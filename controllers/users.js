const User = require('../models/users')
const bcrypt = require('bcrypt-nodejs')
const fs = require('fs');
const jwt = require('jsonwebtoken')
const config = require('../config')
const path = require('path')


function saveUser(req, res) {
    const email = req.body.email
    const phone = req.body.phone

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) return res.status(500).send({ message: `error al buscar el email en la DB ${err}` })
        if (user) {
            return res.status(401).send({ message: `ya existe este usuario favor de iniciar sesion como ${user.email}` })
        } else {
            const user = new User()
            user.name = req.body.name;
            user.surname = req.body.surname;
            user.email = req.body.email;
            bcrypt.hash(req.body.password, null, null, (err, hash) => {
                user.password = hash
                user.save((err, userStored) => {
                    if (err) return res.status(500).send({ message: `error al guardar el usuario ${err}` })
                    if (userStored) {
                    var token = jwt.sign({ usuario: userStored }, config.secret);
                    userStored.password = undefined
                    return res.status(200).send({ message: 'Gracias por registrarte' })
                } else {
                    return res.status(403).send({ message: 'el usuario no se guardo' })
                }
            })
        })
    }
})
}


function loginUser(req, res) {
    let params = req.body
    let email = params.email
    let password = params.password

    if (!req.body.email || !req.body.password) {
        return res.status(403).send({ message: 'Favor rellenar todos los campos' })
    }

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    user.password = undefined
                    var token = jwt.sign({ usuario: user }, config.secret, { expiresIn: 14400 });
                    return res.status(200).send({
                        user,
                        token
                    })
                } else {
                    return res.status(500).send({ message: 'el usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(500).send({ message: 'el usuario no existe, Favor registrate' });
        }
    })
}


module.exports = {
    saveUser,
    loginUser
}