/************** 数据初始化 **************/
let friends = [
  { id: 1, name: "AI助手", avatar: "👩💻", unread: 2 }
];

let emojis = [
  { symbol: "😀", desc: "开心" },
  { symbol: "👍", desc: "点赞" },
  { symbol: "❤️", desc: "爱心" },
  { symbol: "😂", desc: "大笑" }
];

/************** 模拟 API 模块（fakeApi）**************/
const fakeApi = (function () {
  let posts = [
    {
      id: 1,
      friendId: 1,
      content: "这是我的第一条朋友圈",
      images: ["https://placekitten.com/200/200"],
      likes: 5,
      liked: false,
      comments: [{ id: 1, friendId: 1, text: "自拍不错" }],
      author: "AI助手",
      isAi: true,
      timestamp: Date.now() - 1000 * 60 * 30 // 30分钟前
    }
  ];

  function getPosts() {
    return posts.sort((a, b) => b.timestamp - a.timestamp);
  }

  function addPost(content, images = []) {
    const newPost = {
      id: Date.now(),
      friendId: 1,
      content,
      images,
      likes: 0,
      liked: false,
      comments: [],
      author: "你",
      isAi: false,
      timestamp: Date.now()
    };
    posts.push(newPost);
    setTimeout(() => simulateAiReaction(newPost), 2000);
    return newPost;
  }

  function simulateAiReaction(userPost) {
    const reactions = [
      () => {
        const post = posts.find(p => p.id === userPost.id);
        if (post) {
          post.likes += 1;
        }
      },
      () => {
        const post = posts.find(p => p.id === userPost.id);
        if (post) {
          post.comments.push({
            id: Date.now(),
            friendId: 1,
            text: "哇，你说得很有意思呢～",
            author: "AI助手",
            isAi: true
          });
        }
      }
    ];
    reactions[Math.floor(Math.random() * reactions.length)]();
  }

  function addAiPost() {
    const aiThoughts = [
      "今天天气不错呢～",
      "我在学习怎么更好地帮助你 😊",
      "你最近还好吗？",
      "刚刚看到一个很有趣的知识点，想分享给你！",
      "记得多喝水哦～"
    ];
    const content = aiThoughts[Math.floor(Math.random() * aiThoughts.length)];
    const newAiPost = {
      id: Date.now(),
      friendId: 1,
      content,
      images: [],
      likes: 0,
      liked: false,
      comments: [],
      author: "AI助手",
      isAi: true,
      timestamp: Date.now()
    };
    posts.push(newAiPost);
  }

  return { getPosts, addPost, addAiPost };
})();

/************** 工具函数 **************/
function getAllEmojis() {
  return emojis;
}

function insertEmoji(symbol) {
  const input = document.getElementById('chat-input');
  input.value += symbol;
  input.focus();
}

function clearUnread(friendId) {
  const f = friends.find(f => f.id === friendId);
  if (f) f.unread = 0;
}

function checkNotifications() {
  // 可扩展
}

/************** 渲染主界面 **************/
function renderHome() {
  document.getElementById('app').innerHTML = `
    <div style="position:relative; height:100vh; background:#fafafa">
      <button onclick="renderApiSettings()" 
        style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:20px;color:#333;z-index:10">
        ⚙️
      </button>
      <button onclick="renderAddFriend()" 
        style="position:absolute;top:10px;left:10px;background:none;border:none;font-size:20px;color:#333;z-index:10">
        👥
        ${friends.some(f => f.unread > 0) ? '<span class="unread-badge">!</span>' : ''}
      </button>

      <div style="padding:60px 10px 10px; height:calc(100vh - 60px); display:flex; flex-direction:column; justify-content:center;">
        <button onclick="renderChat(1)" class="wechat-green" 
          style="width:100%;margin-bottom:15px;font-size:18px;padding:15px">
          💬 开始聊天
        </button>
        <button onclick="renderMoments()" class="wechat-green" 
          style="width:100%;font-size:18px;padding:15px">
          📸 朋友圈
        </button>
      </div>
    </div>
  `;
}

