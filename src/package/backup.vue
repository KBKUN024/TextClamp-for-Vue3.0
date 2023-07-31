<script setup lang="ts">
import { addListener, removeListener } from 'resize-detector'
import { ref, onMounted, onUnmounted } from 'vue'
import $ from 'jquery'
const props = withDefaults(defineProps<{
    text: string; // 传入的文本，必传项
    buttonType?: 'oneLine' | 'tight'; // 展开收起按钮分为：1. oneLine:自身占据单行 2. tight:和文字紧密相邻
    maxLines?: number; // 设置的显示的行数
    isExpanded?: boolean; // 展开的状态，true：展开，false：收起
}>(), {
    buttonType: 'oneLine',
    isExpanded: false,
    maxLines: 3
})
const textClampRef = ref<HTMLElement | null>(null) // 最外层div的ref
// const textClampContainerRef = ref<HTMLElement | null>(null) // 该组件放内容的容器的ref
const textRef = ref<HTMLElement | null>(null) // 该组件放文本内容的ref
const toggleButtonRef = ref<HTMLElement | null>(null)
const expanded = ref(props.isExpanded) //本地的expanded状态，先获取一遍属性中的isExpanded状态，然后才能用toggle方法进行修改
const step = ref<number>(200) // 截取文本的位置
// 这个是按钮为单行的模式下的折叠文本的css
const clampClass = ref({
    'display': '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': `${props.maxLines}`,// 这里可以根据给定的行数设置具体的clamp行数，这也是我要将css封装成一个对象的目的
    'overflow': 'hidden',
    'text-overflow': 'ellipsis'
})
// 往右移动一个步长，注意我在这里将步长设置为了2，因为如果设置为1的时候，出现按钮不能紧密收紧的情况比较频繁，设置为2之后基本就正常了
function moveRight() {
    step.value = step.value + 2
}
// 往左移动一个步长
function moveLeft() {
    step.value = step.value - 2
}
/**
 * 获取一下展开收起按钮的宽度
 */
function getButtonWidth() {
    // 按钮
    const buttonElement = $('#textRefSpan').next()[0]
    // 文本容器
    const textContainer = textClampRef.value
    // 按钮的宽
    const buttonWidth = buttonElement.clientWidth
    // 按钮容器的宽
    const textContainerWidth = textContainer?.clientWidth
    // return出去给其他方法用
    return { buttonWidth, textContainerWidth }
}
/**
 * ?将文本进行折叠（只在按钮的类型为tight的时候发挥作用）
 * *具体实现思路：先随便假定一个截取范围，例如我这里给的是[0,200]，然后截取完对比下rect的宽度和maxLines，若maxLines < rect.length，则左移；若maxLines > rect.length，则右移；若相等，则调用tightText()收紧文本
 */
function clampText(tag?: string) {
    // 要在expand为false即收起的状态时或者tag为'canClamp'时即’可以折叠‘时才执行这个函数的函数体，这样做的原因是文本有可能在展开的状态下用户调整了浏览器的宽度，这样的话，展开收起按钮可能会因为expand的变化而不断变化，这样体验就差了
    if (!expanded.value || tag == 'canClamp') {
        // 先让textRef的内容从0截取到step，step是我随便设置的，设置为200，你也可以设置为其他值，我的想法是先设置为200，然后再调整，然后再逐步收紧
        textRef.value && (textRef.value.textContent = props.text.slice(0, step.value) + '...')
        const rects = textRef.value?.getClientRects()
        if (rects) {
            console.log('rects:', rects);
            if (props.maxLines < rects?.length) {
                moveLeft();
            } else if (props.maxLines > rects?.length) {
                moveRight();
            } else {
                tightText()
                return
            }
            // 也需要递归调用一下自己，使文本的实际行数和给定的maxLines保持一致
            clampText();
        }
    }
}
/**
 * 收紧文本，使按钮紧贴文本的省略号
 */
