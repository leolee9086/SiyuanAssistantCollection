if(!window.require){
    throw new Error('本地文件系统仅在electron环境下可用')
}
export const isInCurrentWorkspace = (targetPath) => {
    const workspaceDir = globalThis.siyuan.config.system.workspaceDir;
    const relative = path.relative(workspaceDir, targetPath);
    return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
};