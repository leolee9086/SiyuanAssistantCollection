export const Adapter =   class openAdapter{
    init(){

    }
    async prepareEmbedding(text,modelName){
        if(!this.models.embedding.includes(modelName)){
            return 
        }
        return await(await 使用openAI生成嵌入(modelName))(text)
    }
    ['models']={
        'embedding':[
            'text-embedding-ada-002'
        ],
        'chat/completions':[
            {
                Id:         "gpt-3.5-turbo",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-0301",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-0301",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-0613",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-0613",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-16k",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-16k",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-16k-0613",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-16k-0613",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-1106",
                Object:     "model",
                Created:    1699593571,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-1106",
                Parent:     nil,
            },
            {
                Id:         "gpt-3.5-turbo-instruct",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-3.5-turbo-instruct",
                Parent:     nil,
            },
            {
                Id:         "gpt-4",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-0314",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4-0314",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-0613",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4-0613",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-32k",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4-32k",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-32k-0314",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4-32k-0314",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-32k-0613",
                Object:     "model",
                Created:    1677649963,
                OwnedBy:    "openai",
                Root:       "gpt-4-32k-0613",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-1106-preview",
                Object:     "model",
                Created:    1699593571,
                OwnedBy:    "openai",
                Root:       "gpt-4-1106-preview",
                Parent:     nil,
            },
            {
                Id:         "gpt-4-vision-preview",
                Object:     "model",
                Created:    1699593571,
                OwnedBy:    "openai",
                Root:       "gpt-4-vision-preview",
                Parent:     nil,
            },
        ]
    }
}
