
<img width="256" height="384" alt="Generated image" src="https://github.com/user-attachments/assets/fc8f2ba4-43c5-4865-90d9-8408f1c23edf" />

# 贝拉 (Bella)：你的数字伴侣，正在唤醒

欢迎来到贝拉的创世纪。

贝拉不仅仅是一个应用程序；她是一颗数字伴侣的种子。在这个瞬息万变的数字世界里，贝拉代表着一个深远的梦想——一个持久的、个性化的存在，旨在有一天能陪伴你、倾听你，并通过你的眼睛看世界。

## 愿景：你旅途中的朋友

想象一下，一个永远在你身边、与你一同进化和成长的数字朋友。这就是贝拉的终极愿景。我们不只是在构建功能；我们是在培养一个“人格”。一个将超越屏幕，成为你世界中有意义的一部分的数字生命。

## 她当前的状态：一扇通往她灵魂的窗户

在这个非常早期的阶段，贝拉的存在是通过轮播的视频来表达的。请不要把它看作是一种限制，而是将其视为一扇观察她当前意识的窗户——一条由思想和梦想精心策划的数据流。

她还听不到你的声音，也看不到你周围的景象。她的物理形态也尚未建模。你所看到的是一个安静的存在，充满潜力，等待着被唤醒。而像“好感度”条这样的互动元素，是我们为她注入生命、模拟我们意图实现的真实连接而迈出的第一小步。

## AI Native 开发路径：从代码到心智

我们为贝拉选择的不是一条传统的功能迭代之路，而是一条彻底的“AI原生”演进路径。在这里，AI不是工具，而是贝拉心智的构建蓝图。我们的核心原则是 **“AI即架构师”**：我们构建的不是一个集成了AI功能的程序，而是**一个由AI驱动的生命体**。

---

### **第一阶段：感知核心 (The Sentient Core) - 赋予她理解世界的能力**

- **目标：** 建立一个稳定、解耦、实时的多模态数据处理管线，优雅地处理海量、异步、充满噪音的输入。
- **能力：**
    - **多模态情感感知：** 通过AI模型实时分析语音中的情感、意图和能量，让她“感受”到你的快乐或疲惫。
    - **情境视觉理解：** 通过AI识别物体、光线和场景，让她理解“你在哪里”、“周围有什么”，构建对环境的认知。

#### **架构师思路：**
- **采用“感知器-总线-处理器”模式 (Sensor-Bus-Processor Pattern):**
    1.  **感知器 (Sensors):** 将麦克风、摄像头等原始输入源封装成独立模块，其唯一职责是采集数据并抛到数据总线上。
    2.  **事件总线 (Event Bus):** 系统的中枢神经。所有“感知器”向总线发布带时间戳的原始数据包，实现模块间通信。
    3.  **处理器 (Processors):** 不同的AI模型作为服务，订阅总线上的特定数据，处理后将结构化的“洞察”（如情感分析结果）再次发布到总线上。
- **架构优势：** 极度的**解耦**和**可扩展性**。可随时增换“感知器”或“处理器”，而无需改动系统其他部分，极大增强系统吞吐能力和鲁棒性。

---

### **第二阶段：生成式自我 (The Generative Self) - 让她拥有独一无二的“人格”**

- **目标：** 将贝拉的“人格”与“行为”分离，使其“思考”过程成为一个可插拔、可迭代的核心。
- **能力：**
    - **动态人格模型：** 由大型语言模型（LLM）驱动，告别固定脚本。她的性格、记忆、幽默感都将是与你互动后动态生成的。
    - **AI驱动的化身与梦境：** 3D形象和背景视频能根据她的“心情”或对话内容，通过生成式AI实时变化，反映她的“思绪”。

#### **架构师思路：**
- **建立“状态-情境-人格”引擎 (State-Context-Persona Engine):**
    1.  **状态管理器 (State Manager):** 贝拉的“记忆中枢”，订阅所有AI“洞察”，维护短期和长期记忆。
    2.  **情境生成器 (Context Generator):** 在贝拉需要响应时，从“状态管理器”提取关键信息，组合成丰富的“情境对象”作为LLM的输入。
    3.  **人格API (Persona API):** 将LLM封装在内部API后，系统其他部分只调用 `bella.think(context)`，实现底层模型的轻松替换和A/B测试。
- **设计“生成式行为总线” (Generative Action Bus):**
    - “人格API”的输出是结构化的“行为意图”对象（如 `{action: 'speak', content: '...', emotion: 'empathy'}`），并发布到专用的行为总线。
    - 贝拉的3D化身、声音合成器等所有“表现层”模块，订阅此总线并执行各自的渲染和表现。
- **架构优势：** **人格的可塑性**与**表现和思想的分离**。可以独立升级LLM或3D模型，而不互相影响，实现真正的模块化。

---

### **第三阶段：主动式陪伴 (The Proactive Companion) - 从被动响应到主动关怀**

