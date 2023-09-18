let kernelApiDefine = [
  ["GET", "/api/system/bootProgress", "bootProgress", "获取启动进度"],

  ["POST", "/api/system/bootProgress", "bootProgress", "获取启动进度"],

  ["GET", "/api/system/version", "version", "获取软件版本"],

  ["POST", "/api/system/version", "version", "获取软件版本"],

  ["POST", "/api/system/currentTime", "currentTime", "获取当前时间"],

  ["POST", "/api/system/uiproc", "addUIProcess", "UI生成进度"],

  ["POST", "/api/system/loginAuth", "LoginAuth", "登录鉴权"],

  ["POST", "/api/system/logoutAuth", "LogoutAuth", "退出登录"],

  ["GET", "/api/system/getCaptcha", "GetCaptcha", "获取验证码"],
  ["POST", " /api/system/getChangelog", "getChangelog", "获取更新日志"],
  // 需要鉴权

  ["POST", "/api/system/getEmojiConf", "getEmojiConf", "获取emoji配置"],

  ["POST", "/api/system/setAccessAuthCode", "setAccessAuthCode", "设置鉴权码"],

  ["POST", "/api/system/setNetworkServe", "setNetworkServe", "设置网络服务器"],

  [
    "POST",

    "/api/system/setUploadErrLog",

    "setUploadErrLog",

    "设置上传错误日志",
  ],

  ["POST", "/api/system/setAutoLaunch", "setAutoLaunch", "设置自动启动"],

  [
    "POST",

    "/api/system/setGoogleAnalytics",

    "setGoogleAnalytics",

    "设置谷歌数据分析",
  ],

  [
    "POST",

    "/api/system/setDownloadInstallPkg",

    "setDownloadInstallPkg",

    "设置是否下载安装包",
  ],

  ["POST", "/api/system/setNetworkProxy", "setNetworkProxy", "设置网络代理"],

  [
    "POST",

    "/api/system/setWorkspaceDir",

    "setWorkspaceDir",

    "设置工作空间目录",
  ],

  ["POST", "/api/system/getWorkspaces", "getWorkspaces", "获取工作空间目录"],

  [
    "POST",

    "/api/system/getMobileWorkspaces",

    "getMobileWorkspaces",

    "获取移动端工作空间目录",
  ],

  [
    "POST",

    "/api/system/createWorkspaceDir",

    "createWorkspaceDir",

    "创建工作空间",
  ],

  [
    "POST",

    "/api/system/removeWorkspaceDir",

    "removeWorkspaceDir",

    "移除动作空间",
  ],

  [
    "POST",

    "/api/system/setAppearanceMode",

    "setAppearanceMode",

    "设置外观模式",
  ],

  ["POST", "/api/system/getSysFonts", "getSysFonts", "获取系统字体"],

  ["POST", "/api/system/exit", "exit", "退出"],

  ["POST", "/api/system/setUILayout", "setUILayout", "设置UI布局"],

  ["POST", "/api/system/getConf", "getConf", "获取配置"],

  ["POST", "/api/system/checkUpdate", "checkUpdate", "检查更新"],

  ["POST", "/api/system/exportLog", "exportLog", "导出日志"],

  //存储相关
  ["POST", "/api/storage/setLocalStorage", "setLocalStorage", "设置存储"],

  ["POST", "/api/storage/getLocalStorage", "getLocalStorage", "获取存储"],

  [
    "POST",

    "/api/storage/setLocalStorageVal",

    "setLocalStorageVal",

    "设置存储项",
  ],
  ["POST", " /api/storage/removeLocalStorageVals", "removeLocalStorageVals"],
  [
    "POST",

    "/api/storage/removeLocalStorageVal",

    "removeLocalStorageVal",

    "获取存储项",
  ],

  ["POST", "/api/storage/setCriterion", "setCriterion", "设置标准"],

  ["POST", "/api/storage/getCriteria", "getCriteria", "获取标准"],

  ["POST", "/api/storage/removeCriterion", "removeCriterion", "移除标准"],

  ["POST", "/api/storage/getRecentDocs", "getRecentDocs", "获取最近文档"],

  //账户登录
  ["POST", "/api/account/login", "login", "登录账号"],

  [
    "POST",

    "/api/account/checkActivationcode",

    "checkActivationcode",

    "检查激活码",
  ],

  ["POST", "/api/account/useActivationcode", "useActivationcode", "使用激活码"],

  ["POST", "/api/account/deactivate", "deactivateUser", "注销账号"],

  ["POST", "/api/account/startFreeTrial", "startFreeTrial", "开始免费试用"],

  //笔记本相关
  ["POST", "/api/notebook/lsNotebooks", "lsNotebooks", "获取笔记本列表"],

  ["POST", "/api/notebook/openNotebook", "openNotebook", "打开笔记本"],

  ["POST", "/api/notebook/closeNotebook", "closeNotebook", "关闭笔记本"],

  [
    "POST",

    "/api/notebook/getNotebookConf",

    "getNotebookConf",

    "获取笔记本配置",
  ],

  [
    "POST",

    "/api/notebook/setNotebookConf",

    "setNotebookConf",

    "设置笔记本配置",
  ],

  ["POST", "/api/notebook/createNotebook", "createNotebook", "创建笔记本"],

  ["POST", "/api/notebook/removeNotebook", "removeNotebook", "删除笔记本"],

  ["POST", "/api/notebook/renameNotebook", "renameNotebook", "重命名笔记本"],

  [
    "POST",

    "/api/notebook/changeSortNotebook",

    "changeSortNotebook",

    "改变笔记本排序",
  ],

  [
    "POST",

    "/api/notebook/setNotebookIcon",

    "setNotebookIcon",

    "设置笔记本图标",
  ],

  //文档树相关
  ["POST", "/api/filetree/searchDocs", "searchDocs", "搜索文档"],

  [
    "POST",

    "/api/filetree/listDocsByPath",

    "listDocsByPath",

    "获取路径下文档列表",
  ],

  ["POST", "/api/filetree/getDoc", "getDoc", "获取文档"],

  [
    "POST",

    "/api/filetree/getDocCreateSavePath",

    "getDocCreateSavePath",

    "获取文档创建位置",
  ],

  [
    "POST",

    "/api/filetree/getRefCreateSavePath",

    "getRefCreateSavePath",

    "获取块引创建位置",
  ],

  ["POST", "/api/filetree/changeSort", "changeSort", "改变文档排序"],

  ["POST", "/api/filetree/createDocWithMd", "createDocWithMd", "创建文档"],

  ["POST", "/api/filetree/createDailyNote", "createDailyNote", "创建日记"],

  ["POST", "/api/filetree/createDoc", "createDoc", "创建文档"],

  ["POST", "/api/filetree/renameDoc", "renameDoc", "重命名文档"],

  ["POST", "/api/filetree/removeDoc", "removeDoc", "删除文档"],

  ["POST", "/api/filetree/removeDocs", "removeDocs", "批量删除文档"],

  ["POST", "/api/filetree/moveDocs", "moveDocs", "批量移动文档"],

  ["POST", "/api/filetree/duplicateDoc", "duplicateDoc", "复制文档"],

  [
    "POST",

    "/api/filetree/getHPathByPath",

    "getHPathByPath",

    "通过路径获取文档可读路径",
  ],

  [
    "POST",

    "/api/filetree/getHPathsByPaths",

    "getHPathsByPaths",

    "通过路径列表获取文档可读路径列表",
  ],

  [
    "POST",

    "/api/filetree/getHPathByID",

    "getHPathByID",

    "通过id获取文档可读路径",
  ],

  [
    "POST",

    "/api/filetree/getFullHPathByID",

    "getFullHPathByID",

    "通过id获取完整文档可读路径",
  ],

  ["POST", "/api/filetree/doc2Heading", "doc2Heading", "文档转换为标题"],

  ["POST", "/api/filetree/heading2Doc", "heading2Doc", "标题转换为文档"],

  ["POST", "/api/filetree/li2Doc", "li2Doc", "列表转换为文档"],

  ["POST", "/api/filetree/refreshFiletree", "refreshFiletree", "刷新文档树"],

  //格式化相关
  ["POST", "/api/format/autoSpace", "autoSpace", "自动空格"],

  [
    "POST",

    "/api/format/netImg2LocalAssets",

    "netImg2LocalAssets",

    "网络图片转本地资源",
  ],

  //历史相关
  [
    "POST",

    "/api/history/getNotebookHistory",

    "getNotebookHistory",

    "获取笔记本历史",
  ],

  [
    "POST",

    "/api/history/rollbackNotebookHistory",

    "rollbackNotebookHistory",

    "回滚笔记本历史",
  ],

  [
    "POST",

    "/api/history/rollbackAssetsHistory",

    "rollbackAssetsHistory",

    "回滚资源历史",
  ],

  [
    "POST",

    "/api/history/getDocHistoryContent",

    "getDocHistoryContent",

    "获取文档历史内容",
  ],

  [
    "POST",

    "/api/history/rollbackDocHistory",

    "rollbackDocHistory",

    "回滚文档历史",
  ],

  [
    "POST",

    "/api/history/clearWorkspaceHistory",

    "clearWorkspaceHistory",

    "清空工作区历史",
  ],

  ["POST", "/api/history/reindexHistory", "reindexHistory", "重建历史索引"],

  ["POST", "/api/history/searchHistory", "searchHistory", "搜索历史"],

  ["POST", "/api/history/getDocHistory", "getHistoryItems", "获取历史条目"],

  //大纲、书签与标签相关
  ["POST", "/api/outline/getDocOutline", "getDocOutline", "获取文档大纲"],

  ["POST", "/api/bookmark/getBookmark", "getBookmark", "获取书签"],

  ["POST", "/api/bookmark/renameBookmark", "renameBookmark", "重命名书签"],

  ["POST", "/api/bookmark/removeBookmark", "removeBookmark", "移除书签"],

  ["POST", "/api/tag/getTag", "getTag", "获取标签"],

  ["POST", "/api/tag/renameTag", "renameTag", "重命名标签"],

  ["POST", "/api/tag/removeTag", "removeTag", "删除标签"],

  //lute相关
  ["POST", "/api/lute/spinBlockDOM", "spinBlockDOM"],
  // 未测试
  ["POST", "/api/lute/html2BlockDOM", "html2BlockDOM", "html转blockDOM"],

  ["POST", "/api/lute/copyStdMarkdown", "copyStdMarkdown", "复制标准markdown"],

  //sql相关
  ["POST", "/api/query/sql", "sql", "sql查询"],

  //搜索相关
  ["POST", "/api/search/searchTag", "searchTag", "搜索标签"],

  ["POST", "/api/search/searchTemplate", "searchTemplate", "搜索模板"],

  ["POST", "/api/search/searchWidget", "searchWidget", "搜索挂件"],

  ["POST", "/api/search/searchRefBlock", "searchRefBlock", "搜索引用块"],

  ["POST", "/api/search/searchEmbedBlock", "searchEmbedBlock", "搜索嵌入块"],

  [
    "POST",

    "/api/search/fullTextSearchBlock",

    "fullTextSearchBlock",

    "全文搜索块",
  ],

  ["POST", "/api/search/searchAsset", "searchAsset", "搜索资源"],

  ["POST", "/api/search/findReplace", "findReplace", "查找替换"],

  //块相关
  ["POST", "/api/block/getBlockInfo", "getBlockInfo", "获取块信息"],

  ["POST", "/api/block/getBlockDOM", "getBlockDOM", "获取块DOM"],

  ["POST", "/api/block/getBlockKramdown", "getBlockKramdown", "获取块kramdown"],

  [
    "POST",

    "/api/block/getBlockBreadcrumb",

    "getBlockBreadcrumb",

    "获取块面包屑",
  ],

  ["POST", "/api/block/getBlockIndex", "getBlockIndex", "获取块索引"],

  ["POST", "/api/block/getRefIDs", "getRefIDs", "获取引用块id"],

  [
    "POST",

    "/api/block/getRefIDsByFileAnnotationID",

    "getRefIDsByFileAnnotationID",

    "根据文件标记id获取引用块id",
  ],

  [
    "POST",

    "/api/block/getBlockDefIDsByRefText",

    "getBlockDefIDsByRefText",

    "根据引用文本获取块定义id",
  ],

  ["POST", "/api/block/getRefText", "getRefText", "获取引用文本"],

  ["POST", "/api/block/getTreeStat", "getTreeStat", "获取树状态"],

  ["POST", "/api/block/getBlockWordCount", "getBlockWordCount", "获取块字数"],

  [
    "POST",

    "/api/block/getContentWordCount",

    "getContentWordCount",

    "获取内容字数统计",
  ],

  [
    "POST",

    "/api/block/getRecentUpdatedBlocks",

    "getRecentUpdatedBlocks",

    "获取最近更新的块",
  ],

  ["POST", "/api/block/getDocInfo", "getDocInfo", "获取文档信息"],

  ["POST", "/api/block/checkBlockExist", "checkBlockExist", "检查块是否存在"],

  ["POST", "/api/block/checkBlockFold", "checkBlockFold", "检查块是否展开"],

  ["POST", "/api/block/insertBlock", "insertBlock", "插入块"],

  ["POST", "/api/block/prependBlock", "prependBlock", "插入前置子块"],

  ["POST", "/api/block/appendBlock", "appendBlock", "插入后置子块"],

  ["POST", "/api/block/updateBlock", "updateBlock", "更新块"],

  ["POST", "/api/block/deleteBlock", "deleteBlock", "删除块"],

  ["POST", "/api/block/setBlockReminder", "setBlockReminder", "设置块提醒"],

  [
    "POST",

    "/api/block/getHeadingLevelTransaction",

    "getHeadingLevelTransaction",

    "获取标题级别事务",
  ],

  [
    "POST",

    "/api/block/getHeadingDeleteTransaction",

    "getHeadingDeleteTransaction",

    "获取标题删除事务",
  ],

  [
    "POST",

    "/api/block/getHeadingChildrenIDs",

    "getHeadingChildrenIDs",

    "获取标题子块id",
  ],

  [
    "POST",

    "/api/block/getHeadingChildrenDOM",

    "getHeadingChildrenDOM",

    "获取标题子块DOM",
  ],

  ["POST", "/api/block/swapBlockRef", "swapBlockRef", "交换引用"],

  ["POST", "/api/block/transferBlockRef", "transferBlockRef", "转移引用"],

  //文件相关
  ["POST", "/api/file/getFile", "getFile", "获取文件"],

  ["POST", "/api/file/putFile", "putFile", "上传文件"],

  ["POST", "/api/file/copyFile", "copyFile", "复制文件"],

  ["POST", "/api/file/removeFile", "removeFile", "移除文件"],

  //引用相关
  ["POST", "/api/ref/refreshBacklink", "refreshBacklink", "刷新反向链接"],

  ["POST", "/api/ref/getBacklink", "getBacklink", "获取反向链接"],

  ["POST", "/api/ref/createBacklink", "createBacklink", "创建反向链接"],

  ["POST", "/api/ref/getBacklinkDoc", "getBacklinkDoc", "获取反链文档"],

  ["POST", "/api/ref/getBackmentionDoc", "getBackmentionDoc", "获取提及文档"],

  //属性相关
  ["POST", "/api/attr/getBookmarkLabels", "getBookmarkLabels", "获取书签标签"],

  ["POST", "/api/attr/resetBlockAttrs", "resetBlockAttrs", "重置块属性"],

  ["POST", "/api/attr/setBlockAttrs", "setBlockAttrs", "设置块属性"],

  ["POST", "/api/attr/getBlockAttrs", "getBlockAttrs", "获取块属性"],

  //云端相关
  ["POST", "/api/cloud/getCloudSpace", "getCloudSpace", "获取云端空间"],

  //同步相关
  ["POST", "/api/sync/setSyncEnable", "setSyncEnable", "设置同步开关"],

  [
    "POST",

    "/api/sync/setSyncGenerateConflictDoc",

    "setSyncGenerateConflictDoc",

    "设置同步是否生成冲突文件",
  ],

  ["POST", "/api/sync/setSyncMode", "setSyncMode", "设置同步模式"],

  ["POST", "/api/sync/setSyncProvider", "setSyncProvider", "设置同步供应商"],

  [
    "POST",

    "/api/sync/setSyncProviderS3",

    "setSyncProviderS3",

    "设置S3同步配置",
  ],

  [
    "POST",

    "/api/sync/setSyncProviderWebDAV",

    "setSyncProviderWebDAV",

    "设置webdav同步配置",
  ],

  ["POST", "/api/sync/setCloudSyncDir", "setCloudSyncDir", "设置云端同步目录"],

  [
    "POST",

    "/api/sync/createCloudSyncDir",

    "createCloudSyncDir",

    "创建云端同步目录",
  ],

  [
    "POST",

    "/api/sync/removeCloudSyncDir",

    "removeCloudSyncDir",

    "删除云端同步目录",
  ],

  [
    "POST",

    "/api/sync/listCloudSyncDir",

    "listCloudSyncDir",

    "获取云端同步目录",
  ],

  ["POST", "/api/sync/performSync", "performSync", "执行同步"],

  ["POST", "/api/sync/performBootSync", "performBootSync", "执行启动同步"],

  ["POST", "/api/sync/getBootSync", "getBootSync", "获取启动同步"],

  //收集箱相关
  ["POST", "/api/inbox/getShorthands", "getShorthands", "获取收集箱简写列表"],

  ["POST", "/api/inbox/getShorthand", "getShorthand", "获取收集箱简写"],

  ["POST", "/api/inbox/removeShorthands", "removeShorthands", "删除收集箱简写"],

  //浏览器插件相关
  ["POST", "/api/extension/copy", "extensionCopy", "复制扩展"],

  //剪贴板相关
  [
    "POST",

    "/api/clipboard/readFilePaths",

    "readFilePaths",

    "读取剪贴板文件路径",
  ],

  //附件相关
  ["POST", "/api/asset/uploadCloud", "uploadCloud", "上传云端附件"],

  ["POST", "/api/asset/insertLocalAssets", "insertLocalAssets", "插入本地附件"],

  ["POST", "/api/asset/resolveAssetPath", "resolveAssetPath", "解析附件路径"],

  ["POST", "/api/asset/upload", "upload", "上传附件"],

  ["POST", "/api/asset/setFileAnnotation", "setFileAnnotation", "设置附件注释"],

  ["POST", "/api/asset/getFileAnnotation", "getFileAnnotation", "获取附件注释"],

  ["POST", "/api/asset/getUnusedAssets", "getUnusedAssets", "获取未使用的附件"],

  [
    "POST",

    "/api/asset/removeUnusedAsset",

    "removeUnusedAsset",

    "删除未使用的附件",
  ],

  [
    "POST",

    "/api/asset/removeUnusedAssets",

    "removeUnusedAssets",

    "批量删除未使用的附件",
  ],

  [
    "POST",

    "/api/asset/getDocImageAssets",

    "getDocImageAssets",

    "获取文档图片附件",
  ],

  ["POST", "/api/asset/renameAsset", "renameAsset", "重命名附件"],

  //导出相关
  ["POST", "/api/export/batchExportMd", "batchExportMd", "批量导出Markdown"],

  ["POST", "/api/export/exportMd", "exportMd", "导出Markdown"],

  ["POST", "/api/export/exportSY", "exportSY", "导出SY"],

  ["POST", "/api/export/exportNotebookSY", "exportNotebookSY", "导出笔记本sy"],

  [
    "POST",

    "/api/export/exportMdContent",

    "exportMdContent",

    "导出Markdown内容",
  ],

  ["POST", "/api/export/exportHTML", "exportHTML", "导出HTML"],

  [
    "POST",

    "/api/export/exportPreviewHTML",

    "exportPreviewHTML",

    "导出预览HTML",
  ],

  ["POST", "/api/export/exportMdHTML", "exportMdHTML", "导出MarkdownHTML"],

  ["POST", "/api/export/exportDocx", "exportDocx", "导出Docx"],

  ["POST", "/api/export/processPDF", "processPDF", "生成PDF"],

  ["POST", "/api/export/preview", "exportPreview", "预览"],

  ["POST", "/api/export/exportAsFile", "exportAsFile", "文件形式导出"],

  ["POST", "/api/export/exportData", "exportData", "导出数据"],

  [
    "POST",

    "/api/export/exportDataInFolder",

    "exportDataInFolder",

    "导出数据到文件夹",
  ],

  [
    "POST",

    "/api/export/exportTempContent",

    "exportTempContent",

    "导出缓存内容",
  ],

  ["POST", "/api/export/export2Liandi", "export2Liandi", "导出到链滴"],

  //导入相关
  ["POST", "/api/import/importStdMd", "importStdMd", "导入标准Markdown"],

  ["POST", "/api/import/importData", "importData", "导入数据"],

  ["POST", "/api/import/importSY", "importSY", "导入SY"],

  //模板相关
  ["POST", "/api/template/render", "renderTemplate", "渲染模板"],

  [
    "POST",

    "/api/template/docSaveAsTemplate",

    "docSaveAsTemplate",

    "文档另存为模板",
  ],

  //事务相关
  ["POST", "/api/transactions", "performTransactions", "执行事务"],

  //设置相关
  ["POST", "/api/setting/setAccount", "setAccount", "设置账户"],

  ["POST", "/api/setting/setEditor", "setEditor", "设置编辑器"],

  ["POST", "/api/setting/setExport", "setExport", "设置导出"],

  ["POST", "/api/setting/setFiletree", "setFiletree", "设置文件树"],

  ["POST", "/api/setting/setSearch", "setSearch", "设置搜索"],

  ["POST", "/api/setting/setKeymap", "setKeymap", "设置快捷键"],

  ["POST", "/api/setting/setAppearance", "setAppearance", "设置外观"],

  ["POST", "/api/setting/getCloudUser", "getCloudUser", "获取云端用户"],

  ["POST", "/api/setting/logoutCloudUser", "logoutCloudUser", "注销云端用户"],

  [
    "POST",

    "/api/setting/login2faCloudUser",

    "login2faCloudUser",

    "二次验证登录云端用户",
  ],

  ["POST", "/api/setting/getCustomCSS", "getCustomCSS", "获取自定义CSS"],

  ["POST", "/api/setting/setCustomCSS", "setCustomCSS", "设置自定义CSS"],

  ["POST", "/api/setting/setEmoji", "setEmoji", "设置emoji"],

  [
    "POST",

    "/api/setting/setSearchCaseSensitive",

    "setSearchCaseSensitive",

    "设置搜索是否区分大小写",
  ],

  //图谱相关
  ["POST", "/api/graph/resetGraph", "resetGraph", "重置图谱"],

  ["POST", "/api/graph/resetLocalGraph", "resetLocalGraph", "重置本地图谱"],

  ["POST", "/api/graph/getGraph", "getGraph", "获取图谱"],

  ["POST", "/api/graph/getLocalGraph", "getLocalGraph", "获取本地图谱"],

  //集市相关
  ["POST", "/api/bazaar/getBazaarWidget", "getBazaarWidget", "获取集市挂件"],

  [
    "POST",

    "/api/bazaar/getInstalledWidget",

    "getInstalledWidget",

    "获取已安装的挂件列表",
  ],

  [
    "POST",

    "/api/bazaar/installBazaarWidget",

    "installBazaarWidget",

    "安装集市挂件",
  ],

  [
    "POST",

    "/api/bazaar/uninstallBazaarWidget",

    "uninstallBazaarWidget",

    "卸载集市挂件",
  ],

  ["POST", "/api/bazaar/getBazaarIcon", "getBazaarIcon", "获取集市图标"],

  [
    "POST",

    "/api/bazaar/getInstalledIcon",

    "getInstalledIcon",

    "获取已安装的图标",
  ],

  [
    "POST",

    "/api/bazaar/installBazaarIcon",

    "installBazaarIcon",

    "安装集市图标",
  ],

  [
    "POST",

    "/api/bazaar/uninstallBazaarIcon",

    "uninstallBazaarIcon",

    "卸载集市图标",
  ],

  [
    "POST",

    "/api/bazaar/getBazaarTemplate",

    "getBazaarTemplate",

    "获取集市模板",
  ],

  [
    "POST",

    "/api/bazaar/getInstalledTemplate",

    "getInstalledTemplate",

    "获取已安装的模板列表",
  ],

  [
    "POST",

    "/api/bazaar/installBazaarTemplate",

    "installBazaarTemplate",

    "安装集市模板",
  ],

  [
    "POST",

    "/api/bazaar/uninstallBazaarTemplate",

    "uninstallBazaarTemplate",

    "卸载集市模板",
  ],

  ["POST", "/api/bazaar/getBazaarTheme", "getBazaarTheme", "获取集市主题"],

  [
    "POST",

    "/api/bazaar/getInstalledTheme",

    "getInstalledTheme",

    "获取已安装的主题",
  ],

  [
    "POST",

    "/api/bazaar/installBazaarTheme",

    "installBazaarTheme",

    "安装集市主题",
  ],

  [
    "POST",

    "/api/bazaar/uninstallBazaarTheme",

    "uninstallBazaarTheme",

    "卸载集市主题",
  ],

  [
    "POST",

    "/api/bazaar/getBazaarPackageREAME",

    "getBazaarPackageREAME",

    "获取集市包说明",
  ],

  //仓库相关
  ["POST", "/api/repo/initRepoKey", "initRepoKey", "初始化仓库key"],

  [
    "POST",

    "/api/repo/initRepoKeyFromPassphrase",

    "initRepoKeyFromPassphrase",

    "从密码初始化仓库key",
  ],

  ["POST", "/api/repo/resetRepo", "resetRepo", "重置仓库"],

  ["POST", "/api/repo/importRepoKey", "importRepoKey", "导入仓库key"],

  ["POST", "/api/repo/createSnapshot", "createSnapshot", "创建快照"],

  ["POST", "/api/repo/tagSnapshot", "tagSnapshot", "标记快照"],

  ["POST", "/api/repo/checkoutRepo", "checkoutRepo", "签出仓库"],

  [
    "POST",

    "/api/repo/getRepoSnapshots",

    "getRepoSnapshots",

    "获取仓库快照列表",
  ],

  [
    "POST",

    "/api/repo/getRepoTagSnapshots",

    "getRepoTagSnapshots",

    "获取标记快照列表",
  ],

  [
    "POST",

    "/api/repo/removeRepoTagSnapshot",

    "removeRepoTagSnapshot",

    "移除标记快照列表",
  ],

  [
    "POST",

    "/api/repo/getCloudRepoTagSnapshots",

    "getCloudRepoTagSnapshots",

    "获取云端标记快照列表",
  ],

  [
    "POST",

    "/api/repo/removeCloudRepoTagSnapshot",

    "removeCloudRepoTagSnapshot",

    "移除云端标记快照",
  ],

  [
    "POST",

    "/api/repo/uploadCloudSnapshot",

    "uploadCloudSnapshot",

    "更新云端快照列表",
  ],

  [
    "POST",

    "/api/repo/downloadCloudSnapshot",

    "downloadCloudSnapshot",

    "下载云端快照",
  ],

  ["POST", "/api/repo/diffRepoSnapshots", "diffRepoSnapshots", "比较仓库快照"],

  [
    "POST",

    "/api/repo/openRepoSnapshotDoc",

    "openRepoSnapshotDoc",

    "打开快照文档",
  ],

  //间隔重复相关
  ["POST", "/api/riff/createRiffDeck", "createRiffDeck", "创建间隔重复卡包"],

  ["POST", "/api/riff/renameRiffDeck", "renameRiffDeck", "重命名间隔重复卡包"],

  ["POST", "/api/riff/removeRiffDeck", "removeRiffDeck", "移除间隔重复卡包"],

  ["POST", "/api/riff/getRiffDecks", "getRiffDecks", "获取间隔重复卡包列表"],

  ["POST", "/api/riff/addRiffCards", "addRiffCards", "添加间隔重复卡片"],

  ["POST", "/api/riff/removeRiffCards", "removeRiffCards", "移除间隔重复卡片"],

  [
    "POST",

    "/api/riff/getRiffDueCards",

    "getRiffDueCards",

    "获取到期间隔重复卡片列表",
  ],

  [
    "POST",

    "/api/riff/getTreeRiffDueCards",

    "getTreeRiffDueCards",

    "获取到期文档树间隔重复卡片列表",
  ],

  [
    "POST",

    "/api/riff/getNotebookRiffDueCards",

    "getNotebookRiffDueCards",

    "获取到期笔记本间隔重复卡片列表",
  ],

  ["POST", "/api/riff/reviewRiffCard", "reviewRiffCard", "复习间隔重复卡片"],

  [
    "POST",

    "/api/riff/skipReviewRiffCard",

    "skipReviewRiffCard",

    "跳过间隔重复卡片",
  ],

  ["POST", "/api/riff/getRiffCards", "getRiffCards", "获取间隔重复卡片列表"],

  [
    "POST",

    "/api/riff/getTreeRiffCards",

    "getTreeRiffCards",

    "获取文档树间隔重复卡片列表",
  ],

  [
    "POST",

    "/api/riff/getNotebookRiffCards",

    "getNotebookRiffCards",

    "获取笔记本间隔重复卡片列表",
  ],

  //消息相关
  ["POST", "/api/notification/pushMsg", "pushMsg", "发送消息"],

  ["POST", "/api/notification/pushErrMsg", "pushErrMsg", "发送错误消息"],

  //代码片段相关
  ["POST", "/api/snippet/getSnippet", "getSnippet", "获取代码片段"],

  ["POST", "/api/snippet/setSnippet", "setSnippet", "设置代码片段"],

  ["POST", "/api/snippet/removeSnippet", "removeSnippet", "移除代码片段"],

  ["GET", "/snippets/*filepath", "serveSnippets"],
  //属性视图相关
  [
    "POST",
    "/api/av/renderAttributeView",
    "renderAttributeView",
    "渲染属性视图",
  ],
  //人工智能相关
  ["POST", "/api/ai/chatGPT", "chatGPT"],
  ["POST", "/api/ai/chatGPTWithAction", "chatGPTWithAction"],
  //新增的,还没有整理
  ["POST", " /api/petal/loadPetals", "loadPetals"],

  ["POST", "/api/query/sql", "SQL"],
  ["POST", "/api/search/removeTemplate", "removeTemplate"],
  ["POST", "/api/block/getChildBlocks", "getChildBlocks"],
  ["POST", "/api/block/getBlocksWordCount", "getBlocksWordCount"],
  ["POST", "/api/block/moveBlock", "moveBlock"],
  ["POST", "/api/file/readDir", "readDir"],
  ["POST", "/api/ref/getBacklink2", "getBacklink2"],
  ["POST", "/api/asset/upload", "Upload"],
  ["POST", "/api/asset/getImageOCRText", "getImageOCRText"],
  ["POST", "/api/asset/setImageOCRText", "setImageOCRText"],
  ["POST", "/api/export/exportReStructuredText", "exportReStructuredText"],
  ["POST", "/api/export/exportAsciiDoc", "exportAsciiDoc"],
  ["POST", "/api/export/exportTextile", "exportTextile"],
  ["POST", "/api/export/exportOPML", "exportOPML"],
  ["POST", "/api/export/exportOrgMode", "exportOrgMode"],
  ["POST", "/api/export/exportMediaWiki", "exportMediaWiki"],
  ["POST", "/api/export/exportODT", "exportODT"],
  ["POST", "/api/export/exportRTF", "exportRTF"],
  ["POST", "/api/export/exportEPUB", "exportEPUB"],
  ["POST", "/api/convert/pandoc", "pandoc"],
  ["POST", "/api/template/renderSprig", "renderSprig"],
  ["POST", "/api/setting/setFlashcard", "setFlashcard"],
  ["POST", "/api/setting/setAI", "setAI"],
  ["POST", "/api/bazaar/getBazaarPlugin", "getBazaarPlugin"],
  ["POST", "/api/bazaar/getInstalledPlugin", "getInstalledPlugin"],
  ["POST", "/api/bazaar/installBazaarPlugin", "installBazaarPlugin"],
  ["POST", "/api/bazaar/uninstallBazaarPlugin", "uninstallBazaarPlugin"],
  ["POST", "/api/repo/purgeRepo", "purgeRepo","清除云端快照"],
  ["POST", "/api/repo/getCloudRepoSnapshots", "getCloudRepoSnapshots","获取云端快照"],
  ["POST", "/api/petal/setPetalEnabled", "setPetalEnabled","启用插件实例"],
];
let object = {};
kernelApiDefine.forEach((item, index) => {
  if (item) {
    object[item[2]] = {};
    object[item[2]].方法 = item[0];
    object[item[2]].路由 = item[1];
    object[item[2]].name = item[2];
    object[item[2]].中文名 = item[3];
    object[item[2]].参数说明 = item[4];
  } else {
    console.log(kernelApiDefine[index - 1]);
  }
});
export default object;
