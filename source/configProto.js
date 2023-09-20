export const configProto = {
  向量工具设置: {
      默认文本向量化模型: {
          type: 'string',
          default:'leolee9086/text2vec-base-chinese'
      },
      最大句子长度: {
          type: 'number',
          min: 64,
          max: 4096,
          default:128
      },
  },
  聊天工具设置: {
      默认AI: {
          type: 'string',
          default:"REI01"
      },
      决策级别: {
          type:'number',
          default:0
      },
      默认聊天短期记忆: {
          type: 'number',
          min: 1,
          max: 100,
          default:7
      },
      自动给出参考: {
          type:'boolean',
          default:false,
      },
      自动发送当前文档: {
          type: 'boolean',
          default:false
      },
      自动发送当前搜索结果: {
          type: 'boolean',
          default:false
      },
      默认参考数量: {
          type: 'number',
          min: 1,
          max: 100,
          default:30
      },
      参考文字最大长度: {
          type: 'number',
          //0表示完全不限制
          min: 0,
          max: 1024,
          default:512
      },
  },
  块标动作设置: {
      // 根据实际需求添加
  },
  关键词动作设置: {
      // 根据实际需求添加
  }
}