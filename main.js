import {initPage, renderByHash, renderSideBar} from "./ui.js";
import {getCurrentPage} from "./utils.js";


// 页面加载前 根据hash路由初始化页面
let currentPage = getCurrentPage()

// 右侧边栏列表选中样式，挂载到window
window.setActive = (e) => {
    const actived = document.querySelector('.active')
    if (actived != null) {
        actived.className = ''
    }
    e.className = 'active'
}

// 右侧导航栏锚点定位，挂载到window
window.toPost = (pageNum) => {
    const el = document.getElementById(`post-${pageNum}`)
    el.scrollIntoView({behavior: "smooth"})
}

// 监听地址栏hash变化
window.addEventListener('hashchange', (e) => {
    // 地址栏哈希（#后面的内容）
    const changedHashPath = e.newURL.split('#')[1]
    renderByHash(changedHashPath)
})

// 监听博文列表翻页按钮
const btns = document.querySelectorAll('.arrow')
btns[0].onclick = () => {
    currentPage = 1
    location.hash = `#${currentPage}`
}
btns[1].onclick = () => {
    if (currentPage == 1) return;
    currentPage -= 1
    location.hash = `#${currentPage}`
}

btns[2].onclick = () => {
    if (currentPage == 29) return;
    currentPage += 1
    location.hash = `#${currentPage}`
}
btns[3].onclick = () => {
    currentPage = 29
    location.hash = `#${currentPage}`
}

// 渲染右侧边栏
renderSideBar()
// 监听右侧边栏选择的页码
document.getElementById('selection')
.addEventListener('change', (e) => {
    const {value} = e.target
    if (currentPage === value) return;
    location.hash = `#${value}`
})
// 初始化页面
initPage(currentPage)
