<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'

// 类型定义
type ButtonType = 'tight' | 'one-line';
type ButtonAlign = 'left' | 'right';

// 组件属性定义
const props = withDefaults(defineProps<{
  text: string;                     // 文本内容
  lines?: number;                  // 显示的行数
  buttonType?: ButtonType;         // 按钮类型：'tight'(紧贴文本末尾) 或 'one-line'(单独一行)
  expandText?: string;             // 展开按钮文本
  collapseText?: string;           // 收起按钮文本
  maxButtonTextLength?: number;    // 按钮文本最大长度
  buttonAlign?: ButtonAlign;       // 按钮对齐方式（只对 'one-line' 类型有效）
}>(), {
  lines: 3,
  buttonType: 'tight',
  expandText: 'Expand',
  collapseText: 'Collapse',
  maxButtonTextLength: 15,         // 默认最大按钮文本长度
  buttonAlign: 'right'             // 默认对齐方式为右对齐
})

// 元素引用
const textClampRef = ref<HTMLElement | null>(null)    // 容器元素
const textRef = ref<HTMLElement | null>(null)         // 文本元素
const buttonRef = ref<HTMLElement | null>(null)       // 按钮元素

// 状态
const expanded = ref(false)
const offset = ref(0)
const showButton = ref(false)
const isMounted = ref(false)

// 文本截断工具函数
function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + '...'
}

// CSS样式对象
const clampStyle = computed(() => ({
  'display': '-webkit-box',
  '-webkit-box-orient': 'vertical',
  '-webkit-line-clamp': `${props.lines}`,
  'overflow': 'hidden',
  'text-overflow': 'ellipsis'
}))

// 监听属性变化统一处理函数
const refreshLayout = () => {
  if (!isMounted.value) return
  
  // 保存当前展开状态
  const wasExpanded = expanded.value
  
  nextTick(() => {
    // 重置状态但保留展开状态
    reset(false)
    
    // 重新初始化并保持原有展开状态
    init(wasExpanded)
  })
}

// 使用一个watch监听所有可能导致需要重新计算布局的属性变化
watch(
  [() => props.text, () => props.lines, () => props.buttonType, () => props.expandText, () => props.collapseText, () => props.buttonAlign], 
  refreshLayout
)

// 设置文本内容
function setTextContent(content: string) {
  if (!textRef.value) return
  
  try {
    textRef.value.textContent = content
  } catch (error) {
    /* 静默处理错误 */
  }
}

// 重置状态
function reset(resetExpanded = true) {
  if (resetExpanded) {
    expanded.value = false
  }
  
  offset.value = 0
  
  if (textRef.value) {
    try {
      textRef.value.textContent = ''
      textRef.value.style.cssText = ''
    } catch (error) {
      /* 静默处理错误 */
    }
  }
}

// 切换展开/收起状态
function toggle(event?: Event) {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  expanded.value = !expanded.value
  
  // 使用nextTick确保状态更新后再更新DOM
  nextTick(updateTextDisplay)
}

// 更新文本显示
function updateTextDisplay() {
  if (!textRef.value) return
  
  if (expanded.value) {
    // 展开状态 - 显示全部文本
    removeTextStyles()
    setTextContent(props.text)
  } else {
    // 收起状态 - 应用截断样式
    if (props.buttonType === 'one-line') {
      applyOneLineStyles()
    } else {
      offset.value = 0  // 重置偏移量
      applyTightStyles()
    }
  }
}

// 应用紧贴模式样式
function applyTightStyles() {
  if (!textRef.value) return
  
  removeTextStyles()
  setTextContent(props.text)
  nextTick(() => clampText(true))
}

// 应用单行模式样式
function applyOneLineStyles() {
  if (!textRef.value) return
  
  Object.entries(clampStyle.value).forEach(([key, value]) => {
    if (textRef.value) {
      textRef.value.style[key as any] = value
    }
  })
  setTextContent(props.text)
}

// 移除文本样式
function removeTextStyles() {
  if (!textRef.value) return
  textRef.value.style.cssText = ''
}

// 移动截断位置并更新文本
function updateTextWithOffset() {
  if (!textRef.value) return
  
  const safeOffset = Math.max(0, Math.min(offset.value, props.text.length))
  setTextContent(props.text.slice(0, safeOffset) + '...')
}

// 移动截断位置（右移）
function moveOffsetRight() {
  offset.value = Math.min(offset.value + 1, props.text.length)
  updateTextWithOffset()
}

// 移动截断位置（左移）
function moveOffsetLeft() {
  offset.value = Math.max(0, offset.value - 1)
  updateTextWithOffset()
}

