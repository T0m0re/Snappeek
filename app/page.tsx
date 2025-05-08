import Header from "@/components/Header";
import UrlForm from "@/components/UrlForm";


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_100px] min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <Header/>
      <div className=" flex justify-center-safe mt-4 w-4/5 mx-auto">
        <UrlForm/>
      </div>
    </div>
  );
}


 