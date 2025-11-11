const emitter = require('./emitter');
const automation = require('../services/automation.service');
const ai = require('../services/ai.service');

emitter.on('lead.created', async (lead) => {
  try {
    const score = await ai.scoreLead(lead);
    await automation.autoAssignLead(lead);
    console.log('lead.created handled', lead._id, score);
  } catch (err) {
    console.error('lead.created handler error', err);
  }
});

emitter.on('client.created', async (client) => {
  console.log('client created:', client._id);
});

module.exports = emitter;