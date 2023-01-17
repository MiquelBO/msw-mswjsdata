import { db } from "./db";
import { PathParams, rest } from 'msw';
import { environment } from "src/environments/environment";
import { NewUser, User } from "src/app/user/models/user";

interface UsersRequestParams extends PathParams {
userId: string
}

export const handlers = [
rest.get
  <undefined, UsersRequestParams, User>(
  `${environment.API_USERS}/:userId`,
  (req, res, ctx) => {
    const user = db.user.findFirst({
      where: {
        id: {
          equals: req.params.userId
        }
      }
    });

    if (!user) {
      return res(ctx.status(404));
    }

    return res(
      ctx.status(200),
      ctx.json(user)
    );
  }),

rest.put
  <User, UsersRequestParams, string>(
  `${environment.API_USERS}/:userId`,
  (req, res, ctx) => {
    const user = db.user.findFirst({
      where: {
        id: {
          equals: req.params.userId
        }
      }
    });

    if (!user) {
      return res(ctx.status(404));
    }

    db.user.update({
      where: {
        id: {
          equals: user.id,
        },
      },
      data: req.body
    });

    return res(
      ctx.status(200),
      ctx.json(user.id)
    );
  }),

rest.get
  <undefined, PathParams, User[]>(
  environment.API_USERS, 
  (req, res, ctx) => {
    const users = db.user.getAll();

    return res(ctx.json(users));
  }),

rest.delete
  <undefined, UsersRequestParams>(
  `${environment.API_USERS}/:userId`,
  (req, res, ctx) => {
    const user = db.user.findFirst({
      where: {
        id: {
          equals: req.params.userId
        }
      }
    });

    if (!user) {
      return res(ctx.status(404));
    }

    db.user.delete({
      where: {
        id: {
          equals: user.id,
        },
      },
    });

    return res(ctx.status(200));
  }),

rest.post
  <NewUser, PathParams, string>(
  environment.API_USERS,
  (req, res, ctx) => {
    const newUser = db.user.create(req.body);

    return res(
      ctx.status(200),
      ctx.json(newUser.id)
    );
  })
];
