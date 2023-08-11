import {Express, NextFunction, Request, Response, Router} from "express";
import config from "./util/config";
import {checkEntry, confirmedEntries, upsertConfirmedEntry} from "./service";
import {NotFoundError} from "./util/errors";

// validate middleware with fixed secret from config
export function validateAdminSecret(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    if (authHeader === `Bearer ${config.admin.secret}`) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

export function useAdminRoutes() {
    const router = Router();
    router.get('/', validateAdminSecret, async (req, res) => {
        const entries = await confirmedEntries();
        res.send(entries);
    });

    router.get('/:email', validateAdminSecret, async (req, res) => {
        try {
            const entry = await checkEntry(req.params.email);
            res.send(entry);
        } catch (e: any) {
            if (e instanceof NotFoundError) {
                res.status(404).send('Email not found');
            } else {
                console.error(e);
                res.status(500).send('Internal Server Error');
            }
        }
    });

    router.post('/:email', validateAdminSecret, async (req, res) => {
        try {
            const entry = await upsertConfirmedEntry(req.params.email, req.body.source);
            res.status(200).send({});
        } catch (e: any) {
            console.error(e);
            res.status(500).send('Internal Server Error');
        }
    });

    return router;
}