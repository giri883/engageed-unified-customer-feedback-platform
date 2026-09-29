import React, { useState, useEffect, useRef } from 'react';

interface PageTransitionProps {
  viewKey: string;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ viewKey, children }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [currentKey, setCurrentKey] = useState(viewKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'exit' | 'enter'>('idle');
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    if (viewKey !== currentKey) {
      // Start exit animation
      setIsTransitioning(true);
      setStage('exit');

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        // Swap content and start enter animation
        setDisplayChildren(children);
        setCurrentKey(viewKey);
        setStage('enter');

        timeoutRef.current = setTimeout(() => {
          setStage('idle');
          setIsTransitioning(false);
        }, 350);
      }, 250);
    } else {
      setDisplayChildren(children);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [viewKey, children, currentKey]);

  const getStyleClass = () => {
    switch (stage) {
      case 'exit':
        return 'opacity-0 scale-[0.96] -translate-y-2.5 transition-all duration-250 ease-in';
      case 'enter':
        return 'opacity-100 scale-100 translate-y-0 transition-all duration-350 ease-out';
      case 'idle':
      default:
        return 'opacity-100 scale-100 translate-y-0 transition-all duration-300 ease-out';
    }
  };

  return (
    <div className={`w-full ${getStyleClass()} will-change-[transform,opacity]`}>
      {displayChildren}
    </div>
  );
};
