const logger = require('./../../module/logger')('API: Auth')
const express = require('express')
const router = express.Router()
const user = require('./../../module/user')

router.post('/login', async (req, res) => {
    const body = req.body
    logger.debug('Request body:', body)
    if (body && body.username && body.password) {
        const result = await user.getTokenByUsernameAndPassword(body.username, body.password)

        if (result) {
            res.cookie('token', result, {
                maxAge: (new Date()).getTime() / 1000 + 1000 * 3600 * 24 * 180,
                path: '/'
            })

            res.json({
                code: 0,
                msg: 'Success',
                data: {
                    token: result
                }
            })
            return
        } else {
            res.status(403).json({
                code: -1,
                msg: 'Username or password wrong',
                data: {}
            })
            return
        }
    }

    res.json({
        code: -2,
        msg: 'Invalid body',
        data: {}
    })
})

router.all('/logout', (req, res) => {
    res.clearCookie('token')
    res.json({
        code: 0,
        msg: 'Success',
        data: {}
    })
})

module.exports = router
