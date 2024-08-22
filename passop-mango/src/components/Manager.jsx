import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({
        site: '',
        username: '',
        password: '',
    });
    const [passwordArray, setPasswordArray] = useState([]);

    const getPasswords = async () => {
        try {
            let req = await fetch("http://localhost:3001/");
            if (!req.ok) {
                throw new Error('Network response was not ok ' + req.statusText);
            }
            let passwords = await req.json();
            console.log(passwords);
            setPasswordArray(passwords);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    useEffect(() => {
        getPasswords();
    }, []);

    const copyText = (Text) => {
        toast('Copied to clipboard ', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark"
        });
        navigator.clipboard.writeText(Text);
    }

    const showPassword = () => {
        passwordRef.current.type = "text";
        if (ref.current.src.includes("eyecross.png")) {
            ref.current.src = "/eye.png";
            passwordRef.current.type = "password";
        } else {
            ref.current.src = "/eyecross.png";
            passwordRef.current.type = "text";
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            await fetch("http://localhost:3001/", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            });

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);

            await fetch("http://localhost:3001/", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: uuidv4() })
            });

            setForm({
                site: '',
                username: '',
                password: '',
            });
            toast('Password saved ', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark"
            });
        } else {
            toast('Error: Password not saved !');
        }
    };

    const deletePassword = async (id) => {
        console.log("deleting password with id ", id);
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            await fetch("http://localhost:3001/", {
                method: "DELETE", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            toast('Password deleted! ', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
                theme: "dark"
            });
        }
    }

    const editPassword = (id) => {
        console.log("editing password with id ", id);
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id });
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition='Bounce'
            />
            <ToastContainer />

            <div className='pt-7 p-2 md:mycontainer min-h-[88.5vh]'>
                <h1 className='p-2 text-white text-4xl font-bold text-center'>
                    <span className='text-green-700'>&lt;</span>
                    Pass
                    <span className='text-green-700'>OP/&gt;</span>
                </h1>
                <p className='text-green-800 text-center text-lg'>Your own password manager</p>
                <div className='text-white flex flex-col p-4 gap-8 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter Website URL' className='rounded-full border border-green-500 w-full text-black px-4 py-1' type="text" name='site' id='site' />
                    <div className='flex flex-col md:flex-row w-full justify-between gap-8'>
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full text-black px-4 py-1' type="text" name='username' id='username' />
                        <div className='relative'>
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full text-black px-4 py-1' type="password" name='password' id='password ' />
                            <span className='absolute right-[6px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex text-black justify-center items-center bg-green-600 hover:bg-green-500 rounded-full px-10 gap-2 py-2 w-fil border-2 border-green-950'>
                        <lord-icon
                            src="https://cdn.lordicon.com/zrkkrrpl.json"
                            trigger="hover"
                            stroke="bold"
                            state="hover-swirl"
                            colors="primary:#121331,secondary:#ffffff">
                        </lord-icon>
                        Save
                    </button>
                </div>
                <div className='password text-black '>
                    <h2 className='text-white font-bold text-2xl py-4 '>Your passwords</h2>
                    {passwordArray.length === 0 && <div className=' text-red-700'> No password to show </div>}
                    {passwordArray.length != 0 && <table className='table-auto w-full rounded-md overflow-hidden mb-10'>
                        <thead className='bg-slate-800 text- '>
                            <tr className='text-white'>
                                <th className='py-2' >Site</th>
                                <th className='py-2' >Username</th>
                                <th className='py-2' >Password</th>
                                <th className='py-2' >Action</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white'>
                            {passwordArray.map((item, index) => (
                                <tr key={index}>
                                    <td className=' py-1 border text-center '>
                                        <div className=' flex items-center justify-center '>
                                            <a href="{item.site}" target='_blank'>{item.site} </a>
                                            <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.site) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className=' text-center border py-1 ' >
                                        <div className=' flex items-center justify-center '>
                                            <span>{item.username}</span>
                                            <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className=' text-center border py-1 ' >
                                        <div className=' flex items-center justify-center '>
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className=' lordiconcopy size-7 cursor-pointer' onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover" >
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='  text-center border py-1 ' >
                                        <div className=' flex items-center justify-center '>
                                            <span className='cursor-pointer mx-1' onClick={() => { editPassword(item.id) }}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => { deletePassword(item.id) }}><lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ "width": "25px", "height": "25px" }}>
                                            </lord-icon>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    );
}

export default Manager;
