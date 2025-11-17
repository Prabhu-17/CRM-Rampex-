const OpenAI = require('./llm.service') // hypothetical wrapper

exports.scoreLead = async (lead) => {
  // simple heuristic fallback
  const base = (lead.value || 0) / 1000
  const score = Math.min(100, Math.round(base * 10 + Math.random() * 30))
  // try enriching via LLM if available
  try {
    if (OpenAI) {
      const resp = await OpenAI.call('gpt-embed', {
        prompt: `Score this lead: ${JSON.stringify(lead)}`,
      })
      if (resp && resp.score) return { score: resp.score, reason: 'llm' }
    }
  } catch (err) {
    // ignore and return heuristic
  }
  return { score, reason: 'heuristic' }
}

exports.summarize = async (text) => {
  if (!text) return ''
  if (text.length < 200) return text
  try {
    if (OpenAI) {
      const resp = await OpenAI.call('gpt-summarize', { text })
      if (resp && resp.summary) return resp.summary
    }
  } catch (err) {
    // fallback
  }
  return text.slice(0, 197) + '...'
}

exports.recommend = async (data) => {
  // data can be lead or interaction notes
  try {
    if (OpenAI) {
      const resp = await OpenAI.call('gpt-recommend', { data })
      return resp
    }
  } catch (err) {
    // best-effort fallback
  }
  return { suggestion: 'Follow up via email in 3 days' }
}