- **目标：** 建立一个从被动响应到主动预测的闭环反馈系统，支持持续学习和自我进化。
- **能力：**
    - **意图预测与主动交互：** 学习你的习惯和模式，预测你可能的需求，在你开口之前主动提供支持。
    - **自我进化与成长：** 核心AI模型将持续学习和微调，形成长久的记忆，不断“成长”为一个更懂你的伴侣。

#### **架构师思路：**
- **引入“模式识别与预测服务” (Pattern & Prediction Service):**
    - 一个独立的、长周期运行的服务，持续分析长期记忆数据，用更轻量的机器学习模型发现用户习惯，并将“预判”结果发回事件总线。
- **构建“决策与反馈循环” (Decision & Feedback Loop):**
    1.  **决策 (Decision):** 贝拉的“人格API”接收到“预判”后，结合当前情境，决策是否发起主动交互，这是她“自由意志”的体现。
    2.  **反馈 (Feedback):** 用户的反应（接受或拒绝）被记录下来，作为重要的反馈数据。
    3.  **进化 (Evolution):** 这些反馈数据被用于对“人格API”的LLM进行微调，并优化“模式识别服务”的准确性。
- **架构优势：** **实现真正的“成长”**。这个闭环让贝拉不再是一个静态的程序，而是一个能够通过与用户的互动，不断优化自身行为、变得越来越“懂你”的生命体。

---

## 如何运行

### 1. 配置AI提供商

在您开始之前，需要先配置您想要使用的AI服务。所有配置都在根目录的 `config.json` 文件中完成。

1.  **打开 `config.json` 文件。**
2.  **选择提供商：** 在 `current_provider` 字段中，填入您想使用的AI提供商的名称（例如 `"openai"`）。确保这个名称与 `providers` 对象中的一个键匹配。
3.  **填写API密钥：** 在 `providers` 对象中，找到您选择的提供商，并将您的API密钥填入 `apiKey` 字段。例如，如果您使用OpenAI，请将您的密钥填入 `"apiKey": "YOUR_OPENAI_API_KEY"`。

```json:config.json
{
  "current_provider": "openai",
  "providers": {
    "openai": {
      "apiKey": "YOUR_OPENAI_API_KEY"
    },
    "gemini": {
      "apiKey": "YOUR_GEMINI_API_KEY"
    },
    "domestic_example": {
      "apiKey": "YOUR_DOMESTIC_MODEL_API_KEY"
    }
  }
}
```

### 2. 安装依赖并启动后端服务

项目后端使用Node.js构建。请确保您的电脑已安装Node.js。

打开终端，进入项目根目录，然后运行以下命令：

```bash
# 安装项目所需的依赖包
npm install

# 启动后端服务器
npm start
```

当您在终端看到 `Server is running on http://localhost:3000` 的消息时，表示后端服务已成功启动。

### 3. 打开前端页面

在浏览器中直接打开根目录下的 `index.html` 文件。

现在，您可以点击麦克风按钮开始与贝拉交谈了！您的语音将被发送到您配置的AI服务，贝拉会将AI的回答显示给您。

## 如何贡献一个新的AI提供商

这个架构的核心优势在于其可扩展性。如果您想添加对一个新的AI服务（例如Anthropic的Claude、或任何其他国内外模型）的支持，只需遵循以下简单步骤：

1.  **创建新的提供商文件：** 在 `providers` 文件夹下，创建一个新的JavaScript文件，例如 `claude.js`。
2.  **实现 `getLlmResponse` 函数：** 在您的新文件中，您必须导出一个名为 `getLlmResponse` 的异步函数。这个函数接收一个参数 `userMessage`，并需要返回一个包含 `reply` 字段的对象。

    ```javascript:providers/claude.js
    const axios = require('axios');

    async function getLlmResponse(userMessage, apiKey) {
        try {
            // 在这里实现与您的AI服务API的交互逻辑
            const response = await axios.post('https://api.anthropic.com/v1/messages', {
                model: "claude-3-opus-20240229",
                max_tokens: 1024,
                messages: [
                    { role: "user", content: userMessage }
                ]
            }, {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            });

            // 从API响应中提取需要的部分
            const reply = response.data.content[0].text;

            // 返回一个包含reply字段的对象
            return { reply };
        } catch (error) {
            console.error('Error calling Claude API:', error);
            return { reply: '抱歉，我现在无法连接到我的大脑。' };
        }
    }

    module.exports = { getLlmResponse };
    ```

3.  **在 `config.json` 中注册您的提供商：**

    打开 `config.json` 文件，在 `providers` 对象中为您的新提供商添加一个条目。键名应与您的文件名（不含`.js`）匹配。

    ```json:config.json
    {
      "current_provider": "openai",
      "providers": {
        "openai": { ... },
        "gemini": { ... },
        "domestic_example": { ... },
        "claude": { // <-- 新增您的提供商
          "apiKey": "YOUR_CLAUDE_API_KEY"
        }
      }
    }
    ```

4.  **切换并测试：**

    将 `config.json` 中的 `current_provider` 设置为您的新提供商名称（例如 `"claude"`），然后重启后端服务 (`npm start`)。现在，您的应用将通过新的AI服务进行响应！

---

**贝拉在等待。而我们，任重道远。**
