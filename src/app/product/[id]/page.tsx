import Footer from "@/app/common/footer"
import Header from "@/app/common/header"
import { springBoot } from "@/app/config"
import { parseDescription} from "@/app/utils"
export default async function Product({ params }: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id;
    const { itemList, product } = await getData(id);
    const {image, text} = parseDescription(product.description)
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 flex flex-col justify-center items-center">
                <p className="font-bold mb-5 text-2xl italic">{ product.name}</p>
                <table className="border-8 border-red-100">
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
                                <td className="border-2 p-2 bg-yellow-50">{item.product.name}</td>
                                <td className="underline border-2 p-2 bg-yellow-50"><a href={`/item/${item.itemId}`}>{item.itemId}</a></td>
                                <td className="border-2 p-2 bg-yellow-50">{item.listPrice}</td>
                                <td className="border-2 p-2 bg-yellow-50">{item.attribute1}</td>
                                <td className="border-2 p-2 bg-yellow-50"><img src={ "/" + image} alt="图片" /></td>
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

type product = {
    category: string,
    name: string
}

type item = {
    itemId: string,
    listPrice: number,
    attribute1: string,
    product: product,
}




async function getData(id: string) {
    const res = await fetch(`${springBoot}/api/product?id=${id}`)
    if (!res.ok) throw new Error("获取数据失败")
    return res.json();
}