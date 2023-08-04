import mjml2html from 'mjml';
import nunjucks from 'nunjucks';
import * as fs from 'fs/promises';

const pageFrame = (body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Email Confirmed!</title>
  <style>
    body {
      font-family: system-ui;
    }
  </style>
</head>
<body>
  ${body}
</body>`;

export const emailConfirmedHtml = () => pageFrame(`
<h1>Email Confirmed!</h1>
<p>Thank you for confirming your email address.</p>
`);

export const emailConfirmationErrorHtml = () => pageFrame(`
<h1>Confirmation Error</h1>
<p>We could not confirm your subscription. Maybe you already clicked on the link?</p>
`);

export const emailNotification = (email: string, source: string) => pageFrame(`
<h1>New Email Signed Up</h1>
<p>Email: ${email}</p>
<p>Source: ${source}</p>
`);

export const confirmationEmail = async (verificationUrl: string) => {
  const template = await fs.readFile('./src/templates/confirm-email.mjml', 'utf-8');
  const rendered = nunjucks.renderString(template, { verificationUrl });
  const { html } = mjml2html(rendered, {
    // don't import fonts from Google we don't need anyway
    fonts: {}
  });
  return html;
};