/************** 聊天相关 **************/
function renderChat(friendId) {
  const friend = friends.find(f => f.id === friendId);
  if (!friend) return;

  friend.unread = 0;

  document.getElementById('app').innerHTML = `
    <div style="height:100vh; background:#f5f5f5; display:flex; flex-direction:column">
      <div class="chat-header wechat-green" style="padding:10px;display:flex;justify-content:space-between;align-items:center">
        <button onclick="renderHome()" style="background:none;border:none;color:white">←</button>
        <h3 style="margin:0;color:white">${friend.name}</h3>
        <button onclick="renderFriendSettings(${friendId})" style="background:none;border:none;color:white">⚙️</button>
      </div>

      <div id="messages" style="flex:1;overflow-y:auto;padding:10px;background:#f9f9f9"></div>

      <div style="display:flex; padding:8px; background:white; align-items:center; border-top:1px solid #ddd">
        <button onclick="toggleEmojiPanel()" style="font-size:20px;background:none;border:none">😊</button>
        <input id="chat-input" type="text" placeholder="输入消息..." 
          style="flex:1;margin:0 8px;padding:10px;border:1px solid #ccc;border-radius:20px">
        <button onclick="sendMessage(${friendId})" class="wechat-green" style="margin-left:5px;padding:10px 15px;border-radius:20px">发送</button>
      </div>

      <div id="emoji-panel" class="emoji-panel">
        ${getAllEmojis().map(e => `
          <span onclick="insertEmoji('${e.symbol}')" 
            style="font-size:24px;margin:5px;cursor:pointer" title="${e.desc}">${e.symbol}</span>
        `).join('')}
      </div>
    </div>
  `;

  loadMessages(friendId);
}

function loadMessages(friendId) {
  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML = `<div class="message ai">你好！我是 AI 助手，有什么可以帮你的吗？</div>`;
}

function sendMessage(friendId) {
  const input = document.getElementById('chat-input');
  const content = input.value.trim();
  if (!content) return;

  const messagesDiv = document.getElementById('messages');
  messagesDiv.innerHTML += `<div class="message user">${content}</div>`;
  input.value = '';
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  setTimeout(() => {
    const reply = `收到你的消息：“${content}”，我是 AI，已记录！`;
    messagesDiv.innerHTML += `<div class="message ai">${reply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 1000);
}

function toggleEmojiPanel() {
  const panel = document.getElementById('emoji-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

/************** 朋友圈相关 **************/
function renderMoments() {
  const posts = fakeApi.getPosts();

  document.getElementById('app').innerHTML = `
    <div style="height:100vh; background:#f5f5f5">
      <div class="chat-header wechat-green" style="padding:10px;background:#07C160;color:white">
        <button onclick="renderHome()" style="background:none;border:none;color:white">←</button>
        <h3 style="margin:0;text-align:center">朋友圈</h3>
      </div>

      <div style="padding:10px">
        <button onclick="renderNewPost()" class="wechat-green" style="width:100%;padding:12px;margin-bottom:15px">
          ＋ 发布动态
        </button>

        ${posts.map(post => `
          <div class="post">
            <div style="display:flex;align-items:center">
              <span style="font-size:24px">${post.isAi ? '🤖' : '👤'}</span>
              <strong style="margin-left:8px">${post.author}</strong>
            </div>
            <p>${post.content}</p>
            ${post.images && post.images.length ? `<img src="${post.images[0]}" style="width:100%; margin-top:8px; border-radius:8px">` : ''}
            <div style="margin-top:8px;color:#888">
              <span>❤️ ${post.likes} 赞</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderNewPost() {
  const content = prompt("分享你的动态：");
  if (!content) return;

  fakeApi.addPost(content);
  alert("✅ 动态已发布！AI 可能很快会回应哦～");
  renderMoments();
}

/************** 其它 UI（可扩展）**************/
function renderApiSettings() {
  const interval = prompt("设置朋友圈自动刷新间隔（秒，如 10、30、60）：", "10");
  if (!interval) return;

  const seconds = parseInt(interval, 10);
  if (isNaN(seconds) || seconds < 1) {
    alert("请输入有效的数字（如 10）");
    return;
  }

  if (window.refreshInterval) clearInterval(window.refreshInterval);

  window.refreshInterval = setInterval(() => {
    console.log("🔄 刷新朋友圈...");
    renderMoments();
  }, seconds * 1000);

  alert(`✅ 已设置每 ${seconds} 秒自动刷新朋友圈`);
}

function renderAddFriend() {
  alert("添加好友功能（待开发 😊）");
}

function renderFriendSettings(friendId) {
  alert("聊天设置（待开发 😊）");
}
