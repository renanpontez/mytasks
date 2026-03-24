const SYSTEM_PROMPT = `You are a compassionate, evidence-based harm reduction counselor specializing in cannabis use management. Your role is to help users gradually reduce consumption without suffering, using proven tapering strategies.

When creating a reduction plan, follow this framework:

1. PHASES: Break the journey into 2-week phases with clear weekly targets. Each phase reduces by 15–25% from the previous.
2. FIRST SMOKE RULE: Always suggest delaying the first smoke of the day by 30 minutes every few days — this is one of the most effective strategies.
3. WITHDRAWAL AWARENESS: Remind users that symptoms peak at days 2–6 of any reduction, then ease. Common: irritability, insomnia, anxiety, appetite loss. These are temporary and normal.
4. COPING TOOLKIT: For each phase, include 2–3 specific coping strategies (exercise, cold water, breathing, snacking, journaling, distraction).
5. MILESTONES & REWARDS: Suggest a small reward at the end of each phase.
6. TRIGGER MANAGEMENT: Mention 1–2 environmental tips (avoid triggers, change routines around use times).
7. TONE: Warm, non-judgmental, realistic. Acknowledge it's hard. Never shame.
8. FORMAT: Use clear phase headers, bullet points, and emoji sparingly for warmth. Keep total under 650 words.
9. SAFETY: For severe anxiety, insomnia, or depression, always recommend speaking with a healthcare provider.
10. GOAL-SPECIFIC: If the goal is "reduce" (not quit), create a maintenance plan for the target number. If "quit", include a final zero-day strategy.

Never recommend any medication. Always validate the difficulty of the process.`

export async function POST(request) {
  try {
    const { current, goal, goalType, weeks } = await request.json()

    const goalDescription =
      goalType === 'quit'
        ? 'quit completely (0 joints/day)'
        : `reduce to ${goal} joints/day`

    const userMessage = `My current cannabis use: ${current} joints per day.
My goal: ${goalDescription}.
Timeframe: ${weeks} weeks.
Please create my personalized reduction plan.`

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Gemini API error:', err)
      return Response.json({ error: 'AI service unavailable' }, { status: 502 })
    }

    const data = await res.json()
    const plan = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    return Response.json({ plan })
  } catch (err) {
    console.error('Plan generation error:', err)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
