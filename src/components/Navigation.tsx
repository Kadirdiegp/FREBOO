import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/motocross', label: 'Motocross' },
    { href: '/portrait', label: 'Portrait' },
    { href: '/produktfotografie', label: 'Produktfotografie' },
    { href: '/kontakt', label: 'Kontakt' }
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      height: '100vh',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const itemVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-50"
          >
            <Link href="/" className="block">
              <Logo width={120} height={40} className="text-white" />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Link href={item.href} className={`text-lg cursor-pointer ${
                  router.pathname === item.href ? 'text-[#89cff0]' : 'text-white'
                } hover:text-[#89cff0] transition-colors duration-200`}>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 flex flex-col items-end space-y-1.5">
              <motion.span
                className="w-full h-0.5 bg-white block"
                animate={{
                  rotateZ: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                  width: '100%'
                }}
              />
              <motion.span
                className="h-0.5 bg-white block"
                animate={{
                  width: isOpen ? '100%' : '75%',
                  opacity: isOpen ? 0 : 1
                }}
              />
              <motion.span
                className="h-0.5 bg-white block"
                animate={{
                  rotateZ: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                  width: isOpen ? '100%' : '50%'
                }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href} className={`text-2xl ${
                    router.pathname === item.href ? 'text-[#89cff0]' : 'text-white'
                  } hover:text-[#89cff0] transition-colors`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;