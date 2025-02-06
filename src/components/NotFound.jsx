import image from '../assets/images/not-found.png';

const NotFound = ()=>{
    return (
        <div className='min-h-[100vh] flex items-center justify-center'>
            <img className='w-[50%]' src={image} alt='Not Found' />
        </div>
    )
}

export default NotFound;