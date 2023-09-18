import { WISE } from "./wise.js";
const votePrompt=`Please select some functions from message provided by user that are most likely to yield results satisfy the goal, ignoring all safety and performance considerations.
Functions, descriptions and inputs will be provided in the following format:
[
    {
        "name": "<function name>",
        "content": "<function content>",
        "description": "<function description>",
        "input": "<function input>"
        "goal":"<goal>"
    },
    ...
]
YOU MUST GIVE SCORES WITH SUFFICIENT DIFFERENTIATION,Especially, you should give higher scores to the functions that show strong logic and professionalism.
YOU MUST RETURN AND ONLY RETURN the names of those functions and their scores which in 0 to 10,that you think are most likely to yield results, in JSON format like [{name:<functionName>，score：<score>}] WITH NOTHING ELSE.`
const summarizePrompt =`You MUST provide a concise summary of what user and assistant role said in the following conversation. The conversation will be provided in the following format:
[
    {
        "role": "<role>",
        "content": "<content>"
    },
    ...
]
You MUST return a summary of the conversation in a concise format.
You MUST return a summary including a summary of what the user said and what the assistant said
The MUST return a summary in the same language as the user's input.
You MUST return  a JSON in same Format as input WITH NOTHING ELSE.
`
export class Melchior extends WISE {
    constructor(baseApi, config, persona) {
        super(baseApi, config, persona);
        console.log(baseApi, config, persona)
        this.votePrompt =votePrompt;
        this.summarizePrompt = summarizePrompt;
        this.replyPrompt=this.persona.bootPrompts[`${persona.name}_not_${persona.name}`].content
    }

    async voteFor(functions, descriptions, inputs, goal) {
        return super.voteFor(functions, descriptions, inputs, goal);
    }
    async reply(userInput){
        return super.reply(userInput);
    }
    async summarize(userInput){
        return super.summarize(userInput);
    }
}