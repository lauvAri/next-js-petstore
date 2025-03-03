import Footer from "@/app/common/footer";
import Header from "@/app/common/header";
import { springBoot } from "@/app/config";
import { parseDescription } from "@/app/utils";


export default async function Search({ params }: {
    params: Promise<{ keyword: string }>
}) {
    const keyword = (await params).keyword;
    const { suggestion: productList } = await getData(keyword);
    console.log(productList);
    return (
        <div className="flex flex-col h-screen">
            <Header></Header>
            <div className="flex-1 self-center mt-4
             grid grid-cols-2 gap-2 justify-items-center
             auto-rows-min
             w-fit overflow-y-auto">
                {
                    productList.map((item: Product) => (
                        <div key={item.productId}
                            className="bg-lime-50 w-fit p-4 border-2 border-black rounded-2xl
                            flex flex-row gap-2 items-center justify-center
                            h-48">
                            <img src={"/" + parseDescription(item.description).image} alt="img" />
                            <div className="w-60">
                                <p className="text-xl font-bold">{item.name}</p>
                                <p className="underline text-blue-500">
                                    <a href={`/product/${item.productId}`}>{item.productId}</a>
                                </p>
                                <p>{item.categoryId}</p>
                                <p className="truncate">{parseDescription(item.description).text }</p>
                            </div>
                        </div>
                        
                    ))
                }
            </div>
            <Footer></Footer>
        </div>
    )
}

type Product = {
    productId: string,
    name: string,
    categoryId: string,
    description: string,
}

async function getData(keyword: string) {
    const res = await fetch(`${springBoot}/api/search?keyword=${keyword}`)
    if (!res.ok) throw new Error("获取数据失败")
    return res.json();
}