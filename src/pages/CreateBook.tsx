import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CirclePlus, CircleX, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBook } from '@/http/api'
import { Link, useNavigate } from 'react-router-dom'

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  coverImage: z.instanceof(FileList).refine(file => {
    return  file.length === 1;
  }, "Cover Image is required"),
  file: z.instanceof(FileList).refine(file => {
    return  file.length === 1;
  }, "Book PDF is required"),
})

// z o d is used here
const CreateBook = () => {
 
const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues: {
        title: '',
        genre: '',
        description: '',
    }
  })

  const coverImageRef = form.register('coverImage');
  const fileRef = form.register('file');

   const queryClient = useQueryClient()

  // Mutations
     const mutation = useMutation({
        mutationFn: createBook,
        onSuccess: () => {
          queryClient.invalidateQueries({queryKey: ['books']});
           console.log('book created');
           navigate('/dashboard/books');
          },
  })

   function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const formdata = new FormData();
    formdata.append('title', values.title);
    formdata.append('genre', values.genre);
    formdata.append('coverImage', values.coverImage[0]);
    formdata.append('file', values.file[0]);

     mutation.mutate(formdata);

    console.log(values)

  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
  <div className="flex items-center justify-between">
    <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/home">Home</BreadcrumbLink>
               </BreadcrumbItem>
                 <BreadcrumbSeparator />
                   <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/books">Books</BreadcrumbLink>
               </BreadcrumbItem>
              <BreadcrumbSeparator />
             <BreadcrumbItem>
           <BreadcrumbPage>Create</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

<div className="flex items-center gap-4">
<Link to='/dashboard/books'>
  <Button variant={'outline'} >
    <CircleX size={20}/>
    <span className="ml-2">Cancel</span>
  </Button>
</Link>

  <Button type="submit" disabled={mutation.isPending}>
   {
     mutation.isPending && <LoaderCircle className="animate-spin"/>
  }
  {/* <CirclePlus size={20}/> */}
    <span className="ml-2">Submit</span>
  </Button>
</div>

   </div>

  <Card className="mt-6">
    <CardHeader>
        <CardTitle>Create a new book</CardTitle>
        <CardDescription>
            Fill out the form below to create a new book.
        </CardDescription>
    </CardHeader>
    <CardContent>
              <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Book Details</CardTitle>
                    <CardDescription>
                      Fill out the Input Fields Given below
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">

                      <FormField control={form.control} name='title' 
                        render={({ field }) => (
                      <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                         <Input
                          type="text"
                          className="w-full"
                          {...field} 
                        />
                     </FormControl>
                      <FormMessage />
                     </FormItem>)}
                      />

                    <FormField control={form.control} name='genre' 
                        render={({ field }) => (
                      <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                         <Input
                          type="text"
                          className="w-full"
                          {...field} 
                        />
                     </FormControl>
                      <FormMessage />
                     </FormItem>)}
                      />

                  <FormField control={form.control} name='description' 
                        render={({ field }) => (
                      <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                         <Textarea
                          className="min-h-32"
                          {...field} 
                        />
                     </FormControl>
                      <FormMessage />
                     </FormItem>)}
                      />


                  <FormField control={form.control} name='coverImage' 
                        render={() => (
                      <FormItem>
                      <FormLabel>Cover Image</FormLabel>
                      <FormControl>
                          <Input
                           type="file"
                          className="w-full"
                          {...coverImageRef}
                        />
                     </FormControl>
                      <FormMessage />
                     </FormItem>)}
                      />


                    <FormField control={form.control} name='file' 
                        render={() => (
                      <FormItem>
                      <FormLabel>Book PDF</FormLabel>
                      <FormControl>
                          <Input
                          type="file"
                          className="w-full"
                          {...fileRef}
                        />
                     </FormControl>
                      <FormMessage />
                     </FormItem>)}
                      />

                    </div>
                  </CardContent>
                </Card>
    </CardContent>
</Card>
</form>
 
</Form>
    </>
  )
}

export default CreateBook