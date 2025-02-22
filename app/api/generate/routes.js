import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2024-02-15'  // Uppdaterad version
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 100,
        system: "Du är en app som genererar svenska ordpar för charader. Svara endast med ordparet.",
        messages: [{
          role: "user",
          content: "Generera ett svenskt ordpar för en charad. Det ska vara ett verb i presens particip form (t.ex. 'springande') följt av ett substantiv (t.ex. 'katt'). Svara endast med ordparet, inget annat."
        }]
      })
    });

    // Logga API-svaret för felsökning
    console.log('API Status:', response.status);
    const responseText = await response.text();
    console.log('API Response:', responseText);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error('Invalid JSON response from API');
    }

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Unexpected API response format');
    }

    return NextResponse.json({ ordpar: data.content[0].text.trim() });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Kunde inte generera ordpar',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
