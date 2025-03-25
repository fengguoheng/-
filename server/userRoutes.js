const express = require('express');
const router = express.Router();
const sequelize = require('./db');
const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2794840873',
    database: 'blogdb'
});
const SqlUser = sequelize.define('SqlUser', {
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true, // 确保邮箱地址唯一
        allowNull: false // 不允许为空
    }
}, {
    timestamps: false // 移除 createdAt 和 updatedAt 字段
});

sequelize.sync(); // 创建对应的表
router.post('/sqlLogin', async (req, res) => {
    const { username, password } = req.body;
    try {
        // 从 SQL 数据库中查找用户
        const user = await SqlUser.findOne({ where: { username, password } });
        const [rows] = await pool.execute('SELECT * FROM sqlusers WHERE username = ?', [username]);
        req.session.userId = rows[0].id; // 假设表中有 id 字段;
        req.session.username = rows[0].username;
        req.session.isLoggedIn = true;  // 标记用户已登录
        if (user) {
            // 生成 JWT
            const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
            req.session.user = { username: req.body.username, loggedIn: true };
            const a = req.session.user;
            const b = req.session.isLoggedIn;
            res.json({ success: true, message: 'SQL 数据库登录成功', token, a, username: req.body.username, id: user.id, b });
        } else {
            res.json({ success: false, message: 'SQL 数据库用户名或密码错误' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'SQL 数据库错误' });
    }
});
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    // 基本验证：检查字段是否为空
    if (!username || !password || !email) {
        return res.status(400).json({ success: false, message: '请填写完整信息' });
    }
    // 验证邮箱格式
    if (!isValidEmail(email)) {
        return res.status(400).json({ success: false, message: '请输入有效的邮箱地址' });
    }
    try {
        // 检查用户名是否已存在
        const existingUser = await SqlUser.findOne({ where: { username } });
        console.log(existingUser);
        if (existingUser) {
            return res.status(400).json({ success: false, message: '该用户名已被使用，请选择其他用户名' });
        }
        const existingEmailUser = await SqlUser.findOne({ where: { email } });
        console.log(existingEmailUser);
        if (existingEmailUser) {
            return res.status(400).json({ success: false, message: '该邮箱已被注册，请使用其他邮箱' });
        }
        await SqlUser.create({ username, password, email });
        // 将用户信息插入数据库
        res.json({ success: true, message: '注册成功' });
    } catch (error) {
        console.error('注册过程中出现数据库错误:', error);
        res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
    }
});
router.get('/getBlogs', async (req, res) => {
    try {
        const [row1] = await pool.execute('SELECT username, blogs FROM sqlusers;');
        row1.forEach(item => {
            const username = item.username;
            if (item.blogs) { // 检查 blogs 是否为 null 或 undefined
                item.blogs.forEach(blog => {
                    blog.username = username; // 添加属性
                });
            }
            delete item.username; // 删除原对象的 username
        });
        let allBlogs1 = [];
        row1.forEach(row => {
            const blogsArray = row.blogs;
            if (Array.isArray(blogsArray)) {
                allBlogs1 = allBlogs1.concat(blogsArray);
            }
        });
        allBlogs1.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        res.json(allBlogs1);
    } catch (error) {
        console.error('查询数据库出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// 处理获取用户博客的接口
router.get('/personBlogs/:username', async (req, res) => {
    const [row1] = await pool.execute('SELECT username, blogs FROM sqlusers WHERE username =?;', [req.params.username]);
    row1.forEach(item => {
        const username = item.username;
        if (Array.isArray(item.blogs)) {
            item.blogs.forEach(blog => {
                blog.username = username;
            });
        }
        delete item.username;
    });
    let allBlogs1 = [];
    row1.forEach(row => {
        const blogsArray = row.blogs;
        if (Array.isArray(blogsArray)) {
            allBlogs1 = allBlogs1.concat(blogsArray);
        }
    })
    let a = [];
    if (!allBlogs1[0]) {
        return res.json({ a });
    }
    a = allBlogs1.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);//.字体是根据对象的字段
    });
    res.json({ a });
});


router.post('/submitBlogs/:username', async (req, res) => {
    try {
        const { username } = req.params;

        const { title, content } = req.body;
        const newArticle = {
            title,
            content,
            date: new Date() // 将日期转换为 ISO 字符串格式
        };
        let a = JSON.stringify(newArticle);
        let b = [JSON.stringify(a)];

        let c = b;

        let d = c.map(item => item.replace(/\\/g, ''));

        const originalArray = d;
        const processedArray = originalArray.map(item => {
            item = item.trim().slice(1, -1);
            // 去掉转义字符
            return item.replace(/\\/g, '');
        });
        const jsonArrayString = `[ ${processedArray.join(', ')} ]`;
        const finalString = `'${jsonArrayString}'`;
        const newString = `${finalString.trim().replace(/\s*(\[|\])\s*/g, '$1')}`;
        const e = newString.slice(1, -1);
        const [rows] = await pool.execute(
            `UPDATE sqlUsers
        SET blogs = IF(
            blogs IS NULL,
            ?,
            JSON_MERGE_PRESERVE(blogs, ?)
        )
        WHERE username = ?`,
            [e, e, username]
        );
        if (rows.affectedRows === 0) {
            throw new Error('未找到对应的用户或更新失败');
        }
        // 返回成功响应
        res.status(200).json({ message: '文章提交成功', article: newArticle });
    } catch (error) {
        console.error('数据库操作出错:', error);
        res.status(500).json({ message: '文章提交失败，请稍后重试' });
    }
}),
    // ... 原有代码 ...

    router.delete('/deleteBlogsByTime', async (req, res) => {
        const { date } = req.body;
        try {
            // 使用临时表来避免直接引用目标表
            const subQuery = `
            SELECT 
                CONCAT('$[', JSON_UNQUOTE(JSON_SEARCH(JSON_EXTRACT(blogs, '$[*].date'), 'one', '${date}')), ']') as path
            FROM 
                sqlusers
            WHERE 
                JSON_SEARCH(blogs, 'one', '${date}') IS NOT NULL
            LIMIT 1
        `;

            const [tempRows] = await pool.execute(subQuery);
            const path = tempRows.length > 0 ? tempRows[0].path : null;

            if (path) {
                // 修正路径格式，确保没有多余的嵌套
                const validPath = path.replace(/\$\[\$\[/g, '$[').replace(/\]\]/g, ']');
                const [rows] = await pool.execute(
                    `UPDATE sqlusers SET blogs = JSON_REMOVE(blogs, '${validPath}') WHERE JSON_SEARCH(blogs, 'one', '${date}') IS NOT NULL;`
                );
                if (rows.affectedRows > 0) {
                    res.status(200).json({ message: ' 博客删除成功 ' });
                } else {
                    res.status(404).json({ message: ' 未找到指定日期的博客 ' });
                }
            } else {
                res.status(404).json({ message: ' 未找到指定日期的博客 ' });
            }
        } catch (error) {
            console.error(' 删除博客时出错:', error);
            res.status(500).json({ message: ' 删除博客时出错 ' });
        }
    });

// 添加评论接口
router.post('/addComment/:blogOwnerUsername/:blogDate', async (req, res) => {
    const { blogOwnerUsername, blogDate } = req.params;
    const decodedBlogOwnerUsername = decodeURIComponent(blogOwnerUsername);
    const { content, username: commenterUsername } = req.body;
    const decodedCommenterUsername = decodeURIComponent(commenterUsername);
    console.log('接收到的被评论博客所有者用户名:', decodedBlogOwnerUsername);
    console.log('接收到的评论者用户名:', decodedCommenterUsername);
    try {
        // 查询用户信息，同时获取 blogs 和 comments 列
        const [userRows] = await pool.execute(
            'SELECT blogs, comments FROM sqlusers WHERE username =?',
            [decodedBlogOwnerUsername]
        );
        if (!userRows[0]) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 尝试处理 blogs 数据，如果是 [object Object] 格式，初始化为空数组
        let blogs = userRows[0].blogs;
        if (typeof blogs === 'string' && blogs === '[object Object]') {
            blogs = [];
        } else if (typeof blogs === 'string') {
            try {
                blogs = JSON.parse(blogs);
            } catch (err) {
                blogs = [];
            }
        }

        // 尝试处理 comments 数据，如果是 [object Object] 格式，初始化为空数组
        let comments = userRows[0].comments;
        if (typeof comments === 'string' && comments === '[object Object]') {
            comments = [];
        } else if (typeof comments === 'string') {
            try {
                comments = JSON.parse(comments);
            } catch (err) {
                comments = [];
            }
        }

        // 查找目标博客，统一日期格式后比较
        const targetBlogIndex = blogs.findIndex(blog => {
            let storedDate;
            if (typeof blog.date === 'string') {
                storedDate = new Date(blog.date).toISOString();
            } else {
                storedDate = blog.date.toISOString();
            }
            const receivedDate = new Date(decodeURIComponent(blogDate)).toISOString();
            console.log('比较之前', storedDate, receivedDate);
            return storedDate === receivedDate;
        });
        if (targetBlogIndex === -1) {
            return res.status(404).json({ message: '博客不存在' });
        }


        // 创建新评论，使用评论者的 username
        const newComment = {
            date: new Date().toISOString(),
            content,
            blogDate,
            username: decodedCommenterUsername
        };
        if (comments === null || comments === undefined) {
            comments = [];
        }
        // 添加新评论到 comments 数组
        comments.push(newComment);

        // 更新数据库中的 blogs 和 comments 列
        const [updateRows] = await pool.execute(
            'UPDATE sqlusers SET blogs =?, comments =? WHERE username =?',
            [JSON.stringify(blogs), JSON.stringify(comments), decodedBlogOwnerUsername]
        );
        const [selectRows] = await pool.execute(
            'SELECT comments FROM sqlusers WHERE username =?',
            [decodedBlogOwnerUsername]
        );
        if (updateRows.affectedRows === 0) {
            throw new Error('更新失败');
        }
        console.log('更新之后的评论区', selectRows[0].comments);
        res.status(200).json({ message: '评论添加成功', comments: selectRows });
    } catch (error) {
        console.error('处理评论失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});

// 获取评论接口
router.get('/getComments', async (req, res) => {
    try {
        // 从所有用户中获取 comments 数据
        const [rows] = await pool.execute('SELECT username, comments FROM sqlusers');
        const allComments = [];
        rows.forEach(row => {
            const { username, comments: commentStr } = row;
            if (commentStr) {
                let comments;
                if (typeof commentStr === 'string' && commentStr === '[object Object]') {
                    comments = [];
                } else if (typeof commentStr === 'string') {
                    try {
                        comments = JSON.parse(commentStr);
                    } catch (err) {
                        comments = [];
                    }
                } else {
                    comments = commentStr;
                }
                comments.forEach(comment => {
                    comment.username = comment.username || username;
                    allComments.push(comment);
                });
            }
        });

        res.status(200).json(allComments);
    } catch (error) {
        console.error('获取评论失败:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
// 定义获取总点赞数的路由
router.get('/getTotalLikes/:username/:date', async (req, res) => {
    const { username, date } = req.params;
    try {
        // 执行 SQL 查询，这里假设点赞信息存储在 sqlusers 表的 isLiked 字段中
        const [rows] = await pool.execute(
            'SELECT * FROM sqlusers WHERE username =?',
            [username]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: '未找到相关博客信息' });
        }

        const isLiked = rows[0].isLiked;
        console.log('isLiked:', isLiked);
        let totalLikes = 0;
        let likedArray = isLiked;
        function formatDate(dateStr) {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        }


        const formattedDate = formatDate(date);


        if (!likedArray) {
            likedArray = [];
        }
        let updatedIsLiked = likedArray;
        if (isLiked === null || isLiked === undefined) {
            return res.status(200).json({ number: 0 });
        }
        updatedIsLiked = isLiked.map(obj => ({
            ...obj,
            date: formatDate(obj.date)
        }));
        console.log(updatedIsLiked[0].date);
        console.log(formattedDate);
        console.log(updatedIsLiked[0].date == formattedDate);
        console.log(updatedIsLiked[0].date === formattedDate);
        for (let i = 0; i < updatedIsLiked.length; i++) {
            const obj = updatedIsLiked[i];
            // 将 obj.date 和 date 转换为 Date 对象
            const objDate = new Date(obj.date);
            const targetDate = new Date(formattedDate);

            // 比较两个 Date 对象的时间戳是否相等
            if (objDate.getTime() === targetDate.getTime()) {
                totalLikes++;
            }
        }

        res.status(200).json({ number: totalLikes });
    } catch (error) {
        console.error('获取总点赞数失败:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});
// 处理添加点赞的路由
router.post('/addLike/:blogUsername/:blogDate', async (req, res) => {
    const { blogUsername, blogDate } = req.params;
    const { likeUsername } = req.body;

    try {
        // 检查该用户是否已经点过赞（假设点赞记录存储在 likes 表中）
        const checkQuery = 'SELECT * FROM sqlusers WHERE username =? ';
        let [checkResult] = await pool.execute(checkQuery, [blogUsername]);
        console.log(checkResult);
        if (!checkResult[0].isLiked) {
            checkResult[0].isLiked = [];

        }
        console.log(checkResult[0].isLiked);
        const isAlreadyLiked = checkResult[0].isLiked.some(item => item.likeUsername === likeUsername && item.date === blogDate);
        console.log(isAlreadyLiked);
        if (isAlreadyLiked) {
            return res.status(400).json({ message: '你已经点过赞了', number: checkResult[0].isLiked.length });
        }

        const newLike = {
            date: blogDate,
            likeUsername: likeUsername
        };

        // 将新的点赞对象添加到数组中
        checkResult[0].isLiked.push(newLike);
        // 更新数据库中的 isLike 字段
        const updateQuery = 'UPDATE sqlusers SET isLiked =? WHERE username =?';
        await pool.execute(updateQuery, [checkResult[0].isLiked, blogUsername]);
        [checkResult] = await pool.execute(checkQuery, [blogUsername]);
        function calculateTotalLikes(checkResult, blogDate) {
            return checkResult[0].isLiked.filter(item => item.date === blogDate).length;
        }

        const totalLikes = calculateTotalLikes(checkResult, blogDate);
        res.status(200).json({ message: '点赞成功', totalLikes: totalLikes });
    } catch (error) {
        console.error('处理点赞请求失败:', error);
        res.status(500).json({ message: '服务器内部错误' });
    }
});

// 定义搜索接口
router.get('/search', async (req, res) => {
    const { keyword } = req.query;
    if (!keyword) {
        return res.status(400).json({ error: '请提供搜索关键词' });
    }
    try {
        // 假设 sqlusers 表中有 username 和 blogs 列，blogs 列存储 JSON 格式数据
        const [rows] = await pool.execute('SELECT username, blogs FROM sqlusers');
        if (!rows) {
            return res.status(404).json({ error: '没有查询到相关数据' }); // 添加这行检查
        }
        const allBlogs = [];
        // 处理每一行数据，将 blogs 列的 JSON 数据解析并合并到 allBlogs 数组中
        rows.forEach(row => {
            let blogData = row.blogs;
            if (!blogData)
                blogData = [];
            blogData.forEach(blog => {
                blog.username = row.username;
                allBlogs.push(blog);
            });
        });

        // 根据关键词进行模糊匹配，匹配date、title、content、username字段
        const searchResults = allBlogs.filter(blog => {
            const lowerKeyword = keyword.toLowerCase();
            return (
                blog.date.toLowerCase().includes(lowerKeyword) ||
                blog.title.toLowerCase().includes(lowerKeyword) ||
                blog.content.toLowerCase().includes(lowerKeyword) ||
                blog.username.toLowerCase().includes(lowerKeyword)
            );
        });

        res.json(searchResults);
    } catch (error) {
        console.error('查询数据库或处理数据错误:', error);
        return res.status(500).json({ error: '查询数据库或处理数据错误' });
    }
});
// 新增获取好友列表的接口
router.post('/getFriends', async (req, res) => {
    const { username } = req.body;
    try {
        const [rows] = await pool.execute('SELECT friends FROM sqlusers WHERE username =?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '未找到该用户' });
        }
        const friends = rows[0].friends;
        let parsedFriends = [];
        if (friends) {
            try {
                parsedFriends = friends;
            } catch (error) {
                console.error('解析好友数据出错:', error);
                return res.status(500).json({ error: '解析好友数据出错' });
            }
        }
        res.json({ friends: parsedFriends });
    } catch (error) {
        console.error('获取好友列表时数据库出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// 新增获取用户博客列表的接口
router.get('/getUserBlogs/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const [rows] = await pool.execute('SELECT blogs FROM sqlusers WHERE username =?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '未找到该用户的博客' });
        }
        const blogs = rows[0].blogs;
        let parsedBlogs = [];
        if (blogs) {
            try {
                parsedBlogs = blogs;
            } catch (error) {
                console.error('解析博客数据出错:', error);
                return res.status(500).json({ error: '解析博客数据出错' });
            }
        }
        res.json({ blogs: parsedBlogs });
    } catch (error) {
        console.error('获取用户博客列表时数据库出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
router.post('/addFriend', async (req, res) => {
    const { username, goalUsername } = req.body;
    if (!username || !goalUsername) {
        return res.status(400).json({ error: '缺少必要参数' });
    }
    try {
        const [rows] = await pool.execute('SELECT friendsApply FROM sqlusers WHERE username =?', [goalUsername]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '目标用户不存在' });
        }
        let friendsApply = rows[0].friendsApply;
        if (!friendsApply) {
            friendsApply = [];
        } else {
            try {
                friendsApply = friendsApply;
            } catch (error) {
                console.error('解析friendsApply数据出错:', error);
                return res.status(500).json({ error: '解析数据出错' });
            }
        }
        const newApply = { username, isReplied: false };
        friendsApply.push(newApply);
        await pool.execute('UPDATE sqlusers SET friendsApply =? WHERE username =?', [friendsApply, goalUsername]);
        res.json({ message: '好友申请已发送' });
    } catch (error) {
        console.error('处理好友申请时数据库出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// 获取好友申请列表的接口
router.get('/getApplys/:username', async (req, res) => {
    const { username } = req.params;
    try {
        // 从数据库中查询该用户的好友申请列表
        const [rows] = await pool.execute('SELECT friendsApply FROM sqlusers WHERE username =?', [username]);
        if (rows.length === 0) {
            // 如果未找到该用户，返回404错误
            return res.status(404).json({ error: '未找到该用户' });
        }
        let friendApplys = rows[0].friendsApply;
        if (!friendApplys) {
            // 如果好友申请列表为空，设置为空数组
            friendApplys = [];
        } else {
            try {
                // 尝试将存储的JSON字符串解析为JavaScript数组
                friendApplys = friendApplys;
            } catch (error) {
                console.error('解析好友申请数据出错:', error);
                // 解析失败，返回500错误
                return res.status(500).json({ error: '解析数据出错' });
            }
        }
        // 返回好友申请列表
        res.json({ friendApplys });
    } catch (error) {
        console.error('获取好友申请时数据库出错:', error);
        // 数据库操作出错，返回500错误
        res.status(500).json({ error: '服务器内部错误' });
    }
});
router.post('/updateFriendApply', async (req, res) => {
    const { currentUsername, friendUsername, status } = req.body;
    try {
        // 从数据库中获取当前用户的 friendApplys 数据
        const [rows] = await pool.query('SELECT friendsApply FROM sqlusers WHERE username =?', [currentUsername]);
        if (rows.length === 0) {
            return res.status(404).json({ error: '用户未找到' });
        }
        let friendApplys = rows[0].friendsApply; // 假设 friendApplys 字段存储的是 JSON 字符串

        if (!friendApplys)
            friendApplys = [];
        console.log(friendApplys);

        // 将 JSON 字符串解析为数组
        if (typeof friendApplys ==='string') {
            friendApplys = JSON.parse(friendApplys);
        }

        // 遍历并更新对应的 isReplied 值
        const updatedFriendApplys = friendApplys.map(friendApply => {
            if (friendApply.username === friendUsername) {
                friendApply.isReplied = status;
            }
            return friendApply;
        });
        console.log(updatedFriendApplys);
        console.log(typeof(updatedFriendApplys));
        const updatedFriendApplysJson = JSON.stringify(updatedFriendApplys);

        // 将更新后的数据写回到数据库
        await pool.query('UPDATE sqlusers SET friendsApply =? WHERE username =?', [updatedFriendApplysJson, currentUsername]);

        // 查询指定好友的 friends 列
        const [friendRows] = await pool.query('SELECT friends FROM sqlusers WHERE username =?', [friendUsername]);
        if (friendRows.length === 0) {
            return res.status(404).json({ error: `好友 ${friendUsername} 未找到` });
        }
        let friends = friendRows[0].friends;
        if (!friends) {
            friends = [];
        }

        // 将 JSON 字符串解析为数组
        if (typeof friends ==='string') {
            friends = JSON.parse(friends);
        }

        // 将当前用户的名字添加到 friends 列
        if (!friends.includes(currentUsername)) {
            friends.push(currentUsername);
        }

        const updatedFriendsJson = JSON.stringify(friends);

        // 将更新后的 friends 数据写回到数据库
        await pool.query('UPDATE sqlusers SET friends =? WHERE username =?', [updatedFriendsJson, friendUsername]);

        // 查询当前用户的 friends 列
        const [currentUserRows] = await pool.query('SELECT friends FROM sqlusers WHERE username =?', [currentUsername]);
        if (currentUserRows.length === 0) {
            return res.status(404).json({ error: `当前用户 ${currentUsername} 的好友列表未找到` });
        }
        let currentUserFriends = currentUserRows[0].friends;
        if (!currentUserFriends) {
            currentUserFriends = [];
        }

        // 将 JSON 字符串解析为数组
        if (typeof currentUserFriends ==='string') {
            currentUserFriends = JSON.parse(currentUserFriends);
        }

        // 将 friendUsername 添加到当前用户的 friends 数组
        if (!currentUserFriends.includes(friendUsername)) {
            currentUserFriends.push(friendUsername);
        }

        const updatedCurrentUserFriendsJson = JSON.stringify(currentUserFriends);

        // 将更新后的当前用户的 friends 数据写回到数据库
        await pool.query('UPDATE sqlusers SET friends =? WHERE username =?', [updatedCurrentUserFriendsJson, currentUsername]);

        res.status(200).json({ message: '好友申请状态和好友列表更新成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});
// 定义 /getMessage/:username 接口，接收路径参数username
router.get('/getMessage/:username', async (req, res) => {
    const username = req.params.username;
    try {
        // 假设从数据库的某个表（例如 sqlusers 表）中根据username查询数据
        const query = 'SELECT comments, isLiked, friendsApply FROM sqlusers WHERE username =?';
        const [rows] = await pool.query(query, [username]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('获取消息时数据库查询出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

module.exports = router;
