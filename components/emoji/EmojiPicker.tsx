import React, { useState, useEffect, useRef } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data/sets/15/google.json'
import { getEmojiSvgUrl, getDynamicEmojiUrl } from '../../lib/emojiUtils';

interface EmojiPickerProps {
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
  
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ selectedEmoji, onEmojiSelect, }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [staticEmojiUrl, setStaticEmojiUrl] = useState<string | null>(null);
  const [dynamicEmojiUrl, setDynamicEmojiUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  // 使用正确的 emoji-mart 回调格式
  const handleEmojiSelect = (emojiData: any) => {
    onEmojiSelect(emojiData.native);
    setShowPicker(false);
    setIsHovered(false);
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

  // 当选中emoji变化时，设置静态图片和动态图片
  useEffect(() => {
    if (selectedEmoji) {
      setLoading(true);
      
      const staticUrl = getEmojiSvgUrl(selectedEmoji);
      setStaticEmojiUrl(staticUrl);
      
      const dynamicUrl = getDynamicEmojiUrl(selectedEmoji);
      setDynamicEmojiUrl(dynamicUrl);
      
      setLoading(false);
    }
  }, [selectedEmoji]);

  // 计算容器的大致大小以设置emoji大小
  const [containerSize, setContainerSize] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerSize(width);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // 计算图片适当尺寸
  const staticImgSize = Math.min(Math.floor(containerSize * 0.6), 64);
  const dynamicImgSize = Math.min(Math.floor(containerSize * 0.7), 72);

  return (
    <div className="flex flex-col">
      <label className="text-lg font-medium text-white/90 mb-3 text-center">
       
      </label>
      
      {/* 选择器显示区域 - 玻璃态效果 */}
      <div 
        className="relative max-w-[150px] mx-auto w-full" 
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`
            w-full aspect-square rounded-xl overflow-hidden
            transition-all duration-300 ease-in-out
            backdrop-blur-lg bg-white/20 border-2 border-transparent
            flex items-center justify-center relative
            ${isHovered 
              ? "shadow-lg shadow-primary-500/30 transform scale-105 bg-white/30" 
              : "shadow-glass"}
            ${selectedEmoji ? "bg-white/30" : "bg-white/10"}
          `}
          aria-label="选择表情"
        >
          {/* 跑马灯边框效果 - 仅在悬停时显示 */}
          {isHovered && (
            <div 
              className="absolute inset-0 rounded-xl border-2 border-transparent z-0 
                       bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 
                       animate-border-flow"
              style={{ 
                backgroundSize: '200% 100%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            ></div>
          )}
          
          {selectedEmoji ? (
            loading ? (
              <div className="animate-pulse bg-white/40 w-1/3 h-1/3 rounded-full"></div>
            ) : (isHovered && dynamicEmojiUrl) ? (
              // 悬停时显示动态emoji
              <div className="flex items-center justify-center transition-all duration-300 relative z-10">
                <img 
                  src={dynamicEmojiUrl} 
                  alt={selectedEmoji}
                  className="filter drop-shadow-md"
                  style={{
                    width: `${dynamicImgSize}px`,
                    height: `${dynamicImgSize}px`,
                    objectFit: 'contain',
                    transform: 'scale(1.15)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  onError={() => setDynamicEmojiUrl(null)}
                />
              </div>
            ) : (staticEmojiUrl ? (
              // 默认显示静态emoji
              <div className="flex items-center justify-center transition-all duration-300 relative z-10">
                <img 
                  src={staticEmojiUrl} 
                  alt={selectedEmoji}
                  className="filter drop-shadow-md"
                  style={{
                    width: `${staticImgSize}px`,
                    height: `${staticImgSize}px`,
                    objectFit: 'contain',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                  onError={() => setStaticEmojiUrl(null)}
                />
              </div>
            ) : (
              // 回退到系统emoji
              <div className="flex items-center justify-center transition-all duration-300 relative z-10">
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
            <div className="relative z-10 text-white/90 text-sm font-medium flex flex-col items-center">
       
              <span>点击👈选择</span>
            </div>
          )}
        </button>

        {/* 底部渐变已移除 */}

        {/* 选择器弹窗 */}
        {showPicker && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPicker(false);
              }
            }}
          >
            <div 
              ref={pickerRef}
              
              style={{
                position: 'relative',
                width: 'min(362x, 90vw)'
              }}
            >
              
              <div className="emoji-mart-container p-2">
                <Picker 
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  perLine={8}
                  set="google"  
                  theme="light"
                  emojiButtonSize={40}
                  emojiSize={24}
                  locale="zh"
                  autoFocus={true}
                  emojiButtonRadius="8px"
                  previewPosition="none"
                  skinTonePosition="none"
                  emojiButtonColors={[
                    'rgba(155,89,182,.7)',    // 紫色
                    'rgba(142,68,173,.7)',    // 深紫色
                    'rgba(41,128,185,.7)',    // 蓝色
                    'rgba(52,152,219,.7)',    // 亮蓝色
                    'rgba(192,57,43,.7)',     // 红色
                    'rgba(231,76,60,.7)',     // 亮红色
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
