export type EmailTone = "friendly" | "formal" | "enthusiastic" | "empathetic" | "persuasive" | "concise";

export type EmailAgentInput = {
  subject?: string;
  recipientName?: string;
  recipientRole?: string;
  senderName: string;
  senderTitle?: string;
  tone: EmailTone;
  objective: string;
  keyPoints: string[];
  callToAction?: string;
  includePostscript?: boolean;
  extraNotes?: string;
};

export type EmailDraft = {
  subject: string;
  body: string;
  preview: string;
  highlights: string[];
};

type ToneProfile = {
  label: string;
  greeting: string[];
  closings: string[];
  reachOutPhrase: string;
  transitionStarters: string[];
  ctaTemplates: ((cta: string) => string)[];
  defaultCTA: string;
  cadence: "measured" | "upbeat" | "direct" | "warm";
};

const toneProfiles: Record<EmailTone, ToneProfile> = {
  friendly: {
    label: "Friendly",
    greeting: ["Hi", "Hello", "Hey"],
    closings: ["Best", "Warm regards", "Take care"],
    reachOutPhrase: "I'm reaching out",
    transitionStarters: ["I wanted to share that", "Also,", "Just to highlight"],
    ctaTemplates: [
      (cta) => `Let me know ${cta}.`,
      (cta) => `I'd love to ${cta}, just say the word.`,
      (cta) => `Feel free to reply so we can ${cta}.`
    ],
    defaultCTA: "if that works for you",
    cadence: "warm"
  },
  formal: {
    label: "Formal",
    greeting: ["Dear", "Hello"],
    closings: ["Sincerely", "Kind regards", "Respectfully"],
    reachOutPhrase: "I am reaching out",
    transitionStarters: ["To elaborate,", "In addition,", "Furthermore,"],
    ctaTemplates: [
      (cta) => `Please advise if ${cta}.`,
      (cta) => `Would you kindly confirm whether we can ${cta}?`,
      (cta) => `I would appreciate guidance so we can ${cta}.`
    ],
    defaultCTA: "how you'd like to proceed",
    cadence: "measured"
  },
  enthusiastic: {
    label: "Enthusiastic",
    greeting: ["Hello", "Hi", "Hey there"],
    closings: ["Cheers", "All my best", "Talk soon"],
    reachOutPhrase: "I'm thrilled to reach out",
    transitionStarters: ["What excites me most is", "Even better,", "On top of that,"],
    ctaTemplates: [
      (cta) => `Can't wait to ${cta}—let me know your thoughts!`,
      (cta) => `Let's ${cta}; I'm ready when you are.`,
      (cta) => `How about we ${cta}?`
    ],
    defaultCTA: "if you're ready to move forward",
    cadence: "upbeat"
  },
  empathetic: {
    label: "Empathetic",
    greeting: ["Hi", "Hello", "Dear"],
    closings: ["Warm regards", "Take care", "With appreciation"],
    reachOutPhrase: "I wanted to reach out",
    transitionStarters: ["I understand that", "It might help to know", "What I've been mindful of is"],
    ctaTemplates: [
      (cta) => `Whenever you're ready, we can ${cta}.`,
      (cta) => `Please let me know how I can support you so we can ${cta}.`,
      (cta) => `I'm here to help if you'd like to ${cta}.`
    ],
    defaultCTA: "if there's anything else you need",
    cadence: "warm"
  },
  persuasive: {
    label: "Persuasive",
    greeting: ["Hello", "Hi", "Greetings"],
    closings: ["Looking forward", "With anticipation", "Best regards"],
    reachOutPhrase: "I'm reaching out because",
    transitionStarters: ["The key advantage is", "Additionally,", "This means"],
    ctaTemplates: [
      (cta) => `Let's schedule time this week so we can ${cta}.`,
      (cta) => `Can we set up next steps to ${cta}?`,
      (cta) => `If you're open to it, I'd like to ${cta}.`
    ],
    defaultCTA: "if you're open to discussing next steps",
    cadence: "direct"
  },
  concise: {
    label: "Concise",
    greeting: ["Hi", "Hello"],
    closings: ["Best", "Thanks", "Regards"],
    reachOutPhrase: "Quick note to",
    transitionStarters: ["Key points:", "Highlights:", "In short,"],
    ctaTemplates: [
      (cta) => `Can you ${cta}?`,
      (cta) => `Let me know if you can ${cta}.`,
      (cta) => `Please confirm you can ${cta}.`
    ],
    defaultCTA: "if this plan works",
    cadence: "direct"
  }
};

const CONNECTORS = ["First", "Additionally", "On top of that", "Moreover", "Finally", "One more thing"];

const sentenceCase = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const stripPeriod = (value: string) => value.replace(/[.?!]+$/, "");

