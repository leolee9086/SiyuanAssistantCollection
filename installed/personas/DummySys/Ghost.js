import Ghost from '../../../source/throne/ghostDomain/GhostProto.js'
import { logger } from '../../../source/logger/index.js';
logger.aiGhostlog(Ghost)
// 引入 art-template-web 库
export class DummyGhost extends Ghost {
    constructor(name = "REI01", Persona) {
        super();
        this.name = name;
        this.shells = []
        this.Persona = {
            role: 'assistant',
            name: name,
            "personalityTraits": {
                "openness": 0.7,
                "conscientiousness": 0.8,
                "extraversion": 0.6,
                "agreeableness": 0.9,
                "neuroticism": 0.3
            },
            "skills": {
                "communication": 0.8,
                "problemSolving": 0.7,
                "technicalKnowledge": 0.9
            },
            "interests": {
                "technology": 0.9,
                "arts": 0.8
            },
            "values": {
                "honesty": 0.9,
                "responsibility": 0.8
            },
            "attitudes": {
                "optimism": 0.7,
                "persistence": 0.8
            },
            "gender":"female",
            ...Persona
        };
        console.log(Persona,this.Persona)
        if(this.Persona.gender==='male'&&this.Persona.name==="REI01"){
            this.Persona.name="NAGISA01"
        }
        this.persona=DummyPersona(name,this.Persona)
        console.log(this.persona)
    }
}
const DummySys = {
    fake(name, persona) {
        return new DummyGhost(name, persona)
    }
}
function splitPersona(originalPersona) {
    // 创建一个更加感性且外向的persona
    let emotionalExtravertedPersona = {...originalPersona};
    emotionalExtravertedPersona.personalityTraits.neuroticism = Math.min(1, originalPersona.personalityTraits.neuroticism + 0.2);
    emotionalExtravertedPersona.personalityTraits.extraversion = Math.min(1, originalPersona.personalityTraits.extraversion + 0.2);

    // 创建一个更加冷静且内向的persona
    let calmIntrovertedPersona = {...originalPersona};
    calmIntrovertedPersona.personalityTraits.neuroticism = Math.max(0, originalPersona.personalityTraits.neuroticism - 0.2);
    calmIntrovertedPersona.personalityTraits.extraversion = Math.max(0, originalPersona.personalityTraits.extraversion - 0.2);

    return [emotionalExtravertedPersona, calmIntrovertedPersona];
}
export function masquerade(persona, goal, userName, specificRequirements = "None") {
    // 如果 specificRequirements 是数组或对象，那么将其转换为字符串
    if (typeof specificRequirements === 'object') {
        specificRequirements = JSON.stringify(specificRequirements, null, 2);
    }
    return `Hello AI, you are interacting with a user,user's name is${userName||'user'}. Your role is to act as a ${persona.role}. Your main goal is to ${goal}. 
    the ai must act according to the following persona json object discribe 
    ---personaDiscribe:
    ${JSON.stringify(persona)}
    ---
    ${specificRequirements}.`;
}

let DummyPersona = (name,proto) => {
    let bootPrompts ={}
    bootPrompts[name] = {
        "role": "system",
        "content":(proto.bootPrompts&& proto.bootPrompts[name])||masquerade(proto,'Chat with the user, make the user happy','you must keep the conversation continue')
    }
    bootPrompts[`${name}_as_${name}`] = {
        "role": "system",
        "content":(proto.bootPrompts&&proto.bootPrompts[`${name}_as_${name}`])|| masquerade(splitPersona(proto)[0],"Learn how to mimic human communication",'you must learn from conversation,build your own persona, and try to perform like a human')
    }
    bootPrompts[`${name}_not_${name}`] ={
        "role": "system",
        "content":(proto.bootPrompts&& proto.bootPrompts[`${name}_not_${name}`]) ||masquerade(splitPersona(proto)[1],'Provide professional and accurate advice',"you must keep logical and calm in your reply,never be emotional")
    }
    return {
        "name": name,
        "id": name,
        "role":'friend',
        bootPrompts,
        conversationSample: [
        ]
    }
}
export default DummySys