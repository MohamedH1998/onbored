/**
 * Standard server action result types
 * Use these for consistent return values across all server actions
 */

export type ServerActionSuccess<T> = {
  success: true;
  data: T;
  error: undefined;
};

export type ServerActionError = {
  success: false;
  error: string;
  data: undefined;
};

export type ServerActionResult<T> = ServerActionSuccess<T> | ServerActionError;

/**
 * Helper to create a success result
 */
export function success<T>(data: T): ServerActionSuccess<T> {
  return { success: true, data, error: undefined };
}

/**
 * Helper to create an error result
 */
export function error(message: string): ServerActionError {
  return { success: false, error: message, data: undefined };
}

/**
 * Type guard to check if result is successful
 */
export function isSuccess<T>(
  result: ServerActionResult<T>,
): result is ServerActionSuccess<T> {
  return result.success;
}

/**
 * Type guard to check if result is an error
 */
export function isError<T>(
  result: ServerActionResult<T>,
): result is ServerActionError {
  return !result.success;
}
