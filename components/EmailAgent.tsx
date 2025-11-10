"use client";

import { FormEvent, useMemo, useState } from "react";
import clsx from "clsx";
import styles from "./email-agent.module.css";
import { EmailDraft, EmailTone, generateEmailDraft } from "@/lib/emailAgent";

type FormState = {
  subject: string;
  recipientName: string;
  recipientRole: string;
  tone: EmailTone;
  objective: string;
  keyPointsInput: string;
  callToAction: string;
  includePostscript: boolean;
  extraNotes: string;
  senderName: string;
  senderTitle: string;
};

const defaultForm: FormState = {
  subject: "",
  recipientName: "",
  recipientRole: "",
  tone: "friendly",
  objective: "",
  keyPointsInput: "",
  callToAction: "",
  includePostscript: false,
  extraNotes: "",
  senderName: "Jordan Rivers",
  senderTitle: "Customer Success Manager"
};

const toneOptions: { value: EmailTone; label: string; tagline: string }[] = [
  { value: "friendly", label: "Friendly", tagline: "Warm and conversational" },
  { value: "formal", label: "Formal", tagline: "Polished and structured" },
  { value: "enthusiastic", label: "Enthusiastic", tagline: "Upbeat with momentum" },
  { value: "empathetic", label: "Empathetic", tagline: "Supportive and caring" },
  { value: "persuasive", label: "Persuasive", tagline: "Influential and confident" },
  { value: "concise", label: "Concise", tagline: "Efficient and direct" }
];

type SampleScenario = {
  label: string;
  payload: Partial<FormState>;
};

const samples: SampleScenario[] = [
  {
    label: "Product launch update",
    payload: {
      subject: "Upcoming launch timeline",
      tone: "persuasive",
      objective: "align on the next steps for our beta launch",
      keyPointsInput: `Beta feedback exceeded adoption targets\nNeed approval on final messaging by Thursday\nLaunch checklist ready for your review`,
      callToAction: "set up a quick sync this Thursday afternoon",
      recipientRole: "Director of Product Marketing",
      recipientName: "Taylor",
      senderTitle: "Product Lead",
      senderName: "Jordan Rivers",
      includePostscript: true,
      extraNotes: "Happy to share the launch dashboard if helpful"
    }
  },
  {
    label: "Sales follow-up",
    payload: {
      subject: "Follow-up on your platform trial",
      tone: "friendly",
      objective: "check in after your two-week evaluation",
      keyPointsInput: `Usage highlights include automation workflows\nWe unlocked the analytics workspace per your request\nNew onboarding path aligns with your compliance needs`,
      callToAction: "schedule a debrief to cover best-fit plan options",
      recipientName: "Morgan",
      recipientRole: "Operations Lead at Northwind Logistics",
      senderTitle: "Account Executive",
      senderName: "Jamie Patel"
    }
  },
  {
    label: "Support apology",
    payload: {
      subject: "We’re on the fix",
      tone: "empathetic",
      objective: "acknowledge the recent outage impacting your workspace",
      keyPointsInput: `Root cause traced to a configuration drift in your region\nWe deployed a patch and added guardrails to prevent recurrence\nCredit will appear on your next invoice automatically`,
      callToAction: "walk through the remediation steps together",
      recipientName: "Alex",
      recipientRole: "Head of IT",
      senderTitle: "Customer Reliability Team",
      senderName: "Sasha Nguyen",
      includePostscript: true,
      extraNotes: "Status page alerts now include SMS so you’ll get instant updates"
    }
  }
];

const parseKeyPoints = (value: string) =>
  value
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[•|-]/))
    .map((item) => item.trim())
    .filter((item) => item.length);

const buildStatusHint = (hasDraft: boolean, generating: boolean) => {
  if (generating) {
    return "Synthesizing tone, context, and flow…";
  }
  if (hasDraft) {
    return "Draft ready. Iterate or copy it into your email client.";
  }
  return "Share the scenario, tone, and key points—MailMuse handles the prose.";
};

