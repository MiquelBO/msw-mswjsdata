import { factory, primaryKey } from "@mswjs/data";
import { faker } from '@faker-js/faker';

export const db = factory({
user: {
  id: primaryKey(faker.datatype.uuid),
  name: String,
  email: String,
},
});

db.user.create({
  name: 'user1',
  email: 'user1@hotmail.com',
});

db.user.create({
  name: 'user2',
  email: 'user2@hotmail.com',
});

db.user.create({
  name: 'user3',
  email: 'user3@hotmail.com',
});
