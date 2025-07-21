// main.js - Bella's Brain (v2)
// This file will contain the core AI logic for Bella, powered by Transformers.js.

import { pipeline, env, AutoTokenizer, AutoModelForSpeechSeq2Seq } from '../vendor/transformers.js';




// To allow local models, we need to disable the remote model check.
env.allowLocalModels = true;
env.useBrowserCache = false;
env.allowRemoteModels = false;


env.backends.onnx.logLevel = 'verbose';
// Define the location of the models
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

    async init() {
        try {
            console.log('Initializing Bella\'s core AI...');

            const modelPath = 'Xenova/whisper-asr';

            console.log('Loading tokenizer for ASR...');
            const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
            console.log('Tokenizer loaded successfully.');

            console.log('Loading ASR model...');
            const model = await AutoModelForSpeechSeq2Seq.from_pretrained(modelPath);
            console.log('ASR model loaded successfully.');

            console.log('Creating ASR pipeline...');
            this.asr = await pipeline('automatic-speech-recognition', model, { tokenizer });
            console.log('ASR pipeline created successfully.');

        } catch (error) {
            console.error('Error during Bella AI initialization:', error);
            throw error; // Re-throw the error to be caught by the caller
        }

        // console.log('Loading LLM model...');
        // this.llm = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-77M', { progress_callback: onProgress });
        // console.log('LLM model loaded.');

        // console.log('Loading TTS model...');
        // this.tts = await pipeline('text-to-speech', 'Xenova/speecht5_tts', { quantized: false, progress_callback: onProgress });
        // console.log('TTS model loaded.');

        console.log('Bella\'s core AI initialized.');
    }

    async think(prompt) {
        const result = await this.llm(prompt, {
            max_new_tokens: 100,
            temperature: 0.7,
            top_k: 50,
            do_sample: true,
        });
        return result[0].generated_text;
    }

    async listen(audioData) {
        const result = await this.asr(audioData);
        return result.text;
    }

    async speak(text) {
        // We need speaker embeddings for SpeechT5
        const speaker_embeddings = 'models/Xenova/speecht5_tts/speaker_embeddings.bin';
        const result = await this.tts(text, {
            speaker_embeddings,
        });
        return result.audio;
    }
}

export default BellaAI;