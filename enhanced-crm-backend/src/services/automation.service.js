const { defaultQueue } = require('./queue.service');

exports.autoAssignLead = async (lead) => {
  await defaultQueue.add('autoAssignLead', { leadId: lead._id });
};

exports.scheduleRenewalAlert = async (contract) => {
  await defaultQueue.add('contractRenewal', { contractId: contract._id }, { delay: 1000 * 60 });
};