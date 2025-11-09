import type { ComponentType } from 'react'
import { CalculatorApp } from '@portfolio/calculator-widget'
import { GameOfLife } from './projects/GameOfLife'

export type ProjectDefinition = {
  slug: string
  title: string
  summary: string
  tech: string[]
  status?: 'live' | 'coming-soon'
  Component: ComponentType | null
}

export const projects: ProjectDefinition[] = [
  {
    slug: 'game-of-life',
    title: "Conway's Game of Life",
    summary:
      'Interactive cellular automaton showcasing emergent behavior, pattern editing, and generation controls.',
    tech: ['React', 'TypeScript', 'State Machines'],
    status: 'live',
    Component: GameOfLife
  },
  {
    slug: 'calculator',
    title: 'Scientific Calculator',
    summary:
      'Advanced React calculator supporting scientific operations, keyboard input, and persistent history.',
    tech: ['React', 'TypeScript', 'Vite', 'mathjs'],
    status: 'live',
    Component: CalculatorApp
  },
  {
    slug: 'todolist',
    title: 'Productive Todo List',
    summary: 'Smart task management experience with filtering, reminders, and rich keyboard shortcuts.',
    tech: ['React', 'TypeScript', 'IndexedDB'],
    status: 'coming-soon',
    Component: null
  }
]

export const findProject = (slug: string) => projects.find(project => project.slug === slug)
