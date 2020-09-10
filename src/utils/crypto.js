import crypto from 'crypto';

const key = Buffer.from('01234567012345670123456701234567', 'utf-8');
const iv = Buffer.from('0123456701234567', 'utf-8');

export const encrypt = message => {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = cipher.update(message, 'utf8', 'base64');
  return encrypted + cipher.final('base64');
};

export const decrypt = encrypted => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
};
