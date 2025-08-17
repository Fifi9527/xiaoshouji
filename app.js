const messagesContainer = document.getElementById("messages");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// 添加消息到界面
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  messagesContainer.appendChild(msg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 模拟 AI 回复
function aiReply(userMsg) {
  const replies = [
    "我在呢~",
    "你说的很有意思 😏",
    "哈哈，这让我想起一件事…",
    "再多跟我聊聊吧~"
  ];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  setTimeout(() => addMessage(reply, "ai"), 800);
}

// 发送消息
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, "user");
  input.value = "";
  aiReply(text);
}

// 点击按钮发送
sendBtn.addEventListener("click", sendMessage);

// 回车发送
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// 测试加载成功
console.log("✅ app.js 已经加载成功");
