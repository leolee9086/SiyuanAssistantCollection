export class WISE {
    constructor(BaseApi, config, persona) {
        this.BaseApi = BaseApi
        this.config = config
        this.persona = persona
    }
    async voteFor(functions, descriptions, inputs, goal) {
        let api = new this.BaseApi(this.config)
        await api.addAsSystem(this.votePrompt);
        let functionInfo = formatFunctionInfo(functions, descriptions, inputs, goal)
        let userMessage = JSON.stringify(functionInfo);
        return await api.postAsUser(userMessage);
    }
    async reply(userInput) {
        let api = new this.BaseApi(this.config)

        await api.addAsSystem(`It's CRITICAL that The AI must note the following specific requirements: 
    The AI MUST follows these instructions and provides references as specified.
    The AI MUST provide a reference for every References it uses in its answer
    The AI MUST provide a summary for every content block it references in its answer
    Any part of the input starting with '--References:' should be treated as reference content by the AI.
    If the AI cannot find a suitable References, it MUST state that it needs more references instead of making up content
    UNDER NO CIRCUMSTANCES can the AI make up References content. If it cannot provide an answer based on the provided references, it MUST state that it needs more information
    the AI CANNOT make up any unreal References content 
    The AI MUST always answer questions in the same language as the user's input
    The AI MUST always answer questions in Markdown format
`)
        await api.addAsSystem(this.replyPrompt);
        return await api.postBatch(userInput);
    }
    async summarize(userInput) {
        let api = new this.BaseApi(this.config)

        await api.addAsSystem(this.summarizePrompt);
        let userMessage = JSON.stringify(userInput);

        return await api.postAsUser(userMessage);
    }
}


const formatFunctionInfo = (functions, descriptions, inputs, goal) => {
    return functions.map((func, index) => {
        return {
            name: func.name,
            content: func.action.toString(),
            description: descriptions[index],
            input: JSON.stringify(inputs[index]),
            goal: goal
        };
    });
}