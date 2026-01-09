const fetch = require('node-fetch');

async function generateReleaseNotes({ productName, version, mode, features, apiKey }) {
    const isExpanded = mode === 'expanded';

    const systemPrompt = isExpanded
        ? `You are a software developer writing detailed GitHub release descriptions. Write in correct markdown format. The user message contains the features/changes for this release. Create an expanded, detailed release description with multiple sections. Make it comprehensive and well-structured. Use the title "${productName} - ${version}". Base the content on the features provided in the user message. Always use the actual product name ${productName} and version ${version} in the release notes, never use placeholders.`
        : `You are a software developer writing GitHub release descriptions. Write in correct markdown format. The user message contains the features/changes for this release. Create a release description with the title "${productName} - ${version}" based on the features provided in the user message. Always use the actual product name ${productName} and version ${version} in the release notes, never use placeholders.`;

    const requestBody = {
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: features }
        ],
        temperature: 0.7
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

module.exports = { generateReleaseNotes };
