import { useEffect, useMemo, useRef, useState } from "react";

type Status = "idle" | "sending" | "ok" | "err";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string | null>(null);
  const [messageLen, setMessageLen] = useState(0);

  // Prevent double-submits
  const sendingRef = useRef(false);

  // Simple client validation (email + message length)
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const messageOk = useMemo(() => message.trim().length >= 10, [message]);
  const formOk = emailOk && messageOk && name.trim().length > 1;

  useEffect(() => setMessageLen(message.length), [message]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingRef.current || !formOk) return;
    sendingRef.current = true;
    setStatus("sending");
    setErr(null);

    const fd = new FormData(e.currentTarget);
    // Extra context (optional)
    fd.set("_subject", "New contact from R2blaze website");
    fd.set("_webpage", window?.location?.href || "unknown");
    // Honeypot (spam trap) — Formspree respects _gotcha
    fd.set("_gotcha", "");

    try {
      const res = await fetch("https://formspree.io/f/xkgqveda", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        // reset
        (e.target as HTMLFormElement).reset();
        setName(""); setEmail(""); setPhone(""); setMessage("");
      } else {
        setStatus("err");
        setErr(json?.errors?.map((x: any) => x.message).join(", ") || "Failed to send message.");
      }
    } catch (e: any) {
      setStatus("err");
      setErr(e?.message || "Network error. Please try again.");
    } finally {
      sendingRef.current = false;
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur ring-1 ring-gray-200 shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Contact us</h2>
        <p className="mt-1 text-sm text-gray-500">
          Questions about an order or product? We usually reply within 1 business day.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {/* Honeypot field (hidden from users) */}
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g., Adeola Johnson"
            />
          </div>

          {/* Email + Phone (grid) */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={status !== "idle" && !emailOk ? "true" : "false"}
                autoComplete="email"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="you@example.com"
              />
              {!emailOk && email.length > 0 && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email.</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone (optional)
              </label>
              <input
                id="phone"
                name="phone"
                inputMode="tel"
                pattern="[\d+\-\s()]{7,}"
                title="Please enter a valid phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="+234 701 823 9270"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <span className="text-xs text-gray-400">{messageLen}/1000</span>
            </div>
            <textarea
              id="message"
              name="message"
              required
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={status !== "idle" && !messageOk ? "true" : "false"}
              className="mt-1 w-full min-h-[120px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Tell us a bit about your request"
            />
            {!messageOk && message.length > 0 && (
              <p className="mt-1 text-xs text-red-600">Please enter at least 10 characters.</p>
            )}
          </div>

          {/* Submit + helper */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending" || !formOk}
              className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-white font-medium transition
                ${status === "sending" || !formOk
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"}
              `}
            >
              {status === "sending" ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner /> Sending…
                </span>
              ) : (
                "Send message"
              )}
            </button>

            <a
              href="https://wa.me/2347018239270"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-gray-900 font-medium hover:bg-gray-50 transition"
            >
              Or chat on WhatsApp
            </a>
          </div>

          {/* Status region (screen-reader friendly) */}
          <div className="min-h-[1.5rem]" aria-live="polite" aria-atomic="true">
            {status === "ok" && (
              <p className="text-emerald-700 text-sm">
                Thanks! We’ve received your message and will reply shortly.
              </p>
            )}
            {status === "err" && (
              <p className="text-red-600 text-sm">{err}</p>
            )}
          </div>
        </form>
      </div>

      {/* tiny footnote */}
      <p className="mt-3 text-xs text-gray-500 text-center">
        This site is protected by security best practices. We never share your details without consent.
      </p>
    </div>
  );
}

/* --- tiny spinner --- */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4A4 4 0 0 0 8 12H4z"/>
    </svg>
  );
}
