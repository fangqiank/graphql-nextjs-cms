import React, {useEffect, useState} from 'react'
import moment from 'moment'
import parse from 'html-react-parser'

import { getComments } from '../services'

export const Comments = ({slug}) => {
	const [comments, setComments] = useState([])
	
	useEffect(() => {
		getComments(slug)
		.then(data => setComments(data))
	}, [])

	return (
		<>
			{comments.length > 0 && (
				<div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
					<h3 className="text-xl mb-8 font-semibold border-b pb-4">
						{comments.length} 
						{' '}
						Comments
					</h3>

					{comments.map((comment, idx) => (
						<div className="border-b" key={idx}>
							<p className="mb-4">
								<span className="font-semibold">
									{comment.name}
								</span>
								{' '}
								on
								{' '}
								{moment(comment.createdAt).format('MMMM Do YYYY')}
							</p>
							<p className="whitespace-pre-line text-gray-600 w-full">
								{parse(comment.comment)}
							</p>
						</div>
					))}
				</div>
			)}	
		</>
	)
}