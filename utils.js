// 从网络获取数据，并存储到localStorage
const getPosts = async () => {
    const res = await fetch('/api/posts.json')
    const posts = await res.json()
    localStorage.setItem('posts', JSON.stringify(posts))
    return posts
}

// 过滤页面数据
export const getPage = async (num) => {
    const max = num * 10
    const min = max - 9
    const posts = localStorage.getItem('posts')

    if (posts === null) {
        const data = await getPosts()
        return data.filter(p => p.id >= min && p.id <= max)
    }

    return JSON.parse(posts).filter(p => p.id >= min && p.id <= max)
}

// 根据路由hash获取页码，默认返回 1
export const getCurrentPage = () => (location.hash.split('#')[1] || '1').split('-').map(Number)[0]

// 格式化日期工具
export const dateFormat = (timeStamp) => {
    const date = new Date(timeStamp * 1000);  // 参数需要毫秒数，所以这里将秒数乘于 1000
    const month = date.getMonth() + 1 < 10 ? (date.getMonth() + 1) : date.getMonth() + 1
    return date.getFullYear() + '年' + month + '月' + date.getDate() + '日';
}
