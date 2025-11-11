exports.scoreLead = async (lead) => {
  const base = (lead.value || 0) / 1000;
  const score = Math.min(100, Math.round(base * 10 + Math.random() * 30));
  return { score, reason: 'heuristic' };
};

exports.summarizeNote = async (text) => {
  return text && text.length > 200 ? text.slice(0, 197) + '...' : text;
};