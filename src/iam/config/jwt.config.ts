import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  accessTokenTtl: Number.parseInt(
    process.env.JWT_ACCESS_TOKEN_TTL ?? '3600',
    10,
  ),
}));
