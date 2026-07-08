/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client to prevent startup crash if API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured. Please check the Secrets panel in AI Studio Settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ----------------- API ROUTES -----------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. AI Interactive Growth Coach Chat
app.post('/api/growth/chat', async (req, res) => {
  try {
    const { messages, activeApp } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }
    if (!activeApp) {
      return res.status(400).json({ error: 'Active app context is required.' });
    }

    const ai = getGeminiClient();

    // Map message history for Gemini SDK
    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const systemInstruction = `You are GrowthBrain AI, an elite SaaS growth architect, viral expansion strategist, and senior UX/growth consultant.
The user is viewing their "AI Growth Operating System" command center.
The currently active connected application is: "${activeApp.name}" (${activeApp.businessModel}).
Product Description: ${activeApp.description}
Target Audience: ${activeApp.targetAudience}

Current App Metrics:
- Monthly Recurring Revenue (MRR): $${activeApp.metrics.mrr.toLocaleString()}
- Monthly Active Users (MAU): ${activeApp.metrics.mau.toLocaleString()}
- Monthly Churn Rate: ${activeApp.metrics.churn}%
- Average Revenue Per User (ARPU): $${activeApp.metrics.arpu}
- Customer Acquisition Cost (CAC): $${activeApp.metrics.cac}
- Viral Coefficient (K): ${activeApp.metrics.viralCo}

Give extremely strategic, realistic, direct, and actionable advice on user growth, customer acquisition, virality, MRR expansion, conversion, and churn reduction. Keep your tone highly professional, crisp, tactical, and direct. Avoid high-level fluff or platitudes. Give concrete, creative strategies tailored specifically to this business model and audience.

Always structure your response as a JSON object containing:
1. 'reply': A high-impact conversational strategic reply detailing explanations, data analysis, and step-by-step reasoning.
2. 'actions': An optional array of up to 3 interactive actions that the user can execute directly in the app.
   - For example:
     * To suggest creating a marketing campaign: { label: "Create Campaign", type: "create_campaign", payload: { goal: "Reactivate cold registrations", tone: "Empathetic" } }
     * To suggest a signup flow improvement task: { label: "Improve Signup Flow", type: "improve_signup", payload: { title: "Refactor Step 2 Guardian verification and add inline hints to prevent drop-off", category: "Retention" } }
     * To suggest content creation: { label: "Generate Content", type: "generate_content", payload: { goal: "Publish high-virality community stories" } }
     * To add other tasks: { label: "Schedule Pricing Review", type: "add_task", payload: { title: "Review organic subscription pricing tiers and discounts", category: "Monetization" } }
3. 'report': An optional structured growth diagnostic report with a title, a list of key metrics analyzed with value/change/isGood, and a list of structured findings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING, description: "Strategic, conversational text response to the user's specific growth questions." },
            actions: {
              type: Type.ARRAY,
              description: "Optional recommended actions, e.g. [Create Campaign], [Improve Signup Flow], [Generate Content]. Keep relevant to the user request. Max 3.",
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "Button text, e.g. 'Create Campaign', 'Improve Signup Flow', 'Generate Content'" },
                  type: { type: Type.STRING, description: "Must be: 'create_campaign', 'improve_signup', 'generate_content', 'add_task', 'update_metrics', 'view_tab'" },
                  payload: { type: Type.OBJECT, description: "Optional metadata, like { title: 'Fix onboarding' } or { goal: 'Increase registrations' }." }
                },
                required: ['label', 'type']
              }
            },
            report: {
              type: Type.OBJECT,
              description: "Optional diagnostic report showing bottlenecks or performance indicators.",
              properties: {
                title: { type: Type.STRING, description: "E.g. 'Registration Funnel Analysis'" },
                metrics: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING, description: "E.g., 'Step 2 Dropoff Rate'" },
                      value: { type: Type.STRING, description: "E.g., '58%'" },
                      change: { type: Type.STRING, description: "E.g., '-12% vs last week'" },
                      isGood: { type: Type.BOOLEAN, description: "True if positive, false if representing a bottleneck." }
                    },
                    required: ['label', 'value', 'change', 'isGood']
                  }
                },
                findings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING, description: "A key research discovery or statistical observation." }
                }
              },
              required: ['title', 'metrics', 'findings']
            }
          },
          required: ['reply']
        }
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model.');
    }

    const result = JSON.parse(text);
    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat query.' });
  }
});

// 2. Generate Real-time Growth Recommendations
app.post('/api/growth/recommendations', async (req, res) => {
  try {
    const { activeApp } = req.body;
    if (!activeApp) {
      return res.status(400).json({ error: 'Active app context is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Based on the following app profile and real-time business metrics, analyze the current growth profile and generate exactly 4 high-fidelity, highly actionable, personalized growth recommendations.

App Name: ${activeApp.name}
Business Model: ${activeApp.businessModel}
Description: ${activeApp.description}
Target Audience: ${activeApp.targetAudience}

Current Metrics:
- MRR: $${activeApp.metrics.mrr.toLocaleString()}
- MAU: ${activeApp.metrics.mau.toLocaleString()}
- Monthly Churn Rate: ${activeApp.metrics.churn}%
- Average Revenue Per User (ARPU): $${activeApp.metrics.arpu}
- Customer Acquisition Cost (CAC): $${activeApp.metrics.cac}
- Viral Coefficient (K): ${activeApp.metrics.viralCo}

Analyze the bottlenecks. If Churn is high (> 5%), prioritize Retention recommendations. If CAC is high, focus on organic Acquisition, content marketing, or referral systems. If Viral Coefficient is low (< 0.5), recommend virality features (referral program, user-generated-content sharing). If ARPU is low, recommend Monetization changes (upsells, premium tiers).

You MUST output your response strictly matching the requested JSON structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an automated growth diagnostics engine. You always analyze SaaS, Matchmaking, Education and Marketplace metrics, outputting highly customized tactical plays in strict JSON format.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique short string like rec_1, rec_2" },
              title: { type: Type.STRING, description: "Crisp, actionable title of the recommendation." },
              category: { type: Type.STRING, description: "Must be exactly one of: Acquisition, Retention, Monetization, Virality, Brand" },
              impact: { type: Type.STRING, description: "Must be exactly: High, Medium, or Low" },
              effort: { type: Type.STRING, description: "Must be exactly: High, Medium, or Low" },
              metricImpact: { type: Type.STRING, description: "Expected numeric metric impact, e.g., '+15% Churn Reduc.', '-20% CAC', '+2.5x Viral K'" },
              description: { type: Type.STRING, description: "A detailed explanation of why this is important and how it fixes the current bottleneck." },
              actionSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 clear, concrete step-by-step implementation tasks."
              }
            },
            required: ['id', 'title', 'category', 'impact', 'effort', 'metricImpact', 'description', 'actionSteps']
          }
        },
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI.');
    }

    const recommendations = JSON.parse(text);
    res.json({ recommendations });
  } catch (error: any) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate recommendations.' });
  }
});

// 3. AI Marketing Campaign Generator (Content Studio)
app.post('/api/growth/campaign', async (req, res) => {
  try {
    const { activeApp, campaignGoal, tone } = req.body;
    if (!activeApp || !campaignGoal || !tone) {
      return res.status(400).json({ error: 'App context, goal, and tone are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `Develop a high-converting, copywriter-grade, launch-ready multi-channel marketing campaign tailored for:
App Name: ${activeApp.name}
Business Model: ${activeApp.businessModel}
Description: ${activeApp.description}
Target Audience: ${activeApp.targetAudience}

Campaign Goal: ${campaignGoal}
Campaign Tone: ${tone}

You must write actual high-impact marketing copy for four key channels tailored exactly to the app's target market (e.g. if the target market is Muslims looking for marriage, write culturally respectful and deep matrimonial-themed copy; if education, focus on skill-building and children/student enrichment). Avoid placeholder text like "[Insert link here]"—make it look finished and professional.

Channels:
1. Email Newsletter (Subject, Headline, Body paragraphs, Call to Action)
2. Social Media Post (Catchy hook, body, bullet points, hashtags, and Call to Action)
3. Mobile Push Notification (Short, high-clickrate Title, Body, and Call to Action)
4. Outbound Cold Outreach Email (Brief Subject, Headline, High-context introductory pitch, and clear Call to Action)

Output strictly as a single JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, high-conversion growth copywriter who has launched multi-million dollar products. You speak directly to the target demographic with perfect cultural and industry-specific context.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            tone: { type: Type.STRING },
            email: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                headline: { type: Type.STRING },
                body: { type: Type.STRING, description: "Rich, well-structured multi-paragraph body text." },
                cta: { type: Type.STRING }
              },
              required: ['subject', 'headline', 'body', 'cta']
            },
            social: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING, description: "The scroll-stopping hook." },
                body: { type: Type.STRING, description: "The core social copy with spacing and emojis." },
                cta: { type: Type.STRING }
              },
              required: ['headline', 'body', 'cta']
            },
            push: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING, description: "Push notification title." },
                body: { type: Type.STRING, description: "Short, compelling message." },
                cta: { type: Type.STRING }
              },
              required: ['headline', 'body', 'cta']
            },
            outreach: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                headline: { type: Type.STRING },
                body: { type: Type.STRING, description: "One-on-one cold email body." },
                cta: { type: Type.STRING }
              },
              required: ['subject', 'headline', 'body', 'cta']
            }
          },
          required: ['goal', 'tone', 'email', 'social', 'push', 'outreach']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI.');
    }

    const campaign = JSON.parse(text);
    res.json({ campaign });
  } catch (error: any) {
    console.error('Campaign copy error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate campaign copy.' });
  }
});


