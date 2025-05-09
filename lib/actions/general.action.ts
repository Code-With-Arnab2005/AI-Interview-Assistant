import { db } from "@/firebase/admin";

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

export async function getInterviewById(id: string): Promise<Interview | null>{
    const interview = await db
                    .collection('interviews')
                    .doc(id)
                    .get()

    return interview.data() as Interview | null;
}