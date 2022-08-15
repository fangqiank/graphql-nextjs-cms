import React, {useState, useEffect} from 'react'

import {AdjacentPostCard} from './AdjacentPostCard'
import { getAdjecentPosts } from '../services'

export const AdjacentPosts = ({slug, createdAt}) => {
	const [adjacentPost, setAdjacentPost] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		getAdjecentPosts(slug, createdAt)
			.then(data => {
				setLoading(true)
				setAdjacentPost(data)
			})
	}, [slug])

	return (
		<div className='grid grid-cols-1 lg:grid-cols-8 gap-12 mb-8'>
			{loading  && (
				<>
					{adjacentPost.previous && (
						<div className={`${adjacentPost.next ? 'col-span-1 lg:col-span-4' :
						'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
							<AdjacentPostCard post={adjacentPost.previous} position="LEFT" />
						</div>
					)}

					{adjacentPost.next && (
						<div className={`${adjacentPost.previous ? 'col-span-1 lg:col-span-4' : 'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
							<AdjacentPostCard post={adjacentPost.next} position="RIGHT" />		
						</div>
					)}
				</>
			)}
		</div>
	)
}
