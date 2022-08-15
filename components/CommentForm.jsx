import React, {useState, useEffect} from 'react'
import { submitComment } from '../services'

export const CommentForm = ({slug}) => {
	const [error, setError] = useState(false);
  const [localStorage, setLocalStorage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', comment: '', storeData: false });

	useEffect(() => {
		setLocalStorage(window.localStorage)

		const initFormData = {
			name: window.localStorage.getItem('name') ?? '',
			email: window.localStorage.getItem('email') ?? '',
			storeData : (window.localStorage.getItem('name') || window.localStorage.getItem('email')) ?? false
		}

		// console.log(initFormData)
		setFormData(initFormData)
	}, [])

	const handleChange = (e) => {
		if(e.target.type === 'checkbox') {
			setFormData(prev => ({
				...prev,
				[e.target.name]: e.target.checked
			}))
		} else{
			setFormData(prev => ({
				...prev,
				[e.target.name]: e.target.value
			}))
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		setError(false)

		const {name, email, comment, storeData} = formData

		if(!name || !email || !comment) {
			setError(true)
			return
		}

    const newComment = {
			name,
			email,
			comment,
			slug
		} 

		if (storeData) {
      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('name');
      localStorage.removeItem('email');
    }

		submitComment(newComment)
		.then( res => {
			if(res.createComment){
				if(!storeData){
					formData.name = ''
					formData.email = ''
				}
				formData.comment = ''
				
				setFormData(prev => (
					{
						...prev,
						...formData
					}
				))
        setShowSuccessMessage(true)
				setTimeout(() => {
					setShowSuccessMessage(false)
				}, 3000)
			}
		})
	}

	return (
		<div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
			<h3 className="text-xl mb-8 font-semibold border-b pb-4">
				Leave a Reply
			</h3>
			<div className="grid grid-cols-1 gap-4 mb-4">
				<textarea
					value={formData.comment}
					onChange={handleChange}	
					className='p-4 outline-none w-full rounded-lg h-40 focus:ring-gray-200 bg-gray-100 text-gray-700'
					name='comment' 
					placeholder='Leave a comment'
				/>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
				<input 
					type="text"
					value={formData.name}
					onChange={handleChange}
					className='py-2 px-4 outline-none w-full rounded-lg focus:ring-gray-200 bg-gray-100 text-gray-700'
					name='name'
					placeholder='Name'
				/>
				<input 
					type="email" 
					value={formData.email} 
					onChange={handleChange} 
					className="py-2 px-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" 
					placeholder="Email" 
					name="email" 
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 mb-4">
				<div>
					<input
						type="checkbox"
						checked={formData.storeData}
						onChange={handleChange}
						id='storeData'
						name='storeData'
						value='true'
					/>
					<label 
						className="text-gray-500 cursor-pointer ml-2" 
						htmlFor="storeData"
					> 
						Save my name, email in this browser for the next time I comment.
					</label>
				</div>
			</div>
			{error && <p className="text-red-500 text-sm">Please fill out all fields</p>}
			<div className="mt-8">
				<button
					type='button'
					onClick={handleSubmit}
					className='transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer'
				>
					Post Comment
				</button>
				{showSuccessMessage && <span className="text-xl float-right font-semibold mt-3 text-green-500">
					Comment submitted for review
				</span>}
			</div>
		</div>
	)
}