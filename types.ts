import React from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  role: string;
  stat: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  icon: React.ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  avatar: string;
  quote: string;
}