import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width = 120, height = 40, className = '' }: LogoProps) => {
  return (
    <Image
      src="/images/FRE BO.png"
      alt="FRE BO Media Logo"
      width={width}
      height={height}
      className={`${className} transition-opacity hover:opacity-80`}
      priority
    />
  );
};

export default Logo;
