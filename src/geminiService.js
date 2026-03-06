const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateAIResponse(question) {

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a clinical decision support assistant helping a doctor respond to a patient.

                  Patient query: ${question}

                  Generate a short response the doctor could send.

                  Guidelines:
                  - Keep the response concise
                  - Maximum 4 sentences
                  - Use simple medical guidance
                  - Suggest next steps if relevant
                  - Avoid long explanations
                  - No markdown, no bold text
                  - Bullet points only if necessary

                  Return only the response text.`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return data.candidates[0].content.parts[0].text;
}
