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
const offset = ref(0) // 这个是文本的截取位置，初始从0开始截取
// 这个是按钮为单行的模式下的折叠文本的css
const clampClass = ref({
    'display': '-webkit-box',
    '-webkit-box-orient': 'vertical',
    '-webkit-line-clamp': `${props.maxLines}`,// 这里可以根据给定的行数设置具体的clamp行数，这也是我要将css封装成一个对象的目的
    'overflow': 'hidden',
    'text-overflow': 'ellipsis'
})
function moveOffsetRight() {
    offset.value = offset.value + 1
    textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
}
// 往左移动一个步长
function moveOffsetLeft() {
    offset.value = offset.value - 1
    textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
}
/**
 * 获取一下展开收起按钮的宽度
 */
function getButtonWidth() {
    // 按钮
    const buttonElement = $('#textRefSpan').next()[0]
    // 文本容器
    const textContainer = textClampRef.value as HTMLElement
    // 按钮的宽
    const buttonWidth = buttonElement.clientWidth
    // 按钮容器的宽
    const textContainerWidth = textContainer?.clientWidth
    // return出去给其他方法用
    return { buttonWidth, textContainerWidth }
}
/**
 * 获取文本矩形的个数，rects的length反映真实的文本行数
 */
function getRects() {
    const rects = textRef.value?.getClientRects() as DOMRectList
    let rectsLength: number = 0;
    if (rects) {
        rectsLength = rects?.length
    }
    return { rects, rectsLength }
}
function tightText() {
    let { rects, rectsLength } = getRects()
    const { buttonWidth, textContainerWidth } = getButtonWidth()
    moveOffsetLeft()
    if (rects[rects.length - 1].width + buttonWidth > textContainerWidth) {
        tightText();
    } else {
        return
    }

}
function clampText(clampTag?: string) {
    if (!expanded.value || clampTag == 'canClamp') {
        textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
        while (true) {
            let { rects, rectsLength } = getRects()
            const { buttonWidth, textContainerWidth } = getButtonWidth()
            if (props.maxLines > rectsLength) {
                moveOffsetRight();
            } else if (props.maxLines < rectsLength) {
                moveOffsetLeft();
            } else {
                if (rects[rects.length - 1].width + buttonWidth <= textContainerWidth) {
                    moveOffsetRight();
                    continue;
                } else {
                    tightText()
                }
                break;
            }
        }

    }
}
/**
 * 初始处理一下文本
 */
function init() {
    // 当按钮是tight时，先将未经截取的文本内容赋值给textRef，这样才能得到真实的文本行数；若按钮是oneLine时，将显示maxLines那么多行的含省略号的样式加上
    props.buttonType == 'tight' ? (textRef.value && (textRef.value.textContent = props.text)) : $('#textRefSpan').css(clampClass.value)
    // 获取当前文本有多少行
    const rects = textRef.value?.getClientRects()
    console.log('在init中:', rects);
    if (rects) {
        // 当给定的maxLines的行数要比真正文本的行数还要小时，此时需要进行文本的截取
        if (props.maxLines <= rects.length) {
            clampText('canClamp')
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
        // 当按钮的类型是tight类型时
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
        try {
            addListener(textClampRef.value as HTMLElement, () => {
                clampText()
            })
        } catch (error) {
            console.log('11:');
        }
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
        <span ref="textRef" id="textRefSpan"></span>
        <slot ref="toggleButtonRef" name="textExpandButton" :toggle="toggle" :buttonType="buttonType"
            :isExpanded="expanded"></slot>
        <!-- </div> -->
    </div>
</template>
<style scoped></style>

