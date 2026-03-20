import SystemCheckClient from '@/components/system/SystemCheckClient'
import React from 'react'

export default function SystemCheckPage() {
	// Server component: prepares any server data if needed, renders client component inside
	return (
		<div className="min-h-screen flex items-center justify-center p-6">
			{/* Client component is responsible for runtime checks and interactivity */}
			<SystemCheckClient />
		</div>
	)
}
