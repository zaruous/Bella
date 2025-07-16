document.addEventListener('DOMContentLoaded', function() {
    
    // 获取需要的 DOM 元素
    const videoUploadInput = document.getElementById('video-upload');
    const bgVideo = document.getElementById('bg-video');
    const videoSource = document.getElementById('video-source');
    const micButton = document.getElementById('mic-button');
    const favorabilityBar = document.getElementById('favorability-bar');

    const toggleFitButton = document.getElementById('toggle-fit-button');

    // --- 视频上传功能 ---
    videoUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            // 使用 URL.createObjectURL 为用户选择的本地文件创建一个临时的 URL
            const fileURL = URL.createObjectURL(file);

            // 设置 video 元素的 source
            videoSource.setAttribute('src', fileURL);
            
            // 加载并播放新的视频
            bgVideo.load();
            bgVideo.play().catch(error => {
                // 某些浏览器可能会阻止自动播放，这是一种友好的处理方式
                console.error("Video play failed:", error);
            });
        }
    });

    // --- 视频适应模式切换功能 ---
    let isFitHeight = false;
    toggleFitButton.addEventListener('click', function() {
        isFitHeight = !isFitHeight;
        if (isFitHeight) {
            bgVideo.style.objectFit = 'contain';
            toggleFitButton.textContent = '适应宽度';
        } else {
            bgVideo.style.objectFit = 'cover';
            toggleFitButton.textContent = '适应高度';
        }
    });

    // --- 麦克风按钮交互和好感度条模拟 ---
    let isListening = false;
    let currentFavorability = 65; // 与 CSS 中的初始宽度保持一致

    micButton.addEventListener('click', function() {
        isListening = !isListening;
        
        // 切换 "监听中" 的样式 (动画)
        micButton.classList.toggle('is-listening', isListening);

        // 模拟交互：每次点击麦克风，好感度增加
        if (isListening) {
            // 增加好感度，但最高不超过 100
            currentFavorability += 5;
            if (currentFavorability > 100) {
                currentFavorability = 100;
            }
        } else {
            // 如果停止监听，可以稍微降低一点好感度（可选）
            currentFavorability -= 2;
            if (currentFavorability < 0) {
                currentFavorability = 0;
            }
        }
        
        // 更新好感度进度条的宽度
        favorabilityBar.style.width = currentFavorability + '%';
    });

});