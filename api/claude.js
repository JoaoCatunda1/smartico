// Backend endpoint para Claude API
// Coloque este arquivo em: /api/claude.js (ou /pages/api/claude.js se usar Next.js)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userId, userPlan } = req.body;
  const CLAUDE_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada' });
  }

  if (!message) {
    return res.status(400).json({ error: 'Message é obrigatório' });
  }

  try {
    // Chamar Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        system: `Você é o MARTI, um consultor financeiro IA amigável e especializado.
                 Você ajuda usuários com análises de gastos, planejamento financeiro, cálculos de comissão,
                 investimentos e decisões financeiras.
                 Sempre personalizar respostas com dados do usuário quando possível.
                 Seja conciso, prático e direto.
                 Use emojis para melhor comunicação.
                 Plano do usuário: ${userPlan}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude API Error:', data);
      return res.status(response.status).json({
        error: 'Erro ao chamar Claude API',
        details: data
      });
    }

    const aiResponse = data.content[0].text;

    return res.status(200).json({
      response: aiResponse,
      userId,
      userPlan
    });
  } catch (error) {
    console.error('Backend Error:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
}