// 获取元素宽度
function getElementWidths() {
  if (!textClampRef.value) {
    return { buttonWidth: 0, textContainerWidth: 0 }
  }
  
  // 先尝试获取自定义按钮
  let buttonElement = textClampRef.value.querySelector('.custom-button') as HTMLElement
  
  // 如果没有自定义按钮，就使用默认按钮
  if (!buttonElement && buttonRef.value) {
    buttonElement = buttonRef.value
  }
  
  const buttonWidth = buttonElement ? buttonElement.offsetWidth || 0 : 0
  const textContainerWidth = textClampRef.value.clientWidth || 0
  
  return { buttonWidth, textContainerWidth }
}

// 获取文本矩形
function getTextRects() {
  if (!textRef.value) {
    return { rects: [], rectsLength: 0 }
  }
  
  // 强制重新计算布局
  void textRef.value.offsetHeight
  
  const rects = Array.from(textRef.value.getClientRects() || [])
  return { rects, rectsLength: rects.length }
}

// 收紧文本，确保按钮紧贴文本末尾
function tightText(maxIterations = 50) {
  // 防止无限递归，设置最大迭代次数和最小偏移量
  if (maxIterations <= 0 || !textRef.value || offset.value <= 0) return
  
  const { rects } = getTextRects()
  if (!rects || rects.length === 0) return
  
  const { buttonWidth, textContainerWidth } = getElementWidths()
  moveOffsetLeft()
  
  if (rects[rects.length - 1].width + buttonWidth > textContainerWidth) {
    tightText(maxIterations - 1)
  }
}

// 截断文本
function clampText(canClamp = false) {
  if (expanded.value && !canClamp) return
  
  if (!textRef.value) return
  
  updateTextWithOffset()
  
  // 防止无限循环
  const maxIterations = 500
  let iterations = 0
  
  // 迭代查找最佳截断位置
  while (iterations < maxIterations) {
    iterations++
    
    const { rects, rectsLength } = getTextRects()
    if (!rects || rectsLength === 0) break
    
    const { buttonWidth, textContainerWidth } = getElementWidths()
    
    if (props.lines > rectsLength) {
      moveOffsetRight()
    } else if (props.lines < rectsLength) {
      moveOffsetLeft()
    } else {
      // 行数相等，检查最后一行是否有足够空间放置按钮
      if (rects[rects.length - 1].width + buttonWidth <= textContainerWidth) {
        moveOffsetRight()
        continue
      } else {
        tightText()
        break
      }
    }
  }
}

// 检查是否需要显示按钮（使用记忆化计算避免重复计算）
const checkShouldShowButton = (() => {
  let cache = { text: '', lines: 0, result: false };
  
  return function() {
    if (!textRef.value) return false
    
    // 如果文本和行数没有变化，直接返回缓存结果
    if (cache.text === props.text && cache.lines === props.lines) {
      return cache.result;
    }
    
    const originalContent = textRef.value.textContent
    
    // 设置完整文本
    setTextContent(props.text)
    
    // 获取文本行数
    const { rectsLength } = getTextRects()
    cache = { text: props.text, lines: props.lines, result: rectsLength > props.lines };
    
    // 恢复原始内容
    setTextContent(originalContent || '')
    
    return cache.result
  }
})()

// 初始化
function init(keepExpanded = false) {
  if (!textRef.value) return
  
  // 先显示完整文本，检查是否需要截断
  setTextContent(props.text)
  
  // 使用 nextTick 确保内容已经渲染
  nextTick(() => {
    showButton.value = checkShouldShowButton()
    
    if (keepExpanded) {
      expanded.value = true
      removeTextStyles()
      setTextContent(props.text)
    } else if (showButton.value && !expanded.value) {
      if (props.buttonType === 'one-line') {
        applyOneLineStyles()
      } else {
        offset.value = 0  // 确保从零开始
        clampText(true)
      }
    }
  })
}

// 使用防抖函数处理resize事件
const debouncedRefreshLayout = (() => {
  let timer: number | null = null;
  return function() {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      refreshLayout();
      timer = null;
    }, 100);
  };
})();

// ResizeObserver实现
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // 标记组件已挂载
  isMounted.value = true
  
  nextTick(() => {
    // 确保DOM已经渲染完成
    init()
    
    // 使用ResizeObserver监听尺寸变化
    if (textClampRef.value && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(debouncedRefreshLayout)
      resizeObserver.observe(textClampRef.value)
    }
  })
})

