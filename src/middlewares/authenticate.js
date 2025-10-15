import { SessionModel } from "../db/models/Session.js";
import { UsersCollection } from "../db/models/user.js";
import createHttpError from "http-errors";
export const authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        next(createHttpError(401, 'Please provide Authorization header'));
        return;
    };
    const barer = authHeader.split(' ')[0];
    const Token = authHeader.split(' ')[1];
    if (barer !== 'Bearer' || !Token) {
        next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
    }
    const session = await SessionModel.findOne({ accessToken: Token });

    if (!session) {
        next(createHttpError(401, 'Session not found'));
        return;
    }
    const isTokenExpired = new Date(session.accessTokenValidUntil) < new Date();
    if (isTokenExpired) {
        next(createHttpError(401, 'Access token expired'));
        return;
    }
    const user = await UsersCollection.findById(session.userId);
    if (!user) {
        next(createHttpError(401, 'User not found'));
        return;
    }
    req.user = user;
    next();
};
