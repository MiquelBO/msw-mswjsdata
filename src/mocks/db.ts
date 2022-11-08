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
  name: 'Miquel Boada',
  email: 'mboriols@hotmail.com',
});

