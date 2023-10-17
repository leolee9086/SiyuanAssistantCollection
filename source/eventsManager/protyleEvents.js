import { clientApi, pluginInstance as plugin } from "../asyncModules";
export const 启用收集protyle事件 = () => {
  //这个是为了收集所有的protyle
  plugin.eventBus.on("loaded-protyle", (e) => {
    plugin.protyles.push(e.detail);
    plugin.protyles = Array.from(new Set(plugin.protyles));
    plugin.setLute ? plugin._lute = plugin.setLute({
      emojiSite: e.detail.options.hint.emojiPath,
      emojis: e.detail.options.hint.emoji,
      headingAnchor: false,
      listStyle: e.detail.options.preview.markdown.listStyle,
      paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
      sanitize: e.detail.options.preview.markdown.sanitize,
    }) : null;
  });
  plugin.eventBus.on("click-editorcontent", (e) => {
    console.log(e)
    plugin.protyles.push(e.detail);
    plugin.protyles = Array.from(new Set(plugin.protyles));
    plugin.setLute ? plugin._lute = plugin.setLute({
      emojiSite: e.detail.options.hint.emojiPath,
      emojis: e.detail.options.hint.emoji,
      headingAnchor: false,
      listStyle: e.detail.options.preview.markdown.listStyle,
      paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
      sanitize: e.detail.options.preview.markdown.sanitize,
    }) : null;
  });
}
