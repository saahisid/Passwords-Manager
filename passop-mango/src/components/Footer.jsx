import React from 'react'

const Footer = () => {
    return (
        <div className=' text-white bg-slate-800 flex flex-col justify-center items-center  w-full'>
            <div>
                <div className='logo font-bold  text-2xl '>
                    <span className='text-green-700'> &lt;</span>
                    Pass
                    <span className='text-green-700'>OP/&gt;</span>

                </div>
                <div className=' flex '>created with <img className = " w-7 mx-2  "src="heart.png" alt="" /> by saahisid</div>
            </div>
        </div>
    )
}

export default Footer
