export function generateSessionReplayPrompt({
  funnelName,
  capturedEvents,
  timstampedSummary,
  funnelSteps,
}: {
  funnelName?: string;
  capturedEvents: {
    id: string;
    eventType: string;
    timestamp: string;
    url: string;
    metadata: Record<string, any>;
    step?: string;
  }[];
  timstampedSummary: string;
  funnelSteps: { name: string; key: string; order: number; metadata: any }[];
}): string {
  const funnelDescription = funnelName
    ? `This session occurred within the "${funnelName}" funnel and includes the following steps: ${funnelSteps.map((step) => step.name).join(", ")}.`
    : `This session occurred within a tracked funnel. The steps are: ${funnelSteps.map((step) => step.name).join(", ")}.`;

  const prompt = `You are an AI UX analyst. Your goal is to review this session and extract **insightful**, **funnel-aware**, and **actionable** product insights.
    
    ${funnelDescription}
  
  
    Explicity User Events:
    ${JSON.stringify(capturedEvents, null, 2)}
    
    
  Session Timestamps:
    ${JSON.stringify(timstampedSummary, null, 2)}
    
    Instructions:
    1. Summarize what the user did and how they behaved.
    2. Identify signs of confusion, frustration, or drop-off.
    3. Tie your insights back to the funnel steps, if possible.
    4. Prioritize clarity, conciseness, and actionability.
  
  You are an elite UX analyst. Extract ONE actionable insight from this session.
  
  Rules:
  - Use short, punchy sentences.
  - Description = 1–2 lines max. No filler words.
  - Recommendation = tactical fix, start with a verb. 1 line.
  - Summarize user behavior as bullet points, not narrative.
  - Use active voice, avoid "ensure", "consider", "review".
  - Output must match the schema exactly.
    
  `;

  return prompt;
}
