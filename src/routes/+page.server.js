import { SECRET_API_KEY } from '$env/static/private'
import { error } from '@sveltejs/kit';
/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const prompt = data.get('prompt');
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SECRET_API_KEY}`
      },
      body: JSON.stringify(
        {
          prompt: prompt,
          n: 1,
          size: '512x512'
        })
    }).catch(err => {
      throw error(500, {
        message: err
      });
    });;

    let result = await response.json();
    if (result.error) {
      throw error(500, {
        message: result.error.message
      });
    }

    return result.data[0].url;
  }
};

