import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });

export async function POST(req) {
    const { id, action } = await req.json();

    try {
        const page = await notion.pages.retrieve({ page_id: id });
        const currentLikes = page.properties["숫자"]?.number || 0;

        let newLikes;
        if (action === 'like') {
            newLikes = currentLikes + 1;
        } else if (action === 'unlike') {
            newLikes = Math.max(currentLikes - 1, 0);
        }

        await notion.pages.update({
            page_id: id,
            properties: {
                "숫자": {
                    number: newLikes,
                },
            },
        });

        return new Response(JSON.stringify({ likes: newLikes }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update likes' }), { status: 500 });
    }
}
