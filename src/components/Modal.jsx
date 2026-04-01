import { React, useEffect, useRef } from 'react'


export const Modal = ({ isOpen, close, children }) => {

    const maindiv = useRef(null)


    function handleKey(event)
    {
        console.log("keypressed")
        if (event.key == "Escape") {
            close()
        }


    }

    function handleMouse(event) {

        console.log("click detected")

        if (maindiv.current && event.target != maindiv.current)
        {
            close()
        }

    }

    useEffect(() => {

        if(maindiv.current){
            document.addEventListener("keydown", handleKey)
            
        document.body.style.overflow = "hidden"

            //document.addEventListener("click", handleMouse)

        }


        return ()=>{
            document.removeEventListener("keydown", handleKey)
            document.removeEventListener("click", handleMouse)
            document.body.style.overflow = ""
        }


    }, [isOpen]);

    if (!isOpen) {
        return null
    }

    return (
        <div onClick={close} className='modal'>
            <div onClick={e => e.stopPropagation()} ref={maindiv}  className='modal-content'>
                <div style={{ position: "sticky", marginTop:"-3rem",  width:"fit-content", marginLeft:"auto", marginRight:"0.5rem", top:5}} 
                className='menubutton active' onClick={close}>
                    <button>X</button>

                </div>


                {children}
            </div>
        </div>
    )
}


