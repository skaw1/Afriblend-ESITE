import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Pin, Youtube, Twitter, Linkedin, LucideProps, MessageCircle, Music } from 'lucide-react';
import { IconName } from '../types';

export const IconMap: Record<IconName, React.FC<LucideProps>> = {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Pin,
  Youtube,
  Twitter,
  Linkedin,
  TikTok: Music,
  WhatsApp: MessageCircle,
};