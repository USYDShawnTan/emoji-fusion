import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';

interface EmojiQuantumFieldProps {
  density?: 'high' | 'low';
  interactionEnabled?: boolean;
}

const EmojiQuantumField: React.FC<EmojiQuantumFieldProps> = ({
  density = 'high',
  interactionEnabled = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  
  // 初始化场景和渲染
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 创建场景
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // 相机设置 - 使用正交相机更适合2D风格的量子场
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      1,
      1000
    );
    camera.position.z = 500;
    
    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      powerPreference: "high-performance",
      antialias: window.devicePixelRatio < 1.5
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // 配置表情粒子系统
    const emojiSize = {
      high: { base: 64, mobile: 48 },
      low: { base: 48, mobile: 32 }
    }[density];
    
    const isMobile = window.innerWidth < 768;
    const size = isMobile ? emojiSize.mobile : emojiSize.base;
    
    // 创建粒子几何
    const particleCount = isMobile ? 40 : 70; // 增加粒子数量
    const particles = new THREE.BufferGeometry();
    
    // 扩展Emoji列表到至少20个
    const emojis = [
      '😀', '🎉', '💖', '🚀', '✨', '🌈', '🍕', '🎮', '🌸', '🔥', '🎲', 
      '😍', '🥳', '🤩', '🦄', '🍦', '🎨', '🎯', '🎪', '🧩', '🎸', '🦋',
      '🍭', '🌟', '🦁', '🌵', '🏝️', '🌮', '🧠', '🎁'
    ];
    const textureLoader = new THREE.TextureLoader();
    
    // 创建粒子材质集合
    const materials: THREE.PointsMaterial[] = [];
    
    // 异步加载所有Emoji纹理并创建粒子系统
    Promise.all(emojis.map(emoji => {
      return new Promise<THREE.Texture>((resolve) => {
        // 创建Canvas绘制Emoji
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = '48px Apple Color Emoji, Segoe UI Emoji';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(emoji, 32, 32);
          
          const texture = new THREE.CanvasTexture(canvas);
          resolve(texture);
        }
      });
    })).then(textures => {
      // 为每种Emoji创建材质
      textures.forEach(texture => {
        const material = new THREE.PointsMaterial({
          size,
          map: texture,
          transparent: true,
          alphaTest: 0.1,
          depthTest: false,
          blending: THREE.AdditiveBlending,
          opacity: 1.0 // 确保完全不透明
        });
        materials.push(material);
      });
      
      // 创建粒子系统
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const rotations = new Float32Array(particleCount);
      const scales = new Float32Array(particleCount);
      const opacities = new Float32Array(particleCount); // 添加不透明度数组
      
      // 初始化粒子位置、速度和属性
      for (let i = 0; i < particleCount; i++) {
        // 斜向分布初始位置 - 30度角
        const angle = Math.PI / 6; // 30度
        
        // 位于屏幕外的随机位置
        positions[i * 3] = (Math.random() - 0.5) * window.innerWidth * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        
        // 设置速度方向，遵循斜向30度
        velocities[i * 3] = (Math.random() * 0.5 + 0.5) * Math.cos(angle);
        velocities[i * 3 + 1] = (Math.random() * 0.5 + 0.5) * Math.sin(angle);
        velocities[i * 3 + 2] = 0;
        
        rotations[i] = Math.random() * Math.PI * 2;
        scales[i] = Math.random() * 0.5 + 0.5;
        opacities[i] = 1.0; // 初始完全不透明
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      particles.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
      particles.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      particles.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
      
      // 为每组粒子分配不同的材质，创建点对象
      const points: THREE.Points[] = [];
      const particlesPerGroup = Math.ceil(particleCount / materials.length);
      
      for (let i = 0; i < materials.length; i++) {
        // 创建这组粒子的几何体
        const groupGeometry = new THREE.BufferGeometry();
        const start = i * particlesPerGroup;
        const end = Math.min((i + 1) * particlesPerGroup, particleCount);
        const count = end - start;
        
        if (count <= 0) continue;
        
        // 复制部分属性
        const posArray = new Float32Array(count * 3);
        const velArray = new Float32Array(count * 3);
        const rotArray = new Float32Array(count);
        const scaleArray = new Float32Array(count);
        const opacityArray = new Float32Array(count);
        
        for (let j = 0; j < count; j++) {
          const srcIndex = (start + j) * 3;
          const dstIndex = j * 3;
          
          posArray[dstIndex] = positions[srcIndex];
          posArray[dstIndex + 1] = positions[srcIndex + 1];
          posArray[dstIndex + 2] = positions[srcIndex + 2];
          
          velArray[dstIndex] = velocities[srcIndex];
          velArray[dstIndex + 1] = velocities[srcIndex + 1];
          velArray[dstIndex + 2] = velocities[srcIndex + 2];
          
          rotArray[j] = rotations[start + j];
          scaleArray[j] = scales[start + j];
          opacityArray[j] = 1.0; // 初始不透明度
        }
        
        groupGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        groupGeometry.setAttribute('velocity', new THREE.BufferAttribute(velArray, 3));
        groupGeometry.setAttribute('rotation', new THREE.BufferAttribute(rotArray, 1));
        groupGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
        groupGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacityArray, 1));
        
        const material = materials[i].clone();
        const point = new THREE.Points(groupGeometry, material);
        scene.add(point);
        points.push(point);
      }
      
      // 创建噪声生成器
      const noise = new SimplexNoise();
      
      // 动画和更新逻辑
      const clock = new THREE.Clock();
      
      // 存储所有粒子的位置数据，用于碰撞检测
      const allParticlePositions: { x: number, y: number, index: number, pointIndex: number }[] = [];
      
      const animate = () => {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();
        
        // 清空粒子位置数组
        allParticlePositions.length = 0;
        
        // 首先收集所有粒子的位置
        points.forEach((point, pointIndex) => {
          const positions = point.geometry.attributes.position;
          for (let i = 0; i < positions.count; i++) {
            allParticlePositions.push({
              x: positions.array[i * 3],
              y: positions.array[i * 3 + 1],
              index: i,
              pointIndex: pointIndex
            });
          }
        });
        
        // 更新每组粒子
        points.forEach((point, pointIndex) => {
          const positions = point.geometry.attributes.position;
          const velocities = point.geometry.attributes.velocity;
          const rotations = point.geometry.attributes.rotation;
          const scales = point.geometry.attributes.scale;
          const opacities = point.geometry.attributes.opacity;
          const material = point.material as THREE.PointsMaterial;
          
          for (let i = 0; i < positions.count; i++) {
            // 应用速度
            positions.array[i * 3] += velocities.array[i * 3] * delta * 50;
            positions.array[i * 3 + 1] += velocities.array[i * 3 + 1] * delta * 50;
            
            // 添加噪声扰动
            const px = positions.array[i * 3] / 100;
            const py = positions.array[i * 3 + 1] / 100;
            const pz = time * 0.2;
            
            const noiseX = noise.noise3d(px, py, pz) * delta * 20;
            const noiseY = noise.noise3d(px + 100, py + 100, pz) * delta * 20;
            
            positions.array[i * 3] += noiseX;
            positions.array[i * 3 + 1] += noiseY;
            
            // 旋转粒子
            rotations.array[i] += delta * (Math.random() * 0.5 + 0.5);
            
            // 重置不透明度
            //opacities.array[i] = Math.min(opacities.array[i] + delta * 0.5, 1.0);
            
            // 重置离开视野的粒子
            if (
              positions.array[i * 3] > window.innerWidth / 2 + 100 ||
              positions.array[i * 3] < -window.innerWidth / 2 - 100 ||
              positions.array[i * 3 + 1] > window.innerHeight / 2 + 100 ||
              positions.array[i * 3 + 1] < -window.innerHeight / 2 - 100
            ) {
              // 随机选择从左侧、右侧或顶部重新进入
              const entryPoint = Math.random() * 3; // 0-1: 左侧, 1-2: 右侧, 2-3: 顶部
              
              if (entryPoint < 1) {
                // 从左侧进入
                positions.array[i * 3] = -window.innerWidth / 2 - 50;
                positions.array[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
                
                // 向右上方移动（约30度角）
                const angle = Math.PI / 6; // 30度
                velocities.array[i * 3] = (Math.random() * 0.5 + 0.5) * Math.cos(angle);
                velocities.array[i * 3 + 1] = (Math.random() * 0.5 + 0.5) * Math.sin(angle);
              } 
              else if (entryPoint < 2) {
                // 从右侧进入
                positions.array[i * 3] = window.innerWidth / 2 + 50;
                positions.array[i * 3 + 1] = (Math.random() - 0.5) * window.innerHeight;
                
                // 向左上方移动（约150度角）
                const angle = Math.PI - Math.PI / 6; // 150度
                velocities.array[i * 3] = (Math.random() * 0.5 + 0.5) * Math.cos(angle);
                velocities.array[i * 3 + 1] = (Math.random() * 0.5 + 0.5) * Math.sin(angle);
              }
              else {
                // 从顶部进入
                positions.array[i * 3] = (Math.random() - 0.5) * window.innerWidth;
                positions.array[i * 3 + 1] = window.innerHeight / 2 + 50;
                
                // 随机选择左下或右下方向
                const leftOrRight = Math.random() > 0.5;
                const angle = leftOrRight ? Math.PI * 0.75 : Math.PI * 0.25;
                velocities.array[i * 3] = (Math.random() * 0.5 + 0.5) * Math.cos(angle);
                velocities.array[i * 3 + 1] = -(Math.random() * 0.5 + 0.5) * Math.sin(angle);
              }
              
              positions.array[i * 3 + 2] = (Math.random() - 0.5) * 200;
            }
            
            // 鼠标交互
            if (interactionEnabled) {
              const dx = positions.array[i * 3] - mousePosition.current.x;
              const dy = positions.array[i * 3 + 1] - mousePosition.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 150) {
                const force = (1 - distance / 150) * delta * 300;
                positions.array[i * 3] += dx / distance * force;
                positions.array[i * 3 + 1] += dy / distance * force;
                
                // 临时增大缩放
                scales.array[i] = Math.min(scales.array[i] + delta * 2, 2.0);
              } else {
                // 缓慢恢复正常大小
                scales.array[i] = Math.max(scales.array[i] * (1 - delta * 0.5), 0.5);
              }
            }
            
            // 粒子间碰撞检测
            const particleX = positions.array[i * 3];
            const particleY = positions.array[i * 3 + 1];
            const collisionRadius = 80; // 增加碰撞检测半径使粒子间距更大
            
            // 检测与其他粒子的碰撞
            for (const other of allParticlePositions) {
              // 跳过自己
              if (other.pointIndex === pointIndex && other.index === i) continue;
              
              const dx = particleX - other.x;
              const dy = particleY - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < collisionRadius) {
                // 移除透明度修改，仅增加粒子间斥力
                if (distance > 0) {
                  // 增强斥力，确保粒子不会重叠
                  const repelForce = (1 - distance / collisionRadius) * delta * 250; // 增加斥力强度
                  positions.array[i * 3] += dx / distance * repelForce;
                  positions.array[i * 3 + 1] += dy / distance * repelForce;
                }
              }
            }
            
            // 将材质不透明度固定为1，确保始终完全不透明
            material.opacity = 1.0;
          }
          
          positions.needsUpdate = true;
          velocities.needsUpdate = true;
          rotations.needsUpdate = true;
          scales.needsUpdate = true;
          opacities.needsUpdate = true;
        });
        
        renderer.render(scene, camera);
      };
      
      animate();
    });
    
    // 窗口调整大小处理器
    const handleResize = () => {
      if (!rendererRef.current) return;
      
      camera.left = window.innerWidth / -2;
      camera.right = window.innerWidth / 2;
      camera.top = window.innerHeight / 2;
      camera.bottom = window.innerHeight / -2;
      camera.updateProjectionMatrix();
      
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    // 鼠标移动处理
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = event.clientX - window.innerWidth / 2;
      mousePosition.current.y = -event.clientY + window.innerHeight / 2;
    };
    
    // 设备方向处理
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta && event.gamma) {
        // 将陀螺仪数据映射到场景中
        const multiplier = 20;
        mousePosition.current.x = event.gamma * multiplier;
        mousePosition.current.y = event.beta * multiplier;
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [density, interactionEnabled]);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"
    />
  );
};

export default EmojiQuantumField;