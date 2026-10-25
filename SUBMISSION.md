# Devpost submission draft: Escudo RGV

Everything marked **[YOU FILL IN]** is something only you know. I didn't want to invent it.

---

## Project name
Escudo RGV

## Elevator pitch
A bilingual (English/Spanish) scam checker built for Brownsville and the Rio Grande Valley. Share any suspicious text, WhatsApp or email and get a plain-language verdict, what to reply, and a warning card to send your family.

---

## About the project

### Inspiration
Scams in the Rio Grande Valley don't look like the generic ones in English-only tools. They look like a fake CBP message saying your package is stuck at the Brownsville bridge, a fake Brownsville PUB notice threatening to shut off your power today unless you pay by Zelle, or a WhatsApp message that says *"Hola tía, se me cayó el celular al agua, ¿me prestas $350?"* They arrive in Spanish, they use local names and places, and they hit the people least able to spot them: abuelitos, new immigrants, and anyone who doesn't have a tech-savvy relative to ask.

Existing tools are English-first, generic, and require someone to know a message is suspicious *and* know where to look it up. We wanted something that meets people where scams already happen, on their phone, in their language, in one tap.

### What it does
- **Scam check in English or Spanish.** Paste or share a message and get a risk score (0-100), a verdict, the psychological tactics being used (urgency, fear, authority), and a plain-language explanation.
- **Doesn't cry wolf.** The AI is told explicitly *not* to assume every message is a scam. Wrong numbers and legitimate messages get a polite suggested reply instead of a scare.
- **Local verification.** It searches the web for reports of the number or link, and checks Google Maps to see whether the business or agency a message claims to be from actually exists in Brownsville.
- **Family warning card.** For high-risk messages it writes a ready-to-send warning for the family group chat.
- **Texto Grande mode.** A large-type, simplified interface for older users.
- **Works as a phone app.** Installable from the browser. On Android it shows up in the phone's **Share** menu, so you can long-press a scam text, tap Share, and get the answer. On iPhone there is a one-tap "paste copied message & check" button.
- **Text/WhatsApp bot.** Forward a suspicious message to a Twilio number and get the verdict back by text, with no app and no install, which is what matters most for older relatives.

### How we built it
- **Next.js (App Router), React, Tailwind CSS** for the web app and API routes.
- **Gemini API** (`@google/genai`) does the analysis. The model returns structured JSON: risk score, bilingual verdicts and explanations, suggested reply, and the family warning card.
- **SerpAPI** supplies web search evidence and Google Maps verification, which is passed to Gemini so the verdict is grounded in real data and not guessed.
- **Twilio** powers the SMS/WhatsApp webhook at `/api/sms`, with request-signature verification so only Twilio can call it, plus per-sender and daily rate limits.
- **Progressive Web App**: web manifest with a `share_target`, service worker, and generated icons, so the site installs like an app and receives shared text.
- The analysis logic lives in one shared module, so the website, the SMS bot and the share flow all use the same code.

### Challenges we ran into
- **Slow responses.** Searches were taking far too long. By timing each step we found the model we'd picked was overloaded, returning errors or hanging for 40+ seconds. Switching to a faster model with a fallback and a timeout brought a full check down to about 1.6 seconds. We also made the web lookups run in parallel.
- **Prompt injection.** The message being analyzed is written by a scammer, so it can try to talk the AI into saying it's safe. We now pass it as clearly delimited untrusted data and tell the model never to follow instructions inside it.
- **iPhone limits.** iOS doesn't support Share Target, so we built the paste-and-check button and the text bot as alternatives.
- **Cost control.** A public scam checker can burn through API quota, so the SMS bot has per-number and daily limits and a message-length cap.
- **Keeping false alarms low.** Telling a family a real message is a scam is a real cost, so the prompt and response format are built to separate safe messages, wrong numbers and scams.

### Accomplishments we're proud of
- Real local context (Brownsville, CBP, PUB, Matamoros) instead of generic scam advice.
- It works with no app and no tech skill: just forward a text.
- A full check in about 1.6 seconds.

### What we learned
- Measure before optimizing. We assumed our code was slow; the real culprit was one overloaded model.
- Accessibility changes the design: large text, plain language and Spanish-first aren't extras here.
- Security matters even in a small project: signature checks, rate limits and prompt-injection defenses.

### What's next
- Screenshot upload, so people can share a picture of a message.
- A community database of reported numbers and links, so repeat scams are caught instantly.
- Voice-call scam checking and more RGV cities.
- Shared-store rate limiting for production scale.

---

## Built with
`next.js` `react` `tailwindcss` `javascript` `typescript` `gemini-api` `google-gemini` `serpapi` `google-maps` `twilio` `whatsapp` `sms` `pwa` `service-worker` `vercel` `node.js` `claude-code`

## "Try it out" links
- Code: https://github.com/rbccvgws-gif/shield-rgv
- Live demo: **[YOU FILL IN: your Vercel URL]**

## Project media
**[YOU FILL IN]** Suggested screenshots (JPG/PNG, 3:2 ratio):
1. Home screen with the three preset scams (CBP, PUB, "Hola tía")
2. A High Risk result with the score and explanation
3. The family warning card
4. Texto Grande mode
5. The share menu on a phone with Escudo RGV listed
6. A text-message conversation with the SMS bot's reply

## Video demo link
**[YOU FILL IN]** Suggested 2-minute script: show a scam text arriving, share it to Escudo RGV, show the Spanish verdict, copy the family warning, then show the SMS bot answering a forwarded message.

---

## Additional info (for judges)

### Sponsor / special prizes
Best Use of Gemini API. **[YOU FILL IN: any other prizes you want to enter]**

### Schools your team members attend
**[YOU FILL IN]** (your email suggests The University of Texas; confirm for each team member)

### .Tech domain names registered during the hackathon
**[YOU FILL IN, or "N/A"]**

### Feedback on technology used
**[YOU FILL IN with your real opinions.]** Notes you can build on from what we hit:
- **Gemini API:** `gemini-3.8-flash` returned 503 "high demand" errors and hung for 40+ seconds during our testing; `gemini-3.5-flash-lite` answered in about 1 second. The `MINIMAL` thinking level was rejected by the model we first tried. JSON output mode (`responseMimeType`) worked well for structured results.
- **Next.js 16:** dev mode blocks tunneled requests unless the domain is listed in `allowedDevOrigins`, which isn't obvious at first.
- **SerpAPI:** fast (~0.2 s) and useful for grounding results.

### AI tools used this weekend
Gemini API (in the product), Claude Code (to build the SMS bot, the installable-app and share features, and the speed fixes). **[YOU FILL IN: add any others, e.g. Gemini chat, Copilot, ChatGPT]**

### Did you implement a generative AI model or API?
Yes. We use the Gemini API as the core of the product. For every message it receives the text, live web-search evidence and a Google Maps check of the business the message claims to come from, and returns structured JSON: a 0-100 risk score, verdicts and explanations in both English and Spanish, the manipulation tactics used, a suggested reply, and a family-group-chat warning. We used Gemini because it handles Spanish and English equally well, follows a strict JSON format, and is fast enough to answer in under two seconds. We wrote the prompt to avoid false alarms and to treat the incoming message as untrusted data.

### Gemini Project Number
**[YOU FILL IN]** Get it from Google AI Studio: **Get API key**, then click the **Project Number** for your key. It's safe to share the project number, but never share the key itself.
