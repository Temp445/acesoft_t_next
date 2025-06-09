export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const API_KEY = process.env.NEXT_PUBLIC_EMAIL_VALIDATION_API_KEY;

    if (!API_KEY) {
      return new Response(
        JSON.stringify({ message: "Missing API key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://validate.acesoftcloud.in/api/validate-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error calling validation API" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
