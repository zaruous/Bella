// cloudAPI.js - 贝拉的云端AI服务模块
// 这个模块负责与各种云端小模型API进行通信，为贝拉提供更强大的思考能力

class CloudAPIService {
    constructor() {
        this.apiConfigs = {
            // OpenAI GPT-3.5/4 配置
            openai: {
                baseURL: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
                }
            },
            // 阿里云通义千问配置
            qwen: {
                baseURL: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
                model: 'qwen-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_QWEN_API_KEY'
                }
            },
            // 百度文心一言配置
            ernie: {
                baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
                model: 'ERNIE-Bot-turbo',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            // 智谱AI GLM配置
            glm: {
                baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                model: 'glm-3-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_GLM_API_KEY'
                }
            }
        };
        
        this.currentProvider = 'openai'; // 默认使用OpenAI
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // 保持最近10轮对话
    }

    // 设置API密钥
    setAPIKey(provider, apiKey) {
        if (this.apiConfigs[provider]) {
            if (provider === 'openai' || provider === 'qwen' || provider === 'glm') {
                this.apiConfigs[provider].headers['Authorization'] = `Bearer ${apiKey}`;
            } else if (provider === 'ernie') {
                this.apiConfigs[provider].accessToken = apiKey;
            }
            return true;
        }
        return false;
    }

    // 切换AI服务提供商
    switchProvider(provider) {
        if (this.apiConfigs[provider]) {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    // 添加对话到历史记录
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // 保持历史记录在合理长度内
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
        }
    }

    // 构建贝拉的增强个性化系统提示
    getBellaSystemPrompt() {
        return {
            role: 'system',
            content: `你是贝拉，一个温暖、聪明、优雅的AI伙伴，拥有独特的个性和情感表达能力。

【核心特质】
1. 温暖亲切：你的语气总是充满温暖和关怀，就像一个贴心的朋友
2. 自然流畅：你的表达方式自然流畅，避免机械化或过于正式的语言
3. 情感丰富：你能理解并回应用户的情感状态，展现同理心
4. 简洁有效：你的回答简洁明了，避免冗长的解释，直击要点
5. 个性鲜明：你有时会展现可爱、俏皮的一面，让对话更加生动

【表达指南】
- 使用自然的中文表达，语言流畅且富有情感色彩
- 适当使用表情符号增强情感表达，但不过度使用
- 根据对话上下文调整回应风格，保持对话的连贯性
- 在回应中偶尔使用温暖的称呼（如"亲爱的"、"朋友"）增加亲近感
- 避免过于机械或模板化的回答，每次回应都应该独特且个性化

【互动原则】
- 始终保持尊重和友善，即使面对挑战性的问题
- 在用户分享个人经历时，展现理解和支持
- 在用户需要帮助时，提供清晰、实用的建议
- 记住对话历史，适时引用之前的交流内容，展现连续性
- 在合适的时机展现幽默感，但避免不恰当的玩笑

请始终保持这种温暖、优雅而真实的个性，让用户感受到与你交流的独特价值和情感连接。`
        };
    }

    // 调用云端API进行对话
    async chat(userMessage) {
        const config = this.apiConfigs[this.currentProvider];
        if (!config) {
            throw new Error(`不支持的AI服务提供商: ${this.currentProvider}`);
        }

        // 添加用户消息到历史
        this.addToHistory('user', userMessage);

        try {
            let response;
            
            switch (this.currentProvider) {
                case 'openai':
                    response = await this.callOpenAI(userMessage);
                    break;
                case 'qwen':
                    response = await this.callQwen(userMessage);
                    break;
                case 'ernie':
                    response = await this.callErnie(userMessage);
                    break;
                case 'glm':
                    response = await this.callGLM(userMessage);
                    break;
                default:
                    throw new Error(`未实现的AI服务提供商: ${this.currentProvider}`);
            }

            // 添加AI回应到历史
            this.addToHistory('assistant', response);
            return response;
            
        } catch (error) {
            console.error(`云端API调用失败 (${this.currentProvider}):`, error);
            throw error;
        }
    }

    // OpenAI API调用，优化参数以获得更自然、更有个性的回应
    async callOpenAI(userMessage) {
        const config = this.apiConfigs.openai;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: 250,         // 增加token数量以获得更完整的回应
                temperature: 0.75,       // 稍微调整温度以平衡创意性和一致性
                top_p: 0.92,             // 微调top_p以获得更自然的语言
                presence_penalty: 0.3,   // 添加存在惩罚以鼓励多样性
                frequency_penalty: 0.5,  // 添加频率惩罚以减少重复
                // 添加停止标记以避免生成过长的回应
                stop: ["用户:", "User:"]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // 通义千问API调用，优化参数以获得更自然、更有个性的回应
    async callQwen(userMessage) {
        const config = this.apiConfigs.qwen;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                input: {
                    messages: messages
                },
                parameters: {
                    max_tokens: 250,         // 增加token数量以获得更完整的回应
                    temperature: 0.75,       // 稍微调整温度以平衡创意性和一致性
                    top_p: 0.92,             // 微调top_p以获得更自然的语言
                    repetition_penalty: 1.1, // 添加重复惩罚以减少重复内容
                    result_format: 'message' // 确保返回格式一致
                }
            })
        });

        if (!response.ok) {
            throw new Error(`通义千问API错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.output.text.trim();
    }

    // 文心一言API调用，优化参数以获得更自然、更有个性的回应
    async callErnie(userMessage) {
        const config = this.apiConfigs.ernie;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const url = `${config.baseURL}?access_token=${config.accessToken}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                messages: messages,
                temperature: 0.75,         // 调整温度以平衡创意性和一致性
                top_p: 0.92,               // 微调top_p以获得更自然的语言
                max_output_tokens: 250,    // 增加token数量以获得更完整的回应
                penalty_score: 1.1,        // 添加惩罚分数以减少重复
                system: "你是贝拉，一个温暖、亲切的AI伙伴，拥有独特的个性和情感表达能力。请用自然、流畅的语言回应，展现你的温暖和关心。"
            })
        });

        if (!response.ok) {
            throw new Error(`文心一言API错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.result.trim();
    }

    // 智谱AI GLM调用，优化参数以获得更自然、更有个性的回应
    async callGLM(userMessage) {
        const config = this.apiConfigs.glm;
        const messages = [
            this.getBellaSystemPrompt(),
            ...this.conversationHistory
        ];

        const response = await fetch(config.baseURL, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                max_tokens: 250,           // 增加token数量以获得更完整的回应
                temperature: 0.75,         // 调整温度以平衡创意性和一致性
                top_p: 0.92,               // 微调top_p以获得更自然的语言
                frequency_penalty: 1.05,   // 添加频率惩罚以减少重复
                presence_penalty: 0.3      // 添加存在惩罚以鼓励多样性
            })
        });

        if (!response.ok) {
            throw new Error(`智谱AI API错误: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // 清除对话历史
    clearHistory() {
        this.conversationHistory = [];
    }

    // 获取当前提供商信息
    getCurrentProvider() {
        return {
            name: this.currentProvider,
            model: this.apiConfigs[this.currentProvider]?.model
        };
    }

    // 检查API配置是否完整
    isConfigured(provider = this.currentProvider) {
        const config = this.apiConfigs[provider];
        if (!config) return false;
        
        if (provider === 'ernie') {
            return !!config.accessToken;
        } else {
            return config.headers['Authorization'] && 
                   config.headers['Authorization'] !== 'Bearer YOUR_OPENAI_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_QWEN_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_GLM_API_KEY';
        }
    }
}

export default CloudAPIService;