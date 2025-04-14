export function generateError(msg, status) {
    const error = new Error(msg);
    error.status = status;
    throw error;
}