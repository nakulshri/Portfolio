'use client'
import { cn } from "@/utils/cn";

import { useState } from "react";
import animationData from '@/data/confeti.json';
import Lottie from "react-lottie";

import MagicButton from "./magicbutton";
import { IoCopyOutline } from "react-icons/io5";
import { BackgroundGradientAnimation } from "./Bgradient";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        // change gap-4 to gap-8, change grid-cols-3 to grid-cols-5, remove md:auto-rows-[18rem], add responsive code
        "grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  id,
  img,
  imgClassName,
  spareImg,
  titleClassName,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  id:number;
  img:string
  imgClassName:string
  titleClassName:string
  spareImg:string
}) => {
  const leftLists = ["ReactJS", "Mysql", "Ui/Ux"];
  const rightLists = ["Python", "NextJS", "C++"];
  const handleCopy = () => {
    const text = "nakuljpshrivastava@gmail.com";
    navigator.clipboard.writeText(text);
    setCopied(true);
  };
  const [copied, setCopied] = useState(false);
  return (
    <div
    className={cn(
      // remove p-4 rounded-3xl dark:bg-black dark:border-white/[0.2] bg-white  border border-transparent, add border border-white/[0.1] overflow-hidden relative
      "row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4",
      className
    )}
      style={{
        background: 'rgb(37,0,43)',
        backgroundColor: 'linear-gradient(90deg, rgba(37,0,43,1) 0%, rgba(67,5,93,1) 19%, rgba(58,3,83,0.7061469265367316) 43%, rgba(5,0,11,0.08245877061469264) 100%)'
      }}
    >
      <div className={`${id===6&&'flex justify-center' }h-full`}>
        <div className="w-full h-full absolute">
          {img &&(
            <img 
            src={img}
            alt={img}
            className={cn(imgClassName,'object-cover, object-center')}
            />
          )}
        </div>
        <div
          className={`absolute right-0 -bottom-0 ${id === 5 && "w-full h-full opacity-80"
            } `}
        >
          {spareImg && (
            <img
              src={spareImg}
              alt={spareImg}
              //   width={220}
              className="object-cover object-center w-full h-full"
            />
          )}
                
              </div>
              {id === 6 && (
          // add background animation , remove the p tag
          <BackgroundGradientAnimation>
            <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl"></div>
          </BackgroundGradientAnimation>
        )}
              <div className={cn(
                titleClassName,'group-hover:/ bento:translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10'
              )}>
                  <div className=" className=font-sans font-extralight  text-white-200 text-sm md:text-xs lg:text-base z-10">
                    {description} 
                  </div>
                  <div className="font-sans font-bold text-lg lg:text-3xl max-w-96 z-10">
                   {title}
                  </div>
              

                  {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              {/* tech stack lists */}
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3  rounded-lg text-center bg-[#10132E]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg text-center bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                  </div>
                </div>
              )}
              {id===6 && (
                <div className="mt-5 relative">
                  <div className={`absolute -bottom-5 right-0`}>
                      <Lottie options={{
                        loop:copied,
                        autoplay: copied,
                        animationData,
                        rendererSettings:{
                          preserveAspectRatio:'xMidyMid slice',
                        }
                      }}/>
                    </div>
                    <MagicButton
                        title={copied ? "Email is Copied!" : "Copy my email address"}
                        icon={<IoCopyOutline />}
                        position="left"
                        handleClick={handleCopy}
                        otherClasses="!bg-[#161A31]"
                        
                    />
                    

                   
                  </div>
              )}
      </div>    
    </div>
    </div>
      );
};
