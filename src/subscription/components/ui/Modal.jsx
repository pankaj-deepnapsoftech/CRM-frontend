import ReactDOM from 'react-dom';

const Backdrop = (props)=>{
    return <div onClick={props.hideModal} className="z-[100] h-[-webkit-fill-available] w-[100%] fixed opacity-50 bg-[#8a8a8a]">
    </div>
}

const ModalOverlay = (props)=>{
    // return <div className="z-30 bg-white px-5 py-10 rounded-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-h-[1400px] md:w-[80%] xl:w-[500px] xl:max-h-[550px]">
    return <div className="z-[100] bg-white overflow-hidden rounded-3xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[90%] max-h-[1400px] md:w-[80%]">
        {props.children}
    </div>
}

const Modal = ({children, hideModal = ()=>{}}) => {
    const portalElement = document.getElementById('overlays');

  return (
    <>
        {ReactDOM.createPortal(<Backdrop hideModal={hideModal} />, portalElement)}
        {ReactDOM.createPortal(<ModalOverlay hideModal={hideModal}>{children}</ModalOverlay>, portalElement)}
    </>
  )
}

export default Modal;