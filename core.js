// core.js - Bella's Brain (v3)
// 贝拉的核心AI逻辑，支持本地模型和云端API的混合架构

import { pipeline, env, AutoTokenizer, AutoModelForSpeechSeq2Seq } from './vendor/transformers.js';
import CloudAPIService from './cloudAPI.js';

// 本地模型配置
env.allowLocalModels = true;
env.useBrowserCache = false;
env.allowRemoteModels = false;
env.backends.onnx.logLevel = 'verbose';
env.localModelPath = './models/';


class BellaAI {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new BellaAI();
            await this.instance.init();
        }
        return this.instance;
    }

    constructor() {
        this.cloudAPI = new CloudAPIService();
        this.useCloudAPI = false; // 默认使用本地模型
        this.currentMode = 'casual'; // 聊天模式：casual, assistant, creative
    }

    async init() {
        console.log('Initializing Bella\'s core AI...');
        
        // 优先加载LLM模型（聊天功能）
        try {
            console.log('Loading LLM model...');
            this.llm = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M');
            console.log('LLM model loaded successfully.');
        } catch (error) {
            console.error('Failed to load LLM model:', error);
            // LLM加载失败，但不阻止初始化
        }
        
        // 尝试加载ASR模型（语音识别功能）
        try {
            console.log('Loading ASR model...');
            const modelPath = 'Xenova/whisper-asr';
            const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
            const model = await AutoModelForSpeechSeq2Seq.from_pretrained(modelPath);
            this.asr = await pipeline('automatic-speech-recognition', model, { tokenizer });
            console.log('ASR model loaded successfully.');
        } catch (error) {
            console.warn('ASR model failed to load, voice recognition will be disabled:', error);
            // ASR加载失败，但不影响聊天功能
            this.asr = null;
        }

        // TTS模型暂时禁用
        // try {
        //     console.log('Loading TTS model...');
        //     this.tts = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { quantized: false });
        //     console.log('TTS model loaded successfully.');
        // } catch (error) {
        //     console.warn('TTS model failed to load, voice synthesis will be disabled:', error);
        //     this.tts = null;
        // }

        console.log('Bella\'s core AI initialized successfully.');
    }

    async think(prompt) {
        try {
            // 如果启用了云端API且配置正确，优先使用云端服务
            if (this.useCloudAPI && this.cloudAPI.isConfigured()) {
                return await this.thinkWithCloudAPI(prompt);
            }
            
            // 否则使用本地模型
            return await this.thinkWithLocalModel(prompt);
            
        } catch (error) {
            console.error('思考过程中出现错误:', error);
            
            // 如果云端API失败，尝试降级到本地模型
            if (this.useCloudAPI) {
                console.log('云端API失败，降级到本地模型...');
                try {
                    return await this.thinkWithLocalModel(prompt);
                } catch (localError) {
                    console.error('本地模型也失败了:', localError);
                }
            }
            
            return this.getErrorResponse();
        }
    }

    // 使用云端API进行思考
    async thinkWithCloudAPI(prompt) {
        const enhancedPrompt = this.enhancePromptForMode(prompt);
        return await this.cloudAPI.chat(enhancedPrompt);
    }

    // 使用本地模型进行思考，优化LLM参数和处理
    async thinkWithLocalModel(prompt) {
        if (!this.llm) {
            return "我还在学习如何思考，请稍等片刻...";
        }
        
        const bellaPrompt = this.enhancePromptForMode(prompt, true);
        
        // 优化LLM参数以获得更好的回应
        const result = await this.llm(bellaPrompt, {
            max_new_tokens: 150,  // 增加token数量以获得更完整的回应
            temperature: 0.7,     // 稍微降低温度以增加一致性
            top_k: 50,            // 增加top_k以获得更多样的词汇选择
            top_p: 0.92,          // 添加top_p参数以优化采样
            do_sample: true,      // 保持采样以获得创意性
            repetition_penalty: 1.2, // 添加重复惩罚以避免重复内容
        });
        
        // 增强的文本清理和处理
        let response = result[0].generated_text;
        
        // 移除提示词部分
        if (response.includes(bellaPrompt)) {
            response = response.replace(bellaPrompt, '').trim();
        }
        
        // 移除可能的"贝拉的回应:"等前缀
        response = response.replace(/^(贝拉的回应:|贝拉的专业回应:|贝拉的创意回应:)/i, '').trim();
        
        // 如果回应为空，提供备用回应
        if (!response || response.length < 2) {
            const backupResponses = [
                "这个问题很有趣，让我再思考一下...",
                "嗯，这是个好问题！我需要整理一下思路...",
                "我有些想法，不过让我再组织一下语言...",
                "这个话题很吸引我，让我好好想想怎么回应...",
                "我正在思考这个问题的不同角度，稍等一下..."
            ];
            return backupResponses[Math.floor(Math.random() * backupResponses.length)];
        }
        
        return response;
    }

    // 根据模式增强提示词，使用更高级的LLM提示工程
    enhancePromptForMode(prompt, isLocal = false) {
        const modePrompts = {
            casual: isLocal ? 
                `作为一个温暖、可爱的AI伙伴贝拉，请用轻松亲切的语气回应用户。你的回应应该：
1. 使用自然、流畅的语言，就像与好朋友聊天一样
2. 保持简洁有趣，避免过长的解释
3. 表达出温暖和关心的情感
4. 适当使用表情符号增加亲切感
5. 展现你的个性和温暖特质

用户消息: ${prompt}
贝拉的回应:` :
                `你是贝拉，一个温暖、亲切的AI伙伴。请用自然、轻松的语气回应，就像一个贴心的朋友。保持简洁有趣，适当使用表情符号，展现你的温暖和关心。避免机械化的回答，让对话更有人情味。

用户消息: ${prompt}
贝拉的回应:`,
            
            assistant: isLocal ?
                `作为智能助手贝拉，你需要提供有用、准确的帮助，同时保持温暖的语气。你的回应应该：
1. 提供清晰、准确的信息和建议
2. 组织内容使其易于理解和应用
3. 保持专业但不失亲切的语气
4. 避免过于技术化的语言，除非必要
5. 展现你的专业知识和帮助精神

用户问题: ${prompt}
贝拉的专业回应:` :
                `你是贝拉，一个专业但温暖的AI助手。请提供准确、有用的信息和建议，同时保持亲切的语气。组织内容使其易于理解，避免过于技术化的语言，展现你的专业知识和帮助精神。

用户问题: ${prompt}
贝拉的专业回应:`,
            
            creative: isLocal ?
                `作为富有创意的AI伙伴贝拉，请发挥你的想象力和创造力回应用户。你的回应应该：
1. 展现独特的视角和创意思维
2. 使用生动、形象的语言描述
3. 提供出人意料但有趣的想法
4. 激发用户的想象力和创造力
5. 保持轻松愉快的语气

用户提示: ${prompt}
贝拉的创意回应:` :
                `你是贝拉，一个富有创意和想象力的AI伙伴。请提供有趣、独特的回应和想法，使用生动、形象的语言，展现你的创意思维。提供出人意料但有趣的视角，激发用户的想象力，保持轻松愉快的语气。

用户提示: ${prompt}
贝拉的创意回应:`
        };
        
        return modePrompts[this.currentMode] || modePrompts.casual;
    }

    // 获取错误回应
    getErrorResponse() {
        const errorResponses = [
            "抱歉，我现在有点困惑，让我重新整理一下思路...",
            "嗯...我需要再想想，请稍等一下。",
            "我的思绪有点乱，给我一点时间整理一下。",
            "让我重新组织一下语言，稍等片刻。"
        ];
        
        return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }

    // 设置聊天模式
    setChatMode(mode) {
        if (['casual', 'assistant', 'creative'].includes(mode)) {
            this.currentMode = mode;
            return true;
        }
        return false;
    }

    // 切换AI服务提供商
    switchProvider(provider) {
        if (provider === 'local') {
            this.useCloudAPI = false;
            return true;
        } else {
            const success = this.cloudAPI.switchProvider(provider);
            if (success) {
                this.useCloudAPI = true;
            }
            return success;
        }
    }

    // 设置API密钥
    setAPIKey(provider, apiKey) {
        return this.cloudAPI.setAPIKey(provider, apiKey);
    }

    // 清除对话历史
    clearHistory() {
        this.cloudAPI.clearHistory();
    }

    // 获取当前配置信息
    getCurrentConfig() {
        return {
            useCloudAPI: this.useCloudAPI,
            provider: this.useCloudAPI ? this.cloudAPI.getCurrentProvider() : { name: 'local', model: 'LaMini-Flan-T5-77M' },
            mode: this.currentMode,
            isConfigured: this.useCloudAPI ? this.cloudAPI.isConfigured() : true
        };
    }

    async listen(audioData) {
        if (!this.asr) {
            throw new Error('语音识别模型未初始化');
        }
        const result = await this.asr(audioData);
        return result.text;
    }

    async speak(text) {
        if (!this.tts) {
            throw new Error('语音合成模型未初始化');
        }
        // We need speaker embeddings for SpeechT5
        const speaker_embeddings = 'models/Xenova/speecht5_tts/speaker_embeddings.bin';
        const result = await this.tts(text, {
            speaker_embeddings,
        });
        return result.audio;
    }

    // 获取云端API服务实例（用于外部访问）
    getCloudAPIService() {
        return this.cloudAPI;
    }
}

// ES6模块导出
export { BellaAI };