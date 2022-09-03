// 渲染页面节点
import {dateFormat, getCurrentPage, getPage} from "./utils.js";

let currentPage = getCurrentPage()

export const renderPage = (data, index = 0) => {
    const card = document.createElement('div')
    const title = document.createElement('a')
    const content = document.createElement('p')
    const img = document.createElement('img')
    const wrapper = document.getElementById('wrapper')
    card.className = 'card'
    title.className = 'post-detail'
    content.className = 'content'
    img.setAttribute('loading', 'lazy')
    img.setAttribute('onerror', "this.style.display='none';")
    const renderNode = (item) => {
        const cardNode = card.cloneNode()
        const titleNode = title.cloneNode()
        const contentNode = content.cloneNode()
        const imgNode = img.cloneNode()
        titleNode.innerText = item.id + '、' + dateFormat(item.date)
        const num = item.id % 10 == 0 ? 10 : item.id % 10
        titleNode.href = `#${currentPage}-${num}`
        titleNode.id = `post-${num}`
        contentNode.innerText = item.content
        const src = `/static/images/post_${item.id}.webp`
        imgNode.setAttribute('src', src)
        cardNode.appendChild(titleNode)
        cardNode.appendChild(contentNode)
        cardNode.appendChild(imgNode)
        wrapper.appendChild(cardNode)
    }
    if (index) {
        renderNode(data[index - 1])
        return;
    }
    data.forEach(item => {
        renderNode(item)
    })
}

// 初始化页面
export const initPage = async (pageNum, currentPost) => {
    document.getElementById('wrapper').innerHTML = ''
    const responseData = await getPage(pageNum)

    if (currentPost) {
        renderPage(responseData, currentPost)
        document.getElementById('nav').innerHTML = ''
        return;
    }
    renderPage(responseData)
    initNav(responseData)
    // 翻页后跳转到顶部
    window.scrollTo(1000, 0)

}
// 初始化导航
export const initNav = (data) => {
    const anchor = document.createElement('a')
    const navNode = document.getElementById('nav')
    navNode.innerHTML = ''

    for (let i = 0; i < data.length; i++) {
        const anchorNode = anchor.cloneNode()
        anchorNode.innerText = dateFormat(data[i].date)
        anchorNode.setAttribute('onclick', `setActive(this);toPost(${i + 1})`)
        navNode.appendChild(anchorNode)
    }
}

// 右侧边栏
export const renderSideBar = () => {
    const option = document.createElement('option')
    const selectionNode = document.getElementById('selection')
    for (let i = 1; i <= 29; i++) {
        const optionNode = option.cloneNode()
        optionNode.value = i
        optionNode.innerText = i
        selectionNode.appendChild(optionNode)
    }
}
// 单条博文翻页按钮
export const postPagination = (currentPage, currentPost) => {
    document.getElementById('page-bar').style.display = 'none'
    const wrapper = document.getElementById('wrapper')
    const prevPost = document.createElement('span')
    const nextPost = prevPost.cloneNode()
    prevPost.className = 'arrow post-prev'
    nextPost.className = 'arrow post-next'
    prevPost.innerText = '◁'
    nextPost.innerText = '▷'
    wrapper.appendChild(prevPost)
    wrapper.appendChild(nextPost)

    const prevPostHash = () => {
        if (currentPost === 1 && currentPage === 1) {
            return `#1-1`
        } else if (currentPost === 1) {
            currentPage--
            currentPost = 10
        } else {
            currentPost--
        }

        return `#${currentPage}-${currentPost}`
    }
    const nextPostHash = () => {
        if (currentPost === 10) {
            currentPage++
            currentPost = 1
        } else if (currentPage === 29 && currentPost === 1) {
            return `#29-1`
        } else {
            currentPost++
        }

        return `#${currentPage}-${currentPost}`
    }

    prevPost.onclick = () => location.hash = prevPostHash()
    nextPost.onclick = () => location.hash = nextPostHash()
}

export const renderByHash = (hash) => {
    // 根据哈希内容改变页码
    const [curPage, curPost] = hash.split('-').map(Number)

    if (curPost) {
        initPage(curPage, curPost)
        // 渲染并监听博文上下翻页按钮
        postPagination(curPage, curPost)
    } else {
        initPage(curPage)
    }
}
