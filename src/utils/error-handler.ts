export const errorResponceWrapper = (error: Error) => {
    return {
        success: false,
        reason: error.message
    }
}