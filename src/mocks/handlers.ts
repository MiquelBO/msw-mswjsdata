import { db } from "./db";
import { PathParams, rest } from 'msw';
import { NewUser, User } from "src/app/user/models/user";

interface UsersRequestParams extends PathParams {
  userId: string
}

export const USERS_API_MOCK = '/api/users';

export const handlers = [
  rest.get
    <undefined, UsersRequestParams, User>(
    `${USERS_API_MOCK}/:userId`,
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
    `${USERS_API_MOCK}/:userId`,
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
    USERS_API_MOCK,
    (req, res, ctx) => {
      const users = db.user.getAll();

      return res(ctx.json(users));
    }),

  rest.delete
    <undefined, UsersRequestParams>(
    `${USERS_API_MOCK}/:userId`,
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
    USERS_API_MOCK,
    (req, res, ctx) => {
      const newUser = db.user.create(req.body);

      return res(
        ctx.status(200),
        ctx.json(newUser.id)
      );
    })
];
