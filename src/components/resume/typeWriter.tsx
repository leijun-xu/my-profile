'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number; // 每个字符的间隔时间（毫秒）
    onComplete?: () => void;
}

export function Typewriter({ text, speed = 50, onComplete }: TypewriterProps) {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, speed, onComplete]);

    return <span>{displayText}</span>;
}