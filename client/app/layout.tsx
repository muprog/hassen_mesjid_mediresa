import './globals.css'
import { Providers } from './store/provider'
import { AuthGuard } from './components/AuthGuard'
import DashboardLayout from './components/DashboardLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <AuthGuard>
            <DashboardLayout>{children}</DashboardLayout>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  )
}
