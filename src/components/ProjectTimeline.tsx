'use client'

import React from 'react'
import { IconSearch, IconPalette, IconCode, IconBug, IconRocket, IconCalendarEvent, IconUser } from '@tabler/icons-react'

export type TimelineStep = {
  name: string
  icon: React.ElementType
  description: string
  dateRange: string
  owner: string
  status: 'active' | 'pending' | 'done'
}

const DEFAULT_STEPS: TimelineStep[] = [
  {
    name: 'Discovery',
    icon: IconSearch,
    description: 'Initial research, requirements gathering, and project planning.',
    dateRange: 'Sep 16 – Sep 23',
    owner: 'Alex H.',
    status: 'active'
  },
  {
    name: 'Design',
    icon: IconPalette,
    description: 'Wireframes, UI/UX design, and brand integration.',
    dateRange: 'Sep 24 – Oct 10',
    owner: 'Sarah T.',
    status: 'pending'
  },
  {
    name: 'Development',
    icon: IconCode,
    description: 'Frontend and backend implementation of features.',
    dateRange: 'Oct 11 – Nov 01',
    owner: 'Dev Team',
    status: 'pending'
  },
  {
    name: 'Testing',
    icon: IconBug,
    description: 'QA, user acceptance testing, and bug fixing.',
    dateRange: 'Nov 02 – Nov 10',
    owner: 'QA Team',
    status: 'pending'
  },
  {
    name: 'Launch',
    icon: IconRocket,
    description: 'Final deployment and handover to client.',
    dateRange: 'Nov 11 – Nov 16',
    owner: 'Project Manager',
    status: 'pending'
  }
]

export default function ProjectTimeline({ 
  steps,
  milestones, // retained for backwards compatibility
}: { 
  steps?: TimelineStep[]
  milestones?: any[]
  mode?: 'admin' | 'client'
}) {
  let displaySteps = steps

  // If steps not provided but milestones are (existing layout fallback), map milestones to the new shape
  if (!displaySteps && milestones && milestones.length > 0) {
    displaySteps = milestones.map((m, i) => {
      const icons = [IconSearch, IconPalette, IconCode, IconBug, IconRocket]
      return {
        name: m.title,
        icon: icons[Math.min(i, 4)],
        description: m.description || 'Phase details',
        dateRange: 'TBD',
        owner: 'Team',
        status: m.status === 'completed' ? 'done' : m.status === 'in_progress' ? 'active' : 'pending'
      }
    })
  }

  // Fallback to default mock data if both are empty
  if (!displaySteps || displaySteps.length === 0) {
    displaySteps = DEFAULT_STEPS
  }

  const calculateProgress = () => {
    if (!displaySteps.length) return 0
    const completed = displaySteps.filter(s => s.status === 'done').length
    const active = displaySteps.filter(s => s.status === 'active').length
    return Math.round(((completed + active * 0.5) / displaySteps.length) * 100)
  }

  const progress = calculateProgress()

  return (
    <div className="bg-white rounded-[12px] border border-gray-200 p-[24px] font-sans w-full">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-[16px] text-gray-900">Project timeline</h3>
        <div className="bg-brand-primary/10 text-brand-primary text-[12px] font-medium rounded-full px-[10px] py-[4px]">
          {progress}% complete
        </div>
      </div>
      <div className="text-[13px] text-gray-500 mb-8">
        Sep 16 – Nov 16, 2026
      </div>
      
      <div className="relative">
        {displaySteps.map((step, index) => {
          const isLast = index === displaySteps.length - 1
          const isActive = step.status === 'active'
          const isDone = step.status === 'done'
          const isPending = step.status === 'pending'
          
          const Icon = step.icon

          return (
            <div key={index} className={`relative flex items-start group ${!isLast ? 'pb-[28px]' : ''}`}>
              {/* Connecting Line (stops at the center of the next dot) */}
              {!isLast && (
                <div className="absolute left-[9px] top-[12px] -bottom-[12px] w-[1px] bg-gray-200 z-0"></div>
              )}

              {/* Dot */}
              <div className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full border-2 shrink-0 bg-white mt-[2px]
                ${isActive ? 'border-brand-primary shadow-[0_0_0_4px_rgba(255,115,36,0.15)] text-brand-primary' : ''}
                ${isDone ? 'border-gray-400 text-gray-500' : ''}
                ${isPending ? 'border-gray-300 text-gray-400' : ''}
              `}>
                <Icon size={11} stroke={2.5} />
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-1 pb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[14px] ${isActive ? 'font-medium text-gray-900' : 'font-normal text-gray-500'}`}>
                    {step.name}
                  </span>
                  <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full
                    ${isActive ? 'bg-brand-primary/10 text-brand-primary' : ''}
                    ${isPending ? 'bg-gray-100 text-gray-400' : ''}
                    ${isDone ? 'bg-gray-100 text-gray-500' : ''}
                  `}>
                    {isActive ? 'In progress' : isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
                
                <p className="text-[13px] text-gray-500 leading-[1.5] mb-2.5">
                  {step.description}
                </p>
                
                <div className="flex items-center gap-[14px] text-[12px] text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <IconCalendarEvent size={14} />
                    <span>{step.dateRange}</span>
                  </div>
                  {step.owner && (
                    <div className="flex items-center gap-1.5">
                      <IconUser size={14} />
                      <span>{step.owner}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
