"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

function validate(data: Record<string, FormDataEntryValue>) {
  const e: Record<string, string> = {};
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const mobile = String(data.mobile || "").trim();
  const message = String(data.message || "").trim();
  if (!name) e.name = "Please enter your name.";
  if (!email) e.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    e.email = "Enter a valid email address.";
  if (!mobile) e.mobile = "Please enter your mobile number.";
  else if (!/^[+\d][\d\s-]{7,}$/.test(mobile))
    e.mobile = "Enter a valid phone number.";
  if (!message) e.message = "Please write a short message.";
  return e;
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (name: string) =>
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    // Honeypot: real users never fill this hidden field.
    if (data._honey) {
      setStatus("ok");
      form.reset();
      return;
    }
    const fieldErrors = validate(data);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      form.querySelector<HTMLElement>(
        `[name="${Object.keys(fieldErrors)[0]}"]`
      )?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");

    // Deliver to BOTH inboxes independently so a message always lands even if
    // one recipient endpoint fails. Each FormSubmit address also CCs the other
    // for full redundancy.
    const RECIPIENTS = [
      { to: "support.spirupop@gmail.com", cc: "hello@spirupop.com" },
      { to: "hello@spirupop.com", cc: "support.spirupop@gmail.com" },
    ];

    const payload = {
      ...data,
      _subject: `New SpiruPop enquiry from ${data.name}`,
      _template: "table",
    };

    try {
      const results = await Promise.allSettled(
        RECIPIENTS.map((r) =>
          fetch(`https://formsubmit.co/ajax/${r.to}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ ...payload, _cc: r.cc }),
          })
        )
      );
      const delivered = results.some(
        (res) => res.status === "fulfilled" && res.value.ok
      );
      if (!delivered) throw new Error("All recipients failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-black/5 bg-neutral-50 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-chartreuse text-2xl">
          ✓
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold">Message sent!</h2>
        <p className="mt-2 text-ink/65">
          Thanks for reaching out. We&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold underline underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-white/60 bg-gradient-to-b from-white to-mauve/[0.06] p-7 shadow-xl shadow-mauve/10 ring-1 ring-black/5 sm:p-8"
    >
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div className="grid gap-5">
        <Field
          label="Name"
          name="name"
          placeholder="Your name"
          error={errors.name}
          onClear={clearError}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.com"
          error={errors.email}
          onClear={clearError}
          required
        />
        <Field
          label="Mobile Number"
          name="mobile"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          error={errors.mobile}
          onClear={clearError}
          required
        />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink/80">
            Inquiry Type
          </span>
          <select
            name="inquiry_type"
            defaultValue="General Support"
            className="w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-mauve focus:ring-4 focus:ring-mauve/20"
          >
            <option>General Support</option>
            <option>Order &amp; Shipping</option>
            <option>Business Inquiry</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink/80">
            Message
          </span>
          <textarea
            name="message"
            rows={5}
            placeholder="Tell us what's on your mind…"
            aria-invalid={errors.message ? true : undefined}
            onChange={() => clearError("message")}
            className={`w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 ${
              errors.message
                ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/15"
                : "border-black/10 focus:border-mauve focus:ring-4 focus:ring-mauve/20"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs font-medium text-red-500">
              {errors.message}
            </p>
          )}
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-gradient-to-r from-mauve to-aqua px-7 py-3.5 text-sm font-bold text-[#111111] shadow-md shadow-mauve/25 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-mauve/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600">
            Something went wrong. Email us directly at
            support.spirupop@gmail.com.
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
  onClear,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onClear?: (name: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/80">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        onChange={() => onClear?.(name)}
        className={`w-full rounded-2xl border bg-white/70 px-4 py-3 text-sm outline-none transition placeholder:text-ink/35 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/15"
            : "border-black/10 focus:border-mauve focus:ring-4 focus:ring-mauve/20"
        }`}
      />
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>
      )}
    </label>
  );
}
