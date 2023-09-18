export const configProto = {
  向量工具设置: {
      默认文本向量化模型: {
          type: 'string',
      },
      最大句子长度: {
          type: 'number',
          min: 64,
          max: 4096,
      },
  },
  聊天工具设置: {
      默认AI: {
          type: 'string',
      },
      决策级别: {
          type: 'string',
      },
      默认聊天短期记忆: {
          type: 'number',
          min: 1,
          max: 100,
      },
      自动给出参考: {
          type: 'number',
          min: 0,
          max: 1,
      },
      自动发送当前文档: {
          type: 'boolean',
      },
      自动发送当前搜索结果: {
          type: 'boolean',
      },
      默认参考数量: {
          type: 'number',
          min: 1,
          max: 100,
      },
      参考文字最大长度: {
          type: 'number',
          min: 1,
          max: 100,
      },
  },
  块标动作设置: {
      // 根据实际需求添加
  },
  关键词动作设置: {
      // 根据实际需求添加
  }
}