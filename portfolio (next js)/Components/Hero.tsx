    import React from 'react'
    import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGen'
import ButtonLight from './ui/btn'

    function Hero() {
    return (
        <div className='pb-20 pt-36' >
            <div>
                <Spotlight  className='-top-40 -left-10
                md:-left-32 md:-top-20 h-screen'fill='purple'  />
                <Spotlight  className='top-10 left-full h-[80vh]
               w-[50vh]'fill='#4a148c'  />
                <Spotlight  className='top-28 left-80 h-[80vh]
                w-[50vh]
                'fill='#4a148c'  />
            </div>

            <div className="h-screen w-full dark:bg-black bg-white  dark:bg-dot-white/[0.18] bg-dot-black/[0.2] flex items-center justify-center absolute top-0 left-0">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
    </div>
    <div className='flex justify-center relative my-20 z-10'>
            <div className='max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center' >
                <h2 className='Uppercase tracking-widest text-xs text-center text-blue-100 max-w-80' >
                  
                </h2>

                <TextGenerateEffect
                className='text-center [text-40px] md:text-5xl lg:text-6xl'
                words='Crafting Ideas into Intuitive Digital Journeys'
                />
                <p className='text-center md:tracking-wider mb-4 textsm md:text-2xl'>
                    Hi, I am Nakul, a Web Developer
                    based in India
                </p> 
                <a href='#about'>
                <ButtonLight/>

                </a>
            </div>
    </div>

        </div>
    )
    }

    export default Hero
