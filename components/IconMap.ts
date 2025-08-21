import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Pin, Youtube, Twitter, Linkedin, LucideProps, MessageCircle, TikTok } from 'lucide-react';
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
  TikTok: TikTok,
  WhatsApp: MessageCircle,
};