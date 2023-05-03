import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';
const { ACCESS_TOKEN_KEY, ACCESS_TOKEN_EXPIRY } = process.env;
import usersRepository from "../v1/components/users/users.repository";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../utils/api-errors";

// Sign Access Token: JWT signed, to be used for authenticating users
export const signAccessToken = async({userId}: {userId:string}) => {
    const options = {expiresIn: ACCESS_TOKEN_EXPIRY, audience: userId}
    return jwt.sign({}, ACCESS_TOKEN_KEY as string, options);
};

export const authorize = ({roles}: {roles: string[] | string}) => {
    // roles param can be a single role string (e.g. Role.User or 'user')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['admin', 'user'])
    if (typeof roles === 'string') roles = [roles];
    const ROLES = {USER: 'user', ADMIN: 'admin'};

    return [
        // Authenticate user, and attach user to request object (req.authUser)
        (req:Request, res:Response, next:NextFunction) => {
            const user_id = req.params?.userId;
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) return next(new UnauthorizedError(`unauthenticated, please try logging in again`));

            jwt.verify(token, ACCESS_TOKEN_KEY!, {}, async (err:any, payload:any) => {
                if (err) return next(new UnauthorizedError(`Your session has expired, login to continue`));

                let userId = payload?.aud;
                let user;
                try {
                    user = await usersRepository.getUserById({userId});
                } catch (err) {
                    return next(new BadRequestError(`User not found.`));
                }

                req.authUser = user;

                if (user.role === ROLES.USER && user_id && req.authUser?.id !== user_id) return next(new ForbiddenError(`You don't have such privilege.`));

                // authorize based on user role and resource privilege (authorizations for sub-admins).
                // user's role is not authorized
                if (roles.length && !roles.includes(req.authUser.role)) return next(new ForbiddenError(`You are not authorized to perform this action.`));

                // allowed roles as defined in ROLES resources file
                if (!Object.values(ROLES).includes(req.authUser.role)) return next(new ForbiddenError(`You're on the wrong spot, take another turn!`));

                // authorize user if it makes it past the role check above
                if (req.authUser.role === ROLES.USER) return next();

                // grant all privileges to admin
                if (req.authUser.role === ROLES.ADMIN) return next();

                next()
            });
        },
    ];
};


