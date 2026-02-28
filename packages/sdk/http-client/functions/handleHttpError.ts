import { ErrorHandlerRecord, HttpError, NormalizedError } from '../types/errors';
import { getMessageForError } from './getErrorMessage';

function isAbortError(error: unknown): boolean {
  if (error instanceof Error) return error.name === 'AbortError';
  return (error as { name?: string })?.name === 'AbortError';
}

export function handleHttpError(
  error: unknown,
  errorMessages?: ErrorHandlerRecord,
): NormalizedError {
  if (error instanceof HttpError) {
    const message =
      error.message !== `HTTP ${error.status}`
        ? error.message
        : (getMessageForError(error, errorMessages) ?? error.message);
    return {
      message,
      status: error.status,
      body: error.body,
      isAbort: false,
    };
  }

  if (isAbortError(error)) {
    return {
      message: 'Запрос отменён',
      isAbort: true,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'Ошибка сети',
      isAbort: false,
    };
  }

  return {
    message: 'Неизвестная ошибка',
    isAbort: false,
  };
}
