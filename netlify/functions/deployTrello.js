import fetch from 'node-fetch';

export async function handler(event) {
  try {
    // Parse the POST payload from Netlify deploy hook
    const { deployUrl, branch } = JSON.parse(event.body);

    // Trello secrets stored in Netlify environment variables
    const trelloKey = process.env.TRELLO_KEY;
    const trelloToken = process.env.TRELLO_TOKEN;
    const listId = process.env.TRELLO_LIST_ID;

    if (!trelloKey || !trelloToken || !listId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Trello credentials not set' }),
      };
    }

    // Create Trello card
    const response = await fetch(
      `https://api.trello.com/1/cards?key=${trelloKey}&token=${trelloToken}&idList=${listId}&name=New Production Deploy&desc=Branch: ${branch}, URL: ${deployUrl}`,
      { method: 'POST' },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Trello card created', card: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
