import Footer from "@/app/common/footer"
import Header from "@/app/common/header"
import { springBoot, backendUrl } from "@/app/config"
import { parseDescription} from "@/app/utils"
import Link from "next/link"
export default async function Product({ params }: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const { itemList, productName, description} = await getData(id);
    const {image, text} = parseDescription(description)
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 flex flex-col justify-center items-center">
                <p className="font-bold mb-5 text-2xl italic">{ productName}</p>
                <table className="border-4 border-zinc-200">
                    <thead>
                        <tr className="bg-lime-200">
                            <th className="border-2 border-gray-300 px-4 py-2">Name</th>
                            <th className="border-2 border-gray-300 px-4 py-2">Item Id</th>
                            <th className="border-2 border-gray-300 px-4 py-2">Price</th>
                            <th className="border-2 border-gray-300 px-4 py-2">Attribute</th>
                            <th className="border-2 border-gray-300 px-4 py-2">Image</th>
                            <th className="border-2 border-gray-300 px-4 py-2">Intro</th>
                            <th className="border-2 border-gray-300 px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList.map((item: item) => (
                            <tr key={item.itemId}>
                                <td className="border-2 p-2 bg-yellow-50">{productName}</td>
                                <td className="underline border-2 p-2 bg-yellow-50"><Link href={`/item/${item.itemId}`}>{item.itemId}</Link></td>
                                <td className="border-2 p-2 bg-yellow-50">{item.listPrice}</td>
                                <td className="border-2 p-2 bg-yellow-50">{item.attribute1}</td>
                                <td className="border-2 p-2 bg-yellow-50"><img src={ `${backendUrl}` + image} alt="图片" width="60"/></td>
                                <td className="border-2 p-2 bg-yellow-50">{text}</td>
                                <td className="border-2 p-2 bg-yellow-50">
                                    <button className="bg-black text-white p-2 rounded-lg font-bold cursor-pointer hover:bg-stone-600">Add to Cart</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    )
}

type item = {
    itemId: string,
    productId:string,
    listPrice: number,
    unicost: number,
    status: string,
    attribute1: string,
    modifying: number,
}




async function getData(id: string) {
    const res = await fetch(`${backendUrl}/catalog/product/${id}`)
    if (!res.ok) throw new Error("获取数据失败")
    return res.json();
}