// 5. Custom Content Generation & Intelligence Endpoint
app.post('/api/content/generate', async (req, res) => {
  try {
    const { activeApp, goal, audience, platform, tone, instruction, currentCopy } = req.body;
    if (!activeApp || !goal || !platform || !tone) {
      return res.status(400).json({ error: 'activeApp, goal, platform, and tone are required.' });
    }

    const ai = getGeminiClient();

    let prompt = `You are an elite, high-conversion growth marketing content strategist. Write highly engaging copy for:
App: ${activeApp.name} (${activeApp.businessModel})
Description: ${activeApp.description}

Platform Type: ${platform}
Campaign Goal: ${goal}
Target Audience: ${audience || activeApp.targetAudience}
Brand Tone: ${tone}
`;

    if (instruction && currentCopy) {
      prompt += `
We need to edit existing copy based on this request: "${instruction}".
Existing copy details:
- Headline: ${currentCopy.headline}
- Body: ${currentCopy.body}
- CTA: ${currentCopy.cta}

Maintain the core messaging but apply the requested edit perfectly. No placeholders like "[Insert link here]".`;
    } else {
      prompt += `
Please write brand new copy tailored exactly for this channel.
Requirements for ${platform}:
- Social Media Post: Needs a catchy hook, well-spaced bullet benefits, 3-4 professional hashtags, and a clear call-to-action.
- Blog Article: Needs a compelling educational headline/title, a structured multi-paragraph value-first body (at least 3 brief sections), and a helpful call-to-action.
- Email Campaign: Needs an engaging Subject line, strong hook headline, personalized value proposition body paragraphs, and a clear call-to-action button copy.
- WhatsApp Message: Needs high-urgency hook, short benefit bullets, friendly conversational text, emojis, and clear next steps (CTA).
- Advertisement Copy: Needs scroll-stopping attention-grabber, highly punchy product promise, high-impact CTA.

Do not use placeholders. Write full high-fidelity copy.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an award-winning growth copywriter who turns data and target audience expectations into high-conversion digital copies. Your outputs are polished, ready to publish immediately, and possess high viral potential.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING, description: "Main headline, title, or email subject line." },
            body: { type: Type.STRING, description: "The core copy. Use newline formatting for bullets, sections, or paragraph breaks as appropriate." },
            cta: { type: Type.STRING, description: "Call-to-action button or closing instruction text." },
            meta: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING, description: "Optional subject line for emails." },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Optional list of tags." },
                estimatedTime: { type: Type.STRING, description: "E.g. '2 min read' or '30 sec read'." }
              }
            }
          },
          required: ['headline', 'body', 'cta']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI.');
    }

    const generatedContent = JSON.parse(text);
    res.json({ content: generatedContent });
  } catch (error: any) {
    console.error('Custom content generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate custom content copy.' });
  }
});


// 6. Marketing Automation Workflow Simulator Endpoint
app.post('/api/automation/run-simulation', async (req, res) => {
  try {
    const { activeApp, automationName, trigger, actions } = req.body;
    if (!activeApp || !automationName || !trigger || !actions || !Array.isArray(actions)) {
      return res.status(400).json({ error: 'activeApp, automationName, trigger, and actions array are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite, high-performance SaaS marketing automation engine and conversion optimizer.
We are dry-running and simulating an AI-powered automation workflow inside the Growth OS.
App context:
- Name: ${activeApp.name} (${activeApp.businessModel})
- Description: ${activeApp.description}
- Target Audience: ${activeApp.targetAudience}

Workflow Details:
- Automation Name: ${automationName}
- Trigger Event (When): ${trigger}
- AI Actions configured to execute:
${actions.map((act: string, idx: number) => `  ${idx + 1}. ${act}`).join('\n')}

Please construct a high-fidelity, hyper-realistic, dynamic simulation of this workflow firing for a single target user.
Your response MUST be structured as a JSON object containing:
1. 'mockUser': An object with 'name' (appropriate for the app target audience), 'email', and 'meta' (brief behavioral or demographic context).
2. 'logs': An array of 3-4 professional event trace strings demonstrating step-by-step execution. For example:
   - "Trigger detected: 'User registers' for Fatimah Al-Fihri"
   - "AI agent analyzed user profile and selected WhatsApp channel based on high mobile-opening probability (94%)"
   - "Executing action: Custom welcome message generated utilizing 'Warm & Respectful' brand tone"
   - "Scheduled tracking telemetry event; response metrics active."
3. 'generatedCopy': An object detailing the actual message sent, containing 'channel' (e.g., 'Email', 'WhatsApp', 'SMS', or 'Push notification'), 'subject' (if email, otherwise empty or short title), 'body' (the custom generated message tailored to this user), and 'cta' (button or next action text). Make sure the copy is full high-fidelity copy without any placeholders.
4. 'prediction': An object with 'score' (e.g. "+24% Lift" or "88% Re-engagement") and 'reasoning' (a 1-sentence analytical prediction of why this copy and channel will perform successfully).

Strictly follow this response structure. No markdown formatting around the JSON except standard JSON syntax.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an automated marketing agent simulation module. You output highly accurate, custom-tailored customer profiles, trace execution logs, and conversion-optimized notification drafts in JSON format.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mockUser: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                meta: { type: Type.STRING }
              },
              required: ['name', 'email', 'meta']
            },
            logs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            generatedCopy: {
              type: Type.OBJECT,
              properties: {
                channel: { type: Type.STRING },
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
                cta: { type: Type.STRING }
              },
              required: ['channel', 'body', 'cta']
            },
            prediction: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ['score', 'reasoning']
            }
          },
          required: ['mockUser', 'logs', 'generatedCopy', 'prediction']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from simulation engine.');
    }

    const result = JSON.parse(text);
    res.json({ result });
  } catch (error: any) {
    console.error('Automation simulation error:', error);
    res.status(500).json({ error: error.message || 'Failed to simulate automation workflow.' });
  }
});


// 7. Business Intelligence Analytics Center Endpoint
app.post('/api/analytics/insights', async (req, res) => {
  try {
    const { activeApp } = req.body;
    if (!activeApp) {
      return res.status(400).json({ error: 'activeApp object is required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an elite Growth Lead and Chief Business Intelligence Officer.
We are analyzing performance analytics for a SaaS/digital product in Growth OS:
App Details:
- Name: ${activeApp.name} (${activeApp.businessModel})
- Description: ${activeApp.description}
- Target Audience: ${activeApp.targetAudience}

Current App Metrics:
- Monthly Recurring Revenue (MRR): $${activeApp.metrics.mrr.toLocaleString()}
- Monthly Active Users (MAU): ${activeApp.metrics.mau.toLocaleString()}
- Monthly Churn Rate: ${activeApp.metrics.churn}%
- Average Revenue Per User (ARPU): $${activeApp.metrics.arpu}
- Customer Acquisition Cost (CAC): $${activeApp.metrics.cac}
- Viral Coefficient (K): ${activeApp.metrics.viralCo}

Please generate an expert, highly strategic, realistic Business Intelligence packet. 
Make sure every insight, opportunity, and risk alert is deeply contextualized specifically for ${activeApp.name}'s business model (${activeApp.businessModel}), target audience, and current metrics. Avoid generic advice.
Include some realistic geographical or demographic details (e.g. mention Baghdad or specific local regions, age segments, or behavior groups tailored to the business).

You MUST structure your response as a single, valid JSON object containing:

1. 'performanceOverview': An object with:
   - 'headline' (string)
   - 'desc' (string summarizing overall product performance, MRR growth trajectory and core bottleneck)
   - 'healthScore' (integer from 1 to 100)
   - 'chartPoints' (an array of exactly 6 objects representing chronological month-over-month performance trends, each with 'label' e.g. "Feb", "Mar", "value" (integer), and 'previousValue' (integer))

2. 'insights': An array of exactly 3 granular, data-driven observations.
   Each insight object MUST contain:
   - 'title': A captivating, descriptive title (e.g. "Female Verification Retention Catalyst" or "Primary parent dashboard stickiness boost")
   - 'metric': The specific metric tracked (e.g., "Retention Rate", "Weekly Engagement", "Average Order Value")
   - 'change': The percentage shift (e.g., "+14%", "-8%", "+32%")
   - 'isPositive': Boolean (true/false)
   - 'explanation': A 2-3 sentence sophisticated explanation detailing the exact psychological or behavioral root cause of this metric change.
   - 'chartData': An array of 3-4 simple data objects (each with 'label' (string) and 'value' (integer)) depicting the visual correlation.

3. 'opportunities': An array of exactly 3 tactical growth avenues.
   Each opportunity object MUST contain:
   - 'title': A short punchy opportunity title
   - 'potentialImpact': The projected improvement (e.g., "High (+22% MRR)", "Medium (+12% Conversion)")
   - 'targetSegment': The specific regional, age, or behavior cohort to address
   - 'suggestedChannel': The communication channel (e.g. "WhatsApp Nudge", "Parent SMS Alert", "App push banner")
   - 'explanation': Detailed description of why this opportunity exists and how to tap into it.
   - 'chartData': An array of 3-4 simple data objects (each with 'label' (string) and 'value' (integer)) illustrating the target segment sizing or growth velocity.

4. 'riskAlerts': An array of exactly 2-3 warning indicators.
   Each risk alert object MUST contain:
   - 'title': The name of the risk (e.g. "Signup cart dropout", "Dormant user drift")
   - 'severity': 'High' or 'Medium' or 'Low'
   - 'stat': Current trend stat (e.g. "34% Drop", "-8.2% completion")
   - 'explanation': Analysis of where and why the leak is occurring.
   - 'preventativeAction': Actionable step to stop the bleeding immediately.
   - 'chartData': An array of 3-4 simple data objects (each with 'label' (string) and 'value' (integer)) visualizing the declining metric path.

Output ONLY the JSON structure. No markdown wrappers like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a professional full-stack data scientist and product growth expert. You output rigorous, realistic, highly tailored customer retention analysis, growth opportunities, and conversion metrics in a strict JSON format.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            performanceOverview: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                desc: { type: Type.STRING },
                healthScore: { type: Type.INTEGER },
                chartPoints: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.INTEGER },
                      previousValue: { type: Type.INTEGER }
                    },
                    required: ['label', 'value', 'previousValue']
                  }
                }
              },
              required: ['headline', 'desc', 'healthScore', 'chartPoints']
            },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  metric: { type: Type.STRING },
                  change: { type: Type.STRING },
                  isPositive: { type: Type.BOOLEAN },
                  explanation: { type: Type.STRING },
                  chartData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.INTEGER }
                      },
                      required: ['label', 'value']
                    }
                  }
                },
                required: ['title', 'metric', 'change', 'isPositive', 'explanation', 'chartData']
              }
            },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  potentialImpact: { type: Type.STRING },
                  targetSegment: { type: Type.STRING },
                  suggestedChannel: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  chartData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.INTEGER }
                      },
                      required: ['label', 'value']
                    }
                  }
                },
                required: ['title', 'potentialImpact', 'targetSegment', 'suggestedChannel', 'explanation', 'chartData']
              }
            },
            riskAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  stat: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  preventativeAction: { type: Type.STRING },
                  chartData: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        value: { type: Type.INTEGER }
                      },
                      required: ['label', 'value']
                    }
                  }
                },
                required: ['title', 'severity', 'stat', 'explanation', 'preventativeAction', 'chartData']
              }
            }
          },
          required: ['performanceOverview', 'insights', 'opportunities', 'riskAlerts']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from intelligence engine.');
    }

    const result = JSON.parse(text);
    res.json({ result });
  } catch (error: any) {
    console.error('Analytics BI Insights generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to synthesize BI insights packet.' });
  }
});


// ----------------- VITE SETUP -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI-Growth-OS full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
