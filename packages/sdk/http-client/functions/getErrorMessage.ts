import { ERROR_DEFAULT_MESSAGES, ERROR_STATUS_TO_KEY } from "../constants/errors";
import { ErrorHandlerRecord } from "../types/errors";

function getStatus(error: unknown): number | undefined {
	if (error === null || error === undefined) return undefined;
	const err = error as { status?: number; response?: { status?: number } };
	return err.response?.status ?? err.status;
}

export function getMessageForError(
	error: unknown,
	record?: ErrorHandlerRecord,
): string | undefined {
	const status = getStatus(error);
	if (status === undefined) return undefined;

	const key = ERROR_STATUS_TO_KEY[status];
	const custom = key ? record?.[key] : undefined;
	const fallback = ERROR_DEFAULT_MESSAGES[status] ?? "Unknown error";

	return custom ?? fallback;
}
