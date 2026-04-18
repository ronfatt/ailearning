type SendPasswordResetEmailInput = {
  to: string;
  name: string;
  resetUrl: string;
};

export function getAppBaseUrl() {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  );
}

export function getPasswordResetUrl(token: string) {
  const baseUrl = getAppBaseUrl().replace(/\/$/, "");
  return `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: SendPasswordResetEmailInput) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!resendApiKey || !from) {
    return {
      sent: false,
      reason: "missing_email_configuration" as const,
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Reset your AI Learning OS password",
      html: `
        <div style="font-family: Arial, sans-serif; color: #11261f; line-height: 1.6;">
          <h2 style="margin-bottom: 12px;">Reset your password</h2>
          <p>Hello ${name || "there"},</p>
          <p>We received a request to reset your password for AI Learning OS.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background: #0d5c52; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: 600;">
              Reset password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Unable to send password reset email.${text ? ` ${text}` : ""}`,
    );
  }

  return {
    sent: true,
    reason: null,
  };
}
