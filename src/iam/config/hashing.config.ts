import { registerAs } from '@nestjs/config';

export default registerAs('hashing', () => ({
  salt: process.env.HASH_SALT,
}));
