// core.js - Bella's Brain (v3)
// 贝拉的核心AI逻辑，支持本地模型和云端API的混合架构

import { pipeline, env, AutoTokenizer, AutoModelForSpeechSeq2Seq } from './vendor/transformers.js';
import CloudAPIService from './cloudAPI.js';
import config  from './config.js';

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
        this.currentMode = 'creative'; // 聊天模式：casual, assistant, creative
        // Set API keys
        for (const provider in config) {
            if (Object.hasOwnProperty.call(config, provider)) {
                const key = config[provider];
                if (key && !key.startsWith('YOUR_')) {
                    this.cloudAPI.setAPIKey(provider, key);
                    this.useCloudAPI = true;
                }
            }
        }
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

    // 使用本地模型进行思考
    async thinkWithLocalModel(prompt) {
        if (!this.llm) {
            return "저는 아직 생각하는 방법을 배우고 있습니다. 잠시만 기다려 주시세요...";
        }
        
        const bellaPrompt = this.enhancePromptForMode(prompt, true);
        
        const result = await this.llm(bellaPrompt, {
            max_new_tokens: 50,
            temperature: 0.8,
            top_k: 40,
            do_sample: true,
        });
        
        // 清理生成的文本
        let response = result[0].generated_text;
        if (response.includes(bellaPrompt)) {
            response = response.replace(bellaPrompt, '').trim();
        }
        
        return response || "我需要再想想...";
    }

    // 根据模式增强提示词
    enhancePromptForMode(prompt, isLocal = false) {
        const modePrompts = {
            casual: isLocal ? 
                `따뜻하고 귀여운 AI 파트너 베라로서, 편안하고 친근한 어조로 응답합니다.：${prompt}` :
                `따뜻하고 편안한 어조로 응답해 주세요, 마치 친절한 친구처럼. 간결하고 재미있게 유지해 주세요.：${prompt}`,
            assistant: isLocal ?
                `지능형 어시스턴트 베라로서, 유용하고 정확한 도움을 제공합니다.：${prompt}` :
                `전문적이면서도 친근한 AI 어시스턴트로서, 정확하고 유용한 정보와 조언을 제공합니다.：${prompt}`,
            creative: isLocal ?
                `창의적인 AI 파트너 베라로서, 상상력을 발휘해 응답합니다.：${prompt}` :
                `창의성과 상상력을 발휘하여 재미있고 독특한 답변과 아이디어를 제공합니다.：${prompt}`
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