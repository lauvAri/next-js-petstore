import Footer from "@/app/common/footer";
import Header from "@/app/common/header";
import { springBoot } from "@/app/config";
import { parseDescription } from "@/app/utils";
export default async function Item({ params }: { params: { id: string } }) {
    const { item } = await getData(params.id);
    const { image, text } = parseDescription(item.product.description)
    return (
        <div className="flex flex-col h-screen">
            <Header></Header>
            <div className="flex-1 flex flex-col items-center justify-center">
                <ul className="border-5 border-rose-400 rounded-lg p-6 bg-orange-200">
                    <li><img src={"/"+ image} alt="商品图片" /></li>
                    <li className="italic text-rose-500 underline">{text}</li>
                    <li>{item.attribute1}</li>
                    <li>{item.product.name}</li>
                    <li>{item.itemId}</li>
                    <li className="text-rose-500 font-bold">{"$" + item.listPrice}</li>
                    <li>{item.quantity + " in stock"}</li>
                    <li className="mt-6 bg-black w-fit text-white font-bold p-2 rounded-lg hover:bg-neutral-700 cursor-pointer">Add to Chart</li>
                 </ul>
            </div>
            <Footer></Footer>
        </div>
    )
}

type item = {
    itemId: string,
    listPrice: number,
    attribute1: string,
    quantity: number,
    product: product
}

type product = {
    description: string,
    productId: string
    name: string
}

async function getData(id: string) {
    const res = await fetch(`${springBoot}/api/item?id=${id}`)
    if (!res.ok) throw new Error("获取数据失败")
    return res.json();
}