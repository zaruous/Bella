// cloudAPI.js - 贝拉的云端AI服务模块
// 这个模块负责与各种云端小模型API进行通信，为贝拉提供更强大的思考能力
import config from "./config.js";

class CloudAPIService {
    constructor() {
        this.apiConfigs = {
            // OpenAI GPT-3.5/4 configuration
            openai: {
                baseURL: 'https://api.openai.com/v1/chat/completions',
                model: 'gpt-3.5-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
                }
            },
            // Alibaba Cloud Qwen configuration
            qwen: {
                baseURL: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
                model: 'qwen-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_QWEN_API_KEY'
                }
            },
            // Baidu ERNIE Bot configuration
            ernie: {
                baseURL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
                model: 'ERNIE-Bot-turbo',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            // Zhipu AI GLM configuration
            glm: {
                baseURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                model: 'glm-3-turbo',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_GLM_API_KEY'
                }
            },
            // Google Gemini 配置
            gemini: {
                baseURL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                model: 'gemini-pro',
                apiKey: 'YOUR_GEMINI_API_KEY',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        };
        
        this.currentProvider = 'openai'; // Default to using OpenAI
        this.conversationHistory = [];
        this.maxHistoryLength = 10; // Keep the most recent 10 conversation turns
    }

    // Set API key
    setAPIKey(provider, apiKey) {
        if (this.apiConfigs[provider]) {
            if (provider === 'openai') {
                this.apiConfigs[provider].headers['Authorization'] = `Bearer ${apiKey}`;
            }
            else if (provider === 'qwen') {
                this.apiConfigs[provider].headers['Authorization'] = `Bearer ${apiKey}`;
            }
            else if (provider === 'glm') {
                this.apiConfigs[provider].headers['Authorization'] = `Bearer ${apiKey}`;
            }
            else if (provider === 'ernie') {
                this.apiConfigs[provider].accessToken = apiKey;
            } else if (provider === 'gemini') {
                this.apiConfigs[provider].apiKey = apiKey;
            }
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    // Switch AI service provider
    switchProvider(provider) {
        if (this.apiConfigs[provider]) {
            this.currentProvider = provider;
            return true;
        }
        return false;
    }

    // Add conversation to history
    addToHistory(role, content) {
        this.conversationHistory.push({ role, content });
        
        // Keep history at a reasonable length
        if (this.conversationHistory.length > this.maxHistoryLength * 2) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength * 2);
        }
    }

    // Build Bella's enhanced personalized system prompt
    getBellaSystemPrompt() {
        return {
            role: 'system',
            content : config.systemPrompt
        };
    }

    // Call cloud API for conversation
    async chat(userMessage) {
        const config = this.apiConfigs[this.currentProvider];
        if (!config) {
            throw new Error(`Unsupported AI service provider: ${this.currentProvider}`);
        }

        // Add user message to history
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
                case 'gemini':
                    response = await this.callGemini(userMessage);
                    break;
                default:
                    throw new Error(`Unimplemented AI service provider: ${this.currentProvider}`);
            }

            // Add AI response to history
            this.addToHistory('assistant', response);
            return response;
            
        } catch (error) {
            console.error(`Cloud API call failed (${this.currentProvider}):`, error);
            throw error;
        }
    }

    // OpenAI API call, optimized parameters for more natural, personalized responses
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
                max_tokens: 250,         // Increased token count for more complete responses
                temperature: 0.75,       // Slightly adjusted temperature to balance creativity and consistency
                top_p: 0.92,             // Fine-tuned top_p for more natural language
                presence_penalty: 0.3,   // Added presence penalty to encourage diversity
                frequency_penalty: 0.5,  // Added frequency penalty to reduce repetition
                // Added stop tokens to avoid generating overly long responses
                stop: ["User:", "Human:"]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // Qwen API call, optimized parameters for more natural, personalized responses
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
                    max_tokens: 250,         // Increased token count for more complete responses
                    temperature: 0.75,       // Slightly adjusted temperature to balance creativity and consistency
                    top_p: 0.92,             // Fine-tuned top_p for more natural language
                    repetition_penalty: 1.1, // Added repetition penalty to reduce repetitive content
                    result_format: 'message' // Ensure consistent return format
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Qwen API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.output.text.trim();
    }

    // ERNIE Bot API call, optimized parameters for more natural, personalized responses
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
                temperature: 0.8,         // Adjusted temperature to balance creativity and consistency
                top_p: 0.92,               // Fine-tuned top_p for more natural language
                max_output_tokens: 150    // Increased token count for more complete responses
            })
        });

        if (!response.ok) {
            throw new Error(`ERNIE Bot API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.result.trim();
    }

    // Zhipu AI GLM API call, optimized parameters for more natural, personalized responses
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
                max_tokens: 250,           // Increased token count for more complete responses
                temperature: 0.75,         // Adjusted temperature to balance creativity and consistency
                top_p: 0.92,               // Fine-tuned top_p for more natural language
                frequency_penalty: 1.05,   // Added frequency penalty to reduce repetition
                presence_penalty: 0.3      // Added presence penalty to encourage diversity
            })
        });

        if (!response.ok) {
            throw new Error(`Zhipu AI API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    }

    // Gemini API 调用
    async callGemini(userMessage) {
        const config = this.apiConfigs.gemini;
        if (config.apiKey === 'YOUR_GEMINI_API_KEY') {
            throw new Error('Gemini API key is not set.');
        }

        const url = `${config.baseURL}?key=${config.apiKey}`;

        const contents = this.conversationHistory.map(turn => ({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.content }]
        }));

        const body = {
            contents: contents,
            system_instruction: {
                parts: [{ text: this.getBellaSystemPrompt().content }]
            },
            generation_config: {
                max_output_tokens: 1500,
                temperature: 0.8,
                top_p: 0.9
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: config.headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Gemini API 错误: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            console.error('Gemini API returned no candidates:', data);
            return '抱歉，我暂时无法回答。';
        }
        return data.candidates[0].content.parts[0].text.trim();
    }

    // 清除对话历史
    clearHistory() {
        this.conversationHistory = [];
    }

    // Get current provider information
    getCurrentProvider() {
        return {
            name: this.currentProvider,
            model: this.apiConfigs[this.currentProvider]?.model
        };
    }

    // Check if API configuration is complete
    isConfigured(provider = this.currentProvider) {
        const config = this.apiConfigs[provider];
        if (!config) return false;
        
        if (provider === 'ernie') {
            return !!config.accessToken;
        } else if (provider === 'gemini') {
            return config.apiKey && config.apiKey !== 'YOUR_GEMINI_API_KEY';
        } else {
            return config.headers['Authorization'] && 
                   config.headers['Authorization'] !== 'Bearer YOUR_OPENAI_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_QWEN_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_GLM_API_KEY' &&
                   config.headers['Authorization'] !== 'Bearer YOUR_GEMINI_API_KEY'
        }
    }
}

export default CloudAPIService;