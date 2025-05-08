import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import { getCurrentUser, getInterviewByUserid, getLatestInterviews } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserid(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ])
  const hasPastInterviews = userInterviews?.length > 0;
  const hasLatestInterviews = latestInterviews?.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview Ready with AI-Powered practice and Feedback</h2>
          <p className='text-lg'>Practice on real interview questions and get feedback</p>

          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href={"/interview"}>
              Start an Interview
            </Link>
          </Button>
        </div>
        <Image src={"/robot.png"} alt='Robo' width={400} height={400} />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>
        <div className='interviews-section'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <div className='interviews-section'>You haven&apos;t taken any interviews yet</div>
            )
          }
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>
        <div className='interviews-section'>
        {
            hasLatestInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id}/>
              ))
            ) : (
              <div>There are no interviews available</div>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page
