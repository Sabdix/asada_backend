import 'dotenv/config';

const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
  process.env.MJ_API_KEY || 'your-api-key',
  process.env.MJ_SECRET_KEY || 'your-api-secret',
  {
    config: {},
    options: {},
  },
);
export default mailjet;
