import React, { useState, useEffect, useRef } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
  label: string;
}

// 从emoji字符获取Google风格的图片URL
const getGoogleEmojiImage = (emoji: string): string | null => {
  try {
    // 获取Unicode码点
    const codePoint = emoji.codePointAt(0)?.toString(16);
    if (!codePoint) return null;
    
    // 返回Google风格的emoji图片 - 使用64px版本
    return `https://cdn.jsdelivr.net/npm/emoji-datasource-google/img/google/64/${codePoint}.png`;
  } catch (e) {
    console.error("Error getting emoji image:", e);
    return null;
  }
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onEmojiSelect, label }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [dynamicEmojiUrl, setDynamicEmojiUrl] = useState<string | null>(null);
  const [staticEmojiUrl, setStaticEmojiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // 使用正确的 emoji-mart 回调格式
  const handleEmojiSelect = (emojiData: any) => {
    onEmojiSelect(emojiData.native);
    setShowPicker(false);
    setIsHovered(false); // 选择完毕后取消鼠标悬停状态
  };

  // 点击外部区域关闭选择器
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  // 当选中emoji变化时，设置静态图片和尝试加载动态版本
  useEffect(() => {
    if (selectedEmoji) {
      setLoading(true);
      setDynamicEmojiUrl(null);
      
      // 设置Google风格的静态emoji图片URL
      const staticUrl = getGoogleEmojiImage(selectedEmoji);
      setStaticEmojiUrl(staticUrl);
      
      // 尝试加载动态版本
      fetch(`https://api.433200.xyz/api/dynamic-emoji?emoji=${encodeURIComponent(selectedEmoji)}&type=pic`)
        .then(response => {
          if (response.ok) {
            return response.url; // 直接返回URL，因为响应是GIF图片
          }
          return null;
        })
        .then(url => {
          setDynamicEmojiUrl(url);
          setLoading(false);
        })
        .catch(() => {
          setDynamicEmojiUrl(null);
          setLoading(false);
        });
    }
  }, [selectedEmoji]);

  // 计算容器的大致大小以设置emoji大小
  const [containerSize, setContainerSize] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // 获取容器宽度
        const width = containerRef.current.offsetWidth;
        setContainerSize(width);
      }
    };

    // 初始大小和窗口尺寸变化时更新
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 计算图片适当尺寸 
  // 静态图片使用45%比例
  const staticImgSize = Math.min(Math.floor(containerSize * 0.45), 64);
  // 动态图片使用65%比例（悬停后更大）
  const dynamicImgSize = Math.min(Math.floor(containerSize * 0.65), 72);

  return (
    <div className="flex flex-col">
      <label className="text-xl font-bold text-gray-700 mb-5 text-center">{label}</label>
      
      {/* 选择器显示区域 - 正方形容器 - 增加最大宽度为180px */}
      <div 
        className="relative max-w-[180px] mx-auto w-full" 
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`
            w-full aspect-square bg-white border-2 rounded-lg 
            flex items-center justify-center overflow-hidden
            transition-all duration-300 ease-in-out
            ${isHovered 
              ? "border-purple-400 shadow-lg transform scale-105" 
              : "border-gray-300 shadow-sm"}
          `}
        >
          {selectedEmoji ? (
            loading ? (
              <div className="animate-pulse bg-gray-200 w-1/3 h-1/3 rounded-full"></div>
            ) : (isHovered && dynamicEmojiUrl) ? (
              // 悬停时显示动态emoji - 使用更大的尺寸 (65%)
              <div className="flex items-center justify-center transition-all duration-300">
                <img 
                  src={dynamicEmojiUrl} 
                  alt={selectedEmoji} 
                  style={{
                    width: `${dynamicImgSize}px`,
                    height: `${dynamicImgSize}px`,
                    objectFit: 'contain',
                    transform: isHovered ? 'scale(1.5)' : 'scale(1.2)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  onError={() => setDynamicEmojiUrl(null)}
                />
              </div>
            ) : (staticEmojiUrl ? (
              // 默认显示Google风格的静态emoji - 使用45%比例
              <div className="flex items-center justify-center transition-all duration-300">
                <img 
                  src={staticEmojiUrl} 
                  alt={selectedEmoji}
                  style={{
                    width: `${staticImgSize}px`,
                    height: `${staticImgSize}px`,
                    objectFit: 'contain',
                    transform: isHovered ? 'scale(1.5)' : 'scale(1.2)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  onError={() => setStaticEmojiUrl(null)}
                />
              </div>
            ) : (
              // 回退到系统emoji（仅在静态图片加载失败时使用）- 使用相同尺寸
              <div className="flex items-center justify-center transition-all duration-300">
                <span style={{ 
                  fontSize: `${staticImgSize * 0.8}px`,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease-in-out',
                  display: 'inline-block'
                }}>
                  {selectedEmoji}
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-lg">点击选择</span>
          )}
        </button>

        {/* 使用Portal确保emoji选择器在最顶层显示 */}
        {showPicker && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPicker(false);
              }
            }}
          >
            <div 
              ref={pickerRef}
              className="bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-auto"
              style={{
                position: 'relative',
                width: 'min(350px, 200vw)'
              }}
            >
              <div className="p-2 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <span className="font-medium">选择一个Emoji</span>
                <button 
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowPicker(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
              <div className="emoji-mart-container">
                <Picker 
                  onEmojiSelect={handleEmojiSelect}
                  perLine={8}
                  set="google"
                  theme="light"
                  emojiButtonSize={40}
                  emojiSize={24}
                  locale="zh"
                  autoFocus={true}
                  emojiButtonColors={[
                    'rgba(155,223,88,.7)',   // 浅绿色
                    'rgba(149,211,254,.7)',  // 浅蓝色
                    'rgba(247,233,34,.7)',   // 黄色
                    'rgba(238,166,252,.7)',  // 粉紫色
                    'rgba(255,213,143,.7)',  // 橙色
                    'rgba(211,209,255,.7)',  // 淡紫色
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;