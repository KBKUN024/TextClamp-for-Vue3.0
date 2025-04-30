<template>
    <div class="card" :class="{ 'is-flipped': isFlipped }">
        <!-- 正面内容 -->
        <div class="card-face card-front" v-show="!isFlipped">
            <div class="banner">
                <slot name="banner"></slot>
            </div>
            <div class="description">
                <slot name="description"></slot>
            </div>
            <button 
                class="view-source-btn"
                @click="toggleFlip"
                title="查看源代码">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            </button>
        </div>
        
        <!-- 背面内容 -->
        <div class="card-face card-back" v-show="isFlipped">
            <div class="source-code-header">
                <h3>示例源代码</h3>
                <div class="source-code-actions">
                    <button 
                        class="copy-btn" 
                        @click="copyCode" 
                        :class="{ 'copied': copied }"
                        title="复制代码">
                        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {{ copied ? 'Copied!' : 'Copy' }}
                    </button>
                    <button 
                        class="back-btn" 
                        @click="toggleFlip"
                        title="返回">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"></path>
                        </svg>
                        返回
                    </button>
                </div>
            </div>
            <div class="source-code-container">
                <highlightjs language="vue" :code="sourceCode" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

// 定义props
const props = defineProps<{
    sourceCode?: string;
}>();

const isFlipped = ref(false);
const copied = ref(false);

// 翻转卡片
const toggleFlip = () => {
    isFlipped.value = !isFlipped.value;
};

// 复制代码
const copyCode = async () => {
    if (props.sourceCode) {
        try {
            await navigator.clipboard.writeText(props.sourceCode);
            copied.value = true;
            setTimeout(() => {
                copied.value = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }
};

// 当组件挂载后初始化
onMounted(() => {
    // 监听翻转状态变化
    watch(isFlipped, (val) => {
        // 翻转到背面后可能需要一些处理
        // 但highlightjs组件会自动处理高亮
    });
});
</script>

<style scoped>
.card {
    width: 100%;
    min-height: 500px;
    border-radius: 1rem;
    background-color: transparent;
    position: relative;
    margin: 0;
    padding: 0;
    transition: min-height 0.3s ease;
    box-sizing: border-box;
}

.card-face {
    width: 100%;
    min-height: 500px;
    border-radius: 1rem;
    border: 1px solid hsl(216 34% 17%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
    background-color: hsl(224 71% 6%);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 100%;
}

.card-front {
    transform: rotateY(0deg);
    box-sizing: border-box;
}

.card-front:hover {
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.3), 0 8px 12px -6px rgba(0, 0, 0, 0.2);
    border-color: hsl(217.2 65% 35%);
    background-color: hsl(224 71% 7%);
}

.card-back {
    padding: 1.5rem;
    box-sizing: border-box;
    width: 100%;
}

.banner {
    width: 100%;
    height: 220px;
    position: relative;
    box-sizing: border-box; 
    padding: 10px;
}

.banner::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to top, hsl(224 71% 6%), transparent);
    z-index: 1;
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

.card-front:hover .banner::after {
    opacity: 0.3;
}

.banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, filter 0.3s ease;
    opacity: 0.9;
    filter: saturate(0.9);
}

.card-front:hover .banner img {
    transform: scale(1.05);
    opacity: 1;
    filter: saturate(1.1);
}

.description {
    padding: 1.5rem;
    color: hsl(213 31% 91%);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* 查看源代码按钮 */
.view-source-btn {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background-color: hsla(262.1 83.3% 57.8% / 0.8);
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
    z-index: 10;
}

.card-front:hover .view-source-btn {
    opacity: 1;
    transform: translateY(0);
}

.view-source-btn:hover {
    background-color: hsl(262.1 83.3% 63.8%);
}

/* 源代码区域样式 */
.source-code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid hsl(216 34% 17%);
}

.source-code-header h3 {
    margin: 0;
    font-size: 1rem;
    color: hsl(0 0% 98%);
}

.source-code-actions {
    display: flex;
    gap: 0.5rem;
}

.source-code-container {
    flex: 1;
    overflow: auto;
    border-radius: 0.375rem;
    background-color: hsl(220 13% 10%);
    max-height: 400px;
    width: 100%;
}

pre {
    margin: 0;
    overflow: auto;
    height: 100%;
    width: 100%;
    word-wrap: break-word;
    white-space: pre-wrap;
}

code {
    font-family: 'Fira Code', 'Courier New', Courier, monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    width: 100%;
}

.copy-btn, .back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    background-color: hsl(218 11% 15%);
    color: hsl(210 40% 98%);
    border: 1px solid hsl(216 34% 20%);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.copy-btn:hover, .back-btn:hover {
    background-color: hsl(218 11% 20%);
}

.copy-btn.copied {
    background-color: hsl(142.1 76.2% 36.3%);
    border-color: hsl(142.1 76.2% 36.3%);
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .banner {
        height: 160px;
    }
    
    .description {
        padding: 1.25rem;
    }
    
    .view-source-btn {
        left: 1.25rem;
        bottom: 1.25rem;
    }
    
    .card-back {
        padding: 1.25rem;
    }
}

@media screen and (max-width: 480px) {
    .card, .card-front, .card-back {
        border-radius: 0.75rem;
        width: 100%;
        padding: 0;
        margin: 0;
    }
    
    .banner {
        height: 140px;
        width: 100%;
        padding: 5px;
        box-sizing: border-box;
    }
    
    .description {
        padding: 0.75rem;
        width: 100%;
        box-sizing: border-box;
    }
    
    .view-source-btn {
        left: 0.75rem;
        bottom: 0.75rem;
    }
    
    .card-back {
        padding: 0.5rem;
        width: 100%;
    }
    
    .source-code-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem;
    }
    
    .source-code-actions {
        width: 100%;
        justify-content: space-between;
    }

    .source-code-container {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
    }
    
    pre {
        padding: 0.5rem;
        font-size: 0.75rem;
    }
    
    code {
        font-size: 0.75rem;
    }
}
</style>