/**
 * Safely extracts a human-readable message from an unknown catch value.
 *
 * TypeScript catch blocks type the error as `unknown` in strict mode.
 * This utility handles the three common shapes:
 *   - Error instances  (err.message)
 *   - AWS Amplify / API errors  ({ message: string })
 *   - Plain strings   (thrown directly)
 *   - Everything else (JSON stringified as a fallback)
 */
export function getErrorMessage(err: unknown, fallback = 'An unexpected error occurred.'): string {
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    if (
        err !== null &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as Record<string, unknown>).message === 'string'
    ) {
        return (err as Record<string, unknown>).message as string;
    }
    try {
        return JSON.stringify(err);
    } catch {
        return fallback;
    }
}