<template>
    <div class="ai-message ai-message-card" data-message-id="${message.id}" draggable="true">
        <div class="user-message-header fn__flex">
            <div class="fn__space fn__flex-1"></div>
            <span class="sac-user-name">paimon</span>

            <span class="user-avatar b3-tooltips b3-tooltips__nw block__icon block__icon--show" 
                alt="User's avatar">
                <svg class="b3-tooltips b3-tooltips__nw block__icon block__icon--show">
                    <use xlink:href="#iconAccount">
                    </use>
                </svg>
            </span>

        </div>

        实现注意事项

        - 近似排序结构：选择合适的数据结构来快速获得近似排序结果，例如使用T-Digest进行分位数估计。
        - 在线学习模型：选择适合的在线学习算法，如在线梯度下降，以适应不断变化的数据。
        - 性能与准确性的权衡：根据实时性要求和准确性需求调整算法参数，如学习率、近似结构的精度等。
        - 系统资源：监控系统资源使用情况，确保算法在资源限制下仍能有效运行。

        这种算法适用于需要实时处理和排序大量数据的场景，如实时推荐系统、实时搜索引擎排序等。实际实现时，可能需要根据具体应用场景和数据特性进行调整和优化。 <div class="fn__flex sac-tips-buttons">
            <button class="b3-button size__small">
                tips1
            </button>
            <span class="fn__space">
            </span>
            <button class="b3-button size__small">
                tips2
            </button>
        </div>
        <div class="fn__flex  sac-ai-actions-buttons">
            <div class="fn__space fn__flex-1"></div>
            <div class="fn__flex">
                <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" aria-label="Reply to message">
                    <svg>
                        <use xlink:href="#iconRefresh"></use>
                    </svg>
                </span>
                <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" aria-label="Reply to message">
                    <svg>
                        <use xlink:href="#iconCopy"></use>
                    </svg>
                </span>
                <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" aria-label="Reply to message">
                    <svg>
                        <use xlink:href="#iconEdit"></use>
                    </svg>
                </span>
                <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" aria-label="Reply to message">
                    <svg>
                        <use xlink:href="#iconLike"></use>
                    </svg>
                </span>
                <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" aria-label="Reply to message">
                    <svg>
                        <use xlink:href="#iconLike" transform="scale(1, -1) translate(0, -14)"></use>
                    </svg>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style>
.sac-tips-buttons {
    padding: 4px
}

.b3-button.size__small {
    font-size: xx-small;
    padding: 4px;
    line-height: 16px;
}

.sac-ai-actions-buttons {
    align-items: flex-end;
}
</style>