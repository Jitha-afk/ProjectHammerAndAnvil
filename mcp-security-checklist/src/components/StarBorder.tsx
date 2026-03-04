import React from 'react';

type StarBorderBaseProps = {
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

type StarBorderAnchorProps = StarBorderBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
  };

type StarBorderButtonProps = StarBorderBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type StarBorderProps = StarBorderAnchorProps | StarBorderButtonProps;

const StarBorder = ({
  as = 'button',
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps) => {
  const { style, ...componentProps } = rest;
  const componentStyle = {
    padding: `${thickness}px 0`,
    ...(style as React.CSSProperties)
  };

  const content = (
    <>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="relative z-1 border border-sidebar-border bg-[linear-gradient(to_bottom,var(--sidebar),var(--background))] text-sidebar-foreground text-center text-[16px] py-[16px] px-[26px] rounded-[20px]">
        {children}
      </div>
    </>
  );

  if (as === 'a') {
    return (
      <a
        className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
        {...(componentProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        style={componentStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      {...(componentProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      style={componentStyle}
      type={(componentProps as React.ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
    >
      {content}
    </button>
  );
};

export default StarBorder;

// tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       animation: {
//         'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
//         'star-movement-top': 'star-movement-top linear infinite alternate',
//       },
//       keyframes: {
//         'star-movement-bottom': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
//         },
//         'star-movement-top': {
//           '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
//           '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
//         },
//       },
//     },
//   }
// }
