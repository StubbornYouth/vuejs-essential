// 返回添加用户信息后的所有文章
// 派生状态 computedArticles 基于 articles，返回添加用户信息后的所有文章。在需要的地方，我们可以使用 store.getters.computedArticles 来代替 store.state.articles
export const computedArticles = (state) => {
  let articles = state.articles
  let newArticles = []

  // 添加用户信息，参数 isCurrentUser 代表是否是当前用户
  const addUserInfo = function(isCurrentUser) {
    const userName = state.user && state.user.name
    const userAvatar = state.user && state.user.avatar
    const avatarUrl = 'https://picsum.photos/200'

    // 是当前用户时，设置用户数据为当前用户的信息
    if (isCurrentUser) {
      this.uname = userName
      this.uavatar = userAvatar
    } else {
      // 不是当前用户时，设置用户数据为对象里用户的信息
      this.uavatar = `${avatarUrl}?${this.uname}`
    }
  }

  if (Array.isArray(articles)) {
    // 深拷贝 articles 以不影响其原值
    newArticles = JSON.parse(JSON.stringify(articles))
    newArticles.forEach((article) => {
      const comments = article.comments
      const likeUsers = article.likeUsers

      // 添加用户信息到文章
      if (article.uid === 1) {
        addUserInfo.call(article, true)
      } else {
        addUserInfo.call(article)
      }

      // 添加用户信息到评论
      if (Array.isArray(comments)) {
        comments.forEach((comment) => {
          if (comment.uid === 1) {
            addUserInfo.call(comment, true)
          } else {
            addUserInfo.call(comment)
          }
        })
      }

      // 添加用户信息到点赞
      if (Array.isArray(likeUsers)) {
        likeUsers.forEach((likeUser) => {
          if (likeUser.uid === 1) {
            addUserInfo.call(likeUser, true)
          } else {
            addUserInfo.call(likeUser)
          }
        })
      }
    })
  }
  return newArticles
}

// 根据uid 返回用户文章 参数user 为用户名称
// Getter 的第一个参数是 state，通过它可以访问仓库的状态，它的第二个参数是 getters，通过它可以访问仓库的派生状态
export const getArticlesByUid  = (state,getters) => (uid,user) => {
  // 使用派生状态 的文章
  let articles = getters.computedArticles

  if(Array.isArray(articles)) {
    if(user) { // 有指定用户名
      for(let article of articles) {
        if(article.uname === user) {
          //指定uid 为 文章中的uid
          uid = article.uid
          break
        }
      }
    }
    // 返回相同uid 的文章
    // articles = articles.filter(article => parseInt(uid) === parseInt(article.uid))
    articles = articles.filter(article => parseInt(uid) === parseInt(article.uid))

  }else {
    articles = []
  }

  return articles
}

// 派生状态 getArticlesByFilter 基于 computedArticles，返回各种过滤或者排序后的文章。在需要的地方，我们可以使用 store.getters.getArticlesByFilter 来进行访问
// 返回使用 filter 参数过滤后的所有文章
export const getArticlesByFilter = (state, getters) => (filter) => {
  // 使用派生状态 computedArticles 作为所有文章
  let articles = getters.computedArticles
  let filteredArticles = []

  if (Array.isArray(articles)) {
    // 深拷贝 articles 以不影响其原值
    filteredArticles = articles.map(article => ({ ...article }))

    switch(filter) {
      case 'excellent':
        // 将当前用户的文章设置为精华文章
        filteredArticles = getters.getArticlesByUid(1)
        break
      case 'vote':
        // 将赞的最多的文章排在前面
        filteredArticles.sort((a, b) => {
          const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
          const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

          return blikeUsers.length - alikeUsers.length
        })

        break
      case 'recent':
        // 将最新写的文章排在前面
        filteredArticles.reverse()
        break
      case 'noreply':
        // 将评论最少的文章排在前面
        filteredArticles.sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments : []
          const bComments = Array.isArray(b.comments) ? b.comments : []

          return aComments.length - bComments.length
        })

        break
      default:
        // 默认将回复时间最新的文章排在前面
        filteredArticles.sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments : []
          const bComments = Array.isArray(b.comments) ? b.comments : []
          const aCommentsLength = aComments.length
          const bCommentsLength = bComments.length

          if (aCommentsLength > 0) {
            if (bCommentsLength > 0) {
              return new Date(bComments[bCommentsLength - 1].date) - new Date(aComments[aCommentsLength - 1].date)
            } else {
              return -1
            }
          } else {
            return 1
          }
        })

        break
    }
  }

  return filteredArticles
}

// 根据关键字 keyword 返回搜索结果 添加 filter 参数，以按指定方式排序
export const getArticlesByKeyword = (state, getters) => (keyword, filter) => {
  let articles = getters.computedArticles
  let results = []

  if (Array.isArray(articles)) {
    articles.forEach((article) => {
      let { articleId, title, content } = article
      const regex = new RegExp(`(${keyword})`, 'gi')

      if (title.indexOf(keyword) !== -1 || content.indexOf(keyword) !== -1) {
        const url = `${state.origin}/articles/${articleId}/content`
        title = title.replace(regex, '<span class="highlight">$1</span>')
        content = content.substr(0, 100).replace(regex, '<span class="highlight">$1</span>')
        results.push({...article, ...{ url, title, content }})
      }
    })
  }

  // 评估排序方式
  switch (filter) {
    case 'vote':
      // 将赞的最多的文章排在前面
      results.sort((a, b) => {
        const alikeUsers = Array.isArray(a.likeUsers) ? a.likeUsers : []
        const blikeUsers = Array.isArray(b.likeUsers) ? b.likeUsers : []

        return blikeUsers.length - alikeUsers.length
      })

      break
    default:
      // 默认将标题中含有关键字的文章排在前面
      results.sort((a, b) => -(a.title.indexOf(keyword)) + b.title.indexOf(keyword))
      break
  }

  return results
}