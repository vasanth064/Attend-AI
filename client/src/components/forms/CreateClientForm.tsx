import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { CreateClientRequest, useCreateClientMutation } from "@/redux/admin/adminApiSlice";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import { useToast } from "../ui/use-toast";
import { SerializedError } from "@reduxjs/toolkit";

const formSchema = z.object({
  name: z.string().min(2, { message: "Username must be atleast two characters" }),
  email: z.string().email(),
  password: z.string().min(4, { message: "Password should be atleast four characters" })
})


const CreateClientForm = () => {
  const { toast } = useToast();

  const [createClient, { error, isLoading }] = useCreateClientMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await createClient(values as CreateClientRequest).unwrap();
    console.log("Here")
    if (error) {
      console.log("Here");
      toast({
        title: "Error",
        description: (error as SerializedError).message
      })
    }
    toast({
      title: "Messaage",
      description: `Client Created with email ${res.user.email}`
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>

          )}
        />
        <Button type="submit" disabled={isLoading}>Create new client</Button>
      </form>
    </Form>
  )
}

export default CreateClientForm;
