import bcrypt from 'bcrypt';
import { UsersCollection } from '../db/models/user.js';
import {SessionModel} from '../db/models/session.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, TEMPLATES_DIR, THIRTY_DAYS } from '../constants/index.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
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
export const requestResetToken = async (email) => {
    const user = await UsersCollection.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

    const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
    const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();
    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        resetToken: `${getEnvVar('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
    });
    try {
        await sendEmail({
            from: getEnvVar(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch {
        throw createHttpError(500, 'Failed to send the email, please try again later.');
    }
};

export const resetPassword = async (payload) => {
    let entries;
    try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
    } catch(err) {
        if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
    }
    const user = await UsersCollection.findOne({ _id: entries.sub, email: entries.email });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};