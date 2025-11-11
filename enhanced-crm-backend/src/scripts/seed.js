const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Client = require('../models/Client');
const Lead = require('../models/Lead');
const Contract = require('../models/Contract');

(async () => {
  await connectDB();
  console.log('Seeding...');
  await User.deleteMany({});
  await Client.deleteMany({});
  await Lead.deleteMany({});
  await Contract.deleteMany({});

  const admin = await User.create({ name: 'Admin User', email: 'admin@crm.test', password: 'password', role: 'Admin' });
  const sales = await User.create({ name: 'Sales Rep', email: 'sales@crm.test', password: 'password', role: 'Sales' });

  const clientA = await Client.create({
    type: 'corporate',
    organization: 'Acme Corp',
    website: 'https://acme.example',
    industry: 'Manufacturing',
    revenue: 500000,
    owner: sales._id,
    contacts: [{ name: 'Alice Admin', email: 'alice@acme.example', phone: '9999999999', designation: 'CTO' }]
  });

  const clientB = await Client.create({
    type: 'college',
    organization: 'Greenfield College',
    website: 'https://greenfield.example',
    industry: 'Education',
    revenue: 120000,
    owner: sales._id,
    contacts: [{ name: 'Bob Principal', email: 'bob@greenfield.example', phone: '8888888888', designation: 'Principal' }]
  });

  const lead1 = await Lead.create({ title: 'Acme - New Inquiry', client: clientA._id, source: 'website', value: 20000, stage: 'inquiry', owner: sales._id });
  const lead2 = await Lead.create({ title: 'Greenfield - Demo Request', client: clientB._id, source: 'email', value: 8000, stage: 'proposal', owner: sales._id });

  const contract1 = await Contract.create({ title: 'Acme Onboarding', client: clientA._id, owner: sales._id, value: 20000, validFrom: new Date(), validTill: new Date(new Date().setFullYear(new Date().getFullYear()+1)), status: 'active' });

  console.log('Seed complete');
  process.exit(0);
})();