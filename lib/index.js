'use strict'

const Wreck = require('wreck')
const Promise = require('bluebird')

// Set default configuration for Wreck and get new instance
const internals = {}
internals.wreck = Wreck.defaults({
    timeout: 2000
})

const externals = module.exports = {}

externals.request = (method, uri, options) => {
    return new Promise((resolve, reject) => {

        internals.wreck.request(method, uri, options, (err, res) => {
            if (err) {
                return reject(err)
            }

            Wreck.read(res, {}, function (err, body) {
                if (err) {
                    return reject(err)
                }

                return resolve({
                    host: uri,
                    proxy: true,
                    body: body.toString()
                })
            })
        })
    })
}

externals.defaults = (options) => {
    internals.wreck = internals.wreck.defaults(options)
}
