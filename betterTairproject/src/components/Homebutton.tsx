// HomeButton.tsx
import React, { useState } from 'react';


const HomeButton: React.FC= ({ }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      style={{
        backgroundColor: isHovered ? '#45a049' : '#4CAF50', // 根据鼠标悬停状态改变背景颜色
        border: 'none', // 无边框
        color: 'white', // 白色文字
        padding: '10px 20px', // 内边距
        textAlign: 'center', // 文本居中
        textDecoration: 'none', // 无下划线
        display: 'inline-block', // 行内块元素
        fontSize: '16px', // 字体大小
        margin: '4px 2px', // 外边距
        cursor: 'pointer', // 鼠标悬停时显示指针
        borderRadius: '8px', // 圆角边框
        transition: 'background-color 0.3s', // 背景色过渡效果
      }}
      onMouseEnter={handleMouseEnter} // 绑定鼠标进入事件
      onMouseLeave={handleMouseLeave} // 绑定鼠标离开事件
    >
      返回主页
    </button>
  );
};

export default HomeButton;