const formatObjective = (objective: string, profile: ToneProfile) => {
  const cleaned = stripPeriod(objective.trim());
  if (!cleaned) {
    return `${profile.reachOutPhrase} with a quick update.`;
  }

  const lower = cleaned.toLowerCase();
  if (lower.startsWith("to ")) {
    return `${profile.reachOutPhrase} ${cleaned}.`;
  }

  if (lower.startsWith("about ") || lower.startsWith("regarding ")) {
    return `${profile.reachOutPhrase} ${cleaned}.`;
  }

  if (lower.startsWith("because ")) {
    return `${profile.reachOutPhrase} ${cleaned}.`;
  }

  if (lower.startsWith("for ")) {
    return `${profile.reachOutPhrase} ${cleaned}.`;
  }

  return `${profile.reachOutPhrase} to ${cleaned}.`;
};

const storySentence = (text: string, connector?: string) => {
  const cleaned = stripPeriod(text.trim());
  if (!cleaned) {
    return "";
  }
  const prefix = connector ? `${connector.toLowerCase() === "key points:" ? connector : `${connector},`}` : "";
  const formatted = sentenceCase(cleaned);

  if (!connector) {
    return `${formatted}.`;
  }

  if (connector.endsWith(":")) {
    return `${connector} ${formatted}.`;
  }

  return `${connector} ${formatted}.`;
};

const buildBody = (points: string[], profile: ToneProfile) => {
  const sentences = points
    .map((point, index) => storySentence(point, profile.transitionStarters[index] ?? CONNECTORS[index] ?? "Additionally"))
    .filter(Boolean);

  if (!sentences.length) {
    return "";
  }

  if (profile.cadence === "direct") {
    return sentences.join(" ");
  }

  const midpoint = Math.ceil(sentences.length / 2);
  if (sentences.length <= 2) {
    return sentences.join(" ");
  }

  return `${sentences.slice(0, midpoint).join(" ")}\n\n${sentences.slice(midpoint).join(" ")}`;
};

const craftCTA = (cta: string | undefined, profile: ToneProfile) => {
  const cleaned = cta?.trim();
  if (!cleaned) {
    return profile.cadence === "direct"
      ? `Please let me know ${profile.defaultCTA}.`
      : `I'd appreciate it if you could let me know ${profile.defaultCTA}.`;
  }
  const template = profile.ctaTemplates[Math.floor(Math.random() * profile.ctaTemplates.length)];
  return template(cleaned.replace(/[.]/g, "").toLowerCase());
};

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

const generateSubject = (input: EmailAgentInput, profile: ToneProfile) => {
  const provided = input.subject?.trim();
  if (provided) {
    return sentenceCase(provided);
  }

  const hints = input.keyPoints.filter(Boolean);
  const focus = hints[0] ?? input.objective;
  if (!focus.trim()) {
    return `${profile.label} Follow-Up`;
  }

  const cleaned = stripPeriod(focus);
  if (cleaned.length < 60) {
    return sentenceCase(cleaned);
  }

  return `${sentenceCase(cleaned.slice(0, 55).trim())}…`;
};

const previewFromBody = (body: string) => {
  const clean = body.replace(/\s+/g, " ").trim();
  if (clean.length <= 140) {
    return clean;
  }
  return `${clean.slice(0, 137)}…`;
};

export const generateEmailDraft = (input: EmailAgentInput): EmailDraft => {
  const profile = toneProfiles[input.tone];
  const subject = generateSubject(input, profile);
  const name = input.recipientName?.trim();
  const role = input.recipientRole?.trim();

  const greetingName = name || "there";
  const greetingWord = profile === toneProfiles.formal && !name ? "Hello" : pick(profile.greeting);
  const greeting = `${greetingWord} ${greetingWord.toLowerCase() === "dear" ? greetingName : `${greetingName}`},`;

  const introContext = formatObjective(input.objective, profile);
  const roleSentence =
    role && profile.cadence !== "direct"
      ? `Given your role${role.startsWith("the ") ? "" : " in"} ${role}, I thought you'd appreciate the context.`
      : "";

  const points = input.keyPoints.map((item) => item.trim()).filter((item) => item.length);
  const bodyContent = buildBody(points, profile);
  const ctaSentence = craftCTA(input.callToAction, profile);

  const closingWord = pick(profile.closings);
  const senderBlock = input.senderTitle?.trim()
    ? `${input.senderName}\n${input.senderTitle.trim()}`
    : input.senderName;

  const extra = input.extraNotes?.trim();
  const postscript =
    input.includePostscript && extra
      ? `\n\nP.S. ${sentenceCase(extra.replace(/^p\.?\s*s\.?\s*/i, "").trim())}.`
      : "";

  const paragraphs = [
    `${greeting}\n\n${introContext}${roleSentence ? ` ${roleSentence}` : ""}`,
    bodyContent,
    `${ctaSentence}\n\n${closingWord},\n${senderBlock}${postscript}`
  ].filter(Boolean);

  const body = paragraphs.join("\n\n");

  return {
    subject,
    body,
    preview: previewFromBody(body),
    highlights: points.slice(0, 3)
  };
};
