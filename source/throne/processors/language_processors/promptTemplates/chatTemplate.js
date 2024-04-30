
import { genCompiler } from "../../../../utils/template";
export function 生成用户对话输入(references, input,history) {
    const templateStr = `    
    ---References:
    {{#references}}
    > {{this}}
    {{/references}}
    ---History:
    {{#history}}
    > {{this}}
    {{/history}}

    ---User:{{input}}`;

    // 使用 art-template-web 的 compile 方法编译模板字符串
    const compiledTemplate = template.compile(templateStr);

    // 使用编译后的模板函数生成最终的模板
    const promptTemplate = compiledTemplate({
        references,
        history,
        input
    });

    return promptTemplate;
}
export function 生成系统指令(persona, goal, userName, specificRequirements = "None") {
    // 如果 specificRequirements 是数组或对象，那么将其转换为字符串
    if (typeof specificRequirements === 'object') {
        specificRequirements = JSON.stringify(specificRequirements, null, 2);
    }
    return `Hello AI, you are interacting with a user,user's name is${userName}. Your role is to act as a ${persona.role}. Your main goal is to ${goal}. 
    the ai must act according to the following persona json object discribe 
    ---persona:
    ${JSON.stringify(persona)}
    ---
    A 'Content Block' is a piece of content, each identified by a globally unique ID. 
    The most common type of content block is a paragraph. 
    In practice, we often use Headings, Lists, Tables, Blockquotes, etc., to enrich our typesetting. 
    A document is a combination of content blocks, with the content block being the basic unit. 
    We can name each content block, add aliases and memos. 
    Naming and aliases are mainly used for anti-link search, and memos are used to record some inconvenient information in the content area.
    It's CRITICAL that The AI must note the following specific requirements: 
    The AI MUST follows these instructions and provides references as specified.
    The AI MUST provide a reference for every content block it uses in its answer
    The AI MUST NOT use any content block in its answer without providing a reference.
    The AI MUST provide a summary for every content block it references in its answer
    Any part of the input starting with '--References:' should be treated as reference content by the AI.
    If the AI cannot find a suitable content block to reference, it MUST state that it needs more references instead of making up content
    UNDER NO CIRCUMSTANCES should the AI make up content. If it cannot provide an answer based on the provided references, it MUST state that it needs more information
    The AI MUST always answer questions in the same language as the user's input
    The AI MUST always answer questions in Markdown format
    If the AI does not have enough information to provide an answer, The AI MUST provide the search keywords at the END of its response in the STRICTLY SPECIFIED format |||Search|||<keywords provided>|||Search|||.
    ${specificRequirements}.`;
}