"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"


import React from 'react'
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormField from "./FormField"
import { useRouter } from "next/navigation"

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
}

const AuthForm = ({ type }: { type: FormType }) => {

    const router = useRouter();

    const formSchema = authFormSchema(type);

    const isSignIn = type === 'sign-in';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if(type==='sign-in'){
                toast.success("Logged In Successfully");
                router.push("/")
            } else {
                toast.success("User Created Successfully, please Sign In");
                router.push("/sign-in")
            }
            
        } catch (error) {
            console.log("authForm.tsx error: ", error);
            toast.error(`There is an error: ${error}`)
        }
    }

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-primary-100">AI Interview Assistant</h2>
                </div>

                <h3 className="text-center">Practice with AI Assistant</h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                        
                        {!isSignIn && (
                            <FormField 
                                control={form.control} 
                                name="name" 
                                label="Name" 
                                placeholder="Your Name"
                                type="text"
                            />
                        )}
                        <FormField 
                                control={form.control} 
                                name="email" 
                                label="Email" 
                                placeholder="Your Email Address"
                                type="email"
                        />
                        <FormField 
                                control={form.control} 
                                name="password" 
                                label="Password" 
                                placeholder="Enter Password"
                                type="password"
                        />

                        <Button type="submit">{isSignIn ? 'Sign In': "Create Account"}</Button>
                    </form>
                </Form>

                <p className="text-center">
                    {
                        isSignIn ? "Don't have an account?"
                        : "Already have an account?"
                    }
                    <Link href={isSignIn? '/sign-up' : '/sign-in' } className="font-bold text-user-primary ml-1">
                        {isSignIn? 'Sign-up' : 'Sign-in' }
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default AuthForm
