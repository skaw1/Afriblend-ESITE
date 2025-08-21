import React from 'react';
import { Phone, Mail, MapPin, LucideProps } from 'lucide-react';
import { IconName } from '../types';

export const IconMap: Record<IconName, React.FC<LucideProps>> = {
  Phone,
  Mail,
  MapPin,
};