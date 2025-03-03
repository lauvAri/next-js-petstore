import Header from "@/app/common/header";
import Hero from "./hero";
import Footer from "@/app/common/footer";


export default function Main() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <Hero />
            <Footer />
        </div>
    )
}