import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
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
                <body className={`${inter.className} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}