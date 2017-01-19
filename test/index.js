'use strict'

// Load modules

const Http = require('http')
const Lab = require('lab')
const Code = require('code')
const PWreck = require('../lib')

// Test shortcuts

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect


const internals = {
    payload: new Array(1640).join('0123456789'), // make sure we have a payload larger than 16384 bytes for chunking coverage
}

describe('request()', () => {

    it('requests a resource with promise fullfil', (done) => {

        const server = Http.createServer((req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(internals.payload)
        })

        server.listen(0, () => {

            PWreck.request('get', 'http://localhost:' + server.address().port, {}).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                server.close()
                done()
            }).catch(done)
        })
    })

    it('requests a resource with promise error', (done) => {

        const server = Http.createServer((req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(internals.payload)
        })

        server.listen(0, () => {

            PWreck.request('get', 'http://loclhost:' + server.address().port, {}).catch((err) => {

                expect(err).to.be.an.error()
                done()
            })
        })
    })

    it('requests a resource and set a default endpoint', (done) => {

        const server = Http.createServer((req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(internals.payload)
        })

        server.listen(0, () => {

            PWreck.defaults({
                baseUrl: `http://localhost:${server.address().port}`
            })

            PWreck.request('post', '', {}).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                server.close()
                done()
            }).catch(done)
        })
    })

    it('requests a resource and set a default endpoint', (done) => {

        const server = Http.createServer((req, res) => {

            res.writeHead(200, { 'Content-Type': 'text/plain' })
            res.end(internals.payload)
        })

        server.listen(0, () => {

            const baseUrl = `http://localhost:${server.address().port}`

            PWreck.post(baseUrl , {}).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                return PWreck.delete(baseUrl)

            }).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                return PWreck.put(baseUrl)

            }).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                PWreck.defaults({baseUrl: baseUrl})
                return PWreck.get()
            }).then((res) => {

                expect(res.body.toString()).to.equal(internals.payload)
                done()
            }).catch(done)
        })
    })

})
