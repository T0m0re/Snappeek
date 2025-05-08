"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    Url: z.string().url({
      message: "Url must start with https://"
    })
  })
function UrlForm() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          Url: "",
        },
      })

      // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      setIsLoading(true)
      const res = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: values.Url }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to capture screenshot");
      }
  
      const data = await res.json();
  
      setImage(data.image)
    } catch (err) {
      console.error("Error:", err);
    } finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="flex gap-5 flex-col">
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
      <FormField
        control={form.control}
        name="Url"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-semibold">Enter Website Url:</FormLabel>
            <FormControl>
              <Input placeholder="Website Url" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
          <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Get Image"
          )}
        </Button>
    </form>
  </Form>

  {image && (
  <div className="mt-6">
    <p className="mb-2 font-medium">Screenshot Preview:</p>
    <Image
      src={`data:image/png;base64,${image}`}
      alt="Website screenshot"
      className="rounded-md border shadow-md w-full max-w-3xl"
      width={1024}
      height={772}
    />
  </div>
)}
  </div>
  )
}

// function SiteImage(){
//   return(
//    <Image
//    src={}
//    />
//   )
// }
export default UrlForm