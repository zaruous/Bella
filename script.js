document.addEventListener('DOMContentLoaded', function() {

    // --- 加载屏幕处理 ---
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        // 在动画结束后将其隐藏，以防它阻碍交互
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // 这个时间应该匹配 CSS 中的 transition 时间
    }, 1500); // 1.5秒后开始淡出
    
    // 获取需要的 DOM 元素
    let video1 = document.getElementById('video1');
    let video2 = document.getElementById('video2');
    const micButton = document.getElementById('mic-button');
    const favorabilityBar = document.getElementById('favorability-bar');

    let activeVideo = video1;
    let inactiveVideo = video2;

    // 视频列表
    const videoList = [
        '视频资源/3D 建模图片制作.mp4',
        '视频资源/jimeng-2025-07-16-1043-笑着优雅的左右摇晃，过一会儿手扶着下巴，保持微笑.mp4',
        '视频资源/jimeng-2025-07-16-4437-比耶，然后微笑着优雅的左右摇晃.mp4',
        '视频资源/生成加油视频.mp4',
        '视频资源/生成跳舞视频.mp4',
        '视频资源/负面/jimeng-2025-07-16-9418-双手叉腰，嘴巴一直在嘟囔，表情微微生气.mp4'
    ];

    // --- 视频交叉淡入淡出播放功能 ---
    function switchVideo() {
        // 1. 选择下一个视频
        const currentVideoSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextVideoSrc = currentVideoSrc;
        while (nextVideoSrc === currentVideoSrc) {
            const randomIndex = Math.floor(Math.random() * videoList.length);
            nextVideoSrc = videoList[randomIndex];
        }

        // 2. 设置不活动的 video 元素的 source
        inactiveVideo.querySelector('source').setAttribute('src', nextVideoSrc);
        inactiveVideo.load();

        // 3. 当不活动的视频可以播放时，执行切换
        inactiveVideo.addEventListener('canplaythrough', function onCanPlayThrough() {
            // 确保事件只触发一次
            inactiveVideo.removeEventListener('canplaythrough', onCanPlayThrough);

            // 4. 播放新视频
            inactiveVideo.play().catch(error => {
                console.error("Video play failed:", error);
            });

            // 5. 切换 active class 来触发 CSS 过渡
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');

            // 6. 更新角色
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];

            // 为新的 activeVideo 绑定 ended 事件
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true }); // 使用 { once: true } 确保事件只被处理一次
    }

    // 初始启动
    activeVideo.addEventListener('ended', switchVideo, { once: true });


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