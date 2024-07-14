"use client"
import React from 'react'
import{projects} from '@/data'
import { HoverEffect } from './ui/card'
const items = projects.map(({ Title, des, link }) => ({
    title: Title,
    description: des,
    link,}));
const RecentProjects = () => {
    const items1 = [
        {
          title:'hehe' ,
          description: 'skjdfn',
          link: "https://example.com"
        }
      ];
  return (
    <div className='py-20'>
        <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white'>
            A small selection of{' '}
            <span  className='text-purple'>recent Projects</span>
        </h1>
        <div className='flex flex-wrap items-center justify-center p-4 gap-16 mt-10'>

        <HoverEffect items={items} />

        </div>
    </div>
  )
}

export default RecentProjects