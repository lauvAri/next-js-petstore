import Footer from "@/app/common/footer";
import Header from "@/app/common/header";
import { springBoot, backendUrl } from "@/app/config";
import { parseDescription } from "@/app/utils";


export default async function Item({ params }: { params:Promise<{id:string}>}) {
    const id = (await params).id;
    const {productName, itemId, attribute1, quantity, description, listPrice} = await getData(id);
    let { image, text } = parseDescription(description);
    return (
        <div className="flex flex-col h-screen">
            <Header></Header>
            <div className="flex-1 flex flex-col items-center justify-center">
                <ul className="border-5 border-rose-400 rounded-lg p-6 bg-orange-200">
                    <li><img src={`${backendUrl}`+ image} alt="商品图片" width="60"/></li>
                    <li className="italic text-rose-500 underline">{text}</li>
                    <li>{attribute1}</li>
                    <li>{productName}</li>
                    <li>{itemId}</li>
                    <li className="text-rose-500 font-bold">{"$" + listPrice}</li>
                    <li>{quantity + " in stock"}</li>
                    <li className="mt-6 bg-black w-fit text-white font-bold p-2 rounded-lg hover:bg-neutral-700 cursor-pointer">Add to Chart</li>
                 </ul>
            </div>
            <Footer></Footer>
        </div>
    )
}


async function getData(id: string) {
    const res = await fetch(`${backendUrl}/catalog/item/${id}`)
    if (!res.ok) throw new Error("获取数据失败")
    return res.json();
}