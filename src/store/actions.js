// 引入路由作页面跳转用
import router from '../router'

// 导出一个 post 事件，这里的用户参数是 { article, articleId }，article 包含文章标题和内容，articleId 是文章 ID 
export const post = ({ commit, state }, { article, articleId }) => {
  // 从仓库获取所有文章
  let articles = state.articles

  // 没有文章时，建一个空数组
  if (!Array.isArray(articles)) articles = []

  // 存在 article 时
  if (article) {
    // 因为是单用户，所以指定用户 ID 为 1  
    const uid = 1
    // 获取用户传过来的 title 和 content
    const { title, content } = article
    // 获取当前日期
    const date = new Date()

    // 如果没传 articleId，表示新建文章
    if (articleId === undefined) {
      // 获取最后一篇文章
      const lastArticle = articles[articles.length - 1]

      if (lastArticle) {
        // 将当前 articleId 在最后一篇文章的 articleId 基础上加 1  
        articleId = parseInt(lastArticle.articleId) + 1
      } else {
        // 将当前 articleId 在文章长度基础上加 1
        articleId = articles.length + 1
      }

      // 将当前文章添加到所有文章
      articles.push({
        uid,
        articleId,
        title,
        content,
        date
      })
    }else {
      for(let article of articles) {
        // 找到对应文章
        if(parseInt(article.articleId) === parseInt(articleId)) {
          // 对应文章标题 内容
          article.title = title
          article.content = content
          break
        }
      }
    }

    // 更新所有文章
    commit('UPDATE_ARTICLES', articles)
    // 跳转到首页，并附带 articleId 和 showMsg 参数，showMsg 用来指示目标页面显示一个提示
    router.push({ name: 'Content', params: { articleId, showMsg: true } })
  }else {
    for(let article of articles) {
      // 找到对应文章
      if(parseInt(article.articleId) === parseInt(articleId)) {
        console.log('aa')
        // 删除对应的文章
        articles.splice(articles.indexOf(article), 1)
        break
      }
    }

    commit('UPDATE_ARTICLES', articles)
    router.push({ name: 'Home', params: { showMsg: true } })
  }
}

// 参数 articleId 是文章 ID；isAdd 为 true 时点赞，为 false 时取消赞
export const like = ({ state, commit}, {articleId, isAdd}) => {
  // 仓库的文章
  let articles = state.articles
  // 点赞用户列表
  let likeUsers = []
  // 用户id 默认1
  const uid = 1
  if(!Array.isArray(articles)) articles = []
  for(let article of articles) {
    // 找到对应文章
    if(parseInt(article.articleId) === parseInt(articleId)) {

      // 获取点赞用户列表
      likeUsers = Array.isArray(article.likeUsers) ? article.likeUsers : likeUsers
      // 是否点赞
      if(isAdd) {
        // 判断用户是否已点赞
        const isAdded = likeUsers.some(likeUser => parseInt(likeUser.uid) === uid)
        if(!isAdded) {
          likeUsers.push({ uid })
        }
      }else {
        for (let likeUser of likeUsers) {
          // 找到对应点赞用户时
          if (parseInt(likeUser.uid) === uid) {
            // 删除点赞用户
            likeUsers.splice(likeUsers.indexOf(likeUser),1)
            console.log(likeUsers)
            break;
          }
        }
      }
      // 更新文章的点赞用户列表
      article.likeUsers = likeUsers
      break
    }
  }

  // 提交更新事件
  commit('UPDATE_ARTICLES',articles)
  // 返回点赞用户列表
  return likeUsers
}

export const comment = ({ commit, state },{ articleId, comment, commentId }) =>  {
  // 仓库文章获取
  let articles = state.articles
  // 评论列表
  let comments = []

  if(!Array.isArray(articles)) articles = []

  for(let article of articles) {
    // 获取到当前评论文章
    if(parseInt(article.articleId) === parseInt(articleId)) {
      // 更新评论列表
      comments = Array.isArray(article.comments) ? article.comments : comments
      console.log(commentId)
      if(comment) {
        // 获取用户评论内容 设置用户id为1
        const { uid = 1, content } = comment
        const date = new Date()

        // 判断评论列表 设置当前评论ID
        if(commentId === undefined) {
          const lastComment = comments[comments.length - 1]
          // 最新一条评论存在
          if(lastComment) {
            commentId = lastComment.commentId + 1
          }else {
            commentId = comments.length + 1
          }

          comments.push({
            uid,
            commentId,
            content,
            date 
          })
        }else{ // commentId不为空 则更新评论
          for (let comment of comments) {
            // 找到对应的评论时
            if (parseInt(comment.commentId) === parseInt(commentId)) {
              // 更新评论的内容
              comment.content = content
              break
            }
          }
        }
      }else { // 不存在评论内容时 删除评论
        for(let comment of comments) {
          if(parseInt(comment.commentId) === parseInt(commentId)) {
            comments.splice(comments.indexOf(comment),1)
            break
          }
        }
      }

      //更新文章列表
      article.comments = comments
      break
    }
  }

  commit('UPDATE_ARTICLES',articles)
  // 返回评论列表
  return comments
}