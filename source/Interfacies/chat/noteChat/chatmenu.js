// 在 chatmenu.js 文件中拆分事件监听器

// 监听 click-blockicon 事件

import BlockHandler from '../../../utils/BlockHandler.js'
import { sac } from '../../../asyncModules.js';
// 处理 click-blockicon 事件的函数
export  function handleBlockIconClick(data) {
  const block = new BlockHandler(data.blockElements[0].getAttribute('data-node-id'));
  const currentRole = data.blockElements[0].getAttribute('custom-chat-role');

  // 创建角色子菜单
  createRoleSubmenu(data, block, currentRole);

  // 如果当前角色是助手，则创建 AI 角色切换子菜单
  if (currentRole === 'assistant') {
    createAiNamesSubmenu(data, block);
  }
}

// 创建角色子菜单的函数
function createRoleSubmenu(data, block, currentRole) {
  const roles = [
    { role: 'assistant', label: 'AI' },
    { role: 'user', label: '用户' },
    { role: 'system', label: '系统' }
  ];

  let submenu = roles
    .filter(r => currentRole !== r.role) // 过滤掉当前角色
    .map(r => ({
      icon: "#iconSparkles",
      label: `初始化角色为${r.label}`,
      click: () => block.setAttribute('custom-chat-role', r.role)
    }));

  // 添加删除角色的功能
  if (currentRole) {
    submenu.push({
      icon: "#iconTrash",
      label: "删除角色",
      click: () => block.setAttribute('custom-chat-role', '')
    });
  }

  // 如果有子菜单项，则添加到菜单中
  if (submenu.length > 0) {
    data.menu.addItem({
      icon: "#iconSparkles",
      label: "笔记聊天",
      submenu
    });
  }
}

// 创建 AI 角色切换子菜单的函数
function createAiNamesSubmenu(e, block) {
  let 当前AIpersona列表 = sac.statusMonitor.get('ai', 'personas').$value || [];
  console.log(当前AIpersona列表);
  const aiNamesSubmenu = 当前AIpersona列表.map(ai => ({
    icon: "#iconSparkles",
    label: `初始化角色为${ai.name}`,
    click: () => block.setAttribute('custom-ai-persona-name', ai.name)
  }));

  // 如果有 AI 角色，则添加到菜单中
  if (aiNamesSubmenu.length > 0) {
    e.menu.addItem({
      icon: "#iconSparkles",
      label: "切换ai角色",
      submenu: aiNamesSubmenu
    });
  }
}