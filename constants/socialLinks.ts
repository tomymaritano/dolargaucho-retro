import { IconType } from 'react-icons';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export interface SocialLink {
  icon: IconType;
  label: string;
  href: string;
  username?: string;
  color: string;
  hoverGradient: {
    from: string;
    to: string;
  };
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: FaGithub,
    label: 'GitHub',
    href: 'https://github.com/tomymaritano',
    username: '@tomymaritano',
    color: '#181717',
    hoverGradient: {
      from: 'rgba(128, 128, 128, 0.5)',
      to: 'rgba(0, 0, 0, 0.5)',
    },
  },
  {
    icon: FaTwitter,
    label: 'Twitter',
    href: 'https://twitter.com/hacklabdog',
    username: '@hacklabdog',
    color: '#1DA1F2',
    hoverGradient: {
      from: 'rgba(29, 161, 242, 0.3)',
      to: 'rgba(12, 133, 208, 0.3)',
    },
  },
  {
    icon: FaLinkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/tomymaritano',
    username: '/in/tomymaritano',
    color: '#0A66C2',
    hoverGradient: {
      from: 'rgba(10, 102, 194, 0.3)',
      to: 'rgba(0, 65, 130, 0.3)',
    },
  },
  {
    icon: FaEnvelope,
    label: 'Email',
    href: 'mailto:contacto@dolargaucho.com',
    username: 'contacto@dolargaucho.com',
    color: '#EA4335',
    hoverGradient: {
      from: 'rgba(234, 67, 53, 0.3)',
      to: 'rgba(200, 30, 20, 0.3)',
    },
  },
];
