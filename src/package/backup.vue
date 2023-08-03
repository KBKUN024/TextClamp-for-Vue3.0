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
/**
 * 将文本截取标志offset往右移动一个单位，同时截取文本并赋值
 */
function moveOffsetRight() {
    offset.value = offset.value + 1
    textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
}
/**
 * 将文本截取标志offset往左移动一个单位，同时截取文本并赋值
 */
function moveOffsetLeft() {
    offset.value = offset.value - 1
    textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
}
/**
 * 获取一下展开收起按钮的宽度以及文本容器的宽度
 */
function getButtonWidth() {
    // 按钮
    // const buttonElement = $('#textRefSpan').next()[0]
    const buttonElement = document.querySelector('#textRefSpan')?.nextElementSibling as HTMLElement | null;
    // 文本容器
    const textContainer = textClampRef.value as HTMLElement
    // 按钮的宽
    const buttonWidth = buttonElement?.clientWidth ?? 0
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
/**
 * 收紧文本
 * ?实现思路：比较按钮宽度加最后一个矩形框的宽度是否会大于文本容器宽度，若大于，递归调用自身，即调用moveOffsetLeft()，进一步缩紧文本，否则直接return
 */
function tightText() {
    let { rects } = getRects()
    const { buttonWidth, textContainerWidth } = getButtonWidth()
    moveOffsetLeft()
    if (rects[rects.length - 1].width + buttonWidth > textContainerWidth) {
        tightText();
    } else {
        return
    }

}
/**
 * 截取文本
 * @param clampTag 一个用来判断需要进行截取的标志，只有clampTag的值为'canClamp'的时候，才可以调用clampText()，这样做是因为在文本展开的情况下，调整浏览器的宽度会引起截取文本的操作，这样展开的文本又会变成截取的，同时按钮的文本却还是停留在Collapse的情况，为了避免这种情况，才加的这个tag
 */
function clampText(clampTag?: string) {
    // 当文本是未展开且clampTag的值为canClamp时才可以进行截取文本的操作。如果你不知道为什么要这么做，可以试试将下面一行的if判断去掉，然后将文本展开，随即调整浏览器宽度试试，你应该就明白了
    if (!expanded.value || clampTag == 'canClamp') {
        // 首先进行一次截取，首次截取时是slice(0,0)，因为offset的初始值为0
        textRef.value && (textRef.value.textContent = props.text.slice(0, offset.value) + '...')
        // 进行一个无限循环来大致寻找出文本的最终位置的大致位置
        while (true) {
            let { rects, rectsLength } = getRects()
            const { buttonWidth, textContainerWidth } = getButtonWidth()
            // 当给定的maxLines会比所得的矩形个数（即真实行数）大的话，就往右移动进行截取
            if (props.maxLines > rectsLength) {
                moveOffsetRight();
            } else if (props.maxLines < rectsLength) {
                moveOffsetLeft(); // 否则向左移动进行截取
            } else {
                // 若给定行数和真实行数相等时，这个时候就要比较最后一个矩形的width加上按钮的width会不会超过文本容器的width了
                // 当下面的if成立时，需要往右移动进行截取，因为这个else是给定行数和真实行数相等的情况，若不这么做，可能第三行就截取了几个字符就不能继续进行截取了
                if (rects[rects.length - 1].width + buttonWidth <= textContainerWidth) {
                    moveOffsetRight();
                    continue; // 往右截取之后，需要continue再执行一次循环，若还是这个if的情况，继续向右截取
                } else {
                    // 这种情况就可能是最后一个矩形的width加上按钮的width超过了文本容器的width了，这个时候就要进行收紧文本，保证按钮会紧贴着文本
                    tightText()
                }
                // 最后记得要退出无限循环
                break;
            }
        }

    }
}
/**
 * 初始处理一下文本
 */
function init() {
    // 当按钮是tight时，先将未经截取的文本内容赋值给textRef，因为只有这样才能得到真实的文本行数；若按钮是oneLine时，将显示maxLines那么多行的含省略号的样式加上即可
    // props.buttonType == 'tight' ? (textRef.value && (textRef.value.textContent = props.text)) : $('#textRefSpan').css(clampClass.value)
    props.buttonType == 'tight' ? (textRef.value && (textRef.value.textContent = props.text)) : document.querySelector('#textRefSpan')
    // 获取当前文本有多少行
    const rects = textRef.value?.getClientRects()
    if (rects) {
        // 当给定的maxLines的行数要比真正文本的行数还要小或者刚好相等时，此时需要进行文本的截取
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
        // 若当前是未展开的情况，那么点击toggle，就要显示出所有的文本
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
        // 然后别忘记将监听加上
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
    <button @click="getButtonWidth">getButtonWidth</button>
    <div ref="textClampRef">
        <span ref="textRef" id="textRefSpan"></span>
        <slot ref="toggleButtonRef" name="textExpandButton" :toggle="toggle" :buttonType="buttonType"
            :isExpanded="expanded"></slot>
    </div>
</template>
<style scoped></style>