function tightText() {
    // 获取一下按钮和textContainer的宽度
    const { buttonWidth, textContainerWidth } = getButtonWidth()
    // 获取一下文本有几行（即有几个矩形）
    const rects = textRef.value?.getClientRects()
    // 如果rects或者textContainerWidth都存在的话s
    if (rects && textContainerWidth) {
        // 判断一下最后一个矩形的宽度加上按钮的宽度是否小于等于容器的宽度，如果是的话，就直接return，这个时候按钮就会紧贴文本的最右边而不换行（因为这个方法递归了）
        if ((rects[rects.length - 1].width + buttonWidth <= textContainerWidth) && props.maxLines == rects?.length) {
            return
        }
        // 如果最后一个矩形的宽度加按钮的宽度会大于等于容器宽度，说明这个时候按钮如果放在文本的最末尾就会超出导致换行，所以下面要moveLeft()
        if (rects[rects.length - 1].width + buttonWidth >= textContainerWidth) {
            console.log('here:');
            moveLeft()
            // 使用moveLeft()往左边移动后，再设置一下文本
            textRef.value && (textRef.value.textContent = props.text.slice(0, step.value) + '...')
        } else {
            // 如果最后一个矩形的宽度加按钮的宽度会小于等于容器宽度，说明这个时候按钮如果放在文本的最末尾不会超出导致换行，但是有可能结尾空很多空间，所以下面要moveRight()，往右收紧一点
            moveRight()
            textRef.value && (textRef.value.textContent = props.text.slice(0, step.value) + '...')
        }
        // 递归调用一下自己，不断去收紧，前面有return，所以不会爆栈
        tightText()
    }
}
/**
 * 初始处理一下文本
 */
function init() {
    // 当按钮是tight时，什么也不做；若按钮是oneLine时，将显示maxLines那么多行的含省略号的样式加上
    props.buttonType == 'tight' ? (textRef.value && (textRef.value.textContent = props.text.slice(0, step.value) + '...')) : $('#textRefSpan').css(clampClass.value)
    // 获取当前文本有多少行
    const rects = textRef.value?.getClientRects()
    if (rects) {
        // 当给定的maxLines的行数要比真正文本的行数还要小时，此时需要进行文本的截取
        if (props.maxLines <= rects.length) {
            clampText()
        } else {
            // 此时maxLines大于或者等于真正的文本行数，此时无需截取，之前将所有文本显示出来就好
            /**
             * !顺带一提，当按钮类型为oneLine时，是直接执行的这个else，因为本函数的开头在按钮为oneLine时为TextRefSpan设置了style，这会导致getClientRects只能取到一个矩形，即使用了css省略后的矩形，此时直接将textRef的内容设置为原文即可，css会自动省略，显示给定的行数
              */
            textRef.value && (textRef.value.textContent = props.text)
        }
    }
}

/**
 * 切换展开收起的方法
 */
function toggle() {
    // 当按钮的类型是单行类型时
    if (props.buttonType == 'oneLine') {
        // 当前是折叠状态时，一点就变成展开状态
        if ($('#textRefSpan').attr('style') !== undefined) {
            $('#textRefSpan').removeAttr('style')
        } else {
            // 当前是展开状态，一点变成折叠状态
            $('#textRefSpan').css(clampClass.value)
        }
        expanded.value = !expanded.value
    } else {
        // 当按钮的类型是紧密类型时
        if (!expanded.value) {
            // 判断，若当前（即点击toggle之前）是收起的状态，那么需要将文本展开，显示未截取的原文本
            // 此时要将监听去掉，不然在mounted中的监听会让文本又变成省略的状态
            props.buttonType == 'tight' && removeListener(textClampRef.value as HTMLElement)
            textRef.value && (textRef.value.textContent = props.text)
        } else {
            // 若当前已经是展开了的状态了，那么需要对文本进行截取，调用截取方法
            clampText('canClamp')
        }
        // 切换一下展开收起的状态
        expanded.value = !expanded.value
        // 将监听加上
        props.buttonType == 'tight' && addListener(textClampRef.value as HTMLElement, () => {
            clampText()
        })
    }
}
onMounted(() => {
    init()
    // 当按钮的类型是tight时才启动这个监听器
    if (textClampRef.value && props.buttonType == 'tight') {
        addListener(textClampRef.value as HTMLElement, () => {
            clampText()
        })
    }
})
onUnmounted(() => {
    // 卸载的时候取消对textClampRef的监听
    if (textClampRef.value && props.buttonType == 'tight') {
        removeListener(textClampRef.value as HTMLElement)
    }
}
)
</script>

<template>
    <div ref="textClampRef">
        <!-- <div ref="textClampContainerRef"> -->
        <span ref="textRef" id="textRefSpan" class="clamp"></span>
        <slot ref="toggleButtonRef" name="textExpandButton" :toggle="toggle" :buttonType="buttonType"
            :isExpanded="expanded"></slot>
        <!-- </div> -->
    </div>
</template>
<style scoped>
.clamp {
    text-align: justify;
}
</style>

