import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: "Generera ett svenskt ordpar för en charad. Det ska vara ett verb i presens particip form (t.ex. 'springande') följt av ett substantiv (t.ex. 'katt'). Svara endast med ordparet, inget annat."
        }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return NextResponse.json({ ordpar: data.content[0].text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Kunde inte generera ordpar' },
      { status: 500 }
    );
  }
}
