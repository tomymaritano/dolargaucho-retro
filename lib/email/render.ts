/**
 * Email Rendering Utility
 *
 * Renders React Email templates to HTML strings
 */

import { render } from '@react-email/render';

/**
 * Renders a React Email component to HTML string
 */
export async function renderEmail(emailComponent: React.ReactElement): Promise<string> {
  return render(emailComponent);
}

/**
 * Renders a React Email component to plain text
 */
export async function renderEmailText(emailComponent: React.ReactElement): Promise<string> {
  return render(emailComponent, { plainText: true });
}
