export const buildMessage = (raw) => {
    let { role, content } = raw

    return {
        content: content || '',
        role: role
    }
}