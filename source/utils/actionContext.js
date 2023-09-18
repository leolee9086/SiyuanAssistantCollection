class Context {
  constructor(blocks, token, protyle, menu, plugin, kernelApi, clientApi, eventType) {
    this.blocks = blocks;
    this.token = token;
    this.protyle = protyle;
    this.menu = menu;
    this.plugin = plugin;
    this.kernelApi = kernelApi;
    this.clientApi = clientApi;
    this.eventType = eventType;
  }

  get cursor() {
    // 使用获取光标所在位置的函数来获取当前光标的位置
    const cursorPosition = 获取光标所在位置();
    if (!cursorPosition) {
      return null;
    }
    // 获取光标所在的块
    const blockElement = cursorPosition.blockElement;
    if (!blockElement) {
      return null;
    }
    // 返回块的BlockHandler实例
    return new this.plugin.utils.BlockHandler(blockElement.dataset.nodeId);
  }
}

export { Context as Context}
