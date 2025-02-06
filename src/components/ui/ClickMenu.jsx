import { useEffect, useRef } from "react";

const ClickMenu = ({top,left,bottom,right,children,closeContextMenuHandler}) => {

  const containerRef = useRef();

  const styleObj = {
    top: top !== undefined ? `${top}px` : undefined,
    left: left !== undefined ? `${left}px` : undefined,
    bottom: bottom !== undefined ? `${bottom}px` : undefined,
    right: right !== undefined ? `${right}px` : undefined,
    boxShadow: "0px 0px 2px #b7b2b2"
  }

  useEffect(()=>{   
    document.addEventListener('mousedown', (e)=>{
      if(containerRef.current && !containerRef.current.contains(e.target)){
        closeContextMenuHandler();
      }
    })

    document.addEventListener('touchstart', (e)=>{
      if(containerRef.current && !containerRef.current.contains(e.target)){
        closeContextMenuHandler();
      }
    })

    return ()=>{
        document.removeEventListener('mousedown', (e)=>{
          if(containerRef.current && !containerRef.current.contains(e.target)){
            closeContextMenuHandler();
          }
        })
    
        document.removeEventListener('touchstart', (e)=>{
          if(containerRef.current && !containerRef.current.contains(e.target)){
            closeContextMenuHandler();
          }
        })
    }

  }, []);
    
  return (
    <div style={styleObj} ref={containerRef} className='absolute z-30 rounded-md'>
      {children}
    </div>
  )
}

export default ClickMenu;