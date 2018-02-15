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

            internals.wreck.read(res, {}, function (err, body) {
                if (err) {
                    return reject(err)
                }

                let jsonBody = {}
                try{
                    jsonBody = JSON.parse(body.toString())
                }
                catch(e){
                    return reject(e)
                }

                return resolve({
                    host: uri,
                    proxy: true,
                    body: jsonBody
                })
            })
        })
    })
}

externals.defaults = (options) => {
    internals.wreck = internals.wreck.defaults(options)
}

externals.get = (uri, options) => { return externals.request('GET', uri, options) }
externals.post = (uri, options) => { return externals.request('POST', uri, options) }
externals.put = (uri, options) => { return externals.request('PUT', uri, options) }
externals.patch = (uri, options) => { return externals.request('PATCH', uri, options) }
externals.delete = (uri, options) => { return externals.request('DELETE', uri, options) }