const EmailAgent = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusHint = useMemo(() => buildStatusHint(Boolean(draft), generating), [draft, generating]);

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToneSelect = (tone: EmailTone) => {
    setForm((prev) => ({
      ...prev,
      tone
    }));
  };

  const runGeneration = () => {
    const cleanedKeyPoints = parseKeyPoints(form.keyPointsInput);
    const nextDraft = generateEmailDraft({
      subject: form.subject,
      recipientName: form.recipientName,
      recipientRole: form.recipientRole,
      senderName: form.senderName || "MailMuse Agent",
      senderTitle: form.senderTitle,
      tone: form.tone,
      objective: form.objective,
      keyPoints: cleanedKeyPoints,
      callToAction: form.callToAction,
      includePostscript: form.includePostscript,
      extraNotes: form.extraNotes
    });
    setDraft(nextDraft);
  };

  const handleGenerate = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (generating) return;
    setGenerating(true);
    setTimeout(() => {
      runGeneration();
      setGenerating(false);
      setCopied(false);
    }, 320);
  };

  const handleReset = () => {
    setForm(defaultForm);
    setDraft(null);
    setCopied(false);
  };

  const handleSample = (sample: SampleScenario) => {
    setForm((prev) => ({
      ...prev,
      ...sample.payload
    }));
    setTimeout(() => {
      handleGenerate();
    }, 100);
  };

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.panel} onSubmit={handleGenerate}>
        <div className={styles.statusBar}>
          <div className={styles.statusLeft}>
            <span className={styles.statusPulse} />
            <div>
              <div className={styles.statusLabel}>MailMuse Agent</div>
              <div className={styles.statusHint}>{statusHint}</div>
            </div>
          </div>
          {draft && <span className={styles.badge}>Ready</span>}
        </div>
        <div className={styles.formGrid}>
          <div className={clsx(styles.fieldRow)}>
            <div className={styles.field}>
              <label className={styles.label}>
                Subject
                <span className={styles.labelHint}>Leave blank to auto-generate</span>
              </label>
              <input
                className={styles.input}
                value={form.subject}
                onChange={handleChange("subject")}
                placeholder="e.g. Aligning on Q3 launch timeline"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Tone
                <span className={styles.labelHint}>Select the voice the agent should adopt</span>
              </label>
              <div className={styles.toneChips}>
                {toneOptions.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    onClick={() => handleToneSelect(tone.value)}
                    className={clsx(styles.toneChip, form.tone === tone.value && styles.toneChipActive)}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                Recipient name
                <span className={styles.labelHint}>Optional but helps personalize the greeting</span>
              </label>
              <input
                className={styles.input}
                value={form.recipientName}
                onChange={handleChange("recipientName")}
                placeholder="e.g. Taylor"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Recipient role / org
                <span className={styles.labelHint}>What context does the agent know about them?</span>
              </label>
              <input
                className={styles.input}
                value={form.recipientRole}
                onChange={handleChange("recipientRole")}
                placeholder="e.g. Director of Product Marketing at CloudSync"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Objective
              <span className={styles.labelHint}>Tell the agent why you are writing</span>
            </label>
            <textarea
              className={styles.textarea}
              value={form.objective}
              onChange={handleChange("objective")}
              placeholder="e.g. align on next steps for the beta launch and confirm the final messaging review"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Key points
              <span className={styles.labelHint}>One per line; the agent will weave them into the narrative</span>
            </label>
            <textarea
              className={styles.textarea}
              value={form.keyPointsInput}
              onChange={handleChange("keyPointsInput")}
              placeholder={"• Beta feedback exceeded expectations\n• Need approval on final messaging by Thursday\n• Launch checklist ready for review"}
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                Call to action
                <span className={styles.labelHint}>What outcome should the email encourage?</span>
              </label>
              <input
                className={styles.input}
                value={form.callToAction}
                onChange={handleChange("callToAction")}
                placeholder="e.g. schedule a 20-minute sync early next week"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Sender details
                <span className={styles.labelHint}>Displayed in the sign-off</span>
              </label>
              <input
                className={styles.input}
                value={form.senderName}
                onChange={handleChange("senderName")}
                placeholder="e.g. Jordan Rivers"
              />
              <input
                className={styles.input}
                value={form.senderTitle}
                onChange={handleChange("senderTitle")}
                placeholder="e.g. Product Marketing"
                style={{ marginTop: "0.5rem" }}
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>
                Extra note (for P.S.)
                <span className={styles.labelHint}>Add optional postscript context</span>
              </label>
              <input
                className={styles.input}
                value={form.extraNotes}
                onChange={handleChange("extraNotes")}
                placeholder="e.g. Dashboard link ready if you want deeper metrics"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Options</label>
              <label className={styles.toggle}>
                <input type="checkbox" checked={form.includePostscript} onChange={handleChange("includePostscript")} />
                Include postscript with the extra note
              </label>
            </div>
          </div>
          <div className={styles.samples}>
            <span className={styles.sampleLabel}>Need inspiration? Load a scenario:</span>
            <div className={styles.sampleList}>
              {samples.map((sample) => (
                <button key={sample.label} type="button" className={styles.sampleButton} onClick={() => handleSample(sample)}>
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.primaryButton} disabled={generating}>
            {generating ? "Composing…" : draft ? "Regenerate draft" : "Generate email"}
          </button>
          <button type="button" className={styles.ghostButton} onClick={handleReset}>
            Reset inputs
          </button>
        </div>
      </form>
      <aside className={styles.panel}>
        {draft ? (
          <div className={styles.outputCard}>
            <div className={styles.draftHeader}>
              <div className={styles.draftMeta}>
                <span className={styles.badge}>{toneOptions.find((tone) => tone.value === form.tone)?.label ?? "Tone"}</span>
                <h2 className={styles.draftSubject}>{draft.subject}</h2>
                <p className={styles.draftPreview}>{draft.preview}</p>
                {draft.highlights.length > 0 && (
                  <div className={styles.metaList}>
                    {draft.highlights.map((item) => (
                      <span key={item} className={styles.metaItem}>
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.draftBody}>{draft.body}</div>
            <button className={styles.copyButton} onClick={handleCopy} type="button">
              {copied ? "Copied!" : "Copy draft"}
            </button>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>Your draft will appear here</div>
            <p>Describe the intent and key points. MailMuse takes care of tone, structure, and polish.</p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default EmailAgent;
