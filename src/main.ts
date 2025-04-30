import { createApp } from "vue";
import "./style.css";
import TextClampPlugin from './package/index';
import App from "./App.vue";

// 导入highlightjs相关内容
import 'highlight.js/styles/atom-one-dark.css'
import hljs from 'highlight.js/lib/core'
import hljsVuePlugin from '@highlightjs/vue-plugin'

// 注册所需语言
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

// 自定义Vue语言定义
hljs.registerLanguage('vue', function(hljs) {
  return {
    name: 'Vue',
    subLanguage: ['xml', 'javascript', 'typescript', 'css'],
    contains: [
      hljs.COMMENT('<!--', '-->', {
        relevance: 10
      })
    ]
  }
})

// 配置highlight.js
hljs.configure({
    ignoreUnescapedHTML: true,
    languages: ['javascript', 'typescript', 'xml', 'css', 'vue']
})

const app = createApp(App);
app.use(TextClampPlugin);
app.use(hljsVuePlugin);
app.mount("#app");
