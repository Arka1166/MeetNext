'use client'

import { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

import { useToast } from "@/components/ui/use-toast"


const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const { user }= useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
      dateTime : new Date(),
      description: '',
      link: '',
    })

    const [callDetails, setCallDetails] = useState<Call>()

    const { toast } = useToast()

    const createMeeting = async() => {
        if(!user || !client) return;

        try {
          if(!values.dateTime) {
            toast({
              title: "Plesae select a date and time!",
            })
            return;
          }

          const id = crypto.randomUUID();
          const call = client.call('default', id);

          if(!call) throw new Error('Call not found');

          const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

          const description = values.description || 'No description';

          await call.getOrCreate({
            data: {
              starts_at: startsAt,
              custom: {
                description
              }
            }
          })

          setCallDetails(call);
          if(!values.description) {
            router.push(`/meeting/${call.id}`)
            }
            toast({
              title: "Meeting created successfully!",
            })
        } catch (error) {
          console.log(error);
          toast({
            title: "Failed to create a meeting!",
          })
        }
        
    }
  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 '>
        <HomeCard 
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an instant meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
        className='bg-orange-1'
        />
        <HomeCard 
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='via invitation link'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className='bg-blue-1'
        />
        <HomeCard 
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan for meeting'
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className='bg-purple-1'
        />
        <HomeCard 
        img='/icons/recordings.svg'
        title='View Recordings'
        description='Meeting Recordings'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className='bg-orange-2'
        />
        <MeetingModal  
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        buttonText = "Start Meeting"
        handleClick ={createMeeting}
        />
    </section>
  )
}

export default MeetingTypeList