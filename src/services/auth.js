import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import {SessionModel} from '../db/models/Session.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { randomBytes } from 'crypto';
export const registerUsers = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');
    
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,

    });
};

export const loginUsers = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(401, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Email or password is wrong');
    }

    await SessionModel.deleteMany({ userId: user._id });
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await SessionModel.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};
export const logoutUsers = async (sessionId) => {
    await SessionModel.findByIdAndDelete(sessionId);
};
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
    const session = await SessionModel.findOne({ _id: sessionId, refreshToken });
    if (!session) {
        throw createHttpError(401, 'Unauthorized');
    }
    const isSessionTokenExpired = new Date(session.refreshTokenValidUntil) < new Date();
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Unauthorized');
    }
    await SessionModel.deleteOne({ _id: sessionId, refreshToken });
     const newAccessToken = randomBytes(30).toString('base64');
    const newRefreshToken = randomBytes(30).toString('base64');

    return await SessionModel.create({
        userId: session.userId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
};