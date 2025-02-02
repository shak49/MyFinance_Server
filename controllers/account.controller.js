//
//
//
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import User from '../models/User.js';

const env = process.env;

export const generateLinkToken = async (req, res) => {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': env.PLAID_CLIENT_ID,
        'PLAID-SECRET': env.PLAID_SECRET,
        'PLAID-Version': '2020-09-14'
      },
    },
  });
  const client = new PlaidApi(configuration);
  const user = await User.findOne({ _id: req.body._id });
  if (!user) return res.status(400).send({ message: 'Unable to find!' });
  try {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: user._id },
      client_name: 'My Finance App',
      products: ['auth'],
      language: 'en',
      webhook: 'https://sample-webhook-uri.com',
      country_codes: ['US']
    });
    const data = tokenResponse.data;
    res.status(200).json({
      expiration: data.expiration,
      linkToken: data.link_token
    });
  } catch (error) {
    res.status(500).send({ message: 'Internal server error.' });
  }
};