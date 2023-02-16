import express from 'express';
import { handleError, sanitize } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { getInstallURL } from '../helpers/zoom-api.js';
import session from '../session.js';

const router = express.Router();

/*
 * Home Page - Zoom App Launch handler
 * this route is used when a user navigates to the deep link
 */
const text = [];

router.get('/', async (req, res, next) => {
    try {
        sanitize(req);

        const header = req.header(contextHeader);

        const isZoom = header && getAppContext(header);
        // const name = isZoom ? 'Poom' : 'Browser';

        // return res
        // .render('index', {
        //     isZoom,
        //     title: `Hello ${name}`,
        // });

        if (isZoom) {
            return res
                .set(
                    'Content-Security-Policy',
                    "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
                )
                .render('zoom', {
                    data: text,
                });
        } else {
            return res
                .set(
                    'Content-Security-Policy',
                    "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
                )
                .render('test', {
                    data: text,
                });
        }
    } catch (e) {
        next(handleError(e));
    }
});

/* POST HANDLER */
router.post('/', function (req, res) {
    var texts = req.body.text;
    text.push(texts);
    return res.render('test', {
        data: text,
    });
});

/*
 * Install Route - Install the Zoom App from the Zoom Marketplace
 * this route is used when a user installs the app from the Zoom Client
 */
router.get('/install', session, async (req, res) => {
    const { url, state, verifier } = getInstallURL();
    req.session.state = state;
    req.session.verifier = verifier;
    res.redirect(url.href);
});

export default router;
