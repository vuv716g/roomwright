export const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf';
export const ATTACHMENT_HELP = 'Choose files one at a time or together to add up to 3 photos or plans (JPG, PNG, WebP or PDF). Maximum 5 MB per file and 10 MB in total. They will be emailed with your message.';

export function attachmentError(files: readonly { name: string; size: number }[]): string | null {
  if (files.length > 3) return 'Please choose no more than 3 attachments.';
  for (const file of files) {
    if (!/\.(jpe?g|png|webp|pdf)$/i.test(file.name)) return 'Please attach JPG, PNG, WebP or PDF files only.';
    if (!file.size) return 'An attachment is empty. Please remove it or choose another file.';
    if (file.size > 5 * 1024 * 1024) return 'Each attachment must be 5 MB or smaller.';
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_ATTACHMENT_BYTES) return 'Your attachments must total 10 MB or less.';
  return null;
}
