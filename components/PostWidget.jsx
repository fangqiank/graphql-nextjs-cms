import React, {useState, useEffect} from 'react'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'

import { getRecentPosts, getSimilarPosts } from '../services'

const grpahCMSImageLoader = x => {
	console.log({x})
	return x.src
}

export const PostWidget = ({categories, slug}) => {
	const [relatedPosts, setRelatedPosts] = useState([])

	useEffect(() => {
		if(slug){
			getSimilarPosts(slug, categories)
				.then(data => setRelatedPosts(data))
		}else{
			getRecentPosts()
				.then(data => setRelatedPosts(data))
		}
	}, [slug])

	console.log('related:', relatedPosts)

	return (
		<div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
			<h3 className='text-xl mb-8 font-semibold border-b pb-4'>
				{slug ? 'Related Posts' : 'Recent Posts'}
			</h3>
			{relatedPosts.map((post, idx) => (
				<div className='flex items-center w-full mb-4' key={idx}>
					<div className='w-16 flex-none`'>
						<Image 
							src={post.featuredImage.url}
							loader={grpahCMSImageLoader}
							alt={post.title}
							height='60px'
							width='60px'
							unoptimized
							className='align-middle rounded-full'
						/>	
					</div>

					<div className="flex-grow ml-4">
						<p className="text-gray-500 font-xs">
							{moment(post.createdAt).format('MMM DD, YYYY')}
						</p>
						<Link href={`/post/${post.slug}`} className='text-md'>
							{post.title}
						</Link>
					</div>
				</div>
			))}
		</div>
	)
}
