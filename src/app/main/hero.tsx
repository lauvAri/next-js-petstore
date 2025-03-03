"use client"
import { CarouselDemo } from "@/app/main/carousel"
export default function Hero() {
    return (
        <div className="flex-1 flex gap-30 p-10 m-10">
            <div className="flex-1 flex flex-col gap-5 bg-emerald-200 p-10 rounded-e-full items-start shadow-2xl">
                <div>
                    <a href="category/fish"><img src="/images/fish_icon.gif"/></a>
                    <span className="underline decoration-sky-500">Saltwater, Freshwater</span>
                </div>
                <div>
                    <a href="category/dogs"><img src="/images/dogs_icon.gif" /></a>
                    <span className="underline decoration-sky-500">Various Breeds</span>
                </div>
                <div>
                    <a href="category/cats"><img src="/images/cats_icon.gif" /></a>
                    <span className="underline decoration-sky-500">Various Breeds, Exotic Varieties</span>
                </div>
                <div>
                    <a href="category/reptiles"><img src="/images/reptiles_icon.gif" /></a>
                    <span className="underline decoration-sky-500">Lizards, Turtles, Snakes</span>
                </div>
                <div>
                    <a href="category/birds"><img src="/images/birds_icon.gif" /></a>
                    <span className="underline decoration-sky-500">Exotic Varieties</span>
                </div>
            </div>
            <div className="flex-1 self-center">
                <map id="estoremap" name="estoremap">
                    <area alt="Birds" coords="72,2,280,250"
                        shape="RECT" href="/category/birds"/>
                    <area alt="Fish" coords="2,180,72,250"
                        shape="RECT" href="/category/fish"/>
                    <area alt="Dogs" coords="60,250,130,320"
                        shape="RECT" href="/category/dogs"/>
                    <area alt="Reptiles" coords="140,270,210,340"
                        shape="RECT" href="/category/reptiles"/>
                    <area alt="Cats" coords="225,240,295,310"
                        shape="RECT" href="/category/cats"/>
                    <area alt="Birds" coords="280,180,350,250"
                    shape="RECT" href="/category/birds"/>
                </map>
                <img height={355} src="/images/splash.gif" useMap="#estoremap" width={350} />
            </div>
            <div className="flex-1 self-center">
                <CarouselDemo />
            </div>
        </div>
    )
}