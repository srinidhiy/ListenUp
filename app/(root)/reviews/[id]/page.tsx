async function Page({ params}: {params: {id: string}}) {
    return <h1 className="head-text">{params.id}</h1>
}

export default Page;