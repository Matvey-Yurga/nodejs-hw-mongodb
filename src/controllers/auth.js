import { registerUsers,loginUsers, logoutUsers } from "../services/auth.js";
import { THIRTY_DAYS } from '../constants/index.js';
import {refreshUsersSession} from "../services/auth.js";

export const registerUserController = async (req, res) => {
    const user = await registerUsers(req.body);
    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: user,
    });
};
export const loginUserController = async (req, res) => {
   const session = await loginUsers(req.body);
res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUsers(req.cookies.sessionId);
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
};
export const refreshUserController = async (req, res) => {
  const session = await refreshUsersSession({ sessionId: req.cookies.sessionId, refreshToken: req.cookies.refreshToken });
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};