onUnmounted(() => {
  // 标记组件已卸载
  isMounted.value = false
  
  // 清理ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// 定义切换文本
const toggleText = computed(() => {
  const text = expanded.value ? props.collapseText : props.expandText
  return truncateText(text, props.maxButtonTextLength)
})

// 用于暴露给插槽的按钮文本，包含长度限制
const limitedExpandText = computed(() => truncateText(props.expandText, props.maxButtonTextLength))
const limitedCollapseText = computed(() => truncateText(props.collapseText, props.maxButtonTextLength))

// 按钮类样式
const buttonClass = computed(() => {
  const classes = ['text-clamp-button', `text-clamp-button--${props.buttonType}`]
  // 移除未使用的类，只保留必要的类名
  return classes
})

// 导出组件方法给外部使用
defineExpose({
  toggle,
  expanded
})
</script>

<template>
  <div ref="textClampRef" class="text-clamp">
    <span ref="textRef" class="text-clamp__text"></span>
    
    <!-- 仅当需要截断时显示按钮 -->
    <template v-if="showButton">
      <!-- 为one-line模式添加包装容器 -->
      <div v-if="buttonType === 'one-line'" 
           :class="[
             'text-clamp-button--one-line-wrapper', 
             `text-clamp-button--one-line-wrapper-${buttonAlign}`
           ]">
        <!-- 使用插槽自定义按钮 -->
        <slot name="expandButton" 
              :toggle="toggle" 
              :is-expanded="expanded"
              :button-type="buttonType"
              :button-align="buttonAlign"
              :limited-expand-text="limitedExpandText"
              :limited-collapse-text="limitedCollapseText">
          
          <!-- 默认按钮实现 -->
          <button
            ref="buttonRef"
            :class="buttonClass"
            type="button"
            @click="toggle"
            :title="expanded ? props.collapseText : props.expandText">
            {{ toggleText }}
          </button>
        </slot>
      </div>
      
      <!-- 为tight模式保持原有结构 -->
      <slot v-else name="expandButton" 
            :toggle="toggle" 
            :is-expanded="expanded"
            :button-type="buttonType"
            :button-align="buttonAlign"
            :limited-expand-text="limitedExpandText"
            :limited-collapse-text="limitedCollapseText">
        
        <!-- 默认按钮实现 -->
        <button
          ref="buttonRef"
          :class="buttonClass"
          type="button"
          @click="toggle"
          :title="expanded ? props.collapseText : props.expandText">
          {{ toggleText }}
        </button>
      </slot>
    </template>
  </div>
</template>

<style scoped>
/* 文本截断容器 */
.text-clamp {
  position: relative;
  width: 100%;
}

/* 文本元素样式 */
.text-clamp__text {
  word-break: break-word;
}

/* 按钮基础样式 */
.text-clamp-button {
  background: none;
  border: none;
  color: hsl(217.2 91.2% 59.8%);
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  padding: 0 4px;
  transition: color 0.2s, transform 0.5s ease;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px; /* 按钮宽度限制 */
}

/* 按钮悬停效果 */
.text-clamp-button:hover {
  color: hsl(221.2 83.2% 53.3%);
  transform: scale(1.05);
}

/* 紧贴文本样式 - 按钮和文本在同一行 */
.text-clamp-button--tight {
  display: inline;
  margin-left: 4px;
}

/* 单独一行样式 - 使用包装div实现按钮对齐但不占满整行 */
.text-clamp-button--one-line {
  display: inline-block; /* 使用内联块级元素 */
  width: auto; /* 宽度适应内容 */
  margin-top: 8px;
}

/* 单独一行的包装容器，用于控制对齐 */
.text-clamp-button--one-line-wrapper {
  display: block;
  width: 100%;
  text-align: right; /* 默认右对齐 */
}

/* 左对齐包装容器 */
.text-clamp-button--one-line-wrapper-left {
  text-align: left;
}

/* 右对齐包装容器 */
.text-clamp-button--one-line-wrapper-right {
  text-align: right;
}

/* 自定义按钮样式 */
:deep(.custom-button--tight) {
  display: inline !important;
  margin-left: 4px !important;
  margin-top: 0 !important;
  vertical-align: middle !important;
  max-width: 150px !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

:deep(.custom-button--one-line) {
  display: inline-block !important;
  margin-top: 8px !important;
  max-width: 150px !important;
  width: auto !important;
}

:deep(.text-clamp-button--one-line-wrapper) {
  display: block !important;
  width: 100% !important;
}

:deep(.text-clamp-button--one-line-wrapper-left) {
  text-align: left !important;
}

:deep(.text-clamp-button--one-line-wrapper-right) {
  text-align: right !important;
}
</style>


