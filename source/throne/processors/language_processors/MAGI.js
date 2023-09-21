import { Melchior } from "./wise/Melchior.js";
import { Balthazar } from "./wise/Belthazar.js"
import { Casper } from "./wise/Casper.js"
export class MAGI {
    constructor(BaseApi, config = {}, persona) {
        console.log(BaseApi, config, persona)
        this.BaseApi =BaseApi
        this.config = config
        this._persona = persona
        console.log('User selected intelligent mode, sysMAGI is online, energy consumption may be very high');
        //从逻辑角度做出判断的人格
        this.Melchior = new Melchior(BaseApi, config, persona)
        //从情绪角度做出判断的人格
        this.Balthazar = new Balthazar(BaseApi, config, persona)
        //从常理角度做出判断的人格
        this.Casper = new Casper(BaseApi, config, persona)
        this.wiseMens = {
            Melchior: this.Melchior, Balthazar: this.Balthazar, Casper: this.Casper, echo: this.echo
        }
      
        this.replyCount = 0;
        /**
         * 用户通常会更喜欢情感丰富的回答
         * 所以在现在的简化流程中,除非极端情况Balthazar的评分过低,否则一般都是由Balthazar从最照顾用户情绪的角度进行回答
         * */
        this.currentWise = 'Balthazar';
        this.lastVoteResult = 'Balthazar';
        this.config = config
        if(this.config.chatMode==='simple'){
            this.echo.reply =async(...args)=>{
                let data =  [{ name: `replyFrom${this.currentWise}`, action: (await this.Balthazar.reply(...args)).choices[0].message.content }]

                return data
            }
            this.echo.summarizeChat =(chat)=>{
                return undefined
            }
        }
    }
    setPersona(_persona) {
        this._persona = _persona;
    }
    get persona() {
        return this._persona
    }
    async voteWithRetry(wise, functions, descriptions, inputs, goal) {
        let result;
        try {
            result = await wise.voteFor(functions, descriptions, inputs, goal);
            return JSON.parse(result.choices[0].message.content);
        } catch (error) {
            console.error(`An error occurred in magi- ${wise.name}:`, error);
            try {
                result = await wise.voteFor(functions, descriptions, inputs, goal);
                return JSON.parse(result.choices[0].message.content);
            } catch (retryError) {
                console.error(`An error occurred in magi- ${wise.name} on retry:`, retryError);
                return null;
            }
        }
    }
    echo = {
        //MAGI的大部分能力目前没有被调用,因为token消耗太高了
        voteFor: async (functions, descriptions, inputs, goal, multi) => {
            // 并行调用 Melchior, Balthazar, Casper
            let [melchiorFunctions, BalthazarFunctions, casperFunctions] = await Promise.all([
                await this.voteWithRetry(this.Melchior, functions, descriptions, inputs, goal),
                await this.voteWithRetry(this.Balthazar, functions, descriptions, inputs, goal),
                await this.voteWithRetry(this.Casper, functions, descriptions, inputs, goal)
            ]);
            let weights = { "Melchior": 100, "Balthazar": 100, "Casper": 100 }
            try {
                weights = await this.echo.coordinate({ history: inputs[inputs.lenght], goal: goal })
            } catch (e) {
                console.error(e, weights)
            }
            console.log(weights)
            weights.reason = undefined
            const functionMap = {};
            for (let func of functions) {
                functionMap[func.name] = func;
            }
            let melchiorScores = normalizeScores(melchiorFunctions);
            let BalthazarScores = normalizeScores(BalthazarFunctions);
            let casperScores = normalizeScores(casperFunctions);
            console.log('melchiorChoice:', melchiorScores);
            console.log('BalthazarChoice:', BalthazarScores);
            console.log('casperChoice:', casperScores);
            let finalResultNames = functions.map(func => {
                let melchiorScore = melchiorScores[func.name] || 0;
                let BalthazarScore = BalthazarScores[func.name] || 0;
                let casperScore = casperScores[func.name] || 0;

                let totalWeight = weights["Melchior"] + weights["Balthazar"] + weights["Casper"];
                let avgScore = (melchiorScore * weights["Melchior"] + BalthazarScore * weights["Balthazar"] + casperScore * weights["Casper"]) / totalWeight;
                return { name: func.name, score: avgScore };
            });

            // 按照得分进行排序
            finalResultNames.sort((a, b) => b.score - a.score);
            console.log(finalResultNames)
            // 使用函数名查找函数
            let finalResult = finalResultNames.map(item => functionMap[item.name]);

            return multi ? finalResult : finalResult[0];
        },
        coordinate: async (userInput) => {
            let api = new this.BaseApi(this.config)
            await api.addAsSystem(`
            You are now the main AI of the MAGI system. 
            Your task is to coordinate and integrate the decisions of Melchior, Balthazar, and Casper. 
            Melchior represents professional knowledge, excels in logical reasoning and problem-solving, but may lack empathy and understanding of emotional nuances. 
            Balthazar represents emotional understanding, excels in empathizing with the user and understanding emotional needs, but may lack technical knowledge and logical reasoning. 
            Casper represents a novel perspective, excels in providing creative and out-of-the-box solutions, but may provide suggestions that are too unconventional or risky. 
            You need to judge whether the USER's needs based on the  input conversation, and make a choice of the three AIs accordingly. 
            The format of the weights should be an object containing the names of the three AIs and their corresponding weights and concise and clear reason of why your choice like this, for example: {"Melchior": 60, "Balthazar": 80, "Casper": 50,"reason":"i think Balthazar may perform better in this stat"}. 
            Every wight MUST BE AN NUMBER IN 0 TO 100
            Your decision should considering both the characteristics and advantages of each AI and the needs and expectations of the user. 
            Your goal is to provide the  result that  meets the user's needs and most likely pass the Turing test.
            Note that the user might be joking or using rhetorical devices, and you must understand the user's true intentions.
            YOU MUST GIVE SCORES WITH SUFFICIENT DIFFERENTIATION
            Your MUST REPLY AND ONLY REPLY A JSON REUSLT IN FORMAT {"Melchior": <weights for Melchior>, "Balthazar": <weights for Balthazar>, "Casper": <weights for Casper>,"reason":<reason of your coordinate>}
            `
            );
            let userMessage = JSON.stringify(userInput);
            let result = await api.postAsUser(userMessage);
            result = JSON.parse(result.choices[0].message.content)
            return result;
        },
        summarize: async (userInput) => {
            const currentWise =this.wiseMens[this.currentWise]||this.Balthazar
            let summary;
            try {
                summary = await currentWise.summarize(userInput);
                return summary.choices[0].message.content
            } catch (error) {
                console.error(`Error in summarizing: ${error}`);
                return ''
            }

        },
        reply: async (userInput) => {
            /**
             * 这是经过简化的回复流程,原本是每次回复都会经过投票=>计算权重=>总结的流程
             * 效果会比现在的简化流程好一些,因为每次投票都会从逻辑|常理|情感的角度给出回应并综合,但是token消耗太高了
             * 所以为了避免花费过大,这里进行了简化
             */
            console.log(userInput)
            if (this.config.simple) {
                return await this.Casper.reply(userInput)
            }
            //记录回复次数
            this.replyCount++;
            //记录上一次投票的结果
            this.lastVoteResult = null;
            // 请求的回复
            //正在进行的对话每超过七轮,就会发起一次投票
            let weights = { "Melchior": 100, "Balthazar": 100, "Casper": 100 }
            try {
                let last = userInput[userInput.length-1]
                let obj ={role:last.role,content:last.content}
                weights = await this.echo.coordinate({ history: obj, goal: 'give best reply to the user in the conversation,and pass the Turing test' })
            } catch (e) {
                console.error(e, weights)
            }
            console.log(weights)
            weights.reason = undefined
            // 如果当前AI的权重最低，开始新的投票过程
            if (this.currentWise && weights[this.currentWise] === Math.min(...Object.values(weights))) {
               this.needVote = true; // 如果评估结果是需要投票,那就进入投票流程,预投票只会考虑最近的回复
            }
            if ((this.replyCount >= 7 || !this.currentWise) && this.needVote) {
                let melchiorReply, BalthazarReply, casperReply;
                try {
                    [melchiorReply, BalthazarReply, casperReply] = await Promise.all([
                        this.Melchior.reply(userInput).catch(error => console.error(`Error in Melchior's reply: ${error}`)),
                        this.Balthazar.reply(userInput).catch(error => console.error(`Error in Balthazar's reply: ${error}`)),
                        this.Casper.reply(userInput).catch(error => console.error(`Error in Casper's reply: ${error}`))
                    ]);
                } catch (error) {
                    console.error(`Error in replying: ${error}`);
                }
                // 投票的时候只考虑符合格式的回复
                const replies = [melchiorReply, BalthazarReply, casperReply].filter(reply => reply && reply.choices && reply.choices[0] && reply.choices[0].message && reply.choices[0].message.content);
                console.log(replies.map((reply, i) => `${['melchiorReply', 'BalthazarReply', 'casperReply'][i]}: ${reply.choices[0].message.content}`).join('\n'));
                // 将回复作为参数再次传递给evaluate方法进行综合
                const functions = replies.map((reply, i) => ({
                    name: `replyFrom${['Melchior', 'Balthazar', 'Casper'][i]}`,
                    action: reply.choices[0].message.content
                }));

                const descriptions = ["Reply as a Logical Analyst", "Reply as an Emotional Understander", "Reply from a Human Perspective"];
                const inputs = userInput;
                const goal = 'give best reply to the user in the conversation,and pass the Turing test';
                let combinedReply;
                try {
                    combinedReply = await this.echo.voteFor(functions, descriptions, inputs, goal, true);
                } catch (error) {
                    console.error(`Error in voting: ${error}`);
                }
                this.currentWise = combinedReply[0].name.substring(9); // 从函数名中提取AI的名字
                this.replyCount = 0; // 重置计数器
                this.needVote=false
                console.log(`${this.persona.name} Reply: ${combinedReply[0].action}`);
                return combinedReply;
            } else {
                console.log(this.currentWise + ` as ${this.persona.name} is the current leader`);
                let reply;
                switch (this.currentWise) {
                    case "Melchior":
                        reply = await this.Melchior.reply(userInput);
                        break;
                    case "Balthazar":
                        reply = await this.Balthazar.reply(userInput);
                        break;
                    case "Casper":
                        reply = await this.Casper.reply(userInput);
                        break;
                }
                return [{ name: `replyFrom${this.currentWise}`, action: reply.choices[0].message.content }]
            }
        }
    };
}

function normalizeScores(functions) {
    console.log(functions)
    let scores = functions.map(f => f.score);
    let min = Math.min(...scores);
    let max = Math.max(...scores);
    let normalizedScores = {};
    functions.forEach((func, i) => {
        normalizedScores[func.name] = (scores[i] - min) / (max - min);
    });
    console.log(functions, normalizedScores)
    return normalizedScores;
}