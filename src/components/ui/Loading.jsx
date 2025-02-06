import loader from '../../assets/gifs/loading2.gif';

const Loading = ()=>{
    return (
        <div className='w-[max-content] mx-auto'>
            <img className='w-[50px]' src={loader} alt='loading' />
        </div>
    )
}

export default Loading;