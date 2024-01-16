// 转化 md 语法为 html
import { marked } from 'marked'
// import { COLOR_LIST } from '@/utils/config'
import xss from 'xss'

export const translateMarkdown = (plainText, isGuardXss = false) => {
    return marked(isGuardXss ? xss(plainText) : plainText, {
        renderer: new marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: true,
        smartLists: true,
        smartypants: true,
        highlight: function (code) {
            /*eslint no-undef: "off"*/
            return hljs.highlightAuto(code).value
        }
    })
}
