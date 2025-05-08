"use server";

import { interviewCovers } from "@/constants";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK = 60*60*24*7;

export async function signUp(params: SignUpParams){
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return {
                success: false,
                message: "User already exist"
            }
        }

        await db.collection('users').doc(uid).set({
            name, email
        })

        return {
            success: true,
            message: "Account Created Successfully, please Sign in"
        }
    } catch (error: any) {
        console.log("signup user error: ", error);
        if(error.code === 'auth/email-already-exists'){
            return {
                success: false,
                message: "email is already in use"
            }
        }
    }
}

export async function signIn(params: SignInParams){
    const { email, idToken } = params;

    try{
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return {
                success: false,
                message: "User doesn't exist, please create an account"
            }
        }

        await setSessionCookie(idToken);
    } catch(error){
        console.log("singin error: ", error);

    }
}

export async function setSessionCookie(idToken: string){
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK*1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie){
        return null;
    }
    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userRecord = await db
        .collection('users')
        .doc(decodedClaims.uid)
        .get()

        if(!userRecord){
            return null;
        } else {
            return {
                ...userRecord.data(),
                id: userRecord.id,
            } as User;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    if(!user) return false;
    return !!user;
}

export async function getInterviewByUserid(userId: string): Promise<Interview[] | null>{
    const Interviews = await db
                        .collection('interviews')
                        .where('userId', '==', userId)
                        .orderBy('createdAt', 'desc')
                        .get();

    return Interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),

    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null>{

    const { userId, limit=20 } = params;

    const Interviews = await db
                        .collection('interviews')
                        .orderBy('createdAt', 'desc')
                        .where('finalized', '==', true)
                        .where('userId', '!=', userId)
                        .limit(limit)
                        .get();

    return Interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),

    })) as Interview[];
}