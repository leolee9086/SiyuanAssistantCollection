import { sac } from "./runtime.js";
import { logger } from "../../logger/index.js";
import * as 基础事件列表 from './SiyuanBaseEventTypeList.js'
export const 启用收集protyle事件 = () => {
  //这个是为了收集所有的protyle
  sac.eventBus.on(基础事件列表.编辑器加载事件, (e) => {
    sac.protyles.push(e.detail);
    sac.protyles = Array.from(new Set(plugin.protyles));
    sac.setLute ? sac._lute = sac.setLute({
      emojiSite: e.detail.options.hint.emojiPath,
      emojis: e.detail.options.hint.emoji,
      headingAnchor: false,
      listStyle: e.detail.options.preview.markdown.listStyle,
      paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
      sanitize: e.detail.options.preview.markdown.sanitize,
    }) : null;
  });
  sac.eventBus.on(基础事件列表.编辑器内容点击, (e) => {
    logger.eventlog(e)
    sac.protyles.push(e.detail);
    sac.protyles = Array.from(new Set(sac.protyles));
    sac.setLute ? sac._lute = sac.setLute({
      emojiSite: e.detail.options.hint.emojiPath,
      emojis: e.detail.options.hint.emoji,
      headingAnchor: false,
      listStyle: e.detail.options.preview.markdown.listStyle,
      paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
      sanitize: e.detail.options.preview.markdown.sanitize,
    }) : null;
  });
}
