import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import Topbar from "@/components/shared/Topbar"
import '../globals.css' 

export const metadata = {
    title: 'ListenUp',
    description: 'Next.js 13 Music Platform Application'
}

const inter = Inter({subsets: ["latin"]})

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} bg-gradient-to-r from-zinc-900 to-green-900`}>
                    <Topbar />
                    <section className="welcome-container">
                        <div className='w-full max-w-4xl'>
                        {children}
                        </div>
                    </section>
                </body>
            </html>
        </ClerkProvider>
    )
}