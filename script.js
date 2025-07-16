document.addEventListener('DOMContentLoaded', function() {
    
    // 获取需要的 DOM 元素
    const bgVideo = document.getElementById('bg-video');
    const videoSource = document.getElementById('video-source');
    const micButton = document.getElementById('mic-button');
    const favorabilityBar = document.getElementById('favorability-bar');

    // 视频列表
    const videoList = [
        '视频资源/3D 建模图片制作.mp4',
        '视频资源/生成跳舞视频.mp4',
        '视频资源/生成加油视频.mp4'
    ];

    // --- 视频随机播放功能 ---
    bgVideo.addEventListener('ended', function() {
        // 获取当前播放的视频
        const currentVideo = videoSource.getAttribute('src');
        
        // 过滤掉当前视频，从剩下的视频中随机选择一个
        let nextVideo = currentVideo;
        while (nextVideo === currentVideo) {
            const randomIndex = Math.floor(Math.random() * videoList.length);
            nextVideo = videoList[randomIndex];
        }
        
        // 设置新的视频源并播放
        videoSource.setAttribute('src', nextVideo);
        bgVideo.load();
        bgVideo.play().catch(error => {
            console.error("Video play failed:", error);
        });
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