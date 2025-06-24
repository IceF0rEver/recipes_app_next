'use client'

import { useI18n } from '@/locales/client'

export default function Home() {
	const t = useI18n()
	return <div className="flex items-center justify-center h-screen">{t('test')}</div>
}
