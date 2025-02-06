import reactjs from '../../../assets/reactjs.png';
import express from '../../../assets/expressjs.png';
import nodejs from '../../../assets/nodejs.png';
import mongodb from '../../../assets/mongodb.png';
import tailwindcss from '../../../assets/tailwindcss.png';

const Technologies = () => {
  return (
    <div className='my-24 px-10'>
        <h1 className='subscription-font text-3xl font-medium text-[#262544] text-center'>Technologies Used</h1>

        <div className='mt-10 flex flex-col lg:flex-row items-center lg:gap-16 justify-center'>
            <img className='h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square' src={mongodb} />
            <img className='h-[10rem] lg:h-auto lg:w-[10rem] object-contain aspect-square' src={express} />
            <img className='h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square mb-10 lg:mb-0' src={reactjs} />
            <img className='h-[10rem] lg:h-auto lg:w-[7rem] object-contain aspect-square' src={nodejs} />
            <img className='h-[12rem] lg:h-auto lg:w-[15rem] object-contain aspect-square -mt-8 lg:mt-0' src={tailwindcss} />
        </div>
    </div>
  )
}

export default Technologies