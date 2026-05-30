import TabNav from '@/layout/tagstatus/navtagstatus'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TabNav />
      <div className="p-4">{children}</div>
    </>
  )
}