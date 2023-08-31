import { currentUser } from "@clerk/nextjs";

async function Page({ params}: {params: {id: string}}) {
    const user = await currentUser();
    if (!user) return null;
    return (<h1 className="head-text">{params.id}</h1>)
}

export default Page;