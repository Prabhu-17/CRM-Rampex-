const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.generateText = async ({ prompt, model = "llama3-70b-8192", maxTokens = 300 }) => {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};

exports.summarizeNotes = async (notes) => {
  const prompt = `
    Summarize these CRM notes clearly and professionally:
    ---
    ${notes}
  `;
  return this.generateText({ prompt, maxTokens: 150 });
};

exports.recommendNextStep = async (lead) => {
  const prompt = `
    Based on the following lead details, recommend the next best CRM action:
    ---
    ${JSON.stringify(lead, null, 2)}
  `;
  return this.generateText({ prompt, maxTokens: 200 });
};

exports.scoreLeadLLM = async (lead) => {
  const prompt = `
    Score this sales lead from 1-100 and explain the reason.
    Format:
    Score: <number>
    Reason: <text>

    Lead Data:
    ${JSON.stringify(lead, null, 2)}
  `;
  return this.generateText({ prompt, maxTokens: 120 });
};
